"use strict";
// import "../js/check.js"
// import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js';
// //  and it's easy to individually load & register additional languages
// import go from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/go.min.js';

// hljs.registerLanguage('go', go);
// const { configConsumerProps } = require("antd/lib/config-provider");

//获取网页根目录
function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}

var article_json;
//每页的文章数量
// var pages = 3
//分页个数
var page_num = 1
//文章数
var length = 0
sessionStorage.setItem("pages", 5)
sessionStorage.setItem("flag", 0)
sessionStorage.setItem("actegory", "0")
sessionStorage.setItem("time", "0")
sessionStorage.setItem("sortway", "0")
sessionStorage.setItem("author_id", 0)
sessionStorage.setItem("svalue", "")

//文章动态生成
function create(text, index) {
    let temp = document.createElement("div")
    let h1 = document.createElement("h1")
    let div = document.createElement("div")
    div.className = "user_and_time"
    let authorname = document.createElement("a")

    let createtime = document.createElement("div")
    //
    let indexx
    if (sessionStorage.getItem("flag") == "1") {

        indexx = Object.keys(text).sort(function (a, b) {
            return b - a
        })[index - 1]
    } else {
        indexx = Object.keys(text).sort(function (a, b) {
            return a - b
        })[index - 1]
    }

    // indexx= Object.keys(text)[index-1]
    h1.innerHTML = marked.parse(text[indexx]["title"])
    let p1 = document.createElement("p")
    p1.innerHTML = marked.parse(text[indexx]["synopsis"])
    authorname.innerHTML = "作者：" + (text[indexx]["authorname"])
    authorname.addEventListener("click", () => {
        sessionStorage.setItem("author_id", text[indexx]["author_id"])


    })
    let span0 = document.createElement("span")
    let span1 = document.createElement("span")
    let span2 = document.createElement("span")
    let span3 = document.createElement("span")
    span0.innerHTML = "文章类别：" + text[indexx]["actegory"]
    span1.innerHTML = "评论数：" + text[indexx]["comment_amount"]
    span2.innerHTML = "点赞数：" + text[indexx]["favorite_amount"]
    span3.innerHTML = "发布时间：" + (text[indexx]["createtime"])
    authorname.href = getBasePath() + "/html/individualSpace.html"
    createtime.appendChild(span0)
    createtime.appendChild(span1)
    createtime.appendChild(span2)
    createtime.appendChild(span3)
    temp.appendChild(h1)
    temp.appendChild(p1)
    div.appendChild(authorname)
    div.appendChild(createtime)
    temp.appendChild(div)
    h1.addEventListener("click", () => {
        // sessionStorage.setItem('item', index);
        window.location.href = "../html/content.html?domain=" + text[index]["label"] + "?index=" + indexx;
    })
    return temp;
}

//换页按钮
function change_page(buttons) {

    document.querySelector(".previous-page").addEventListener("click", () => {
        let href = window.location.href;
        let index = href.match(/\?paging=(.*)/)[1]
        index = parseInt(index)
        if (index - 1 >= 1) {
            buttons[index - 2].click();
        }
    })
    document.querySelector(".next-page").addEventListener("click", () => {
        // let index = sessionStorage.getItem("paging")
        let href = window.location.href;
        let index = href.match(/\?paging=(.*)/)[1]
        index = parseInt(index)
        if (index + 1 <= page_num) {
            buttons[index].click()
        }
    })
}

//初始化页面
function init_page(buttons) {
    let href = window.location.href;
    for (let j of buttons) {
        if (href.match(/\?paging=(.*)/) === null) {
            j.click()
            break;
        } else if (j.value === href.match(/\?paging=(.*)/)[1]) {
            j.click();
            break;
        }

    }

}

