"use strict";



window.addEventListener('load', () => {

    
    var artshow = document.querySelector(".content-show")
    artshow.style.display = "inline-block"
    let url = "../article/" + localStorage.getItem('item') + ".md"
    fetch(url)
        .then((data) => {
            data.text().then((text) => {
                let temp = document.createElement("div")
                temp.innerHTML = marked.parse(text)
                temp.querySelectorAll("pre code").forEach((el) => {
                    hljs.highlightElement(el);
                  });
                artshow.appendChild(temp)
            })
        })
})

