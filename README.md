
### 实现一个node-cli命令行工具

  想要学习node编写cli命令行工具的知识， 可用看我 <a href="https://github.com/kongzhi0707/v-cli">这篇文章</a>

#### 注意：这篇文章也是折腾人家的github的代码的， 最主要的是学习使用node编写cli工具的流程和方法。 目前个人处于学习中，还没有对应的需求要编写对应的命令行工具。只是看人家github代码拿出来学习。后面自己有对应的需求会根据这种规范编写即可，具体的实现业务逻辑就根据自己的需求来处理即可。

#### 一）命令行工具的使用方法介绍

  在我们前端日常开发中，经常会碰到各种各样的cli工具，比如使用过vue框架的话，会有 @vue/cli, 使用过react框架的话， 对create-react-app 一定不陌生。利用这些工具，我们只需要运行几行命令就可以生成一个前端脚手架。提高了我们的开发效率。后续我们只需要把关注点处理我们的业务逻辑即可。

  今天折腾的是 vue 开发中，敲一行命令会帮我们自动生成 页面或组件后 自动添加路由功能。 我们平时做项目的时候，比如新增一个页面后，还需要在路由那边加一个路由，等等配置，手动操作比较烦。因此我们可以使用命令行工具帮我们解决这些问题。

#### 我们暂且取名该命令行工具为: v-cli2

  下面我们来演示下该工具的使用方法：

<img src="https://raw.githubusercontent.com/kongzhi0707/v-cli2/master/images/1.png" /> <br />

  我们运行了 v-cli2 后，可以看到上面提供了两个命令， add-page 增加一个页面的命令， add-component 增加一个组件的命令。但是新增一个页面的时候， 需要在项目的根目录下 或 src 目录下 运行命令，比如执行：v-cli2 add-page 即可。

#### 1) 新增页面或新增组件(运行命令：v-cli2 add-page 或 v-cli2 add-component )需要满足如下条件：

  1.1): 需要在项目的根目录下 或 项目的根目录下中的src目录下 运行： v-cli2 add-page 或 v-cli2 add-component, 否则的话 执行命令失败。比如如下：

<img src="https://raw.githubusercontent.com/kongzhi0707/v-cli2/master/images/2.png" /> <br />

  因为代码中会判断项目的根目录下是否有src文件夹目录。如果没有src文件夹目录的话，就会报错。

#### 2）新增页面的时候(运行命令：v-cli2 add-page) 需要满足条件：

  2.1）src目录下需要有 src/page 目录，src/pages 目录，src/views 目录中三种中其中的任何一种。否则也会报错。依赖这三种其中任何一种的页面的目录结构。

#### 3）新增组件的时候 (运行命令：v-cli2 add-component) 需要满足的条件

  3.1）src目录下需要有 src/component 目录， src/components 目录 中的任意一种，否则也会报错，依赖这2种其中任意一种页面的目录结构。

#### 二）命令行工具目录结构如下：
```
｜--- v-cli2
｜ |--- bin
｜ | |--- index.js                       # 入口文件 bin/index.js
｜ |--- packages
｜ | |--- commands
｜ | | |--- add-page.js
｜ | | |--- add-component.js
｜ | |--- lib
｜ | | |--- add-router.js
｜ | | |--- add-component.js
｜ | | |--- ask-page.js
｜ | | |--- check-context.js
｜ | | |--- copy-template.js
｜ | |--- init.js
｜ |--- template                         # 提供了五种 模版页面
｜ | |--- vue-page-template-less
｜ | |--- vue-page-template-sass
｜ | |--- vue-page-template-stylus
｜ | |--- vue-page-template-scss
｜ | |--- vue-page-simple-template.vue
｜ |--- package.json
```
  package.json 依赖的文件如下：
```
{
  "name": "v-cli2",
  "version": "1.0.0",
  "description": "",
  "main": "bin/index.js",
  "bin": {
    "v-cli2": "bin/index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.0.0",
    "commander": "^9.4.0",
    "inquirer": "^8.2.4",
    "shelljs": "^0.8.5"
  }
}
```
#### 2.1) 入口文件 (bin/index.js)

  入口文件做了二件事，第一就是判断node版本是否大于12，如果本地的node版本小于12的话，会提示用户升级node的版本。
  第二件事就是初始化代码了； 如下代码所示：
```
// bin/index.js
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
```

