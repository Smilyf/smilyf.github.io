//require表示引包，引包就是引用自己的一个特殊功能
var http = require("http");
var fs = require("fs");
var buf = new Buffer.alloc(1024);
// 导入系统模块querystring 用于将HTTP参数转换为对象格式
const querystring = require('querystring');
const { URLSearchParams } = require('url');
const { constants } = require("buffer");
const { devNull } = require("os");
const server = http.createServer();

function article_show(req, res) {
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

        // var searchParams = new URLSearchParams(postData);

        //先通过？分解得到？后面的所需字符串，再将其通过&分解开存放在数组里
        //   postData = postData.split("?")[1].split("&"); 
        if (postData.length > 0) {
            postData = postData.split("&");
            let jsons = {};
            // for (let i of postData) {
            //     jsons[i.split("======")[0]] = i.split("======")[1];  //对数组每项用=分解开，=前为对象属性名，=后为属性值
            // }
            // let length = Object.keys(jsons).length

            jsons = JSON.parse(postData)

            const announce = async () => {
                let ans = await open_article_json(jsons)
                await write_article_json(ans)
                let ansens = await open_article_json(jsons)
                await res.end(ansens.toString())
            }
            const show = async () => {

                let ansens = await open_article_json()
                res.end(ansens.toString())
            }

            const open_article_json = async function (jsons) {
                let url = "./article/" + jsons["category"] + "/article.json"

                return new Promise(function (resolve, reject) {
                    fs.readFile(url, function (err, data) {
                        if (!err) {
                            let ans = data.toString()
                            if (ans == "") {
                                ans = "{}"
                            }
                            resolve(ans);
                        } else {
                            reject(err);
                        }
                    });
                });

            }

            const write_article_json = async function (e) {
                var tempSnowflake = new Snowflake(1n, 1n, 0n);
                let tempId = tempSnowflake.nextId();

                const create_article_json = async function (e, tempId, jsons) {

                    let articles_json = {}
                    let articles_json_one = {}
                    articles_json = JSON.parse(e)
                    let indexs = tempId.toString()
                    let articles_json_content = {}
                    articles_json_content["title"] = jsons["title"]
                    articles_json_content["synopsis"] = jsons["synopsis"]
                    articles_json_content["category"] = jsons["category"]
                    let myDate = new Date();
                    let year = myDate.getFullYear();
                    let month = myDate.getMonth() + 1;
                    let date = myDate.getDate();
                    let hours = myDate.getHours();
                    let minutes = myDate.getMinutes();
                    let seconds = myDate.getSeconds();

                    //月份的显示为两位数字如09月
                    if (month < 10) {
                        month = "0" + month;
                    }
                    if (date < 10) {
                        date = "0" + date;
                    }
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    if (minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }

                    //时间拼接
                    var dateTime = year + "-" + month + "-" + date + "  " + hours + ":" + minutes + ":" + seconds;
                    articles_json_content["createtime"] = dateTime
                    articles_json[indexs] = articles_json_content

                    articles_json_one[indexs] = articles_json_content
                    let url1 = "./article/" + jsons["category"] + "/article.json"
                    let url2 = "./article/" + jsons["category"] + "/json/" + indexs + ".json"
                    const create_jsons = async function (url1, articles_json) {

                        new Promise(function (resolve, reject) {

                            fs.writeFile(url1, JSON.stringify(articles_json), function (err) {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                }
                                else {
                                    resolve("");
                                }


                            });
                        })


                    }
                    const create_json_one = async function (url2, articles_json_one) {

                        new Promise(function (resolve, reject) {

                            fs.writeFile(url2, JSON.stringify(articles_json_one), function (err) {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                }
                                else {
                                    resolve("");
                                }


                            });
                        })


                    }
                    await create_jsons(url1, articles_json)
                    await create_json_one(url2, articles_json_one)

                }
                const create_article_md = async function (jsons) {
                    return new Promise(function (resolve, reject) {

                        let url2 = "./article/" + jsons["category"] + "/md/" + tempId + ".md"
                        fs.writeFile(url2, jsons["content"], function (err) {
                            if (err) {
                                console.error(err);
                                reject(err);
                            }
                            else {
                                resolve("");
                            }

                        });

                    });

                }
                await create_article_json(e, tempId, jsons)
                await create_article_md(jsons)

            }



            if (jsons["flag"] == "announce") {
                announce()
            }
            if (jsons["flag"] == "show") {
                show()
            }

        }

    });
};

server.on('request', (req, res) => {

    let url_t = "";
    if (req.url.match(/^.*?(?=\?)/) != null) {
        url_t = req.url.match(/^.*?(?=\?)/)[0]

    }
    else {
        url_t = req.url
    }


    if (url_t != "/favicon.ico") {


        if (url_t == "/") {

            fs.readFile("./index.html", function (err, data) {
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
                if (url_t == "/article") {

                    article_show(req, res)
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
    }




});

server.listen(8888, "127.0.0.1");

console.log('Server running at http://127.0.0.1:8888/')





var Snowflake = (function () {
    function Snowflake(_workerId, _dataCenterId, _sequence) {
        this.twepoch = 1288834974657n;
        //this.twepoch = 0n;
        this.workerIdBits = 5n;
        this.dataCenterIdBits = 5n;
        this.maxWrokerId = -1n ^ (-1n << this.workerIdBits); // 值为：31
        this.maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits); // 值为：31
        this.sequenceBits = 12n;
        this.workerIdShift = this.sequenceBits; // 值为：12
        this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：17
        this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：22
        this.sequenceMask = -1n ^ (-1n << this.sequenceBits); // 值为：4095
        this.lastTimestamp = -1n;
        //设置默认值,从环境变量取
        this.workerId = 1n;
        this.dataCenterId = 1n;
        this.sequence = 0n;
        if (this.workerId > this.maxWrokerId || this.workerId < 0) {
            throw new Error('_workerId must max than 0 and small than maxWrokerId-[' + this.maxWrokerId + ']');
        }
        if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
            throw new Error('_dataCenterId must max than 0 and small than maxDataCenterId-[' + this.maxDataCenterId + ']');
        }

        this.workerId = BigInt(_workerId);
        this.dataCenterId = BigInt(_dataCenterId);
        this.sequence = BigInt(_sequence);
    }
    Snowflake.prototype.tilNextMillis = function (lastTimestamp) {
        var timestamp = this.timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = this.timeGen();
        }
        return BigInt(timestamp);
    };
    Snowflake.prototype.timeGen = function () {
        return BigInt(Date.now());
    };
    Snowflake.prototype.nextId = function () {
        var timestamp = this.timeGen();
        if (timestamp < this.lastTimestamp) {
            throw new Error('Clock moved backwards. Refusing to generate id for ' +
                (this.lastTimestamp - timestamp));
        }
        if (this.lastTimestamp === timestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;
            if (this.sequence === 0n) {
                timestamp = this.tilNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0n;
        }
        this.lastTimestamp = timestamp;
        return ((timestamp - this.twepoch) << this.timestampLeftShift) |
            (this.dataCenterId << this.dataCenterIdShift) |
            (this.workerId << this.workerIdShift) |
            this.sequence;
    };
    return Snowflake;
}());