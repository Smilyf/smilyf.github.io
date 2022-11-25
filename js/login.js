

window.addEventListener("load", () => {




    document.querySelector("#submit").addEventListener("click", () => {
    //     let password=document.querySelector("#password").value;
    //     let username=document.querySelector("#username").value;

    //     data = new FormData(); // 将表单节点数据封装为 FormData 格式
    //     data.append("password",password);
    //     data.append("username",username);

    //     //发送异步请求获取数据
    //     fetch('http://localhost:8080/webblogs_war_exploded/test', {
    //         method: 'POST',
    //         body: data,
    //         headers: {
    //         }
    //     }).then(resp => resp.text()).then(datas => {
    //         if (datas != "") {
    //             sessionStorage.setItem("identity", datas)
    //             console.log(datas);
    //             // window.history.go(-1);
    //         } else {
    //             alert("用户名或密码错误！")
    //             console.log(datas);
    //         }
    //     })
    sessionStorage.setItem("identity","s")
    alert("登录成功！")
    window.location.href=document.referrer;

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
