function getBasePath() {
    var obj = window.location;
    var contextPath = obj.pathname.split("/")[0];
    var basePath = obj.protocol + "//" + obj.host + "/" + contextPath;
    return basePath;
}
window.addEventListener("load",()=>{

	if (sessionStorage.getItem("identity").length>2)
	{
		document.querySelector("#identity-user").className="user"
		document.querySelector("#identity-visitor").className="user-hidden"

	}

})
window.addEventListener("load",()=>{
	let username=document.querySelector("#username")
	let userid=document.querySelector("#userid")

	let inf=JSON.parse( sessionStorage.getItem("identity"))
	username.innerHTML=inf["username"]
	userid.innerHTML=inf["userid"]

	document.querySelector("#vip").addEventListener("click",()=>{

		window.location.href ="../index.html";

	})
})


