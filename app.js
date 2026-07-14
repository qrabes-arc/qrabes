let articles=[];


const url =
"https://raw.githubusercontent.com/qrabes-arc/qrabes/refs/heads/main/articles.json";



async function loadArticles(){


try{


let res = await fetch(url);


articles = await res.json();



displayArticles(articles);



document.getElementById("loading").style.display="none";



}

catch(error){

console.log(error);

}


}




function displayArticles(data){


let feed=document.getElementById("feed");


feed.innerHTML="";



data.forEach(article=>{


feed.innerHTML += `


<div class="card">


<img src="${article.image}">


<div class="content">


<div class="category">
${article.category}
</div>


<h2>
${article.title}
</h2>


<p>
${article.description}
</p>


<button>
Read Story
</button>


</div>


</div>


`;


});


}





// Search


document
.getElementById("search")
.addEventListener("input",(e)=>{


let value=e.target.value.toLowerCase();


let filtered=articles.filter(article=>

article.title
.toLowerCase()
.includes(value)

);


displayArticles(filtered);


});







// Category filter


document
.querySelectorAll(".categories button")
.forEach(btn=>{


btn.addEventListener("click",()=>{


let cat=btn.dataset.category;



if(cat==="All"){

displayArticles(articles);

}

else{


let result=articles.filter(article=>

article.category===cat

);


displayArticles(result);


}


});


});






loadArticles();
