//存放commander命令行
const { Command } = require('commander');
const program = new Command();

//控制命令行的版本名称和参数
program.version('0.0.1')
    .name('translate')
    .usage('<english>');

program.parse(process.argv);