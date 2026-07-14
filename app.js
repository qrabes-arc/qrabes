const feed = document.getElementById("feed");
const loading = document.getElementById("loading");

let allArticles = [];


// Fetch JSON Data

async function fetchArticles(){

    try{

        const response = await fetch("./articles.json");


        if(!response.ok){

            throw new Error("JSON file not found");

        }


        const data = await response.json();


        allArticles = data;


        displayArticles(allArticles);


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

        loading.style.display = "none";

    }

}




// Create Cards

function displayArticles(articles){


    feed.innerHTML = "";


    articles.forEach(article => {


        const card = document.createElement("article");


        card.className = "card";


        card.innerHTML = `

        <img 
        src="${article.image}"
        alt="${article.title}"
        >


        <div class="card-content">


            <span class="category">
            ${article.category}
            </span>


            <h2>
            ${article.title}
            </h2>


            <p>
            ${article.description}
            </p>


            <div class="card-info">


                <span>
                ✍️ ${article.author}
                </span>


                <span>
                👁 ${article.views}
                </span>


                <span>
                ❤️ ${article.likes}
                </span>


            </div>


        </div>

        `;


        feed.appendChild(card);


    });


}



// Search

const searchBox = document.getElementById("search");


searchBox.addEventListener(
"input",
function(){


const value = this.value.toLowerCase();


const result = allArticles.filter(article =>

article.title.toLowerCase().includes(value)

);


displayArticles(result);


});




// Category Filter

const buttons = document.querySelectorAll(
".categories button"
);


buttons.forEach(button=>{


button.addEventListener(
"click",
()=>{


const category = button.dataset.category;


if(category === "All"){

displayArticles(allArticles);

}

else{


const filtered = allArticles.filter(article=>

article.category === category

);


displayArticles(filtered);


}


});

});




// Start

fetchArticles();
