"use strict";
import Time from "./time.js";
//获取网页根目录
function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
var article_json;
//每页的文章数量
var pages = 4
//分页个数
var page_num = 1
//文章数
var length = 0

function create(text, index) {
	let temp = document.createElement("div")
	let h1 = document.createElement("a")
	h1.innerHTML = marked.parse(text[index]["title"])
	let div_p = document.createElement("div")
	div_p.className = "div_p"
	let title = document.createElement("div")
	title.className = "title_a"
	div_p.innerHTML = marked.parse(text[index]["content"])
	// let indexx = Object.keys(text).sort(function (a, b) { return b - a })[index - 1]
	let div_s = document.createElement("div")
	div_s.className = "div_s"
	h1.href = "./html/domain.html" + "?domain=" + text[index]["index"]

	title.appendChild(h1)
	temp.appendChild(title)
	div_s.appendChild(div_p)
	temp.appendChild(div_s)
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
async function init_index() {

	let url = "article/domain.json"
	let text = await fetch(url)
	text = await text.json()
	length = Object.keys(text).length;
	let paging_index = document.querySelector(".paging .paging-index")
	page_num = (length + pages - 1) / pages
	for (let i = 1; i <= page_num; i++) {
		let button = document.createElement("button")
		button.className = "button_off";
		button.innerHTML = i;
		button.value = i.toString()
		button.addEventListener("click", () => {
			let art = document.querySelector(".layout-content>.articles")
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
				art.appendChild(create(text, i))
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
	init_page()
	
}
window.addEventListener('load', init_index())
window.addEventListener("load",change_page())
window.addEventListener("popstate", () => {
	let href = window.location.href;
	let index = "0"
	if (href.match(/\?paging=(.*)/) != null) {
		index = href.match(/\?paging=(.*)/)[1];//取 data=后面所有字符串
	}
	let num = parseInt(index)
	if (num != 0) {
		buttons[num - 1].click()
	}

});
//indivdualSpace
window.addEventListener("load", () => {

	document.querySelector("#identity-visitor").addEventListener("click", () => {

		window.location.href = "../html/individualSpace.html"
	})


})
//complex search 
window.addEventListener("load", () => {
	let searchs = document.querySelectorAll(".search-complex svg")
	for (let x of searchs) {
		x.addEventListener("click", () => {
			window.location.href = "../html/search.html"
		})
	}

})
window.addEventListener("load", () => {

	Time.time()

})

