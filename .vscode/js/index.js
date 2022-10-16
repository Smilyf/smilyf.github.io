"use strict";



// function displayDate() {
// 	document.getElementById("demo").innerHTML = Date();
// }


// Function: creates a new paragraph and appends it to the bottom of the HTML body.

// function createParagraph() {

// 	const para = document.createElement('p');
// 	para.textContent = 'You clicked the button!';
// 	document.querySelector("#time").style.backgroundColor="red";
//   }

/*
  1. Get references to all the buttons on the page in an array format.
  2. Loop through all the buttons and add a click event listener to each one.

  When any button is pressed, the createParagraph() function will be run.
*/

// window.addEventListener('load',()=>{
// 	const buttons = document.querySelectorAll('button');
// 	console.log(buttons)
// 	for (const button of buttons) {
// 	   button.addEventListener('click', createParagraph);

// 	}
// })


// window.addEventListener('load', function () {
// 	var x = document.querySelectorAll("p");
// 	document.querySelector('button').addEventListener('click', () => { x[0].style.backgroundColor = "red"; });

// })	

// window.addEventListener("load",()=>{

// 	var listOfDiv=document.querySelector(".navigation").querySelectorAll("div")

// 	 for(var i=0;i<=10;i+=2 )
// 	{
// 		let t=listOfDiv[i]
// 		let tn=listOfDiv[i+1]
// 		t.addEventListener("mouseover",()=>{
// 			t.querySelector('div').style.visibility="visible"

// 	   	})
// 	  	 t.addEventListener("mouseout",()=>{
// 		   t.querySelector('div').style.visibility="hidden"
// 	 	})

// 	}
// 	for(var i=1;i<=11;i+=2 )
// 	{
// 		let t=listOfDiv[i]
// 		t.addEventListener("mouseover",()=>{
// 			t.style.visibility="visible"

// 	   	})
// 	  	 t.addEventListener("mouseout",()=>{
// 		   t.style.visibility="hidden"
// 	 	})

// 	}
// })

// window.addEventListener('load',()=>{

// 	var e=document.querySelector('i')

// 	e.addEventListener('click',()=>{





// 导航栏
// window.addEventListener("load",()=>{

// 	var listOfStair1=document.querySelectorAll(".stair1")

// 	 for(let  e of listOfStair1 )
// 	{

// 		e.addEventListener("mouseover",()=>{
// 			e.querySelector(".stair2").style.visibility="visible"

// 	   	})
// 	  	 e.addEventListener("mouseout",()=>{
// 		   e.querySelector(".stair2").style.visibility="hidden"
// 	 	})

// 	}

// })
// 动态md
window.addEventListener('load', () => {

	// var arts=new Array()
	var art=document.querySelector(".content")
	// var artshow=document.querySelector(".content-show")
	for(let i=1;i<5;i++)
	{
		let url="./article/"+i+".md"
		fetch(url)
			.then((data) => {
				data.text().then((text) => {
					let temp=document.createElement("div")
					temp.innerHTML=marked.parse(text)
					temp.addEventListener("click",()=>{
						localStorage.setItem('item', i);
						window.location.href="./html/index.html"
						// artshow.appendChild(temp)
					})
					art.appendChild(temp)
					// console.log(marked.parse(text))
				})
			})
	}
	// var articles=document.querySelector(".content").document.querySelectorAll("div")
	// for(let x in articles)
	// {
	// 	x.addEventListener("click",()=>{
	// 		this.style.display="none"
	// 	})
	// }


	
	
})
// window.addEventListener('load', () => {
// 	fetch('htmls/a.html')
// 		.then((data) => {
// 			data.text().then((text) => {
// 				document.querySelector(".texts").innerHTML =text; 
// 			})
// 		})
// })