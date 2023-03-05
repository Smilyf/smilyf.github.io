//require表示引包，引包就是引用自己的一个特殊功能
var http = require("http");
var fs = require("fs");
var buf = new Buffer.alloc(1024);
const server = http.createServer();

async function article_announce(jsons, res) {

    var tempSnowflake = new Snowflake(1n, 1n, 0n);
    let tempId = tempSnowflake.nextId();
    let url = "./article/" + jsons["category"] + "/article.json"

    let url_md = "./article/" + jsons["category"] + "/md/" + tempId + ".md"
    let url2_json_one = "./article/" + jsons["category"] + "/json/" + tempId + ".json"
    const open_article_json = async function (url) {

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
    const open_json_one_old = async function (url) {

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
    const create_article_json = async function (tempId, articles_json, jsons) {
        articles_json = JSON.parse(articles_json)

        let articles_json_content = {}
        articles_json_content["title"] = jsons["title"]
        articles_json_content["synopsis"] = jsons["synopsis"]
        articles_json_content["category"] = jsons["category"]
        articles_json_content["state"] = jsons["state"]
        articles_json_content["author"] = jsons["author"]
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
        if (jsons["index"] != "") {
            let url_json_one_old = "./article/" + jsons["category_delete"] + "/json/" + jsons["index"] + ".json"
            let json_one_old = await open_json_one_old(url_json_one_old)

            json_one_old = JSON.parse(json_one_old)

            articles_json_content["createtime"] = json_one_old["createtime"]
            articles_json_content["updatetime"] = dateTime
        }
        else {
            articles_json_content["createtime"] = dateTime
        }

        articles_json[tempId] = articles_json_content
        return articles_json
    }
    const write_article_json = async function (url, articles_json) {

        return new Promise(function (resolve, reject) {

            fs.writeFile(url, JSON.stringify(articles_json), function (err) {
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

    const write_article_json_one = async function (url, articles_json_one) {

        return new Promise(function (resolve, reject) {

            fs.writeFile(url, JSON.stringify(articles_json_one), function (err) {
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
    const write_article_md = async function (url, md_content) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(url, md_content.toString(), function (err) {
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

    try {
        let article_json = await open_article_json(url)
        article_json = await create_article_json(tempId, article_json, jsons)
        await write_article_json(url, article_json)
        await write_article_json_one(url2_json_one, article_json[tempId])
        await write_article_md(url_md, jsons["content"])
        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        res.end("Announce successful");
    } catch (error) {
        console.log(error)
        res.writeHead(404, { "Content-Type": "text/html;charset=UTF-8" });
        res.end("Announce errno");
    }
}


async function article_update(jsons, res) {
    await article_announce(jsons, res)
    await article_delete(jsons, res)
}

async function article_delete(jsons, res) {

    let index = jsons["index"]
    let url = "./article/" + jsons["category_delete"] + "/article.json"
    let url1 = "./article/" + jsons["category_delete"] + "/md/" + index + ".md"
    let url2 = "./article/" + jsons["category_delete"] + "/json/" + index + ".json"
    //手写 fs.readfilesync()
    const open_article_json = async function (url) {
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
    const write_article_json = async function (url, articles_json) {

        return new Promise(function (resolve, reject) {

            fs.writeFile(url, JSON.stringify(articles_json), function (err) {
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
    const delete_article_md = async function (url) {
        return new Promise(function (resolve, reject) {
            fs.unlink(url, function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve("delete succeed!");
                }

            });

        });

    }
    const delete_article_json_one = async function (url) {
        return new Promise(function (resolve, reject) {
            fs.unlink(url, function (err) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    resolve("delete succeed!");
                }

            });
        });
    }
    let article_json = await open_article_json(url)
    try {
        article_json = JSON.parse(article_json)
        delete article_json[index]
        await write_article_json(url, article_json)
        await delete_article_md(url1)
        await delete_article_json_one(url2)
        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        res.end("Delect successful");
    } catch (error) {
        res.writeHead(404, { "Content-Type": "text/html;charset=UTF-8" });
        res.end("Delect error");
    }
}


function convert_Content_Type(url_t) {
    let Type = url_t.replace(/.+\./, "")
    switch (Type) {
        case "js":
            return "application/javascript;charset=UTF-8"
        // case "css":
        //     return "text/html;charset=UTF-8"
        default:
            return ""
    }


}


server.on('request', (req, res) => {

    let url_t = "";
    if (req.url.match(/^.*?(?=\?)/) != null) {
        url_t = req.url.match(/^.*?(?=\?)/)[0]

    }
    else {
        url_t = req.url
    }
    switch (url_t) {
        case "/favicon.ico":
            break;
        case "/articleAannounce":
            {
                let postData = '';
                let jsons = {};
                req.on('data', (params) => {
                    postData += params
                });

                req.on('end', () => {
                    if (postData.length > 0) {
                        jsons = JSON.parse(postData)
                        article_announce(jsons, res)
                    }
                })
                break;
            }

        case "/articleUpdate":
            {
                let postData = '';
                let jsons = {};
                req.on('data', (params) => {
                    postData += params
                });

                req.on('end', () => {
                    if (postData.length > 0) {
                        jsons = JSON.parse(postData)
                        article_update(jsons, res)
                    }
                })
                break;
            }


        case "/articleDelete":
            {
                let postData = '';
                let jsons = {};
                req.on('data', (params) => {
                    postData += params
                });

                req.on('end', () => {
                    if (postData.length > 0) {
                        jsons = JSON.parse(postData)
                        article_delete(jsons, res)
                    }
                })
                break;
            }
        case "/":
            {
                fs.readFile("./index.html", function (err, data) {
                    if (err) {
                        console.log(err);

                        res.writeHead(404, { "Content-Type": "text/html;charset=UTF-8" });
                    }

                    else {

                        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });

                        res.end(data);

                    }

                });
                break;
            }
        default:
            fs.readFile("." + url_t, function (err, data) {
                if (err) {
                    console.log(err);

                    res.writeHead(404, { "Content-Type": "text/html;charset=UTF-8" });
                }
                else {
                    res.writeHead(200, { "Content-Type": convert_Content_Type(url_t) });

                    res.end(data);
                }
            });
            break;
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
