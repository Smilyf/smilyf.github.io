"use strict";

var article_json;
//每页的文章数量
var pages = 4
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
		sessionStorage.setItem('domain', text[index]["label"]);
		window.location.href = "./html/domain.html"
	})
	return temp;
}
function change_page(buttons) {

	document.querySelector(".previous-page").addEventListener("click", () => {


		// let index = sessionStorage.getItem("paging")
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

	// if (sessionStorage.getItem("paging") === null) {
	// 	j.click()
	// 	break;
	// }
	// else if (j.value === sessionStorage.getItem("paging")) {
	// 	j.click();
	// 	break;
	// }


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
	var art = document.querySelector(".content")
	let url = "./article/domain.json"
	fetch(url)
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
				button.innerHTML = i;
				button.value = i.toString()
				button.addEventListener("click", () => {
					art.innerHTML = ""
					// sessionStorage.setItem('paging', i.toString());
					let href = window.location.href;
					let index = "0"
					if (href.match(/\?paging=(.*)/) != null) {
						index = href.match(/\?paging=(.*)/)[1];
						if (index != i.toString()) {
							history.pushState(null, null, '?paging=' + i.toString())
						}
					}
					else
					{
						history.pushState(null, null, '?paging=' + "1")
					}
					let start = (i - 1) * pages + 1
					let end = start + ((length - start + 1) < pages ? (length - start + 1) : pages)
					for (let i = start; i < end; i++) {
						art.appendChild(create(text, i))
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
						// if (j.value === sessionStorage.getItem("paging")) {
						// 	j.className = "button_on"
						// }
						// else {
						// 	j.className = "button_off"
						// }
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

		}).then((buttons)=>{
			window.addEventListener("popstate",()=>{
				let href = window.location.href;
				let index="0"
				// var code1 = href.match(/\?data=(.*)/)[1];//取 ?data=后面所有字符串
				// var code3 = href.match(/data=(.*)/)[0]; //取 包含 data=及后面的字符串
				// buttons[num-1].click()
				if(href.match(/\?(.*)/)!=null)
				{
					index=href.match(/\?(.*)/)[1];//取 data=后面所有字符串
				}
				let num=parseInt(index)
				if(num!=0)
				{
					buttons[num-1].click()
				}

			});
		})
}

)
