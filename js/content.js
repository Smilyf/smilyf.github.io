
import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js';
//  and it's easy to individually load & register additional languages
import go from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/go.min.js';
hljs.registerLanguage('go', go);
window.addEventListener('load', () => {

    
    var artshow = document.querySelector(".content-show")
    artshow.style.display = "inline-block"
    let url = "../article/" + sessionStorage.getItem('item') + ".md"
    fetch(url)
        .then((data) => {
            data.text()
        .then((text) => {
                let temp = document.createElement("div")
                temp.innerHTML = marked.parse(text)
                temp.querySelectorAll("pre code").forEach((el) => {
                    hljs.highlightElement(el);
                  });
                artshow.appendChild(temp)
            })
        })
})





