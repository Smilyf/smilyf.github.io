//require表示引包，引包就是引用自己的一个特殊功能
var http = require("http");
var fs = require("fs");
var server = http.createServer(function (req, res) {


    fs.readFile("", function (err, data) {

        if (err) {
            console.log(err);

            res.writeHead(404, { "Content-Type": "text/html;charset=UTF-8" });
        }

        else {

            // res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });

            res.end(data);

        }

    });






});


