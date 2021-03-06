/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { SubjectHero, OneColumn, Breadcrumb, constants } from 'ndla-ui';
import Helmet from 'react-helmet';
import { injectT } from 'ndla-i18n';
import connectSSR from '../../components/connectSSR';
import {
  actions,
  getTopicArticle,
  getTopic,
  getTopicPath,
  getFetchTopicsStatus,
  getFetchTopicArticleStatus,
} from './topic';
import {
  getSubjectById,
  actions as subjectActions,
} from '../SubjectPage/subjects';
import TopicResources from './TopicResources';
import SubTopics from './SubTopics';
import { SubjectShape, ArticleShape, TopicShape } from '../../shapes';
import { toTopic } from '../../routeHelpers';
import Article from '../../components/Article';
import { getLocale } from '../Locale/localeSelectors';
import { TopicPageErrorMessage } from './components/TopicsPageErrorMessage';
import { getArticleScripts } from '../../util/getArticleScripts';
import getStructuredDataFromArticle from '../../util/getStructuredDataFromArticle';

const getTitle = (article, topic) => {
  if (article) {
    return article.title;
  } else if (topic) {
    return topic.name;
  }
  return '';
};

class TopicPage extends Component {
  static getInitialProps(ctx) {
    const {
      match: { params },
      fetchTopicArticle,
      fetchTopicsWithIntroductions,
      fetchSubjects,
    } = ctx;
    const { subjectId, topicId } = params;
    fetchTopicArticle({ subjectId, topicId });
    fetchTopicsWithIntroductions({ subjectId });
    fetchSubjects();
  }

  componentDidMount() {
    TopicPage.getInitialProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: { params },
      fetchTopicArticle,
      fetchTopicsWithIntroductions,
    } = this.props;
    const { subjectId, topicId } = params;

    if (nextProps.match.params.topicId !== topicId) {
      fetchTopicArticle({
        subjectId,
        topicId: nextProps.match.params.topicId,
      });
      fetchTopicsWithIntroductions({ subjectId });
    }
  }

  render() {
    const {
      match: { params },
      topic,
      locale,
      article,
      t,
      topicPath,
      fetchTopicsStatus,
      fetchTopicArticleStatus,
      subject,
    } = this.props;
    const { subjectId } = params;

    const title = getTitle(article, topic);
    const scripts = getArticleScripts(article);

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Helmet>
          <title>{`NDLA | ${title}`}</title>
          {article &&
            article.metaDescription && (
              <meta name="description" content={article.metaDescription} />
            )}

          {scripts.map(script => (
            <script
              key={script.src}
              src={script.src}
              type={script.type}
              async={script.async}
            />
          ))}

          <script type="application/ld+json">
            {JSON.stringify(getStructuredDataFromArticle(article))}
          </script>
        </Helmet>
        <SubjectHero>
          <OneColumn>
            <div className="c-hero__content">
              <section>
                {subject ? (
                  <Breadcrumb
                    toSubjects={() => '/'}
                    subjectsTitle={t('breadcrumb.subjectsLinkText')}
                    subject={subject}
                    topicPath={topicPath}
                    toTopic={toTopic}
                  />
                ) : null}
              </section>
            </div>
          </OneColumn>
        </SubjectHero>
        {(fetchTopicsStatus === 'error' ||
          fetchTopicArticleStatus === 'error') && (
          <TopicPageErrorMessage
            t={t}
            fetchTopicsFailed={fetchTopicsStatus === 'error'}
          />
        )}
        <OneColumn>
          <Article
            article={article}
            locale={locale}
            label={t('topicPage.topic')}
            contentType={constants.contentTypes.SUBJECT}>
            {topic ? (
              <Fragment>
                <SubTopics
                  subjectId={subjectId}
                  topic={topic}
                  topicPath={topicPath}
                />
                <TopicResources
                  subjectId={subjectId}
                  topicId={topic.id}
                  topicPath={topicPath}
                />
              </Fragment>
            ) : null}
          </Article>
        </OneColumn>
      </div>
    );
  }
}

TopicPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string.isRequired,
      topicId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  fetchSubjects: PropTypes.func.isRequired,
  fetchTopicArticle: PropTypes.func.isRequired,
  fetchTopicsWithIntroductions: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  fetchTopicArticleStatus: PropTypes.string.isRequired,
  fetchTopicsStatus: PropTypes.string.isRequired,
  topic: TopicShape,
  subject: SubjectShape,
  topicPath: PropTypes.arrayOf(TopicShape),
  article: ArticleShape,
};

const mapDispatchToProps = {
  fetchSubjects: subjectActions.fetchSubjects,
  fetchTopicArticle: actions.fetchTopicArticle,
  fetchTopicsWithIntroductions: actions.fetchTopicsWithIntroductions,
};

const mapStateToProps = (state, ownProps) => {
  const { subjectId, topicId } = ownProps.match.params;
  const getTopicSelector = getTopic(subjectId, topicId);
  const getTopicArticleSelector = getTopicArticle(subjectId, topicId);
  const getTopicPathSelector = getTopicPath(subjectId, topicId);
  const getSubjectByIdSelector = getSubjectById(subjectId);
  return {
    topic: getTopicSelector(state),
    article: getTopicArticleSelector(state),
    topicPath: getTopicPathSelector(state),
    subject: getSubjectByIdSelector(state),
    fetchTopicArticleStatus: getFetchTopicArticleStatus(state),
    fetchTopicsStatus: getFetchTopicsStatus(state),
    locale: getLocale(state),
  };
};

export default compose(
  connectSSR(mapStateToProps, mapDispatchToProps),
  injectT,
)(TopicPage);
