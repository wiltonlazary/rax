const chokidar = require('chokidar');
const { statSync, readdirSync } = require('fs');
const colors = require('colors');
const child_process = require('child_process');
const { mkdirsSync } = require('fs-extra');

module.exports = class Project {
  constructor(options) {
    const { projectName, description } = options;

    console.log(colors.green('即将创建一个rax新项目!'));

    try {
      const newProjectPath = process.cwd() + '/' + projectName;
      mkdirsSync(newProjectPath);
      const fromPath = __dirname + '/../templates';
      const toPath = newProjectPath;
      this._copyAllFile(fromPath, toPath);
      console.log(colors.green('项目创建成功!'));
    } catch (error) {
      console.log(colors.red('项目创建失败! ' + JSON.stringify(error)));
    }
  }

  _copyAllFile(fromPath, toPath) {
    const sourcePathFiles = readdirSync(fromPath);
    for (let i = 0, l = sourcePathFiles.length; i < l; i++) {
      const item = sourcePathFiles[i];
      const fileItemPath = fromPath + '/' + item;
      if (item === 'node_modules' || item.length > 1 && item.substring(0, 1) === '.') {
        continue;
      }
      if (statSync(fileItemPath).isDirectory()) {
        const toDirPath = toPath + '/' + item;
        mkdirsSync(toDirPath);
        this._copyAllFile(fileItemPath, toDirPath);
      } else {
        child_process.spawn('cp', ['-r', fileItemPath, toPath]);
      }
    }
  }
};
