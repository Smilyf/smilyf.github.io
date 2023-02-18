"use strict";
import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js';
//  and it's easy to individually load & register additional languages
import go from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/go.min.js';
hljs.registerLanguage('go', go);
function combineDebounceThrottle(func, wait) {
    var lastTime = 0
    var timeoutD
    var timeoutT

    var later = function (...args) {
        clearTimeout(timeoutD)
        clearTimeout(timeoutT)
        timeoutD = null
        timeoutT = null
        lastTime = Date.now()
        func.apply(null, args)
    }

    return function (...args) {
        var now = Date.now()
        var coolingDown = now - lastTime < wait

        clearTimeout(timeoutD)

        if (!timeoutT && !coolingDown) {
            timeoutT = setTimeout(later, wait, 'throttle', ...args)
        }
        else {
            timeoutD = setTimeout(later, wait, 'debounce', ...args)
        }
    }
}
//获取网页根目录
function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
if (sessionStorage.getItem("content") == null) {
    sessionStorage.setItem("content", "")
}
if (sessionStorage.getItem("title") == null) {
    sessionStorage.setItem("title", "")
}
if (sessionStorage.getItem("synopsis") == null) {
    sessionStorage.setItem("synopsis", "")
}
var scrolltime = null;
var article_json;
//每页的文章数量
var pages = 3
//分页个数
var page_num = 1
//文章数
var length = 0
function create(text, init_domain_json, index) {

    let temp = document.createElement("div")
    let h1 = document.createElement("a")
    let title = document.createElement("div")
    title.className = "title_a"
    let div = document.createElement("div")
    div.className = "user_and_time"
    let authorname = document.createElement("a")
    //
    let indexx = Object.keys(text).sort(function (a, b) { return b - a })[index - 1]
    // let indexx= Object.keys(text)[index-1]
    h1.innerHTML = marked.parse(text[indexx]["title"])

    let div_buttons = document.createElement("div")
    div_buttons.className = "div_buttons"
    let div_button1 = document.createElement("div")
    div_button1.innerHTML = "更新"
    div_button1.addEventListener("click", async () => {

        document.querySelector("#title").value = text[indexx]["title"]
        document.querySelector("#synopsis").value = text[indexx]["synopsis"]
        document.querySelector("#category").value = text[indexx]["category"]

        let url = "../article/" + text[indexx]["category"] + "/md/" + indexx + ".md"
        let content=await fetch(url)
        content =await content.text()
        sessionStorage.setItem("content",content)
        document.querySelector("#un_full_screen_content_left").value=content
        document.querySelector("#create-articles").click()
        document.querySelector("#announce").value="更新"
        sessionStorage.setItem("article_index",indexx)
        sessionStorage.setItem("category_delete",text[indexx]["category"])

    })
    let div_button2 = document.createElement("div")
    div_button2.innerHTML = "删除"
    div_button2.addEventListener("click", async () => {
        delete_article(indexx, text)
    })
    div_buttons.appendChild(div_button1)
    div_buttons.appendChild(div_button2)
    let div_s = document.createElement("div")
    div_s.className = "div_s"
    let div_p = document.createElement("div")
    div_p.className = "div_p"
    div_p.innerHTML = marked.parse(text[indexx]["synopsis"])
    authorname.innerHTML = "作者：" + (text[indexx]["author"])
    authorname.addEventListener("click", () => {
        sessionStorage.setItem("author_id", text[indexx]["author_id"])

    })

    let span0 = document.createElement("span")
    let span1 = document.createElement("span")
    let span2 = document.createElement("span")
    let span3 = document.createElement("span")
    span0.innerHTML = "文章类别：" + init_domain_json[text[indexx]["category"]]["label"]
    // span1.innerHTML = "评论数：" + text[indexx]["comment_amount"]
    // span2.innerHTML = "点赞数：" + text[indexx]["favorite_amount"]
    span3.innerHTML = "发布时间：" + (text[indexx]["createtime"])
    authorname.href = getBasePath() + "/html/individualSpace.html"

    // createtime.appendChild(span1)
    // createtime.appendChild(span2)

    title.appendChild(h1)
    temp.appendChild(title)
    div_s.appendChild(div_p)
    div_s.appendChild(div_buttons)
    temp.appendChild(div_s)
    div.appendChild(authorname)
    div.appendChild(span0)
    div.appendChild(span3)
    temp.appendChild(div)
    h1.href = "../html/content.html?domain=" + text[indexx]["category"] + "?index=" + indexx;
    // h1.target="_blank"
    return temp;
}

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
function init_page(buttons) {
    let href = window.location.href;
    for (let j of buttons) {
        if (href.match(/\?paging=(.*)/) === null) {
            j.click()
            break;
        }
        else if (j.value === href.match(/\?paging=(.*)/)[1]) {
            j.click();
            break;
        }

    }



}
async function announce_article() {

    let url = "/articleAannounce"
    let title = document.querySelector("#title").value
    let synopsis = document.querySelector("#synopsis").value
    let category = document.querySelector("#category").value
    let content = sessionStorage.getItem("content")
    let body_ = {}
    body_["title"] = title
    body_["synopsis"] = synopsis
    body_["category_announce"] = category
    body_["content"] = content
    body_["author"] = "Smily"
    let resp = await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(body_),
            headers: { 'Content-Type': "application/json; charset=utf-8" },
        })
    resp =await resp.text()
    console.log(resp)
    article_display()

}
async function delete_article(index, text) {

    let url = "/articleDelete"
    let body_ = {}
    body_["index"] = index
    body_["category_delete"] = text[index]["category"]
    let resp = await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(body_),
            headers: { 'Content-Type': "application/json; charset=utf-8" },
        })
    resp = resp.text()
    console.log(resp)
    article_display()
}
async function update_article(index,category_delete) {

    let url = "/articleUpdate"
    let title = document.querySelector("#title").value
    let synopsis = document.querySelector("#synopsis").value
    let category = document.querySelector("#category").value
    let content = sessionStorage.getItem("content")
    let body_ = {}

    body_["index"] = index
    body_["title"] = title
    body_["synopsis"] = synopsis
    body_["category_announce"] = category
    body_["category_delete"] = category_delete
    body_["content"] = content
    body_["author"] = "Smily"
    let resp = await fetch(url,
        {
            method: 'POST',
            body: JSON.stringify(body_),
            headers: { 'Content-Type': "application/json; charset=utf-8" },
        })
    resp = await resp.text()
    console.log(resp)
    article_display()
}
async function article_display() {
    let init_domain_json = await init_domain()
    let text = {}
    for (let domain of Object.keys(init_domain_json)) {
        let url = getBasePath() + "/article/" + domain + "/article.json"
        let articlejson = await fetch(url,
            {
                method: 'GET',
                headers: { 'Content-Type': "application/json; charset=utf-8" },

            })
        articlejson = await articlejson.text()
        articlejson = JSON.parse(articlejson)
        text = Object.assign(text, articlejson)
    }
    article_json = text
    length = Object.keys(text).length;
    let paging_index = document.querySelector("#paging .paging-index")
    paging_index.innerHTML = ""
    page_num = (length + pages - 1) / pages
    for (let i = 1; i <= page_num; i++) {
        let button = document.createElement("button")
        button.className = "button_off";
        button.innerHTML = i.toString()
        button.value = i.toString()
        button.addEventListener("click", () => {
            let art = document.querySelector(".layout-content>#articles")
            art.innerHTML = ""
            // let temp = document.createElement("div")
            let href = window.location.href;
            let index = "0"
            if (href.match(/\?paging=(.*)/) != null) {
                index = href.match(/\?paging=(.*)/)[1];
                if (index != i.toString()) {
                    history.pushState(null, null, '?paging=' + i.toString())
                }
            }
            else {
                history.pushState(null, null, '?paging=' + "1")
            }
            let start = (i - 1) * pages + 1
            let end = start + ((length - start + 1) < pages ? (length - start + 1) : pages)
            for (let i = start; i < end; i++) {
                art.appendChild(create(text, init_domain_json, i.toString()))
            }

            // art.innerHTML = temp.innerHTML
        })
        paging_index.appendChild(button)
    }

    let buttons = paging_index.querySelectorAll("button")
    for (let button of buttons) {
        button.addEventListener("click", () => {
            let href = window.location.href;
            for (let j of buttons) {
                if (j.value === href.match(/\?paging=(.*)/)[1]) {
                    j.className = "button_on"
                }
                else {
                    j.className = "button_off"
                }
            }
        })
    }

    init_page(buttons)
    change_page(buttons)

    document.querySelector("#dynamic").click()
    document.querySelector(".logos a").addEventListener("click", () => {
        buttons[0].click();
    })



}
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
function select(content_index) {
    const content = document.querySelector("#articles")
    const create = document.querySelector("#create")
    const paging = document.querySelector("#paging")
    const dynamic = document.querySelector("#dynamic")
    const manuscript = document.querySelector("#manuscript")
    const create_articles = document.querySelector("#create-articles")

    if (content_index == "dynamic") {
        dynamic.className = "navigation-article-show"

    }
    else {

        dynamic.className = "navigation-article-hidden"
    }

    if (content_index == "manuscript") {

        manuscript.className = "navigation-article-show"
    }
    else {

        manuscript.className = "navigation-article-hidden"
    }

    if (content_index == "dynamic" || content_index == "manuscript") {
        content.className = "articles"
        paging.className = "paging"



    }
    else {
        content.className = "articles-hidden"
        paging.className = "paging-hidden"

    }





    if (content_index == "create-articles") {
        create.className = "create"
        create_articles.className = "navigation-article-show"
        

    }
    else {
        create.className = "create-hidden"
        create_articles.className = "navigation-article-hidden"
    }

}


