/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

import { getAccessToken } from '../../src/util/apiHelpers';
import config from '../../src/config';

const assets = config.isProduction
  ? require('../../htdocs/assets/assets') // eslint-disable-line import/no-unresolved
  : require('../developmentAssets');

const GoogleTagMangerNoScript = () => {
  if (config.googleTagMangerId) {
    return `<noscript>
        <iframe
          title="google tag manager"
          src="//www.googletagmanager.com/ns.html?id=${config.googleTagMangerId}"
          height="0"
          width="0"
          style="display: 'none', visibility: 'hidden'"
        />
      </noscript>`;
  }
  return '';
};

const GoogleTagMangerScript = () => {
  if (config.googleTagMangerId) {
    return `<script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
        j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})
        (window,document,'script','dataLayer','${config.googleTagMangerId}');
      <script/>`;
  }
  return '';
};

const Html = (lang, state, component, className) => {
  const content = component ? renderToString(component) : '';
  const head = Helmet.rewind();
  const cssFileName = assets['main.css'];
  const styles = config.isProduction
    ? `<link
          rel="stylesheet"
          type="text/css"
          href="/assets/${cssFileName}" />`
    : ``;
  const favIcon = assets['ndla-favicon.png'];
  return `
    <html lang="${lang}" class="${className}">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        ${styles}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,300italic,400,600,700|Signika:400,600,300,700"
        />
        <link
          rel="shortcut icon"
          href="/assets/${favIcon}"}
          type="image/x-icon"
        />
         ${head.title.toString()}
         ${head.meta.toString()}
         ${head.script.toString()}
      </head>
      <body>
        ${GoogleTagMangerNoScript()}
        ${GoogleTagMangerScript()}
        <div id="root">
          ${content}
        </div>
        <script>
            window.initialState = ${serialize(state)}
            window.assets = ${serialize(assets)}
            window.config = ${serialize(config)}
            window.accessToken = ${serialize(getAccessToken())}
        </script>
        <script src="/assets/${assets['vendor.js']}"></script>
        <script src="/assets/${assets['main.js']}"></script>
      </body>
    </html>
  `;
};

export default Html;
