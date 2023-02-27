import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js';
//  and it's easy to individually load & register additional languages
import go from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/go.min.js';

hljs.registerLanguage('go', go);

function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
window.addEventListener('load', () => {

    let href = window.location.href
    let domain = href.match(/\?domain=(.*)/)[1];
    if (domain.match(/(\S*)\?/) != null) {
        domain = domain.match(/(\S*)\?/)[1]
    }
    let index = href.match(/\?index=(.*)/)[1];
    var artshow = document.querySelector("#content-sss")
    // artshow.style.display = "inline-block"
    let url = "../article/" + domain + "/md/" + index + ".md"
    fetch(url)
        .then((data) => { 
           
            return data.text() })

        .then((text) => {

            let temp = document.createElement("div")
            temp.innerHTML = marked.parse(text)
            for (const element of temp.querySelectorAll("code")) {


                hljs.highlightElement(element);

            }
            for (const element of temp.querySelectorAll("pre")) {

                let copy = document.createElement("div")
                copy.addEventListener("click",
                    async () => {
                        try {

                            await navigator.clipboard.writeText(element.textContent.trim())
                            let inf = document.createElement("div")
                            inf.className = "inf"
                            inf.innerHTML = "复制成功"
                            document.querySelector("html").appendChild(inf)
                            setTimeout(() => {
                                inf.remove()
                            }, 800)


                        } catch (err) {
                            let inf = document.createElement("div")
                            inf.className = "inf"
                            inf.innerHTML = "复制失败"
                            document.querySelector("html").appendChild(inf)
                            setTimeout(() => {
                                inf.remove()
                            }, 800)

                            console.error('Failed to copy: ', err)

                        }
                    }
                )
                copy.title = "复制"
                copy.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'><path fill='none' d='M0 0h24v24H0z'/><path d='M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z'  fill='rgba(89,89,89,1)'/></svg>"
                copy.className = "copy"
                element.appendChild(copy);
            }

            artshow.appendChild(temp)
        })
})




async function addcomment(username, userid, index, content1, comment1, flag) {
    {
        let url = getBasePath() + '/Comment?'
        url += 'username=' + username + '&userid=' + userid + '&articleid=' + index + '&content=' + content1 + '&comment1=' + comment1 + '&flag=' + flag
        console.log(url)
        fetch(url,
            {
                method: 'POST',
                body: "",
                headers: {}
            })
    }
}

