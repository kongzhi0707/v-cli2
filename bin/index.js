#!/usr/bin/env node
const chalk = require('chalk');
// 获取当前node版本
const currentNodeVersion = process.versions.node;
const major = currentNodeVersion.split('.')[0];
if (major < 12) {
  console.error(
    chalk.red(
      `You are running Node \n${currentNodeVersion} \nvue-assist-cli requires Node 12 or higher.\nPlease update your version of Node`
    )
  );
  process.exit(1);
}
// 初始化 init.js
require('../packages/init');