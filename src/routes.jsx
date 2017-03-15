/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Route, IndexRoute } from 'react-router';

import WelcomePage from './containers/WelcomePage/WelcomePage';
import App from './containers/App/App';
import ArticlePage from './containers/ArticlePage/ArticlePage';
import SearchPage from './containers/SearchPage/SearchPage';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import TopicPage from './containers/TopicPage/TopicPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';

export function toSearch() {
  return '/search';
}

export function toArticle(articleId, subjectId, topicId) {
  if (subjectId && topicId) {
    return `/article/${subjectId}/${topicId}/${articleId}`;
  }
  return `/article/${articleId}`;
}

export function toSubject(subjectId) {
  return `/subjects/${subjectId}`;
}

export function toTopic(subjectId, ...topicIds) {
  if (topicIds.length === 0) {
    return toSubject(subjectId);
  }
  return `/subjects/${subjectId}/${topicIds.join('/')}`;
}

export const toTopicPartial = (subjectId, ...topicIds) => topicId =>
   toTopic(subjectId, ...topicIds, topicId);

export function toTopicResourceTab(location, index) {
  return { ...location, query: { resourceTabIndex: index } };
}

export default function () {
  return (
    <Route path="/" component={App}>
      <IndexRoute component={WelcomePage} />
      <Route path="article/:articleId(/)" component={ArticlePage} />
      <Route path="search(/)" component={SearchPage} />
      <Route path="subjects(/)" component={SubjectsPage} />
      <Route path="subjects/:subjectId(/)" component={SubjectPage} />
      <Route path="subjects/:subjectId/:topicId(/)" component={TopicPage} />
      <Route path="subjects/:subjectId/**/:topicId(/)" component={TopicPage} />
      <Route path="article/:subjectId/:topicId/:articleId" component={ArticlePage} />
      <Route path="*" status={404} component={NotFoundPage} />
    </Route>
  );
}
