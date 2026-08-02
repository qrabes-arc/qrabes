// ==========================================
// QRABES USER POSTS
// Loads data/user_posts.json
// ==========================================

const userPostsFeed = document.getElementById("user-posts-feed");

const USER_POSTS_URL =
    "./data/user_posts.json?cache=" + Date.now();

const USER_FALLBACK_IMAGE =
    "https://placehold.co/900x700/111111/FFFFFF?text=QRABES";


// ==========================================
// FETCH USER POSTS
// ==========================================

async function fetchUserPosts() {

    if (!userPostsFeed) {
        console.error("user-posts-feed not found");
        return;
    }

    try {

        const response = await fetch(USER_POSTS_URL);

        if (!response.ok) {
            throw new Error("Unable to load user_posts.json");
        }

        const data = await response.json();

        // Only published posts
        const posts = data.filter(post => {

            return post &&
                   post.title &&
                   post.image &&
                   post.status === "publish";

        });

        renderUserPosts(posts);

    }

    catch (error) {

        console.error(
            "User Posts Error:",
            error
        );

    }

}


// ==========================================
// RENDER USER POSTS
// ==========================================

function renderUserPosts(posts) {

    userPostsFeed.innerHTML = "";

    posts.forEach(post => {

        createUserPostCard(post);

    });

}


// ==========================================
// CREATE USER POST CARD
// ==========================================

function createUserPostCard(post) {

    const card = document.createElement("article");

    card.className = "post user-post";

    const image =
        post.image &&
        post.image.trim() !== ""
            ? post.image
            : USER_FALLBACK_IMAGE;

    const description =
        (post.description || "")
        .substring(0, 160);

    card.innerHTML = `

        <div class="post-image">

            <img
                src="${image}"
                alt="${post.title || "QRABES"}"
                loading="lazy"
                decoding="async"
                onerror="this.src='${USER_FALLBACK_IMAGE}'"
            >

        </div>


        <div class="post-body">

            <h2>
                ${post.title || "QRABES"}
            </h2>

            <p>
                ${description}
            </p>


            <div class="actions">

                <button class="user-like-btn">

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
                    >

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
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <path
                            d="M21 11.2C21 15.75 17.1 19.5 12.2 19.5C11.15 19.5 10.15 19.32 9.2 18.98L4 21L5.55 16.55C4.55 15.05 4 13.25 4 11.2C4 6.75 7.9 3.5 12.8 3.5C17.7 3.5 21 6.75 21 11.2Z"
                            fill="none"
                            stroke="white"
                            stroke-width="1.7"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />

                    </svg>

                </button>


                <button class="user-share-btn">

                    <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >

                        <circle
                            cx="18"
                            cy="5"
                            r="2.5"
                            fill="none"
                            stroke="white"
                            stroke-width="1.8"
                        />

                        <circle
                            cx="6"
                            cy="12"
                            r="2.5"
                            fill="none"
                            stroke="white"
                            stroke-width="1.8"
                        />

                        <circle
                            cx="18"
                            cy="19"
                            r="2.5"
                            fill="none"
                            stroke="white"
                            stroke-width="1.8"
                        />

                        <path
                            d="M8.3 10.8L15.7 6.2"
                            fill="none"
                            stroke="white"
                            stroke-width="1.8"
                            stroke-linecap="round"
                        />

                        <path
                            d="M8.3 13.2L15.7 17.8"
                            fill="none"
                            stroke="white"
                            stroke-width="1.8"
                            stroke-linecap="round"
                        />

                    </svg>

                </button>

            </div>


            <div class="source">

                ${post.author || "QRABES"}

            </div>

        </div>

    `;


    userPostsFeed.appendChild(card);

}


// ==========================================
// START
// ==========================================

fetchUserPosts();
