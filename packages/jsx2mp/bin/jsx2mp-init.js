#!/usr/bin/env node
const program = require('commander');
const Project = require('../project');

program
  .option('--name [name]', '项目名称')
  .option('--description [description]', '项目介绍')
  .parse(process.argv);

const args = program.args
const {description, name} = program

const projectName = args[0] || name

new Project({
    description : description,
    projectName : projectName
})