window.addEventListener('load', () => {


    document.querySelector("#dynamic").addEventListener("click", () => {

        select("dynamic")
    })

    document.querySelector("#create-articles").addEventListener("click", () => {
        select("create-articles")


    })
    document.querySelector("#manuscript").addEventListener("click", () => {
        select("manuscript")
    })
    article_display()
    const dynamic = document.querySelector("#dynamic")
    dynamic.className = "navigation-article-show"

})
window.addEventListener("load", () => {

    let full_preview = document.querySelector("#full_preview")
    let full_un_preview = document.querySelector("#full_un_preview")
    let un_full_preview = document.querySelector("#un_full_preview")
    let un_full_un_preview = document.querySelector("#un_full_un_preview")
    let full_screen_div_left = document.querySelector("#full_screen_div_left")
    let full_screen_div_right = document.querySelector("#full_screen_div_right")
    let un_full_screen_div_left = document.querySelector("#un_full_screen_div_left")
    let un_full_screen_div_right = document.querySelector("#un_full_screen_div_right")

    full_preview.addEventListener("click", () => {
        let full_screen_content_right = document.querySelector("#full_screen_content_right")
        let temp = document.createElement("div")
        full_screen_content_right.innerHTML = ""
        temp.innerHTML = marked.parse(sessionStorage.getItem("content"))
        for (const element of temp.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }
        full_screen_content_right.appendChild(temp)

        full_preview.className = "div_svg_hidden"
        full_un_preview.className = "div_svg_show"
        full_screen_div_left.className = "content-left-unfull"
        full_screen_div_right.className = "content-right-full"

    })
    full_un_preview.addEventListener("click", () => {

        full_un_preview.className = "div_svg_hidden"
        full_preview.className = "div_svg_show"
        full_screen_div_left.className = "content-left-full"
        full_screen_div_right.className = "content-right-unfull"

    })

    un_full_un_preview.addEventListener("click", () => {


        un_full_un_preview.className = "div_svg_hidden"
        un_full_preview.className = "div_svg_show"
        un_full_screen_div_left.className = "content-left-full"
        un_full_screen_div_right.className = "content-right-unfull"
    })

    un_full_preview.addEventListener("click", () => {

        let un_full_screen_content_right = document.querySelector("#un_full_screen_content_right")
        let temp = document.createElement("div")
        un_full_screen_content_right.innerHTML = ""
        temp.innerHTML = marked.parse(sessionStorage.getItem("content"))
        for (const element of temp.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }
        un_full_screen_content_right.appendChild(temp)
        un_full_un_preview.className = "div_svg_show"
        un_full_preview.className = "div_svg_hidden"
        un_full_screen_div_left.className = "content-left-unfull"
        un_full_screen_div_right.className = "content-right-full"

    })

})





