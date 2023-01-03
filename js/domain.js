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
    var contextPath = obj.pathname.split("/")[1];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
function create(text, index) {
    let temp = document.createElement("div")
    let h1 = document.createElement("h1")
    let div = document.createElement("div")
    div.className = "user_and_time"
    let authorname = document.createElement("a")
    let createtime = document.createElement("div")
    //
    let indexx = Object.keys(text).sort(function (a, b) { return b - a })[index - 1]
    // let indexx= Object.keys(text)[index-1]
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
    // span0.innerHTML = "文章类别：" + text[indexx]["actegory"]
    // span1.innerHTML = "评论数：" + text[indexx]["comment_amount"]
    // span2.innerHTML = "点赞数：" + text[indexx]["favorite_amount"]
    span3.innerHTML = "发布时间：" + (text[indexx]["createtime"])
    authorname.href = getBasePath() + "/html/individualSpace.html"
    // createtime.appendChild(span0)
    // createtime.appendChild(span1)
    // createtime.appendChild(span2)
    createtime.appendChild(span3)
    authorname.href = getBasePath() + "/html/individualSpace.html"
    temp.appendChild(h1)
    temp.appendChild(p1)
    // div.appendChild(authorname)
    div.appendChild(createtime)
    temp.appendChild(div)
    h1.addEventListener("click", () => {
        sessionStorage.setItem('item', indexx);
		sessionStorage.setItem('temp', text[indexx]);
        window.location.href = "../html/content.html?domain=" + text[indexx]["category"] + "?index=" + indexx;
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
window.addEventListener('load', () => {

	let href = window.location.href
	let domain = href.match(/\?domain=(.*)/)[1];
	if(domain.match(/(\S*)\?/)!=null)
	{
		domain=domain.match(/(\S*)\?/)[1]
	}
	let h1 = document.querySelector(".description>h1")
	let h3 = document.querySelector(".description>h3")
	let url = "../article/" + domain + "/description.json"



	fetch(url)
		.then((data) => {
			return data.json()
		})
		.then((text) => {
			var art = document.querySelector(".layout-content>.articles")
			h1.innerHTML = marked.parse(text["1"]["title"])
			h3.innerHTML = marked.parse(text["1"]["content"])
		})

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
				button.innerHTML =i.toString()
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

)
// window.addEventListener("load",()=>{
// 	// sessionStorage.setItem("identity","s")
// 	if (sessionStorage.getItem("identity").length>2)
// 	{
// 		document.querySelector("#identity-user").className="user"
// 		document.querySelector("#identity-visitor").className="user-hidden"
// 	}

// })
