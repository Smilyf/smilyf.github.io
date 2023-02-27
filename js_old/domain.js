"use strict";
var article_json;
//每页的文章数量
var pages = 2
//分页个数
var page_num = 1
//文章数
var length = 0
//获取网页根目录
function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
function create(text, init_domain_json, index) {
	let temp = document.createElement("div")
	let h1 = document.createElement("a")
	let title = document.createElement("div")
	title.className = "title_a"
	let div = document.createElement("div")
	div.className = "user_and_time"
	let authorname = document.createElement("a")
	let createtime = document.createElement("div")
	//
	let indexx = Object.keys(text).sort(function (a, b) { return b - a })[index - 1]
	// let indexx= Object.keys(text)[index-1]
	h1.innerHTML = marked.parse(text[indexx]["title"])

	// let div_buttons = document.createElement("div")
	// div_buttons.className="div_buttons"
	// let div_button1 = document.createElement("div")
	// div_button1.innerHTML="修改"
	// let div_button2 = document.createElement("div")
	// div_button2.innerHTML="删除"
	// div_buttons.appendChild(div_button1)
	// div_buttons.appendChild(div_button2)
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
	span0.addEventListener("click", () => {
		
	})
	// span1.innerHTML = "评论数：" + text[indexx]["comment_amount"]
	// span2.innerHTML = "点赞数：" + text[indexx]["favorite_amount"]
	span3.innerHTML = "发布时间：" + (text[indexx]["createtime"])
	authorname.href = getBasePath() + "/html/individualSpace.html"

	// createtime.appendChild(span1)
	// createtime.appendChild(span2)

	title.appendChild(h1)
	temp.appendChild(title)
	div_s.appendChild(div_p)
	// div_s.appendChild(div_buttons)
	temp.appendChild(div_s)
	// div.appendChild(authorname)
	div.appendChild(span0)
	div.appendChild(span3)
	temp.appendChild(div)
	h1.href = "../html/content.html?domain=" + text[indexx]["category"] + "?index=" + indexx;
	// h1.target="_blank"
	return temp;
}
function change_page() {
    
	let previous_page= document.querySelector(".previous-page")
	let next_page= document.querySelector(".next-page")
	previous_page.addEventListener("click", () => {
		let buttons = document.querySelectorAll("#paging .paging-index button")
		let href = window.location.href;
		let index = href.match(/\?paging=(.*)/)[1]
		index = parseInt(index)
		if (index - 1 >= 1) {
			buttons[index - 2].click();
		}
	})
	
	next_page.addEventListener("click", () => {
		let buttons = document.querySelectorAll("#paging .paging-index button")
		console.log(buttons)
		let href = window.location.href;
		let index = href.match(/\?paging=(.*)/)[1]
		index = parseInt(index)
		if (index + 1 <= page_num) {
			buttons[index].click()
		}
	})
}
function init_page() {
	let href = window.location.href;
	let buttons = document.querySelectorAll("#paging .paging-index button")
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
async function article_display(state) {
    let href = window.location.href
    let domain = href.match(/\?domain=(.*)/)[1];
    if (domain.match(/(\S*)\?/) != null) {
        domain = domain.match(/(\S*)\?/)[1]
    }
    init_domain_description(domain)
    let init_domain_json = await init_domain()
    let text =await open_domain(domain)
    let article_json = {}
    if (state == "announce") {
        let keys = Object.keys(text)
        for (let key of keys) {
            if (text[key]["state"] == state) {
                article_json[key] = text[key]
            }
        }
    }
    if (state == "drafts") {
        let keys = Object.keys(text)
        for (let key of keys) {
            if (text[key]["state"] == state) {
                article_json[key] = text[key]
            }
        }
    }
    if (state == "") {
        article_json = text
    }
    let art = document.querySelector(".layout-content>#articles")
    art.innerHTML = ""
    length = Object.keys(article_json).length;
    let paging_index = document.querySelector("#paging .paging-index")
    paging_index.innerHTML = ""
    page_num = (length + pages - 1) / pages
    page_num = parseInt(page_num)
    if (page_num == 0) {
        art.innerHTML = "暂无数据！"
    }
    for (let i = 1; i <= page_num; i++) {
        let button = document.createElement("button")
        button.className = "button_off";
        button.innerHTML = i.toString()
        button.value = i.toString()
        button.addEventListener("click", () => {
            let art = document.querySelector(".layout-content>#articles")
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
                art.appendChild(create(article_json, init_domain_json, i.toString()))
            }
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
    init_page()
    document.querySelector(".logos a").addEventListener("click", () => {
        buttons[0].click();
    })
}
async function init_domain() {
    let url = getBasePath() + "article/domain.json"
    let text = await fetch(url)
    text = await text.json()
    return text
}
async function open_domain(domain) {

    let url = "../article/" + domain + "/"  + "article.json"
	let text = await fetch(url)
	text = await text.json()
	return text
}
async function init_domain_description(domain)
{
    let url = "../article/" + domain + "/description.json"
    let data =await fetch(url)
	let json=await data.json()
	let h1 = document.querySelector(".description>h1")
	let h3 = document.querySelector(".description>h3")
	h1.innerHTML = marked.parse(json["1"]["title"])
	h3.innerHTML = marked.parse(json["1"]["content"])
}
//init_page
window.addEventListener("load",()=>{
	article_display("announce")
	change_page()
})