window.addEventListener("load", () => {

    let text;
    let full_screen_content_right = document.querySelector("#full_screen_content_right")
    let un_full_screen_content_right = document.querySelector("#un_full_screen_content_right")
    let full_screen_content_left = document.querySelector("#full_screen_content_left")
    let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left")

    if (sessionStorage.getItem("content") != null) {
        let temp = document.createElement("div")
        let temp1 = document.createElement("div")

        full_screen_content_right.innerHTML = ""
        un_full_screen_content_right.innerHTML = ""
        text = sessionStorage.getItem("content")
        un_full_screen_content_left.value = text
        full_screen_content_left.value = text
        

        temp.innerHTML = marked.parse(text)

        for (const element of temp.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }

        temp1.innerHTML = marked.parse(text)

        for (const element of temp1.querySelectorAll("pre code")) {
            hljs.highlightElement(element);
        }

        full_screen_content_right.appendChild(temp)

        un_full_screen_content_right.appendChild(temp1)

    }
    if (sessionStorage.getItem("title") != null) {
        document.querySelector("#title").value = sessionStorage.getItem("title")

    }
    if (sessionStorage.getItem("synopsis") != null) {
        document.querySelector("#synopsis").value = sessionStorage.getItem("synopsis")

    }

    let title = document.querySelector("#title")
    title.addEventListener('input', combineDebounceThrottle(() => {

        sessionStorage.setItem("title", title.value)

    }), 500)
    let synopsis = document.querySelector("#synopsis")
    synopsis.addEventListener('input', combineDebounceThrottle(() => {

        sessionStorage.setItem("synopsis", synopsis.value)

    }), 500)


    full_screen_content_left.addEventListener('input', combineDebounceThrottle(() => {

        text = full_screen_content_left.value;
        sessionStorage.setItem("content", text)
        if (full_screen_div_right.className == "content-right-full") {
            let temp = document.createElement("div")
            full_screen_content_right.innerHTML = ""
            temp.innerHTML = marked.parse(text)
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            full_screen_content_right.appendChild(temp)
        }
    }), 500)

    un_full_screen_content_left.addEventListener('input', combineDebounceThrottle(() => {

        text = un_full_screen_content_left.value;
        sessionStorage.setItem("content", text)
        if (un_full_screen_div_right.className == "content-right-full") {
            let temp = document.createElement("div")
            un_full_screen_content_right.innerHTML = ""
            temp.innerHTML = marked.parse(text)
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            un_full_screen_content_right.appendChild(temp)
        }
    }, 500))
})



