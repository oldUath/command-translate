"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//存放commander命令行
var main_1 = require("./main");
var Command = require('commander').Command;
var program = new Command();
//控制命令行的版本名称和参数
program.version('0.0.1')
    .name('translate')
    .usage('<english>')
    .arguments('<english>')
    .action(function (english) {
    main_1.translate(english);
});
program.parse(process.argv);
