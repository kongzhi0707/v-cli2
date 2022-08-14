
const fs = require('fs');
const path = require('path');
const { error } = require('./util');

/**
 * @param {String} name 页面名称
 * @param {String} rootDir 项目所在目录
 * @param {Boolean} simple 模版类型, 如果为false的话, 【同时创建 .vue .js .[style]】. 如果为true的话, 【只创建 .vue】
 * @param {String} destDirRootName 目标文件夹名称 pages/views/page
 * @param {String} title 页面标题
 */

 const addRouter = async (name, rootDir, simple, destDirRootName, title) => {
   console.log('---addRouter---', name, rootDir, simple, destDirRootName, title);
   let routerPath, pagePath;
   let isRouterPath = false; // 是否是 src/router/index.js 目录
   if (fs.existsSync(path.resolve(rootDir, './src/router.js'))) {
    routerPath = path.resolve(rootDir, './src/router.js');
   } else if (fs.existsSync(path.resolve(rootDir, './src/router/index.js'))) {
    routerPath = path.resolve(rootDir, './src/router/index.js');
    isRouterPath = true;
   } else {
    error('您的项目路由文件不符合规范，请将其放在/src/router.js或者/src/router/index.js');
   }
   pagePath = `./${destDirRootName}/${name}/index.vue`;
   if (isRouterPath) {
     pagePath = `../${destDirRootName}/${name}/index.vue`;
   }
   if (simple) {
     pagePath = `./${destDirRootName}/${name}.vue`;
     if (isRouterPath) {
      pagePath = `../${destDirRootName}/${name}.vue`;
     }
   }
   try {
     let content = await fs.readFileSync(routerPath, 'utf-8');
     // 找到 const routes = 与 ]; 之间的内容，也就是routes数组
     const reg = /const\s+routes\s*\=([\s\S]*)\]\s*\;/;
     const pathStr = `path: '/${name}',`;
     const nameStr = `name: '${name}',`;
     const metaStr = title ? `meta: {title: '${title}'},` : '';
     let componentStr = `component: () => import('${pagePath}'),`;
     content = content.replace(reg, function(match, $1, index) {
       $1 = $1.trim();
       if (!$1.endsWith(',')) {
         $1 += ',';
       }
       if (title) {
         return  `const routes = ${$1} {
           ${pathStr}
           ${nameStr}
           ${metaStr}
           ${componentStr}
         }];`;
       } else {
         return `const routes = ${$1} {
          ${pathStr}
          ${nameStr}
          ${componentStr}
         }];`;
       }
     });
     try {
       await fs.writeFileSync(routerPath, content, 'utf-8');
     } catch(err) {
       error(err);
     }
   } catch(err) {
     error(err);
   }
 }

 module.exports = addRouter;