//预览功能的关闭与打开，大窗口和小窗口
window.addEventListener("load", () => {

    let full_screen = document.querySelector("#full_screen")
    let full_screen_show = document.querySelector("#full_screen_show")
    let layout = document.querySelector("#layout")
    let un_full_screen = document.querySelector("#un_full_screen")

    full_screen.addEventListener("click", () => {

        layout.className = "layout"
        full_screen_show.className = "full_screen_hidden"
        let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left")
        un_full_screen_content_left.value = sessionStorage.getItem("content")
        let un_full_screen_div_right = document.querySelector("#un_full_screen_div_right")
        if (un_full_screen_div_right.className == "content-right-full") {
            let un_full_screen_content_right = document.querySelector("#un_full_screen_content_right")
            let temp = document.createElement("div")
            un_full_screen_content_right.innerHTML = ""
            temp.innerHTML = marked.parse(sessionStorage.getItem("content"))
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            un_full_screen_content_right.appendChild(temp)
        }

    })

    un_full_screen.addEventListener("click", () => {

        layout.className = "layout_hidden"
        full_screen_show.className = "full_screen"
        let full_screen_content_left = document.querySelector("#full_screen_content_left")
        full_screen_content_left.value = sessionStorage.getItem("content")
        let full_screen_div_right = document.querySelector("#full_screen_div_right")
        if (full_screen_div_right.className == "content-right-full") {
            let full_screen_content_right = document.querySelector("#full_screen_content_right")
            let temp = document.createElement("div")
            full_screen_content_right.innerHTML = ""
            temp.innerHTML = marked.parse(sessionStorage.getItem("content"))
            for (const element of temp.querySelectorAll("pre code")) {
                hljs.highlightElement(element);
            }
            full_screen_content_right.appendChild(temp)
        }
    })

})




