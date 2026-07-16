// ==========================================
// QRABES APP.JS (PART 1)
// Foundation + Feed Engine
// ==========================================

const feed = document.getElementById("feed");
const loading = document.getElementById("loading");

let allArticles = [];
let filteredArticles = [];

let currentPage = 0;
const POSTS_PER_LOAD = 20;

let isLoading = false;


// ==========================================
// FALLBACK IMAGE
// ==========================================

const FALLBACK_IMAGE =
"https://placehold.co/900x700/111111/FFFFFF?text=QRABES";


// ==========================================
// FETCH ARTICLES
// ==========================================

async function fetchArticles(){

    loading.style.display="block";

    try{

        const response = await fetch(
            "./articles.json?cache=" + Date.now()
        );

        if(!response.ok){

            throw new Error("Unable to load JSON");

        }

        const data = await response.json();

        // remove invalid records

        allArticles = data.filter(article=>{

            return article &&
                   article.title &&
                   article.image;

        });


        // latest first

        allArticles.sort((a,b)=>{

            return new Date(
                b.created_at || b.published || 0
            )

            -

            new Date(
                a.created_at || a.published || 0
            );

        });


        filteredArticles=[...allArticles];

        resetFeed();

    }

    catch(error){

        console.error(error);

        feed.innerHTML=`

        <div class="error">

            Failed to load feed.

        </div>

        `;

    }

    finally{

        loading.style.display="none";

    }

}



// ==========================================
// RESET FEED
// ==========================================

function resetFeed(){

    feed.innerHTML="";

    currentPage=0;

    loadMorePosts();

}



// ==========================================
// LOAD NEXT POSTS
// ==========================================

function loadMorePosts(){

    if(isLoading) return;

    isLoading=true;

    const start=currentPage*POSTS_PER_LOAD;

    const end=start+POSTS_PER_LOAD;

    const posts=filteredArticles.slice(start,end);

    posts.forEach(article=>{

        createCard(article);

    });

    currentPage++;

    isLoading=false;

}



// ==========================================
// CREATE CARD
// ==========================================

function createCard(article){

    const card=document.createElement("article");

    card.className="post";


    const image=
    article.image &&
    article.image.trim()!=="" ?

    article.image :

    FALLBACK_IMAGE;



    const description=

    (article.description || "")

    .substring(0,160);



    card.innerHTML=`

<div class="post-image">

<img

src="${image}"

alt="${article.title}"

loading="lazy"

decoding="async"

onerror="this.src='${FALLBACK_IMAGE}'"

>

</div>



<div class="post-body">

<div class="category">

${article.category || "Luxury"}

</div>



<h2>

${article.title}

</h2>



<p>

${description}

</p>



<div class="actions">

<button>❤️</button>

<button>💬</button>

<button>🔗</button>

<button>🔖</button>

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

}



// ==========================================
// INFINITE SCROLL
// ==========================================

window.addEventListener("scroll",()=>{

    const scrollTop=
    window.scrollY;

    const viewport=
    window.innerHeight;

    const height=
    document.body.offsetHeight;

    if(

        scrollTop+viewport>

        height-800

    ){

        loadMorePosts();

    }

});



// ==========================================
// START
// ==========================================

fetchArticles();
