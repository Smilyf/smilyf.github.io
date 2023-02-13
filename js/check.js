//check the login state
window.addEventListener("load", () => {

    if (sessionStorage.getItem("identity").length>2) {
        document.querySelector("#identity-user").className = "user"
        document.querySelector("#identity-visitor").className = "user-hidden"
        document.querySelector("#exit").addEventListener("click",()=>{
            sessionStorage.setItem("identity","");
            document.querySelector("#identity-user").className="user-hidden"
            document.querySelector("#identity-visitor").className="user"
        })
    }
    else
    {
        // document.querySelector("#identity-user").className = "user-hidden"
        // document.querySelector("#identity-visitor").className = "user"
        window.location.href="../html/login.html"
    }
})


window.addEventListener("load",()=>{
	
	if(sessionStorage.getItem("identity")==null)
	{
		sessionStorage.setItem("identity","");
	}
	
})