window.addEventListener("load", () => {



    let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left")

    document.querySelector("#un_full_bold").addEventListener("click", () => {

        un_full_screen_content_left.value += "****";
        un_full_screen_content_left.focus();
        un_full_screen_content_left.selectionEnd -= 2;

    })
    document.querySelector("#un_full_italic").addEventListener("click", () => {
        un_full_screen_content_left.value += "**";
        un_full_screen_content_left.focus();
        un_full_screen_content_left.selectionEnd -= 1;

    })

    document.querySelector("#un_full_color").addEventListener("change", (event) => {

        un_full_screen_content_left.value += "<span style=\"color:" + event.target.value + "\"></span>";
        un_full_screen_content_left.focus();
        un_full_screen_content_left.selectionEnd -= 7;

    })
    document.querySelector("#un_full_strikethrough").addEventListener("click", () => {


        un_full_screen_content_left.value += "~~~~";
        un_full_screen_content_left.focus();
        un_full_screen_content_left.selectionEnd -= 2;
    })

    document.querySelector("#un_full_unordered_list").addEventListener("click", () => {

        un_full_screen_content_left.value += "* \n* \n* \n";
        un_full_screen_content_left.focus();
    })
    document.querySelector("#un_full_ordered_list").addEventListener("click", () => {

        un_full_screen_content_left.value += "1. \n2. \n3. \n";
        un_full_screen_content_left.focus();
    })
    document.querySelector("#un_full_unordered_code").addEventListener("click", () => {

        un_full_screen_content_left.value += "```\n\n```\n";
        un_full_screen_content_left.focus();
        un_full_screen_content_left.selectionEnd -= 5;
    })
    document.querySelector("#un_full_unordered_link").addEventListener("click", () => {


        un_full_screen_content_left.value += "[](https:// \"Title\")";
        un_full_screen_content_left.focus();
        // un_full_screen_content_left.selectionEnd -=5;
    })
    document.querySelector("#un_full_unordered_link_photo").addEventListener("click", () => {


        un_full_screen_content_left.value += "![](https:// )";
        un_full_screen_content_left.focus();
        // un_full_screen_content_left.selectionEnd -=5;
    })

})

