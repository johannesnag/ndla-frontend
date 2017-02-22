/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const URN_ARTICLE = 'urn:article:';
export const URN_LEARTNING_PATH = 'urn:learningpath:';
export const isLearningPathResource = resource => resource && resource.contentUri.startsWith(URN_LEARTNING_PATH);
export const isArticleResource = resource => resource && resource.contentUri.startsWith(URN_ARTICLE);
export const getArticleIdFromResource = (resource) => {
  if (isArticleResource(resource)) {
    return resource.contentUri.replace(URN_ARTICLE, '');
  }
  return undefined;
};

export const getLearningPathIdFromResource = (resource) => {
  if (isLearningPathResource(resource)) {
    return resource.contentUri.replace(URN_LEARTNING_PATH, '');
  }
  return undefined;
};
