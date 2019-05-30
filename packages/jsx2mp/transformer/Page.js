const { resolve } = require('path');
<<<<<<< HEAD
const { transformJSX, writeFiles } = require('./Transformer');
const { createComponent } = require('./Component');

/**
 * Creat page files
 * @param distPagePath {String} dist Path
 * @param config {Object} has usingComponents
 * @param rootContext {String} root Path
 */
const createPage = function(rootContext, context, distPagePath) {
  const transformed = transformJSX(context + '.jsx', 'page');
  createComponent(rootContext, distPagePath, {usingComponents: transformed.usingComponents});
  writeFiles(resolve(distPagePath, 'index'), transformed, rootContext);
=======
const { transformJSX, writeFiles, formatConfing } = require('./Transformer');
const { createComponent } = require('./Component');
const resolveModule = require('../utils/moduleResolve');

/**
 * Creat page files
 * @param rootContext  {String} Root Path
 * @param distContext {String} Dist path to a file.
 * @param sourcePath {String} User defined path.
 */
const createPage = function(rootContext, distContext, sourcePath) {
  const sourceFilePath = resolveModule(rootContext + '/index.js', './' + sourcePath, '.jsx') || resolveModule(rootContext + '/index.js', './' + sourcePath, '.js');

  const transformed = transformJSX(sourceFilePath, 'page');
  createComponent(rootContext, distContext, transformed.usingComponents);
  transformed.config = formatConfing(transformed.config, rootContext);
  writeFiles(resolve(distContext, sourcePath), transformed, rootContext);
>>>>>>> jsx2mp/dev
};

module.exports = {
  createPage
};
