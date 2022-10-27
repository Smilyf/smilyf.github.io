"use strict";

var article_json;
var pages = 1
var page_num = 1
var length = 0
function create(text, index) {
	let temp = document.createElement("div")
	let p = document.createElement("p")
	p.innerHTML = marked.parse(text[index]["title"])
	let p1 = document.createElement("p")
	p1.innerHTML = marked.parse(text[index]["content"])
	temp.appendChild(p)
	temp.appendChild(p1)
	temp.addEventListener("click", () => {
		sessionStorage.setItem('item', index);
		window.location.href = "./html/index.html"
	})
	return temp;
}
function change_page(buttons) {

	document.querySelector(".previous-page").addEventListener("click", () => {
		let index = sessionStorage.getItem("paging")
		index=parseInt(index)
		if (index - 1 >= 1) {
			buttons[index - 2].click();
		}
	})
	document.querySelector(".next-page").addEventListener("click", () => {
		let index = sessionStorage.getItem("paging")
		index=parseInt(index)
		if (index + 1 <= page_num) {
			buttons[index].click()
		}
	})
}
function init_page(buttons) {
	for (let j of buttons) {
		if(sessionStorage.getItem("paging")===null )
		{
			j.click()
			break;
		}
		else if (j.value === sessionStorage.getItem("paging")) {
			j.click();
			break;
		}
	}
}
window.addEventListener('load', () => {
	var art = document.querySelector(".content")
	let url = "./article/article.json"
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
				button.className="button_off";
				button.innerHTML = i;
				button.value = i.toString()
				button.addEventListener("click", () => {
					art.innerHTML = ""
					sessionStorage.setItem('paging', i);
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
					for (let j of buttons) {
						if (j.value === sessionStorage.getItem("paging")) {
							j.className="button_on"
						}
						else {
							j.className="button_off"
						}
					}

				})
			}
			return buttons
		}).then((buttons) => {

			init_page(buttons)
			change_page(buttons)
			return buttons
		}).then((buttons)=>{

			document.querySelector(".logos a").addEventListener("click",()=>{
				buttons[0].click();

			})

		})
}
)
window.addEventListener("load",()=>{
	// header>.user>div
})