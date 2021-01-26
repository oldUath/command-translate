"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
var https = __importStar(require("https"));
var querystring = __importStar(require("querystring"));
var md5 = require("md5");
var private_1 = require("./private");
var errorMap = {
    52001: "请求超时",
    52002: "系统错误",
    52003: "未授权错误",
    54000: "必填参数为空",
    unknown: '服务器繁忙'
};
var translate = function (word) {
    var salt = Math.random();
    var sign = md5(private_1.appId + word + salt + private_1.appSecert);
    var from, to;
    if (/[a-zA-Z]/.test(word[0])) {
        //英译中
        from = 'en';
        to = 'zh';
    }
    else {
        //中译英
        from = 'zh';
        to = 'en';
    }
    var query = querystring.stringify({
        q: word,
        from: from,
        to: to,
        appid: private_1.appId,
        salt: salt,
        sign: sign
    });
    var options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?' + query,
        method: 'GET'
    };
    var request = https.request(options, function (response) {
        // console.log('状态码:', response.statusCode);
        // console.log('请求头:', response.headers);
        //监听请求到的结果，并把它变成字符串
        var chunks = [];
        response.on('data', function (chunk) {
            chunks.push(chunk);
        });
        response.on('end', function () {
            var string = Buffer.concat(chunks).toString();
            var object = JSON.parse(string);
            if (object.error_code) {
                console.log(errorMap[object.error_code] || object.error_msg);
                //退出当前任务
                process.exit(2);
            }
            else {
                console.log(object.trans_result[0].dst);
                //退出当前进程，0表示没有错误
                process.exit(0);
            }
        });
    });
    request.on('error', function (e) {
        console.error(e);
    });
    request.end();
};
exports.translate = translate;
