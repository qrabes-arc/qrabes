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





<h2>

${article.title}

</h2>



<p>

${description}

</p>
<button 
class="read-more"
data-url="${article.url || '#'}"
>
Read More
</button>

<div class="actions">


<button class="like-btn">

<svg 
xmlns="http://www.w3.org/2000/svg"
width="28"
height="28"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round"
class="heart-icon">

<path d="
M20.84 4.61
a5.5 5.5 0 0 0-7.78 0
L12 5.67
l-1.06-1.06
a5.5 5.5 0 0 0-7.78 7.78
l1.06 1.06
L12 21.23
l7.78-7.78
1.06-1.06
a5.5 5.5 0 0 0 0-7.78
z">
</path>

</svg>

</button>



<button>


<svg 
class="comment-icon" 
viewBox="0 0 24 24" 
xmlns="http://www.w3.org/2000/svg">

<path 
d="M20.5 11.5C20.5 15.64 16.69 19 12 19C10.9 19 9.84 18.8 8.88 18.45L4 20L5.45 15.95C4.55 14.65 4 13.1 4 11.5C4 7.36 7.81 4 12.5 4C17.19 4 20.5 7.36 20.5 11.5Z"

fill="none"

stroke="white"

stroke-width="1.8"

stroke-linecap="round"

stroke-linejoin="round"

/>


<path

d="M8 11.5H16"

fill="none"

stroke="white"

stroke-width="1.8"

stroke-linecap="round"

/>


</svg>
</button>



<button class="share">

<svg viewBox="0 0 24 24">
<path d="M18 8l4 4-4 4M22 12H9"/>
</svg>

</button>



<button class="bookmark">

<svg viewBox="0 0 24 24">
<path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4z"/>
</svg>

</button>


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
// SEARCH
// ==========================================

const searchBox = document.getElementById("search");

if(searchBox){

    let searchTimeout;

    searchBox.addEventListener("input",()=>{

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(()=>{

            const value = searchBox.value
            .trim()
            .toLowerCase();

            if(value===""){

                filteredArticles=[...allArticles];

            }

            else{

                filteredArticles = allArticles.filter(article=>{

                    return (

                        (article.title || "")
                        .toLowerCase()
                        .includes(value)

                        ||

                        (article.description || "")
                        .toLowerCase()
                        .includes(value)

                        ||

                        (article.category || "")
                        .toLowerCase()
                        .includes(value)

                    );

                });

            }

            resetFeed();

        },300);

    });

}



// ==========================================
// CATEGORY FILTER
// ==========================================

const buttons =
document.querySelectorAll(".categories button");

buttons.forEach(button=>{

    button.addEventListener("click",()=>{

        buttons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const category = button.dataset.category;

        if(category==="All"){

            filteredArticles=[...allArticles];

        }

        else{

            filteredArticles = allArticles.filter(article=>{

                return article.category===category;

            });

        }

        resetFeed();

    });

});



// ==========================================
// REMOVE DUPLICATES
// ==========================================

function removeDuplicates(){

    const map=new Map();

    allArticles.forEach(article=>{

        const key=

        article.id ||

        article.url ||

        article.title;

        if(!map.has(key)){

            map.set(key,article);

        }

    });

    allArticles=[...map.values()];

}

removeDuplicates();



// ==========================================
// READ MORE
// ==========================================

feed.addEventListener("click",(e)=>{

    const button=e.target.closest(".read-more");

    if(!button) return;

    const url=button.dataset.url;

    if(url){

        window.open(url,"_blank");

    }

});



// ==========================================
// SHARE
// ==========================================

feed.addEventListener("click",async(e)=>{

    const share=e.target.closest(".share");

    if(!share) return;

    const url=share.dataset.url;

    const title=share.dataset.title;

    if(navigator.share){

        try{

            await navigator.share({

                title:title,

                url:url

            });

        }

        catch(err){

            console.log(err);

        }

    }

    else{

        navigator.clipboard.writeText(url);

        alert("Link copied");

    }

});



// ==========================================
// REFRESH FEED
// ==========================================

window.addEventListener("focus",()=>{

    if(searchBox){

        if(searchBox.value===""){

            filteredArticles=[...allArticles];

            resetFeed();

        }

    }

});

// ==========================================
// SKELETON LOADING
// ==========================================

