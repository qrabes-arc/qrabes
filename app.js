const feed = document.getElementById("feed");
const loading = document.getElementById("loading");

let allArticles = [];


// ============================
// Fetch Articles
// ============================

async function fetchArticles(){

    try{


        const response = await fetch(
            "./articles.json?cache=" + Date.now()
        );


        if(!response.ok){

            throw new Error("JSON file not found");

        }


        const data = await response.json();



        allArticles = data;



        // Latest articles first

        allArticles.sort((a,b)=>{

            return new Date(b.created_at) - new Date(a.created_at);

        });



        // Random feed on refresh

        const freshFeed = shuffleArticles(allArticles);



        displayArticles(freshFeed);



    }


    catch(error){

        console.error(error);


        feed.innerHTML = `

        <h2>
        Failed to load stories
        </h2>

        `;

    }


    finally{

        loading.style.display="none";

    }

}





// ============================
// Shuffle Feed
// ============================


function shuffleArticles(array){


    return [...array].sort(

        ()=> Math.random() - 0.5

    );


}





// ============================
// Create Cards
// ============================


function displayArticles(articles){


    feed.innerHTML="";



    articles.forEach(article=>{


        const card=document.createElement("article");


        card.className="card";



        card.innerHTML = `


        <img

        src="${article.image}"

        alt="${article.title}"

        loading="lazy"

        >



        <div class="card-content">


        <span class="category">

        ${article.category || "Luxury"}

        </span>



        <h2>

        ${article.title}

        </h2>



        <p>

        ${article.description || ""}

        </p>



        <div class="card-info">


        <span>

        ✍️ ${article.author || article.source}

        </span>



        <span>

        👁 ${article.views || 0}

        </span>



        <span>

        ❤️ ${article.likes || 0}

        </span>



        </div>


        </div>


        `;



        feed.appendChild(card);



    });



}





// ============================
// Search
// ============================


const searchBox=document.getElementById("search");


if(searchBox){


searchBox.addEventListener(

"input",

function(){


const value=this.value.toLowerCase();



const result=allArticles.filter(article=>


article.title

.toLowerCase()

.includes(value)



);



displayArticles(result);



}



);


}





// ============================
// Category Filter
// ============================


const buttons=document.querySelectorAll(
".categories button"
);



buttons.forEach(button=>{


button.addEventListener(

"click",

()=>{


const category=button.dataset.category;



if(category==="All"){


displayArticles(

shuffleArticles(allArticles)

);


}


else{


const filtered=allArticles.filter(article=>


article.category===category


);



displayArticles(filtered);



}



}



);



});





// Start

fetchArticles();
