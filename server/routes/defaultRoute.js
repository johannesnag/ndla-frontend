/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { matchPath } from 'react-router-dom';
import defined from 'defined';
import { bindActionCreators } from 'redux';
import IntlProvider from 'ndla-i18n';
import { getComponentName } from 'ndla-util';
import { resetIdCounter } from 'ndla-tabs';

import getConditionalClassnames from '../helpers/getConditionalClassnames';
import Html from '../helpers/Html';
import routes, { routes as serverRoutes } from '../../src/routes';
import configureStore from '../../src/configureStore';

import { getLocaleObject, isValidLocale } from '../../src/i18n';
import { storeAccessToken } from '../../src/util/apiHelpers';

async function loadGetInitialProps(Component, ctx) {
  if (!Component.getInitialProps) return {};

  const props = await Component.getInitialProps(ctx);
  if (!props && (!ctx.res || !ctx.res.finished)) {
    const compName = getComponentName(Component);
    const message = `"${compName}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }
  return props;
}

const renderHtmlString = (
  locale,
  userAgentString,
  state = {},
  component = undefined,
) =>
  renderToString(
    <Html
      lang={locale}
      state={state}
      component={component}
      className={getConditionalClassnames(userAgentString)}
    />,
  );

export async function defaultRoute(req, res, token) {
  storeAccessToken(token.access_token);
  const paths = req.url.split('/');
  const basename = isValidLocale(paths[1]) ? paths[1] : '';
  const path = basename ? req.url.replace(`/${basename}`, '') : req.url;

  const { abbreviation: locale, messages } = getLocaleObject(paths[1]);
  const userAgentString = req.headers['user-agent'];

  if (__DISABLE_SSR__) {
    // eslint-disable-line no-underscore-dangle
    const htmlString = renderHtmlString(locale, userAgentString, {
      locale,
    });
    res.send(`<!doctype html>\n${htmlString}`);
    return;
  }

  const store = configureStore({ locale });
  const route = serverRoutes.find(r => matchPath(path, r));
  const Component = route.component;
  const match = matchPath(path, route);

  const actions = Component.mapDispatchToProps
    ? bindActionCreators(Component.mapDispatchToProps, store.dispatch)
    : {};
  await loadGetInitialProps(route.component, {
    isServer: true,
    store,
    ...actions,
    match,
  });

  const context = {};
  const Page = (
    <Provider store={store}>
      <IntlProvider locale={locale} messages={messages}>
        <StaticRouter basename={basename} location={req.url} context={context}>
          {routes}
        </StaticRouter>
      </IntlProvider>
    </Provider>
  );

  if (context.url) {
    res.writeHead(301, {
      Location: context.url,
    });
    res.end();
  } else {
    // resetIdCounter must be called on server before render to prevent server and client markup diff
    resetIdCounter();
    const htmlString = renderHtmlString(
      locale,
      userAgentString,
      store.getState(),
      Page,
    );
    const status = defined(context.status, 200);
    res.status(status).send(`<!doctype html>\n${htmlString}`);
  }
}
