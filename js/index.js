"use strict";


var article_json;
var pages = 3
function create(text, index) {
	let temp = document.createElement("div")
	let p = document.createElement("p")
	p.innerHTML = marked.parse(text[index]["title"])
	let p1 = document.createElement("p")
	p1.innerHTML = marked.parse(text[index]["content"])
	temp.appendChild(p)
	temp.appendChild(p1)
	temp.addEventListener("click", () => {
		localStorage.setItem('item', index);
		window.location.href = "./html/index.html"
	})
	return temp;
}

window.addEventListener('load', () => {
	var art = document.querySelector(".content")
	let url = "./article/article.json"
	fetch(url)
		.then((data) => {
			data.json().then((text) => {
				article_json = text
				let length = Object.keys(article_json).length;
				let paging_index = document.querySelector(".paging .paging-index")
				for (let i = 1; i <= (length + pages - 1) / pages; i++) {
					let button = document.createElement("button")
					button.innerHTML = i;
					button.value = i
					button.addEventListener("click", () => {
						art.innerHTML = ""
						localStorage.setItem('paging', i);
						let start = (i - 1) * pages + 1
						let end = start + ((length - start + 1) < pages ? (length - start + 1) : pages)
						for (let i = start; i < end; i++) {
							art.appendChild(create(text, i))
						}
						let buttons = paging_index.querySelectorAll("button")
						for (let j of buttons) {
							if (j.value === localStorage.getItem("paging")) {
								j.style.background = "#fff";
								j.style.color = "#0f0f0f";
							}
							else {
								j.style.background = "#0f0f0f";
								j.style.color = "#fff";
							}
						}
					})
					paging_index.appendChild(button)
				}
				let buttons = paging_index.querySelectorAll("button")
				for (let j of buttons) {
					if (j.value === localStorage.getItem("paging")) {
						j.click();
						break;
					}
				}
				document.querySelector(".previous-page").addEventListener("click", () => {
					let buttons = paging_index.querySelectorAll("button")
					let index=localStorage.getItem("paging")
					if (index-1>=1) 
					{
						buttons[index-2].click();
					}

				})
				let next_page = document.querySelector(".next-page").addEventListener("click", () => {
					let buttons = paging_index.querySelectorAll("button")
					let index=localStorage.getItem("paging")
					if (index+1>=length) 
					{
						buttons[index].click()
					}

				})

			})
		})

})