window.addEventListener("load", () => {


    let full_screen_content_left = document.querySelector("#full_screen_content_left")

    document.querySelector("#full_bold").addEventListener("click", () => {
        full_screen_content_left.value += "****";
        full_screen_content_left.focus();
        full_screen_content_left.selectionEnd -= 2;

    })
    document.querySelector("#full_italic").addEventListener("click", () => {
        full_screen_content_left.value += "**";
        full_screen_content_left.focus();
        full_screen_content_left.selectionEnd -= 1;

    })

    document.querySelector("#full_color").addEventListener("change", (event) => {

        full_screen_content_left.value += "<span style=\"color:" + event.target.value + "\"></span>";
        full_screen_content_left.focus();
        full_screen_content_left.selectionEnd -= 7;

    })
    document.querySelector("#full_strikethrough").addEventListener("click", () => {


        full_screen_content_left.value += "~~~~";
        full_screen_content_left.focus();
        full_screen_content_left.selectionEnd -= 2;
    })

    document.querySelector("#full_unordered_list").addEventListener("click", () => {

        full_screen_content_left.value += "* \n* \n* \n";
        full_screen_content_left.focus();
    })
    document.querySelector("#full_ordered_list").addEventListener("click", () => {

        full_screen_content_left.value += "1. \n2. \n3. \n";
        full_screen_content_left.focus();
    })
    document.querySelector("#full_unordered_code").addEventListener("click", () => {

        full_screen_content_left.value += "```\n\n```\n";
        full_screen_content_left.focus();
        full_screen_content_left.selectionEnd -= 5;
    })
    document.querySelector("#full_unordered_link").addEventListener("click", () => {


        full_screen_content_left.value += "[](https:// \"Title\")";
        full_screen_content_left.focus();
        // full_screen_content_left.selectionEnd -=5;
    })
    document.querySelector("#full_unordered_link_photo").addEventListener("click", () => {


        full_screen_content_left.value += "![](https:// )";
        full_screen_content_left.focus();
        // full_screen_content_left.selectionEnd -=5;
    })

})

window.addEventListener("load", () => {

    let flag = 1
    function addscrollListener(e) {


        let full_screen_content_left = document.querySelector("#full_screen_content_left")
        let full_screen_content_right = document.querySelector("#full_screen_div_right")
        let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left")
        let un_full_screen_content_right = document.querySelector("#un_full_screen_div_right")

        e.addEventListener("scroll", combineDebounceThrottle(function () {
            if (flag == 1) {

                let scrollTop = e.scrollTop
                let scrollHeight = e.scrollHeight
                let clientHeight = e.clientHeight
                let ratio = scrollTop / (scrollHeight - clientHeight)
                sessionStorage.setItem("ratio", ratio)


                set_scroll(full_screen_content_left)
                set_scroll(full_screen_content_right)
                set_scroll(un_full_screen_content_left)
                set_scroll(un_full_screen_content_right)
                set_scroll(un_full_screen_content_right)
                flag = 0

            }
            else {
                flag = 1

            }


        }, 500)

        )
    }
    let full_screen_content_left = document.querySelector("#full_screen_content_left")
    let full_screen_content_right = document.querySelector("#full_screen_div_right")
    let un_full_screen_content_left = document.querySelector("#un_full_screen_content_left")
    let un_full_screen_content_right = document.querySelector("#un_full_screen_div_right")

    addscrollListener(full_screen_content_left)
    addscrollListener(full_screen_content_right)
    addscrollListener(un_full_screen_content_left)
    addscrollListener(un_full_screen_content_right)


    function set_scroll(e) {


        let scrollHeight = e.scrollHeight
        let clientHeight = e.clientHeight
        let ratio = Number(sessionStorage.getItem("ratio"))
        let scrollTop = ratio * (scrollHeight - clientHeight)
        e.scrollTop = scrollTop


    }



})

window.addEventListener("load", () => {

    
    let announce = document.querySelector("#announce")
    announce.addEventListener("click", () => {
        if(announce.value=="发布")
        {
            announce_article()
        } 
        if(announce.value=="更新")
        {
            update_article(sessionStorage.getItem("article_index"), sessionStorage.getItem("category_delete"))
            document.querySelector("#announce").value="发布"
        } 
       
    })

})

async function init_domain() {
    let url = getBasePath() + "article/domain.json"
    let text = await fetch(url)
    text = await text.json()
    length = Object.keys(text).length;

    let select = document.querySelector("#category")
    select.innerHTML=""
    for (let i = 1; i <= length; i++) {
        let option = document.createElement("option")
        option.innerHTML = text[i]["label"]
        option.value = text[i]["index"]
        select.appendChild(option)
    }

    return text


}


