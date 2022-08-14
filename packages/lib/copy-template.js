
const shell = require('shelljs');
const path = require('path');

/**
 * @param {String} destDir 目标文件路径 比如： 项目的根目录下/src/pages/xxx 这样的
 * @param {Boolean} simple 布尔值；如果是true的话，创建单独的vue文件，否则的话，创建 index.js/index.vue/index.scss 文件夹
 * @param {less, scss, sass, stylus} cssType css 风格，是 less/scss/sass/stylus 风格的任意一种
 * @return { sourceDir, destFile } 模版原文件, 生成的目标文件 
 */

const copyTemplate = (destDir, simple, cssType) => {
  let sourceDir, destFile;
  if (simple) {
    // 获取源文件的路径页面
    sourceDir = path.resolve(__dirname, '../../template/vue-page-simple-template.vue');
    destDir += '.vue';
    shell.cp('-R', sourceDir, destDir);
    destFile = destDir;
  } else {
    shell.mkdir('-p', destDir);
    sourceDir = path.resolve(__dirname, `../../template/vue-page-template-${cssType}/*`);
    shell.cp('-R', sourceDir, destDir);
    destFile = path.resolve(destDir, 'index.vue');
  }
  return { sourceDir, destFile };
} 

module.exports = copyTemplate;