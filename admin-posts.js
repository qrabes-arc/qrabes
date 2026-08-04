console.log("ADMIN-POSTS.JS LOADED");

async function loadAdminPosts() {

    const feed = document.getElementById("feed");

    if (!feed) {
        console.error("FEED ELEMENT NOT FOUND");
        return;
    }

    try {

        const response = await fetch(
            "https://raw.githubusercontent.com/qrabes-arc/qrabes/refs/heads/main/data/user_posts.json?cache=" + Date.now()
        );

        console.log("JSON RESPONSE:", response.status);

        if (!response.ok) {
            throw new Error("user_posts.json not found");
        }

        const data = await response.json();

        console.log("USER POSTS DATA:", data);

        const posts = data.filter(post => {

            return post &&
                   post.title &&
                   post.image &&
                   post.status === "publish";

        });

        console.log("PUBLISHED POSTS:", posts);

        posts.forEach(post => {

            const card = document.createElement("article");

            card.className = "post";

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

                    ${
                        post.description
                            ? `
                                <p>
                                    ${post.description.substring(0, 160)}
                                </p>
                              `
                            : ""
                    }

                    <div class="actions">

                        <button
                            class="like-btn"
                            type="button"
                            aria-label="Like post"
                            title="Like"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >

                                <path
                                    d="M20.8 8.6
                                       C20.8 5.7 18.7 3.5 15.9 3.5
                                       C14.3 3.5 12.9 4.3 12 5.5
                                       C11.1 4.3 9.7 3.5 8.1 3.5
                                       C5.3 3.5 3.2 5.7 3.2 8.6
                                       C3.2 13.7 8.3 17.1 12 20.5
                                       C15.7 17.1 20.8 13.7 20.8 8.6Z"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                            </svg>

                        </button>

                        <button
                            class="comment-btn"
                            type="button"
                            aria-label="Comment"
                            title="Comment"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >

                                <path
                                    d="M20 11.5
                                       C20 15.9 16.4 19 12 19
                                       C10.8 19 9.6 18.8 8.6 18.3
                                       L4 20
                                       L5.2 16.2
                                       C4.4 15 4 13.7 4 11.5
                                       C4 7.1 7.6 4 12 4
                                       C16.4 4 20 7.1 20 11.5Z"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                            </svg>

                        </button>

                        <button
                            class="share-btn"
                            type="button"
                            aria-label="Share post"
                            title="Share"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >

                                <path
                                    d="M12 16V4"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                />

                                <path
                                    d="M7.5 8.5L12 4L16.5 8.5"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                                <path
                                    d="M5 13.5V18
                                       C5 19.1 5.9 20 7 20
                                       H17
                                       C18.1 20 19 19.1 19 18
                                       V13.5"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />

                            </svg>

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

    } catch(error) {

        console.error(
            "ADMIN POSTS ERROR:",
            error
        );

    }

}

loadAdminPosts();
