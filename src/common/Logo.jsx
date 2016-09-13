/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import polyglot from '../i18n';

export const Logo = ({ cssModifier }) =>
  <h1 className={classNames('logo', `logo--${cssModifier}`)}>
    <Link to="/" className="logo_link">
      {polyglot.t('logo.altText')}
    </Link>
  </h1>
;

Logo.propTypes = {
  cssModifier: PropTypes.string,
};

export default Logo;
