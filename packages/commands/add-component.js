
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
// askQuestions 回答的问题, askCssType: 选择css风格 (less, sass, stylus)
const { askQuestions, askCssType } = require('../lib/ask-component');
const checkContext = require('../lib/check-context');
const copyTemplate = require('../lib/copy-template');
const { error, log } = require('../lib/util');

module.exports = async (name, cmdObj) => {
  try {
    // 默认使用less样式
    let cssType = 'less';
    let simple = true; // 创建简单的页面
    
    // 如果用户没有输入name, 直接命令 v-cli2 add-component 则进入问答模式, 通过一问一答获取用户输入(问答模式: 需要输入页面名称, 模版类型)
    if (!name) {
      const answers = await askQuestions();
      name = answers.FILENAME;
      simple = answers.SIMPLE;
      // 如果选择的类型不是 simple 的话, 就使用其他的类型
      if (!simple) {
        const res = await askCssType();
        cssType = res.CSS_TYPE;
      }
    }
    // 检查上下文环境, 并返回目标文件的目录路径
    let { destDir, destDirRootName } = checkContext(name, cmdObj, 'component');
    // 复制模版到目标文件
    let { destFile } = copyTemplate(destDir, simple, cssType);
    // 检测目录是否存在
    if (fs.existsSync(destFile)) {
      log(`成功创建${name}组件, 请在${destDir}下查看`);
    } else {
      console.error(
        chalk.red(`创建失败, 请到项目 [根目录] 或者 [src] 目录下执行该操作`)
      );
    }
  } catch (err) {
    console.error(chalk.red(err));
    console.error(
      chalk.red(`创建页面失败, 请确保在项目的 [根目录] 或者 [src] 目录下执行该操作`)
    );
  }
}