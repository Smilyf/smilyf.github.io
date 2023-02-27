window.addEventListener("load", () => {
    let username_alert = document.querySelector("#username-alert");
    let password_alert1 = document.querySelector("#password-alert1");
    let password_alert2 = document.querySelector("#password-alert2");
    let password = document.querySelector("#password");
    let username = document.querySelector("#username")
    let usernametext = /(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{2,10}/;
    let passwordtext = /[A-Za-z0-9]{6,18}/;
    let password1 = document.querySelector("#password1");
    let password2 = document.querySelector("#password2");

    username.addEventListener("change", () => {

        if (!usernametext.test(username.value)) {
            username_alert.innerHTML = "用户名只含有汉字、数字、字母、下划线不能以下划线开头和结尾,长度范围[2,10]。"
        }
        else {
            username_alert.innerHTML = ""
        }
        //用户名正则，4到16位（字母，数字，下划线，减号）
        //  alert(uPattern.test(username.value))
    })
    password1.addEventListener("change", () => {
        if (!passwordtext.test(password1.value)) {
            password_alert1.innerHTML = "密码由[6,18]位数字和26个英文字母(含大小写)组成"
        }
        else {
            password_alert1.innerHTML = ""
        }
        if (password1.value != password2.value) {
            password.innerHTML = "两次输入密码不相同！"
        }
        else {
            password.innerHTML = ""
        }


    })
    password2.addEventListener("change", () => {
        if (!passwordtext.test(password2.value)) {
            password_alert2.innerHTML = "密码由[6,18]位数字和26个英文字母(含大小写)组成"
        }
        else {
            password_alert2.innerHTML = ""
        }
        if (password1.value != password2.value) {


            password.innerHTML = "两次输入密码不相同！"
        }
        else {
            password.innerHTML =""
        }


    })

})
window.addEventListener("load",()=>{
	// sessionStorage.setItem("identity","s")

    if (sessionStorage.getItem("identity").length>2)
	{
		document.querySelector("#identity-user").className="user"
		document.querySelector("#identity-visitor").className="user-hidden"
	}

})
