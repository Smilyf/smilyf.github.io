"use strict";




window.addEventListener('load', () => {


    var banner = document.querySelector(".banner")
    var artshow = document.querySelector(".content-show")
    // banner.style.display = "none"
    artshow.style.display = "inline-block"
    let url = "../article/" + localStorage.getItem('item') + ".md"
    fetch(url)
        .then((data) => {
            data.text().then((text) => {
                let temp = document.createElement("div")
                temp.innerHTML = marked.parse(text)
                artshow.appendChild(temp)
                console.log(marked.parse(text))
            })
             
        })
})