async function showcomment() {

    let href = window.location.href
    let domain = href.match(/\?domain=(.*)/)[1];
    if (domain.match(/(\S*)\?/) != null) {
        domain = domain.match(/(\S*)\?/)[1]
    }
    let index = href.match(/\?index=(.*)/)[1];
    var artshow = document.querySelector(".content-show")
    artshow.style.display = "inline-block"
    let url = "../article/" + domain + "/" + index + ".md"
    await fetch(url,
        {
            method: 'POST',
            body: "",
            headers: {}
        })

        .then(resp => resp.text()).then((data) => {

            return JSON.parse(data)
        })
        .then((texts) => {


            let divs = document.querySelector(".discuss-s")
            divs.innerHTML = ""
            // let ttt =Object.keys(texts).sort(function(a,b){return b-a})

            for (let x in texts) {


                //第一层
                let discuss1 = document.createElement("div");
                discuss1.className = "discuss1";
                let imageuser = document.createElement("div");
                imageuser.className = "imageuser";
                imageuser.innerHTML = "<img src=\"../images/YY.ico\" alt=\"\">"
                let contents = document.createElement("div");
                contents.className = "contents";
                let content1 = document.createElement("div");
                content1.className = "content1";
                let form = document.createElement("form");
                form.className = "input_form_hidden";
                let discuss2 = document.createElement("div");
                discuss2.className = "discuss2";
                //第二层
                let user_inf = document.createElement("div");
                user_inf.className = "user_inf"
                let content = document.createElement("div");
                content.className = "content"
                let r = document.createElement("span");
                let rs = document.createElement("span");
                for (let y in texts[x]) {

                    document.querySelector("#ssssssssss").innerHTML = ""
                    document.querySelector("#ssssssssss").innerHTML = texts[x][y]["comment_amount"] + "评论"


                    if (y == "0") {


                        //第三层
                        let user_name = document.createElement("a");
                        user_name.innerHTML = texts[x][y]["author"]
                        user_name.href = ""
                        let createtime = document.createElement("span");
                        createtime.innerHTML = texts[x][y]["createtime"]
                        let comment = document.createElement("div");
                        comment.className = "comment"

                        comment.innerHTML = texts[x][y]["comment"]

                        let textarea = document.createElement("textarea");
                        r.innerHTML = "回复"
                        r.addEventListener("click", () => {
                            if (form.className != "input_form_show") {
                                form.className = "input_form_show";
                            }
                            else {
                                form.className = "input_form_hidden";
                            }

                        })

                        rs.innerHTML = "提交评论"
                        rs.addEventListener("click", () => {
                            let inf = JSON.parse(sessionStorage.getItem("identity"))
                            let username = inf["username"]
                            let userid = inf["userid"]

                            let cc = ""
                            cc += textarea.value
                            addcomment(username, userid, index, cc, x, "2")
                            form.className = "input_form_hidden";
                        })
                        user_inf.appendChild(user_name)
                        user_inf.appendChild(createtime)
                        user_inf.appendChild(r)
                        content.appendChild(comment)
                        form.appendChild(textarea)
                        form.appendChild(rs)

                        content1.appendChild(user_inf)
                        content1.appendChild(content)

                        contents.appendChild(content1)
                        contents.appendChild(form)
                        contents.appendChild(discuss2)

                        discuss1.appendChild(imageuser)
                        discuss1.appendChild(contents)
                        divs.appendChild(discuss1)


                    } else {



                        //第一层
                        let discuss1 = document.createElement("div");
                        discuss1.className = "discuss1";
                        let imageuser = document.createElement("div");
                        imageuser.className = "imageuser";
                        imageuser.innerHTML = "<img src=\"../images/YY.ico\" alt=\"\">"
                        let contents = document.createElement("div");
                        contents.className = "contents";
                        let content1 = document.createElement("div");
                        content1.className = "content1";
                        let form = document.createElement("form");
                        form.className = "input_form_hidden";
                        //第二层
                        let user_inf = document.createElement("div");
                        user_inf.className = "user_inf"
                        let content = document.createElement("div");
                        content.className = "content"
                        let r = document.createElement("span");
                        let rs = document.createElement("span");




                        //第三层
                        let user_name = document.createElement("a");
                        user_name.innerHTML = texts[x][y]["author"]
                        user_name.href = ""
                        let createtime = document.createElement("span");
                        createtime.innerHTML = texts[x][y]["createtime"]
                        let comment = document.createElement("div");
                        comment.className = "comment"

                        comment.innerHTML = texts[x][y]["comment"]

                        let textarea = document.createElement("textarea");
                        r.innerHTML = "回复"
                        r.addEventListener("click", () => {
                            if (form.className != "input_form_show") {
                                form.className = "input_form_show";
                            }
                            else {
                                form.className = "input_form_hidden";
                            }

                        })
                        rs.innerHTML = "提交评论"
                        rs.addEventListener("click", () => {

                            let inf = JSON.parse(sessionStorage.getItem("identity"))
                            let username = inf["username"]
                            let userid = inf["userid"]

                            let cc = "@" + user_name.innerHTML + ":   "
                            cc += textarea.value
                            addcomment(username, userid, index, cc, x, "2")
                            form.className = "input_form_hidden";
                        })
                        user_inf.appendChild(user_name)
                        user_inf.appendChild(createtime)
                        user_inf.appendChild(r)
                        content.appendChild(comment)
                        form.appendChild(textarea)
                        form.appendChild(rs)

                        content1.appendChild(user_inf)
                        content1.appendChild(content)

                        contents.appendChild(content1)
                        contents.appendChild(form)


                        discuss1.appendChild(imageuser)
                        discuss1.appendChild(contents)
                        discuss2.appendChild(discuss1)

                    }


                }


            }


        })

}