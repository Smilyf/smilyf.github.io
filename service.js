//require表示引包，引包就是引用自己的一个特殊功能
var http = require("http");
var fs = require("fs");

// 导入系统模块querystring 用于将HTTP参数转换为对象格式
const querystring = require('querystring');

const server = http.createServer();

server.on('request', (req, res) => {
    //拼接post请求参数
    let postData = '';

    // post参数是通过事件的方式接受的
    // 监听参数传输事件, 当请求参数传递的时候出发data事件, params: post请求传输的数据
    req.on('data', (params) => {


        postData += params

    });
    // 监听参数传输完毕事件, 当参数传递完成的时候出发end事件
    req.on('end', () => {
        // 通过querystring模块的parse方法解析 字符串参数postData 成对象格式并返回

        let t = querystring.parse(postData)
        let jsons = JSON.parse(JSON.stringify(t));
        let length = Object.keys(jsons).length


        if(length>0)
        {
            res.end(JSON.stringify(jsons))
        }


    });
});

server.on('request', (req, res) => {

    let url_t="";
    if (req.url.match(/^.*?(?=\?)/)!= null) {
        url_t = req.url.match(/^.*?(?=\?)/)
        
    }
    else {
        url_t = req.url
    }
   
    if (url_t !== "favicon.icon") {
        // console.log(url_t)

        if (url_t == "/") {

            fs.readFile("./html/individualSpace.html", function (err, data) {
                if (err) {
                    console.log(err);

                    res.writeHead(404, { "Content-Type": "text/html;charset=UTF-8" });
                }

                else {

                    // res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });

                    res.end(data);

                }

            });
        }
        else {
            if (url_t.replace(/.+\./, "") === "js") {

                fs.readFile("." + url_t, function (err, data) {


                    if (err) {
                        console.log(err);

                        res.writeHead(404, { "Content-Type": "application/javascript;charset=UTF-8" });
                    }
                    else {

                        res.writeHead(200, { "Content-Type": "application/javascript;charset=UTF-8" });

                        res.end(data);

                    }

                });
            }
            else {
                fs.readFile("." + url_t, function (err, data) {


                    if (err) {
                        console.log(err);

                        res.writeHead(404, { "Content-Type": "text/html;charset=UTF-8" });
                    }
                    else {

                        // res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });

                        res.end(data);

                    }

                });
            }
        }


    }




});

server.listen(8888, "127.0.0.1");

console.log('Server running at http://127.0.0.1:8888/')
