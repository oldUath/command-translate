import * as https from 'https';
import * as querystring from 'querystring';
import md5 = require('md5');
import {appId, appSecert} from './private';

const errorMap = {
    52001:"请求超时",
    52002:"系统错误",
    52003:"未授权错误",
    54000:"必填参数为空",
    unknown:'服务器繁忙'
}

export const translate = (word)=>{
    const salt = Math.random()
    const sign = md5(appId+word+salt+appSecert) ;

    const query: string = querystring.stringify({
        q: word,
        from:'en',
        to:'zh',
        appid:appId,
        salt:salt,
        sign:sign
    });
    const options = {
        hostname: 'api.fanyi.baidu.com',
        port: 443,
        path: '/api/trans/vip/translate?'+query,
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        // console.log('状态码:', response.statusCode);
        // console.log('请求头:', response.headers);

        //监听请求到的结果，并把它变成字符串
        let chunks = [];
        response.on('data', (chunk) => {
            chunks.push(chunk)
        });
        response.on('end',()=>{
            const string = Buffer.concat(chunks).toString();
            //定义一个返回结果的类型
            type BaiduResult={
                error_code?:string;
                error_msg?:string;
                from:string;
                to:string;
                trans_result:{src:string,dst:string}[];
            }
            const object:BaiduResult = JSON.parse(string);
            if(object.error_code){
                console.log(errorMap[object.error_code] || object.error_msg);
                //退出当前任务
                process.exit(2)
            }else {
                console.log(object.trans_result[0].dst)
                //退出当前进程，0表示没有错误
                process.exit(0)
            }
        })
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
}