function showSkeleton(count = 8){

    feed.innerHTML = "";

    for(let i=0;i<count;i++){

        const skeleton=document.createElement("div");

        skeleton.className="post skeleton";

        skeleton.innerHTML=`

            <div class="skeleton-image"></div>

            <div class="skeleton-body">

                <div class="skeleton-line short"></div>

                <div class="skeleton-line"></div>

                <div class="skeleton-line"></div>

                <div class="skeleton-line small"></div>

            </div>

        `;

        feed.appendChild(skeleton);

    }

}



// ==========================================
// HIDE SKELETON
// ==========================================

function hideSkeleton(){

    document
    .querySelectorAll(".skeleton")
    .forEach(card=>{

        card.remove();

    });

}



// ==========================================
// BETTER LOAD MORE
// ==========================================

const observer=new IntersectionObserver(entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            loadMorePosts();

        }

    });

},{
    rootMargin:"600px"
});



// ==========================================
// CREATE OBSERVER
// ==========================================

const loadTrigger=document.createElement("div");

loadTrigger.id="load-trigger";

document.body.appendChild(loadTrigger);

observer.observe(loadTrigger);



// ==========================================
// RETRY IMAGE
// ==========================================

document.addEventListener("error",(e)=>{

    if(e.target.tagName==="IMG"){

        e.target.src=FALLBACK_IMAGE;

    }

},true);



// ==========================================
// OPTIMIZE FEED
// ==========================================

function optimizeFeed(){

    const cards=
    document.querySelectorAll(".post");

    if(cards.length>300){

        for(

            let i=0;

            i<100;

            i++

        ){

            cards[i].remove();

        }

    }

}



// ==========================================
// AUTO CLEANUP
// ==========================================

setInterval(()=>{

    optimizeFeed();

},30000);

// ==========================================
// BOOKMARK SYSTEM
// ==========================================

const bookmarks = JSON.parse(
    localStorage.getItem("qrabes_bookmarks") || "[]"
);

feed.addEventListener("click",(e)=>{

    const btn=e.target.closest(".bookmark");

    if(!btn) return;

    const url=btn.dataset.url;

    if(!url) return;

    const index=bookmarks.indexOf(url);

    if(index===-1){

        bookmarks.push(url);

        btn.innerHTML="📌";

    }

    else{

        bookmarks.splice(index,1);

        btn.innerHTML="🔖";

    }

    localStorage.setItem(
        "qrabes_bookmarks",
        JSON.stringify(bookmarks)
    );

});



// ==========================================
// SCROLL POSITION
// ==========================================

window.addEventListener("scroll",()=>{

    localStorage.setItem(

        "feed_scroll",

        window.scrollY

    );

});



window.addEventListener("load",()=>{

    const pos=parseInt(

        localStorage.getItem("feed_scroll") || 0

    );

    setTimeout(()=>{

        window.scrollTo({

            top:pos,

            behavior:"instant"

        });

    },500);

});



// ==========================================
// SAVE CACHE
// ==========================================

function saveFeedCache(){

    localStorage.setItem(

        "feed_cache",

        JSON.stringify(allArticles)

    );

}



// ==========================================
// LOAD CACHE
// ==========================================

function loadFeedCache(){

    const cache=

    localStorage.getItem("feed_cache");

    if(cache){

        try{

            allArticles=

            JSON.parse(cache);

            filteredArticles=[...allArticles];

            resetFeed();

        }

        catch(e){

            console.log(e);

        }

    }

}



// ==========================================
// AUTO SAVE
// ==========================================

setInterval(()=>{

    saveFeedCache();

},10000);



// ==========================================
// NETWORK
// ==========================================

window.addEventListener("offline",()=>{

    alert("Offline Mode");

});



window.addEventListener("online",()=>{

    fetchArticles();

});



// ==========================================
// IMAGE PRELOAD
// ==========================================

function preloadImages(){

    filteredArticles

    .slice(0,20)

    .forEach(article=>{

        const img=new Image();

        img.src=

        article.image ||

        FALLBACK_IMAGE;

    });

}



// ==========================================
// AUTO REFRESH
// ==========================================

setInterval(()=>{

    fetchArticles();

},300000);



// ==========================================
// STARTUP
// ==========================================

loadFeedCache();

preloadImages();

// ==========================================
// START
// ==========================================

fetchArticles();
