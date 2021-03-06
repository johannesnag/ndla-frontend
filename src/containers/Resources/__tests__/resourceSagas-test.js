/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expectSaga } from 'redux-saga-test-plan';
import nock from 'nock';
import * as sagas from '../resourceSagas';
import { actions, initalState } from '../resource';
import { resources, additionalResources, resourceTypes } from './mockResources';

test('resourceSagas watchFetchTopicResources', () => {
  nock('http://ndla-api')
    .get(
      '/taxonomy/v1/topics/2/resources/?language=en&relevance=urn:relevance:core',
    )
    .reply(200, resources);
  nock('http://ndla-api')
    .get(
      '/taxonomy/v1/topics/2/resources/?language=en&relevance=urn:relevance:supplementary',
    )
    .reply(200, additionalResources);
  nock('http://ndla-api')
    .get('/taxonomy/v1/resource-types/?language=en')
    .reply(200, resourceTypes);

  return expectSaga(sagas.watchFetchTopicResources)
    .withState({ resources: initalState, locale: 'en' })
    .put(
      actions.setTopicResources({ topicId: 2, resources, additionalResources }),
    )
    .put(actions.setResourceTypes(resourceTypes))
    .dispatch(actions.fetchTopicResources({ topicId: 2 }))
    .run({ silenceTimeout: true });
});

test('resourceSagas watchFetchTopicResources do not refetch if already fetched', () =>
  expectSaga(sagas.watchFetchTopicResources)
    .withState({
      resources: { all: { 2: { id: 2, resources } } },
      locale: 'en',
    })
    .not.put(
      actions.setTopicResources({ topicId: 2, resources, additionalResources }),
    )
    .not.put(actions.setResourceTypes(resourceTypes))
    .dispatch(actions.fetchTopicResources({ topicId: 2 }))
    .run({ silenceTimeout: true }));
