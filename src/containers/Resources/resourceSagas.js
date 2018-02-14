/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { all, take, call, put, select } from 'redux-saga/effects';
import * as api from './resourceApi';
import {
  actions,
  hasFetchedResourcesForTopicId,
  hasFetchedResourceTypes,
} from './resource';
import { getLocale } from '../Locale/localeSelectors';
import { applicationError } from '../../modules/error';

export function* fetchResourceTypes() {
  try {
    const hasFetched = yield select(hasFetchedResourceTypes);
    if (hasFetched) {
      return;
    }

    const locale = yield select(getLocale);
    const resourceTypes = yield call(api.fetchResourceTypes, locale);
    yield put(actions.setResourceTypes(resourceTypes));
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchTopicResourcesError());
  }
}

export function* fetchTopicResources(topicId) {
  try {
    const locale = yield select(getLocale);
    const [resources, additionalResources] = yield all([
      call(api.fetchTopicResources, topicId, locale),
      call(
        api.fetchTopicResources,
        topicId,
        locale,
        'urn:relevance:supplementary',
      ),
    ]);
    yield put(
      actions.setTopicResources({ topicId, resources, additionalResources }),
    );
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchTopicResourcesError());
  }
}

export function* watchFetchTopicResources() {
  while (true) {
    const { payload: { topicId } } = yield take(actions.fetchTopicResources);
    const hasFetched = yield select(hasFetchedResourcesForTopicId(topicId));
    if (!hasFetched) {
      yield all([call(fetchTopicResources, topicId), call(fetchResourceTypes)]);
    }
  }
}

export default [watchFetchTopicResources];
