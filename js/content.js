
import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js';
//  and it's easy to individually load & register additional languages
import go from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/go.min.js';
hljs.registerLanguage('go', go);


window.addEventListener('load', () => {

    let href = window.location.href
	let domain = href.match(/\?domain=(.*)/)[1];
	if(domain.match(/(\S*)\?/)!=null)
	{
		domain=domain.match(/(\S*)\?/)[1]
	}
    let index=href.match(/\?index=(.*)/)[1];
    var artshow = document.querySelector(".content-show")
    artshow.style.display = "inline-block"
    let url = "../article/" +domain+"/"+ index + ".md"
    fetch(url)
        .then((data) => {
            data.text()
        .then((text) => {
                let temp = document.createElement("div")
                temp.innerHTML = marked.parse(text)
                for(const element of temp.querySelectorAll("pre code")){
                    hljs.highlightElement(element);
                }
                artshow.appendChild(temp)
            })
        })
})

window.addEventListener("load",()=>{
	// sessionStorage.setItem("identity","s")
	if(sessionStorage.getItem("identity")!=null)
	{
		document.querySelector("#identity-user").className="user"
		document.querySelector("#identity-visitor").className="user-hidden"
	}

})