#### 2.2) 初始化命令 (packages/init.js)

  该文件的作用是：初始化我们要实现的命令，比如初始化 add-page 或 add-component 命令功能，如下代码：
```
const { program } = require('commander');
const { log } = require('./lib/util');

function programInit() {
  // 初始化版本, 直接获取到 package.json 里面的版本
  program.version(require('../package.json').version);

  // 开始添加命令 使用 .command() [name] 该参数是可选的
  // .description 里面可以写上这个命令的一些描述, 当我们使用 v-cli2 或 v-cli2 --help 时候可以提供帮助文档
  // .action 用来响应用户的输入, 我们单独使用一个文件 ./commands/add-page 来处理
  program
    .command('add-page [name]')
    .description('新增一个页面, 默认加在 ./src/views 或 ./src/pages 或 ./src/page 目录下, 同时添加路由支持"/"来创建\n子目录,比如: add-page user/login 使用.')
    .action(require('./commands/add-page'));

  program
    .command('add-component [name]')
    .description(
      '新增一个通用组件，默认加在./src/components 或者 .src/component目录， 支持创建多级目录，例如：demo/test/header \n使用时，支持 v-cli2 add-component 【回车】 来选择输入信息'
    )
    .action(require('./commands/add-component'))
    // 格式化命令行参数
    program.parse(process.argv);  
}

programInit();
```
#### 执行 v-cli2 add-page 命令响应用户的输入 (packages/commands/add-page.js)

  add-pages.js 代码中使用到一些库，比如 shellJS 是用来处理 shell 命令的。了解更多shelljs使用方法，请看 <a href="https://github.com/kongzhi0707/front-end-learn/blob/master/node/shelljs.md">这篇文章</a>, 我们用来操作文件的。 chalk 是用来打印输出样式的。函数通过name, cmdObj 来获取用户输入的，其中name是 v-cli2 add-page pageA 命令中的 pageA。 cmdObj 对象里面包含其他的参数。代码如下：
```
const fs = require('fs');
const chalk = require('chalk');
// askQuestions 回答的问题, askCssType: 选择css风格 (less, sass, stylus)
const { askQuestions, askCssType } = require('../lib/ask-page');
// 检查目录是否符合规范
const checkContext = require('../lib/check-context');
// 复制模版
const copyTemplate = require('../lib/copy-template');
// 添加路由
const addRouter = require('../lib/add-router');
const { error, log } = require('../lib/util');

module.exports = async (name, cmdObj) => {
  try {
    // 默认使用less样式
    let cssType = 'less';
    let simple = true; // 创建简单的页面
    let title = ''; // 页面标题
    // 如果用户没有输入name, 直接命令 v-cli2 add-page 则进入问答模式, 通过一问一答获取用户输入(问答模式: 需要输入页面名称, 页面标题, 模版类型)
    if (!name) {
      const answers = await askQuestions();
      name = answers.FILENAME;
      title = answers.TITLE;
      simple = answers.SIMPLE;
      if (!simple) { // 如果选择的类型不是 simple 的话, 就使用其他的类型
        const res = await askCssType();
        cssType = res.CSS_TYPE;
      }
    }
    // 检查上下文环境, 并返回目标文件的目录路径
    let { destDir, destDirRootName, rootDir } = checkContext(name, cmdObj, 'page');
    // 复制模版到目标文件
    let { destFile } = copyTemplate(destDir, simple, cssType);
    if (fs.existsSync(destFile)) { // 检测目录是否存在
      await addRouter(name, rootDir, simple, destDirRootName, title);
      log(`成功创建${name}, 请在${destDir}下查看`);
    } else {
      console.error(
        chalk.red(`创建失败, 请到项目的【根目录】或者【src】目录下执行该操作`)
      );
    }
  } catch(error) {
    console.error(chalk.red(error));
    console.error(chalk.red(`创建页面失败, 请确保在项目的【根目录】或者【src】目录下执行该操作\n`));
  }
}
```
#### 执行 v-cli2 add-component 组件命令响应用户的输入 (packages/commands/add-component.js)
```
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
```
#### 新增页面的问答模式 (packages/lib/ask-page.js)

  用到的组件 inquirer, 基本上以数组的方式想让用户输入内容，其中 页面名称 和 title 是必填项，每个问题的交互可以选择input输入，list选择等等。我们获取到用户的输入后就可以在 packages/commands/add-page.js 调用，然后拿到这些参数。如下代码：
