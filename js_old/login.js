function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}

window.addEventListener("load", () => { 


    let submit = document.querySelector("#submit")
    submit.addEventListener("click", () => {

        let password = document.querySelector("#password").value;
        let username = document.querySelector("#username").value;
        //发送异步请求获取数据
        // alert(getBasePath()+'/login?password=' + password + '&username=' + username)
        fetch(getBasePath() + '/login?password=' + password + '&username=' + username, {
            method: 'POST',
            body: "",
            headers: {}
        }).then(resp => resp.text()).then(datas => {


            sessionStorage.setItem("identity", datas)


        }).then(() => {

                // let response=JSON.parse( sessionStorage.getItem("identity"))

                if (sessionStorage.getItem("identity").length > 2) {


                    window.location.href = getBasePath() + "/index.html"
                } else {
                    alert("用户名或密码错误")
                }
            }
        )


    })


})