function article_display() {

    let pages = Number(sessionStorage.getItem("pages"))

    let href = window.location.href
    let domain = "C++";
    let ur2 = "../article/" + domain + "/article.json"
    let url1 = getBasePath() + '/Search'
    url1 += '?flag=0'

    let actegory = sessionStorage.getItem("actegory")

    let sortway = sessionStorage.getItem("sortway")

    let time = sessionStorage.getItem("time")
    let value = sessionStorage.getItem("svalue")
    sessionStorage.setItem("svalue", "")
    if (actegory == "0" || actegory == "全部") {
        url1 += '&actegory=' + 0
    }
    if (actegory == "C++") {
        url1 += '&actegory=' + 1
    }
    if (actegory == "Java") {
        url1 += '&actegory=' + 2
    }
    if (actegory == "Python") {
        url1 += '&actegory=' + 3
    }
    if (actegory == "C#") {
        url1 += '&actegory=' + 4
    }


    if (sortway == "0" || sortway == "发布时间") {
        url1 += '&sortway=' + 0
    }
    if (sortway == "点赞数") {
        url1 += '&sortway=' + 1
    }
    if (sortway == "评论数") {
        url1 += '&sortway=' + 2
    }
    if (time == "全部" || time == "0") {
        url1 += '&time=' + 0
    } else {
        url1 += '&time=' + time
    }

    url1 += '&value=' + value


    //servlet请求触发
    fetch(url1,
        {
            method: 'POST',
            body: "",
            headers: {}
        }).then(resp => resp.text()).then((data) => {

            return JSON.parse(data)

        })
        .then((text) => {
            article_json = text

            length = Object.keys(text).length;

            let paging_index = document.querySelector(".paging .paging-index")
            paging_index.innerHTML = ""
            page_num = (length + pages - 1) / pages
            let art = document.querySelector(".layout-content>.articles")
            art.innerHTML = ""
            for (let i = 1; i <= page_num; i++) {
                let button = document.createElement("button")
                button.className = "button_off";
                button.innerHTML = i.toString()
                button.value = i.toString()
                button.addEventListener("click", () => {
                    art = document.querySelector(".layout-content>.articles")
                    art.innerHTML = ""
                    let href = window.location.href;
                    let index = "0"
                    if (href.match(/\?paging=(.*)/) != null) {
                        index = href.match(/\?paging=(.*)/)[1];
                        if (index != i.toString()) {
                            history.pushState(null, null, '?domain=' + domain + '?paging=' + i.toString())
                        }
                    } else {
                        history.pushState(null, null, '?domain=' + domain + '?paging=' + "1")
                    }
                    let start = (i - 1) * pages + 1
                    let end = start + ((length - start + 1) < pages ? (length - start + 1) : pages)
                    for (let i = start; i < end; i++) {
                        art.appendChild(create(text, i.toString()))
                    }
                })
                paging_index.appendChild(button)
            }
            return paging_index
        }
        )
        .then((paging_index) => {
            let buttons = paging_index.querySelectorAll("button")
            for (let button of buttons) {
                button.addEventListener("click", () => {
                    let href = window.location.href;
                    for (let j of buttons) {
                        if (j.value === href.match(/\?paging=(.*)/)[1]) {
                            j.className = "button_on"
                        } else {
                            j.className = "button_off"
                        }

                    }

                })
            }
            return buttons
        }).then((buttons) => {

            init_page(buttons)
            change_page(buttons)
            return buttons
        }).then((buttons) => {

            document.querySelector(".logos a").addEventListener("click", () => {
                buttons[0].click();
            })
            return buttons;

        }).then((buttons) => {
            window.addEventListener("popstate", () => {
                let href = window.location.href;
                let index = "0"
                // var code1 = href.match(/\?data=(.*)/)[1];//取 ?data=后面所有字符串
                // var code3 = href.match(/data=(.*)/)[0]; //取 包含 data=及后面的字符串
                // buttons[num-1].click()
                if (href.match(/\?paging=(.*)/) != null) {
                    index = href.match(/\?paging=(.*)/)[1];//取 data=后面所有字符串
                }
                let num = parseInt(index)
                if (num != 0) {
                    buttons[num - 1].click()
                }

            });
            return buttons;
        }).then((buttons) => {
            if (buttons.length == 0) {
                let div = document.createElement("div")
                div.innerHTML = "暂无查询结果！"
                div.className = "shownone"
                document.querySelector("#articles").appendChild(div)
            }


        })
}

