
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