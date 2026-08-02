// ==========================================
// QRABES ADMIN POSTS
// data/user_posts.json → HOME FEED
// ==========================================

console.log("ADMIN-POSTS.JS LOADED");

async function loadAdminPosts() {

    const feed = document.getElementById("feed");

    if (!feed) {

        console.error("FEED ELEMENT NOT FOUND");

        return;

    }


    try {

        console.log(
            "Loading: ./data/user_posts.json"
        );


        const response = await fetch(
            "./data/user_posts.json?cache=" + Date.now()
        );


        console.log(
            "JSON RESPONSE:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "user_posts.json not found"
            );

        }


        const data = await response.json();


        console.log(
            "USER POSTS DATA:",
            data
        );


        // ==================================
        // ONLY PUBLISHED POSTS
        // ==================================

        const posts = data.filter(post => {

            return post &&
                   post.title &&
                   post.image &&
                   post.status === "publish";

        });


        console.log(
            "PUBLISHED POSTS:",
            posts
        );


        // ==================================
        // CREATE CARDS
        // ==================================

        posts.forEach(post => {

            const card =
                document.createElement("article");


            card.className =
                "post";


            const image =
                post.image &&
                post.image.trim() !== ""

                    ? post.image

                    : "https://placehold.co/900x700/111111/FFFFFF?text=QRABES";


            card.innerHTML = `

                <div class="post-image">

                    <img
                        src="${image}"
                        alt="${post.title || "QRABES"}"
                        loading="lazy"
                        decoding="async"
                    >

                </div>


                <div class="post-body">

                    <h2>
                        ${post.title || "QRABES"}
                    </h2>


                    <p>
                        ${(post.description || "")
                            .substring(0, 160)}
                    </p>


                    <div class="actions">

                        <button class="like-btn">

                            ❤️

                        </button>


                        <button>

                            💬

                        </button>


                        <button>

                            ↗

                        </button>

                    </div>


                    <div class="source">

                        ${post.author || "QRABES"}

                    </div>

                </div>

            `;


            feed.appendChild(card);

        });


        console.log(
            "ADMIN POSTS RENDERED:",
            posts.length
        );

    }


    catch(error) {

        console.error(
            "ADMIN POSTS ERROR:",
            error
        );

    }

}


// ==========================================
// START
// ==========================================

loadAdminPosts();