```
const inquirer = require('inquirer');
const askQuestions = () => {
  const questions = [
    {
      name: 'FILENAME',
      type: 'input',
      message: '请输入页面的名称?[支持多级目录, 比如: lib/test]',
      validate: (val) => {
        if (val) {
          return true;
        }
        return '请输入页面名称'
      }
    },
    {
      name: 'TITLE',
      type: 'input',
      message: '请输入页面标题',
      validate: (val) => {
        if (val) {
          return true;
        }
        return '请输入页面标题'
      }
    },
    {
      type: 'list',
      name: 'SIMPLE',
      message: '选择模版的类型?',
      choices: [
        'normal: 【同时创建 .vue .js .[style]】',
        'simple: 【只创建 .vue】',
      ],
      filter: function(val) {
        return val.split(':')[0] === 'simple' ? true : false;
      }
    }
  ];
  return inquirer.prompt(questions);
}

const askCssType = () => {
  const questions = [
    {
      name: 'CSS_TYPE',
      type: 'list',
      message: 'what is this css style type?',
      choices: ['.less', '.scss', '.sass', '.stylus'],
      filter: function (val) {
        return val.split('.')[1];
      },
    },
  ];
  return inquirer.prompt(questions);
}

module.exports = { askQuestions, askCssType };
```
#### 新增组件的问答模式 (packages/lib/ask-component.js)
```
const inquirer = require('inquirer');
const askQuestions = () => {
  const questions = [
    {
      name: 'FILENAME',
      type: 'input',
      message: '请输入页面的名称?[支持多级目录, 比如: lib/test]',
      validate: (val) => {
        if (val) {
          return true;
        }
        return '请输入页面名称'
      }
    },
    {
      name: 'SIMPLE',
      type: 'list',
      message: '选择模版的类型?',
      choices: [
        'normal: 【同时创建 .vue .js .[style]】',
        'simple: 【只创建 .vue】',
      ],
      filter: function(val) {
        return val.split(':')[0] === 'simple' ? true : false;
      }
    }
  ];
  return inquirer.prompt(questions);
};

const askCssType = () => {
  const questions = [
    {
      name: 'CSS_TYPE',
      type: 'list',
      message: 'what is this css style type?',
      choices: ['.less', '.scss', '.sass', '.stylus'],
      filter: function (val) {
        return val.split('.')[1];
      },
    },
  ];
  return inquirer.prompt(questions);
}

module.exports = { askQuestions, askCssType };
```
#### 检查用户执行命令时所在的环境(packages/lib/check-context.js)

  因为不确定用户会不会按照我们所期望的方式来使用。因此我们需要判断下，来确保用户的行为规范，否则就抛出错误来提示用户该怎么使用。其实我们上面也提到过有如下几个规范：
```
  1）确保用户在项目的根目录下或src目录下执行命令 v-cli2 add-page 或 v-cli2 add-component, 否则报错，提示用户如何使用。
  2）确认用户所在项目的目录结构是否符合我们提供的规范，比如 执行 命令 v-cli2 add-page 时候， 会判断项目的根目录下的src目录是否有 page/pages/views 文件夹。如果没有的话，报错提示， 如果使用 v-cli2 add-component 命令的时候，判断 src目录下是否有 component 或 omponents 文件夹，如果没有的话报错提示用户。
  3）判断下这个添加的页面是否已经存在。
```
代码如下：
```
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
```
#### 复制模板到目标路径下 (packages/lib/copy-template.js)
```
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
```
#### 添加路由 (package/lib/add-router.js)

  添加了页面模版后，我们希望自动配置上路由，我们需要读取 router.js，然后往里面插入用户添加的页面所在的路由。但是依赖于路由结构；
  是否是 src/router/index.js 这样的结构 或 src/router.js 的结构，如果除了这两种之外，其他的不符合。会报错提示。

  并且 src/router/index.js 必须有如下结构：

  const routes = []; 因为代码里面的正则会去匹配 const routes = [ 这个结构，里面的代码，然后一个个去拼接起来，最后通过文件写入的方式写入进去，所有的代码如下：
```
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
```
 我们可以测试下， 把该代码下载下来， 然后 npm link 下， 然后在其他项目使用 v-cli2 命令运行下即可看到效果。

