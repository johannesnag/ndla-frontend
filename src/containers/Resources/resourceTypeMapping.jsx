/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import defined from 'defined';
import Icon from '../../components/Icon';

const mapping = {
  'urn:resource-type:subject-matter': {
    icon: <Icon.Document />,
    className: 'Lrestoff',
  },
  'urn:resource-type:article': {
    icon: <Icon.Document />,
    className: 'Lrestoff',
  },
  'urn:resource-type:video': {
    icon: <Icon.Document />,
    className: 'Lrestoff',
  },
  'urn:resource-type:interactivity': {
    icon: <Icon.Document />,
    className: 'Lrestoff',
  },
  'urn:resource-type:simulation': {
    icon: <Icon.Document />,
    className: 'Lrestoff',
  },
  'urn:resource-type:attachment': {
    icon: <Icon.Document />,
    className: 'Lrestoff',
  },
  'urn:resource-type:urn:resource-type:e3cd3322-5af5-4ebf-9fb7-69312281b233': {
    icon: <Icon.Document />,
    className: 'Lrestoff',
  },
  'urn:resource-type:assignment': {
    icon: <Icon.Pencil />,
    className: 'Oppgaver',
  },
  'urn:resource-type:learning-path': {
    icon: <Icon.Path />,
    className: 'Lringsstier',
  },
};

export default id =>
  defined(mapping[id], mapping['urn:resource-type:subject-matter']);