function select(content_index) {
    const content = document.querySelector("#articles")
    const create = document.querySelector("#create")
    const paging = document.querySelector("#paging")
    const dynamic = document.querySelector("#dynamic")
    const manuscript = document.querySelector("#manuscript")
    const create_articles = document.querySelector("#create-articles")

    if (content_index == "dynamic") {

        dynamic.className = "navigation-article-show"


    } else {

        dynamic.className = "navigation-article-hidden"
    }

    if (content_index == "manuscript") {

        manuscript.className = "navigation-article-show"
    } else {

        manuscript.className = "navigation-article-hidden"
    }

    if (content_index == "dynamic" || content_index == "manuscript") {
        content.className = "articles"
        paging.className = "paging"


    } else {
        content.className = "articles-hidden"
        paging.className = "paging-hidden"

    }


    if (content_index == "create-articles") {
        create.className = "create"
        create_articles.className = "navigation-article-show"

    } else {
        create.className = "create-hidden"
        create_articles.className = "navigation-article-hidden"
    }

}


window.addEventListener('load', () => {
    article_display()


})



// window.addEventListener("load",()=>{
//     let username=document.querySelector("#username")
//     let userid=document.querySelector("#userid")
//
//     let inf=JSON.parse( sessionStorage.getItem("identity"))
//     username.value=inf["username"]
//     userid.value=inf["userid"]
//
// })
//
//
//


//每页文章数量
window.addEventListener("load", () => {
    let pages = document.querySelectorAll("#articlenums input")
    for (let x of pages) {
        x.addEventListener("click", () => {
            if (x.className == "off") {

                for (let y of pages) {
                    y.className = "off"
                }
                x.className = "on"

            }
            sessionStorage.setItem("pages", x.value)
            //触发servlet
            article_display()

        })
    }

})

//排序顺序
window.addEventListener("load", () => {
    let pages = document.querySelectorAll("#sortflag input")
    for (let x of pages) {
        x.addEventListener("click", () => {
            if (x.className == "off") {

                for (let y of pages) {
                    y.className = "off"
                }
                x.className = "on"

            }
            if (x.value == "升序") {
                sessionStorage.setItem("flag", 1)
            } else {
                sessionStorage.setItem("flag", 0)
            }
            //触发servlet
            article_display()

        })
    }

})
//类别查找
window.addEventListener("load", () => {
    let pages = document.querySelectorAll("#actegory input")
    for (let x of pages) {
        x.addEventListener("click", () => {
            if (x.className == "off") {

                for (let y of pages) {
                    y.className = "off"
                }
                x.className = "on"

            }


            sessionStorage.setItem("actegory", x.value)
            //触发servlet
            article_display()

        })
    }

})


//时间查找
window.addEventListener("load", () => {
    let pages = document.querySelectorAll("#time input")
    for (let x of pages) {
        x.addEventListener("click", () => {
            if (x.className == "off") {

                for (let y of pages) {
                    y.className = "off"
                }
                x.className = "on"

            }


            sessionStorage.setItem("time", x.value)
            //触发servlet
            article_display()

        })
    }

})
//排序方式
window.addEventListener("load", () => {
    let pages = document.querySelectorAll("#sortway input")
    for (let x of pages) {
        x.addEventListener("click", () => {
            if (x.className == "off") {

                for (let y of pages) {
                    y.className = "off"
                }
                x.className = "on"

            }


            sessionStorage.setItem("sortway", x.value)
            //触发servlet
            article_display()

        })
    }

})
//关键字搜索
window.addEventListener("load", () => {
    let pages = document.querySelector("#svalue")
    let cccc = document.querySelector("#cccc")

    // cccc.addEventListener("click", () => {
    //     sessionStorage.setItem("svalue", pages.value)
    //     //触发servlet
    //     article_display()

    // })

})
