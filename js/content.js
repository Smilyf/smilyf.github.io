// import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/highlight.min.js';
// //  and it's easy to individually load & register additional languages
// import go from 'https://unpkg.com/@highlightjs/cdn-assets@11.6.0/es/languages/go.min.js';

// hljs.registerLanguage('go', go);

function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[1];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
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
    let url = "../article/" +domain+"/md/"+ index + ".md"
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


// window.addEventListener('load', () => {


//     let href = window.location.href
//     let domain = href.match(/\?domain=(.*)/)[1];
//     if (domain.match(/(\S*)\?/) != null) {
//         domain = domain.match(/(\S*)\?/)[1]
//     }
//     let index = href.match(/\?index=(.*)/)[1];
//     var artshow = document.querySelector(".content-show")
//     artshow.style.display = "inline-block"

//     let url = "../article/" +domain+"/"+ index + ".md"

//     fetch(getBasePath() + '/Content?index=' + index,
//         {
//             method: 'POST',
//             body: "",
//             headers: {}
//         }).then(resp => resp.text()).then((data) => {
//         return JSON.parse(data)
//     })
//         .then((texts) => {

//             let text = texts[index]["content"]


//             let temp = document.createElement("div")
//             temp.innerHTML = marked.parse(text)
//             for (const element of temp.querySelectorAll("pre code")) {
//                 hljs.highlightElement(element);
//             }
//             artshow.appendChild(temp)
//         }).then(() => {
//             // showcomment()


//         }
//     )
//     document.querySelector("#sssss").addEventListener("click",
//         ()=>{
//             let inf = JSON.parse(sessionStorage.getItem("identity"))
//             let username = inf["username"]
//             let userid = inf["userid"]

//             let cc=document.querySelector("#sssiii").value

//             addcomment(username, userid, index, cc, "0","1")

//         }
//     )


// })



function addcomment(username, userid, index, content1, comment1, flag) {
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
            .then(() => {

                    // showcomment();
                }
            )

    }
}

function showcomment() {
    // let url = getBasePath() + '/Comment?articleid=' + index
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
    fetch(url,
        {
            method: 'POST',
            body: "",
            headers: {}
        }).then(resp => resp.text()).then((data) => {

        return JSON.parse(data)
    })
        .then((texts) => {


            let divs = document.querySelector(".discuss-s")
            divs.innerHTML=""
            // let ttt =Object.keys(texts).sort(function(a,b){return b-a})

            for (let x in texts) {


                //第一层
                let discuss1 = document.createElement("div");
                discuss1.className = "discuss1";
                let imageuser = document.createElement("div");
                imageuser.className = "imageuser";
                imageuser.innerHTML="<img src=\"../images/YY.ico\" alt=\"\">"
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
                user_inf.className="user_inf"
                let content = document.createElement("div");
                content.className="content"
                let r = document.createElement("span");
                let rs = document.createElement("span");
                for (let y in texts[x]) {

                    document.querySelector("#ssssssssss").innerHTML=""
                    document.querySelector("#ssssssssss").innerHTML=texts[x][y]["comment_amount"]+"评论"


                    if (y == "0") {


                        //第三层
                        let user_name = document.createElement("a");
                        user_name.innerHTML = texts[x][y]["author"]
                        user_name.href=""
                        let createtime = document.createElement("span");
                        createtime.innerHTML = texts[x][y]["createtime"]
                        let comment = document.createElement("div");
                        comment.className="comment"

                        comment.innerHTML = texts[x][y]["comment"]

                        let textarea  =document.createElement("textarea");
                        r.innerHTML = "回复"
                        r.addEventListener("click", () => {
                            if(form.className != "input_form_show")
                            {
                                form.className = "input_form_show";
                            }
                            else
                            {
                                form.className = "input_form_hidden";
                            }

                        })

                        rs.innerHTML = "提交评论"
                        rs.addEventListener("click", () => {
                            let inf = JSON.parse(sessionStorage.getItem("identity"))
                            let username = inf["username"]
                            let userid = inf["userid"]

                            let cc=""
                            cc+=textarea.value
                            addcomment(username, userid, index, cc, x,"2")
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
                        imageuser.innerHTML="<img src=\"../images/YY.ico\" alt=\"\">"
                        let contents = document.createElement("div");
                        contents.className = "contents";
                        let content1 = document.createElement("div");
                        content1.className = "content1";
                        let form = document.createElement("form");
                        form.className = "input_form_hidden";
                        //第二层
                        let user_inf = document.createElement("div");
                        user_inf.className="user_inf"
                        let content = document.createElement("div");
                        content.className="content"
                        let r = document.createElement("span");
                        let rs = document.createElement("span");




                        //第三层
                        let user_name = document.createElement("a");
                        user_name.innerHTML = texts[x][y]["author"]
                        user_name.href=""
                        let createtime = document.createElement("span");
                        createtime.innerHTML = texts[x][y]["createtime"]
                        let comment = document.createElement("div");
                        comment.className="comment"

                        comment.innerHTML = texts[x][y]["comment"]

                        let textarea  =document.createElement("textarea");
                        r.innerHTML = "回复"
                        r.addEventListener("click", () => {
                            if(form.className != "input_form_show")
                            {
                                form.className = "input_form_show";
                            }
                            else
                            {
                                form.className = "input_form_hidden";
                            }

                        })
                        rs.innerHTML = "提交评论"
                        rs.addEventListener("click", () => {

                            let inf = JSON.parse(sessionStorage.getItem("identity"))
                            let username = inf["username"]
                            let userid = inf["userid"]

                            let cc="@"+user_name.innerHTML+":   "
                             cc+=textarea.value
                            addcomment(username, userid, index, cc, x,"2")
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