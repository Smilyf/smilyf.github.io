window.addEventListener("load",()=>{

	if(sessionStorage.getItem("identity")!=null)
	{
		document.querySelector("#identity-user").className="user"
		document.querySelector("#identity-visitor").className="user-hidden"
       
	}
   

})
