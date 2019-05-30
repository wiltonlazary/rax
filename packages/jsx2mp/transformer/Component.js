<<<<<<< HEAD
const { join } = require('path');
const { transformJSX, writeFiles } = require('./Transformer');

/**
 * Create component files
 * @param distPath {String} dist Path
 * @param config {Object} has usingComponents
 * @param rootContext {String} root Path
 */
const createComponent = function(rootContext, distPath, config) {
  const { usingComponents = {} } = config;
  for (let [key, value] of usingComponents) {
    if (!value.external) {
      const componentDistPath = join(distPath, value.from);
      const componentSourcePath = value.absolutePath;

      const transformed = transformJSX(componentSourcePath, 'component');
=======
const { resolve, relative } = require('path');
const { transformJSX, writeFiles, isCustomComponent, formatConfing } = require('./Transformer');
const removeExt = require('../utils/removeExt');

/**
 * Create component files
 * @param usingComponents {Object} using Components
 * @param distPath {String} dist Path
 * @param rootContext {String} root Path
 */
const createComponent = function(rootContext, distPath, usingComponents) {
  for (let [key, value] of Object.entries(usingComponents)) {
    if (isCustomComponent(value)) {
      const relativePath = relative(rootContext, value);
      const componentDistPath = removeExt(resolve(distPath, relativePath));
      const transformed = transformJSX(value, 'component');
      transformed.config = formatConfing(transformed.config, rootContext);
>>>>>>> jsx2mp/dev
      writeFiles(componentDistPath, transformed, rootContext);
      createComponent(rootContext, distPath, { usingComponents: transformed.usingComponents });
    }
  }
};

module.exports = {
  createComponent
};
