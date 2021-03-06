/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { OneColumn, Pager } from 'ndla-ui';
import connectSSR from '../../components/connectSSR';

import * as actions from './searchActions';
import { ArticleResultShape } from '../../shapes';
import { getResults, getLastPage, getSearching } from './searchSelectors';
import SearchForm from './components/SearchForm';
import SearchResultList from './components/SearchResultList';
import SelectSearchSortOrder from './components/SelectSearchSortOrder';
import { toSearch } from '../../routeHelpers';
import { createQueryString, parseQueryString } from '../../util/queryHelpers';

class SearchPage extends Component {
  static getInitialProps(ctx) {
    const { location, search } = ctx;
    if (location && location.search) {
      search(location.search);
    }
  }

  componentDidMount() {
    SearchPage.getInitialProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { location, search } = nextProps;
    if (location.search && location.search !== this.props.location.search) {
      search(location.search);
    }
  }

  render() {
    const { location, results, searching, lastPage, history } = this.props;
    const query = parseQueryString(location.search);

    return (
      <OneColumn cssModifier="narrow">
        <SearchForm
          query={query.query}
          searching={searching}
          onSearchQuerySubmit={searchQuery =>
            history.push(
              `/search?${createQueryString({
                query: searchQuery,
                page: 1,
                sort: query.sort ? query.sort : '-relevance',
              })}`,
            )
          }
        />

        <div className="search-filters">
          <SelectSearchSortOrder
            sort={query.sort}
            onSortOrderChange={sort =>
              history.push(
                `/search?${createQueryString({
                  query: query.query,
                  sort,
                  page: 1,
                })}`,
              )
            }
          />
        </div>

        <SearchResultList query={query} results={results} />

        <Pager
          page={query.page ? parseInt(query.page, 10) : 1}
          lastPage={lastPage}
          query={query}
          pathname={toSearch()}
        />
      </OneColumn>
    );
  }
}

SearchPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  clearSearchResult: PropTypes.func.isRequired,
  lastPage: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(ArticleResultShape).isRequired,
  searching: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  search: actions.search,
  clearSearchResult: actions.clearSearchResult,
};

const mapStateToProps = state => ({
  results: getResults(state),
  lastPage: getLastPage(state),
  searching: getSearching(state),
});

export default connectSSR(mapStateToProps, mapDispatchToProps)(SearchPage);
