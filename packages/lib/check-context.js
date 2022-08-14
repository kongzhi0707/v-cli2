
const fs = require('fs');
const path = require('path');
const { error } = require('./util');

/**
 * 检查 用户是否在项目的根目录 或 ./src 目录下执行, 是否有约定的项目目录结构, 是否已经存在该组件
 * @param {String} name
 * @param {Object} cmdObj
 * @param {String} 'page' or 'component'
 * @return {Object} {destDirRootName, destDir, rootDir} 目标文件夹名称(比如 pages/page/views), 目标文件路径, 项目的根目录下
 */

 const checkContext = (name, cmdObj, type) => {
   console.log('----checkContext-----', name, cmdObj, type);
   let destDir, destDirRootName;
   // 获取当前项目的执行命令的目录 比如在 /Users/tugehua/react-template/fc-vue-test 目录下执行命令 就是这个路径
   const curDir = path.resolve('.'); 
   let rootDir = '.';
   const basename = path.basename(curDir); // 获取当前文件目录的文件名, 比如上面的 就是 fc-vue-test

   // 用户在 './src 目录下执行该命令'
   if (basename === 'src') {
     rootDir = path.resolve('..', rootDir); // 项目的根目录下
   }
   // 判断下项目的根目录rootDir下面有没有src目录文件夹
   if (!fs.existsSync(path.join(rootDir, 'src'))) {
     error('项目的根目录下没有src目录, 请创建src目录');
     process.exit(1);
   }
   if (type === 'component') {
     // 创建一个组件, 组件需要在 src/components 或 src/component 目录下
     if (fs.existsSync(path.resolve(rootDir, 'src/components'))) {
       destDir = path.resolve(rootDir, 'src/components', name);
     } else if (fs.existsSync(path.resolve(rootDir, 'src/component'))) {
       destDir = path.resolve(rootDir, 'src/component', name);
     } else {
       error('您创建的组件存放的目录不符合规范, 请将放在 /src/components 或 /src/component 目录下');
     }
   } else {
     // 创建页面可以支持的目录有如下三种 src/views, src/pages, src/page 中的任意一种都是符合的
     if (fs.existsSync(path.resolve(rootDir, 'src/views'))) {
       destDir = path.resolve(rootDir, 'src/views', name);
       destDirRootName = 'views';
     } else if (fs.existsSync(path.resolve(rootDir, 'src/pages'))) {
       destDir = path.resolve(rootDir, 'src/pages', name);
       destDirRootName = 'pages';
     } else if (fs.existsSync(path.resolve(rootDir, 'src/page'))) {
      destDir = path.resolve(rootDir, 'src/page', name);
      destDirRootName = 'page';
     } else {
       error('您的页面组件存放文件目录不符合规范，请将其放在 /src/view 或者 /src/pages 或者 /src/page 目录');
     }
   }
   // 是否已经存在该组件
   if ((cmdObj.simple && fs.existsSync(destDir + '.vue')) || (!cmdObj.simple && fs.existsSync(destDir + '/index.vue'))) {
     error(`${name} 页面/组件 已经存在，创建失败！`);
     process.exit(1);
   }
   return { destDirRootName, destDir, rootDir };
 }

 module.exports = checkContext;