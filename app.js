const feed = document.getElementById("feed");
const loading = document.getElementById("loading");

let allArticles = [];


// ============================
// FETCH ARTICLES
// ============================

async function fetchArticles(){

    try{

        const response = await fetch(
            "./articles.json?cache=" + Date.now()
        );


        if(!response.ok){

            throw new Error("JSON not found");

        }


        const data = await response.json();


        allArticles = data;



        // Latest first

        allArticles.sort((a,b)=>{

            return new Date(b.created_at || b.published)
            -
            new Date(a.created_at || a.published);

        });



        displayArticles(
            createFeed()
        );


    }


    catch(error){

        console.log(error);


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
// FEED ALGORITHM
// ============================

function createFeed(){


    let articles=[...allArticles];


    // mix latest + random

    let latest = articles.slice(0,50);



    return latest.sort(

        ()=> Math.random()-0.5

    );


}



// ============================
// DISPLAY FEED
// ============================


function displayArticles(articles){


    feed.innerHTML="";



    articles.forEach(article=>{


        const card=document.createElement("article");


        card.className="post";



        card.innerHTML=`


        <!-- IMAGE -->

        <div class="post-image">


            <img

            src="${article.image}"

            alt="${article.title}"

            loading="lazy"

            >


        </div>




        <!-- CONTENT -->


        <div class="post-body">


            <div class="category">

            ${article.category || "Luxury"}

            </div>



            <h2>

            ${article.title}

            </h2>



            <p>

            ${article.description || ""}

            </p>




            <!-- ACTIONS -->


            <div class="actions">


                <button>

                ❤️

                </button>



                <button>

                💬

                </button>



                <button>

                🔗

                </button>



                <button>

                🔖

                </button>


            </div>





            <div class="stats">


            👁 ${article.views || 0}

            &nbsp;&nbsp;

            ❤️ ${article.likes || 0}



            </div>





            <div class="source">


            ${article.source || "QRABES"}

            </div>


        </div>


        `;



        feed.appendChild(card);



    });


}




// ============================
// SEARCH
// ============================


const searchBox=document.getElementById("search");


if(searchBox){


searchBox.addEventListener(
"input",

()=>{


let value=
searchBox.value.toLowerCase();



let result=allArticles.filter(article=>


article.title
.toLowerCase()
.includes(value)



);



displayArticles(result);



}

);


}




// ============================
// CATEGORY FILTER
// ============================


const buttons=document.querySelectorAll(
".categories button"
);



buttons.forEach(button=>{


button.addEventListener(

"click",

()=>{


let category=
button.dataset.category;



if(category==="All"){


displayArticles(
createFeed()
);


}

else{


let result =
allArticles.filter(article=>


article.category===category


);



displayArticles(result);



}



}

);


});




// ============================
// START
// ============================

fetchArticles();
