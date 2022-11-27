"use strict";

import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js';
//  and it's easy to individually load & register additional languages
import go from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/go.min.js';
hljs.registerLanguage('go', go);
// const { configConsumerProps } = require("antd/lib/config-provider");

var article_json;
//每页的文章数量
var pages = 1
//分页个数
var page_num = 1
//文章数
var length = 0
function create(text, index) {
    let temp = document.createElement("div")
    let h1 = document.createElement("h1")
    h1.innerHTML = marked.parse(text[index]["title"])
    let p1 = document.createElement("p")
    p1.innerHTML = marked.parse(text[index]["content"])
    temp.appendChild(h1)
    temp.appendChild(p1)
    temp.addEventListener("click", () => {
        sessionStorage.setItem('item', index);
        window.location.href = "../html/content.html?domain=" + text[index]["label"] + "?index=" + index;
    })
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
function article_display() {
    let href = window.location.href
    let domain = "C++";
    let ur2 = "../article/" + domain + "/article.json"

    fetch(ur2)
        .then((data) => {
            return data.json()
        })
        .then((text) => {
            article_json = text
            length = Object.keys(text).length;
            let paging_index = document.querySelector(".paging .paging-index")
            page_num = (length + pages - 1) / pages
            for (let i = 1; i <= page_num; i++) {
                let button = document.createElement("button")
                button.className = "button_off";
                button.innerHTML = i.toString()
                button.value = i.toString()
                button.addEventListener("click", () => {
                    let art = document.querySelector(".layout-content>.articles")
                    art.innerHTML = ""
                    let href = window.location.href;
                    let index = "0"
                    if (href.match(/\?paging=(.*)/) != null) {
                        index = href.match(/\?paging=(.*)/)[1];
                        if (index != i.toString()) {
                            history.pushState(null, null, '?domain=' + domain + '?paging=' + i.toString())
                        }
                    }
                    else {
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
                        }
                        else {
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
        })
}
function select(content_index) {
    const content = document.querySelector("#articles")
    const create = document.querySelector("#create")
    const paging = document.querySelector("#paging")


    if (content_index == "dynamic" || content_index == "manuscript") {
        content.className = "articles"
        paging.className = "paging"
    }
    else {
        content.className = "articles-hidden"
        paging.className = "paging-hidden"
    }
    if (content_index == "create") {
        create.className = "create"

    }
    else {
        create.className = "create-hidden"
    }

}


window.addEventListener('load', () => {
    article_display()

    document.querySelector("#dynamic").addEventListener("click", () => {
        select("dynamic")
    })

    document.querySelector("#create-articles").addEventListener("click", () => {
        select("create")

        const synopsis = document.querySelector("#synopsis")


    })
    document.querySelector("#manuscript").addEventListener("click", () => {
        select("manuscript")
    })


})
window.addEventListener("load", () => {

    let full_preview = document.querySelector("#full_preview")
    let full_un_preview = document.querySelector("#full_un_preview")
    let un_full_preview = document.querySelector("#un_full_preview")
    let un_full_un_preview=document.querySelector("#un_full_un_preview")
    let full_screen_div_left = document.querySelector("#full_screen_div_left")
    let full_screen_div_right = document.querySelector("#full_screen_div_right")
    let un_full_screen_div_left = document.querySelector("#un_full_screen_div_left")
    let un_full_screen_div_right = document.querySelector("#un_full_screen_div_right")

    full_preview.addEventListener("click", () => {

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
        sessionStorage.setItem("content", text)

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
    full_screen_content_left.addEventListener('input', () => {


        let temp = document.createElement("div")
        let temp1 = document.createElement("div")

        full_screen_content_right.innerHTML = ""
        un_full_screen_content_right.innerHTML = ""
        text = full_screen_content_left.value;
        un_full_screen_content_left.value = full_screen_content_left.value;
        sessionStorage.setItem("content", text)

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



    })

    un_full_screen_content_left.addEventListener('input', () => {


        let temp = document.createElement("div")
        let temp1 = document.createElement("div")

        full_screen_content_right.innerHTML = ""
        un_full_screen_content_right.innerHTML = ""
        text = un_full_screen_content_left.value;
        full_screen_content_left.value = un_full_screen_content_left.value;
        sessionStorage.setItem("content", text)

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

    })
})




window.addEventListener("load", () => {

    let full_screen = document.querySelector("#full_screen")
    let full_screen_show = document.querySelector("#full_screen_show")
    let layout = document.querySelector("#layout")
    let un_full_screen = document.querySelector("#un_full_screen")

    full_screen.addEventListener("click", () => {
        layout.className = "layout"
        full_screen_show.className = "full_screen_hidden"

    })

    un_full_screen.addEventListener("click", () => {

        layout.className = "layout_hidden"
        full_screen_show.className = "full_screen"
    })

})



window.addEventListener("load", () => {

    if (sessionStorage.getItem("identity") != null) {
        document.querySelector("#identity-user").className = "user"
        document.querySelector("#identity-visitor").className = "user-hidden"
    }


})







    // document.querySelector("#color").addEventListener("change", (event)=>{

    //     event.target.value;

    // }
    // );
