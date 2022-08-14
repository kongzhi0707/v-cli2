
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
