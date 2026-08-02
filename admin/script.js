alert("SCRIPT JS LOADED");

// =====================================
// QRABES CMS
// admin/script.js
// =====================================

// =====================================
// SUPABASE CONFIG
// =====================================

const SUPABASE_URL =
    "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_l2J49vtmNJW8bp6KZp4img_UX-QyiQ_";


// =====================================
// SUPABASE CLIENT
// =====================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// =====================================
// DOM ELEMENTS
// =====================================

const imageInput =
    document.getElementById("image");

const preview =
    document.getElementById("preview");

const publishBtn =
    document.getElementById("publishBtn");

const message =
    document.getElementById("message");

const postsContainer =
    document.getElementById("postsContainer");


// =====================================
// HTML ESCAPE
// =====================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================
// IMAGE PREVIEW
// =====================================

if (imageInput && preview) {

    imageInput.addEventListener("change", function () {

        const file =
            imageInput.files &&
            imageInput.files[0];

        if (!file) {

            preview.src = "";
            preview.style.display = "none";

            return;

        }

        preview.src =
            URL.createObjectURL(file);

        preview.style.display =
            "block";

    });

}


// =====================================
// UPLOAD IMAGE
// =====================================

async function uploadImage(file) {

    if (!file) {

        throw new Error(
            "Please select an image."
        );

    }

    const extension =
        file.name.includes(".")
            ? file.name
                .split(".")
                .pop()
                .toLowerCase()
            : "jpg";


    const filename =
        "post_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8) +
        "." +
        extension;


    console.log(
        "Uploading image:",
        filename
    );


    const uploadResult =
        await supabaseClient
            .storage
            .from("image_posts")
            .upload(
                filename,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (uploadResult.error) {

        throw new Error(
            "Supabase image upload failed: " +
            uploadResult.error.message
        );

    }


    const publicResult =
        supabaseClient
            .storage
            .from("image_posts")
            .getPublicUrl(filename);


    if (
        !publicResult.data ||
        !publicResult.data.publicUrl
    ) {

        throw new Error(
            "Could not create public image URL."
        );

    }


    console.log(
        "Image uploaded:",
        publicResult.data.publicUrl
    );


    return publicResult.data.publicUrl;

}


// =====================================
// PUBLISH POST
// =====================================

async function publishPost() {

    console.log(
        "Publish button clicked."
    );


    if (!imageInput) {

        alert(
            "Image input not found."
        );

        return;

    }


    const file =
        imageInput.files &&
        imageInput.files[0];


    const titleElement =
        document.getElementById("title");

    const descriptionElement =
        document.getElementById("description");

    const categoryElement =
        document.getElementById("category");

    const authorElement =
        document.getElementById("author");

    const tagsElement =
        document.getElementById("tags");

    const featuredElement =
        document.getElementById("featured");

    const trendingElement =
        document.getElementById("trending");

    const statusElement =
        document.getElementById("status");


    const title =
        titleElement
            ? titleElement.value.trim()
            : "";

    const description =
        descriptionElement
            ? descriptionElement.value.trim()
            : "";

    const category =
        categoryElement
            ? categoryElement.value
            : "";

    const author =
        authorElement
            ? authorElement.value.trim()
            : "";

    const tags =
        tagsElement
            ? tagsElement.value
                .split(",")
                .map(function (tag) {
                    return tag.trim();
                })
                .filter(Boolean)
            : [];

    const featured =
        featuredElement
            ? featuredElement.checked
            : false;

    const trending =
        trendingElement
            ? trendingElement.checked
            : false;

    const status =
        statusElement
            ? statusElement.value
            : "publish";


    // =================================
    // VALIDATION
    // =================================

    if (!file) {

        alert(
            "Please select a cover image."
        );

        return;

    }


    if (!title) {

        alert(
            "Please enter a title."
        );

        return;

    }


    if (!description) {

        alert(
            "Please enter a description."
        );

        return;

    }


    // =================================
    // BUTTON STATE
    // =================================

    if (publishBtn) {

        publishBtn.disabled = true;

        publishBtn.innerText =
            "Uploading Image...";

    }


    try {

        // =================================
        // 1. UPLOAD IMAGE
        // =================================

        const imageUrl =
            await uploadImage(file);


        // =================================
        // 2. CREATE POST
        // =================================

        const post = {

            title: title,

            description: description,

            image: imageUrl,

            category: category,

            author:
                author || "QRABES",

            tags: tags,

            featured: featured,

            trending: trending,

            status:
                status || "publish",

            likes: 0,

            comments: 0,

            shares: 0,

            views: 0,

            published_at:
                new Date().toISOString()

        };


        console.log(
            "Sending post:",
            post
        );


        // =================================
        // 3. SEND TO VERCEL API
        // =================================

        if (publishBtn) {

            publishBtn.innerText =
                "Publishing...";

        }


        const response =
            await fetch(
                "/api/publish",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(post)

                }
            );


        const responseText =
            await response.text();


        let result = {};

        try {

            result =
                JSON.parse(responseText);

        } catch {

            result = {
                raw: responseText
            };

        }


        console.log(
            "Publish API response:",
            result
        );


        // =================================
        // API ERROR
        // =================================

        if (!response.ok) {

            let errorMessage =
                "Publish failed.";

            if (
                result &&
                typeof result.error === "string"
            ) {

                errorMessage =
                    result.error;

            } else if (
                result &&
                result.error
            ) {

                errorMessage =
                    JSON.stringify(
                        result.error
                    );

            } else if (
                result &&
                result.raw
            ) {

                errorMessage =
                    result.raw;

            }


            throw new Error(
                errorMessage
            );

        }


        // =================================
        // SUCCESS
        // =================================

        console.log(
            "Post published successfully:",
            result
        );


        if (message) {

            message.classList.remove(
                "hidden"
            );

            message.innerText =
                "✅ Post Published Successfully";

        } else {

            alert(
                "✅ Post Published Successfully"
            );

        }


        // =================================
        // RESET FORM
        // =================================

        if (titleElement) {
            titleElement.value = "";
        }

        if (descriptionElement) {
            descriptionElement.value = "";
        }

        if (categoryElement) {
            categoryElement.value = "";
        }

        if (authorElement) {
            authorElement.value = "";
        }

        if (tagsElement) {
            tagsElement.value = "";
        }

        if (featuredElement) {
            featuredElement.checked = false;
        }

        if (trendingElement) {
            trendingElement.checked = false;
        }

        if (statusElement) {
            statusElement.value = "publish";
        }

        imageInput.value = "";


        if (preview) {

            preview.src = "";

            preview.style.display =
                "none";

        }


        // =================================
        // REFRESH POSTS
        // =================================

        await loadRecentPosts();


        if (message) {

            setTimeout(function () {

                message.classList.add(
                    "hidden"
                );

            }, 3000);

        }


    } catch (error) {

        console.error(
            "PUBLISH ERROR:",
            error
        );


        alert(
            "❌ " +
            (
                error.message ||
                "Something went wrong."
            )
        );


    } finally {

        if (publishBtn) {

            publishBtn.disabled =
                false;

            publishBtn.innerText =
                "🚀 Publish Post";

        }

    }

}


// =====================================
// BUTTON EVENT
// =====================================

if (publishBtn) {

    console.log(
        "Publish button found."
    );


    publishBtn.addEventListener(
        "click",
        publishPost
    );

} else {

    console.error(
        "Publish button NOT found."
    );

}


// =====================================
// LOAD RECENT POSTS
// =====================================

async function loadRecentPosts() {

    if (!postsContainer) {

        return;

    }


    postsContainer.innerHTML = `

        <div class="bg-[#181818]
                    border border-gray-700
                    rounded-2xl
                    p-5
                    text-center">

            <p class="text-gray-400">
                Loading posts...
            </p>

        </div>

    `;


    try {

        const response =
            await fetch(
                "/data/user_posts.json?t=" +
                Date.now()
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load posts (" +
                response.status +
                ")"
            );

        }


        const posts =
            await response.json();


        if (
            !Array.isArray(posts) ||
            posts.length === 0
        ) {

            postsContainer.innerHTML = `

                <div class="bg-[#181818]
                            border border-gray-700
                            rounded-2xl
                            p-5">

                    <h3 class="text-lg font-semibold">
                        No Posts Yet
                    </h3>

                    <p class="text-gray-400 mt-2">
                        Published posts will appear here.
                    </p>

                </div>

            `;

            return;

        }


        postsContainer.innerHTML = "";


        posts
            .slice(0, 20)
            .forEach(function (post) {

                const card =
                    document.createElement("div");


                card.className =
                    "bg-[#181818] border border-gray-700 rounded-2xl p-5";


                let formattedDate =
                    "Unknown date";


                if (post.published_at) {

                    const date =
                        new Date(
                            post.published_at
                        );


                    if (
                        !isNaN(
                            date.getTime()
                        )
                    ) {

                        formattedDate =
                            date.toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric"
                                }
                            );

                    }

                }


                let tagsHTML = "";


                if (
                    Array.isArray(post.tags) &&
                    post.tags.length
                ) {

                    tagsHTML =
                        post.tags
                            .map(function (tag) {

                                return `
                                    <span
                                        class="inline-block
                                               bg-[#252525]
                                               text-gray-300
                                               text-xs
                                               px-3
                                               py-1
                                               rounded-full
                                               mr-1
                                               mb-1">

                                        #${escapeHTML(tag)}

                                    </span>
                                `;

                            })
                            .join("");

                }


                const featuredHTML =
                    post.featured
                        ? `
                            <span
                                class="text-xs
                                       bg-yellow-500
                                       text-black
                                       px-2
                                       py-1
                                       rounded-full
                                       font-semibold">

                                ⭐ Featured

                            </span>
                        `
                        : "";


                const trendingHTML =
                    post.trending
                        ? `
                            <span
                                class="text-xs
                                       bg-red-500
                                       text-white
                                       px-2
                                       py-1
                                       rounded-full
                                       font-semibold">

                                🔥 Trending

                            </span>
                        `
                        : "";


                card.innerHTML = `

                    <div
                        class="flex
                               flex-col
                               md:flex-row
                               gap-5">

                        <div
                            class="w-full
                                   md:w-48
                                   h-40
                                   flex-shrink-0">

                            <img
                                src="${escapeHTML(
                                    post.image || ""
                                )}"
                                alt="${escapeHTML(
                                    post.title || "Post"
                                )}"
                                class="w-full
                                       h-full
                                       object-cover
                                       rounded-xl
                                       border
                                       border-gray-700"
                                loading="lazy"
                                onerror="this.style.display='none'"
                            >

                        </div>


                        <div class="flex-1">

                            <div
                                class="flex
                                       flex-wrap
                                       gap-2
                                       mb-3">

                                ${featuredHTML}

                                ${trendingHTML}

                                ${
                                    post.category
                                        ? `
                                            <span
                                                class="text-xs
                                                       bg-[#252525]
                                                       text-gray-300
                                                       px-2
                                                       py-1
                                                       rounded-full">

                                                ${escapeHTML(
                                                    post.category
                                                )}

                                            </span>
                                        `
                                        : ""
                                }

                            </div>


                            <h3
                                class="text-xl
                                       font-semibold
                                       text-white">

                                ${escapeHTML(
                                    post.title ||
                                    "Untitled Post"
                                )}

                            </h3>


                            <p
                                class="text-gray-400
                                       mt-2
                                       line-clamp-3">

                                ${escapeHTML(
                                    post.description || ""
                                )}

                            </p>


                            <div
                                class="flex
                                       flex-wrap
                                       gap-3
                                       text-sm
                                       text-gray-500
                                       mt-4">

                                <span>
                                    👤
                                    ${escapeHTML(
                                        post.author ||
                                        "QRABES"
                                    )}
                                </span>

                                <span>
                                    📅
                                    ${formattedDate}
                                </span>

                                <span>
                                    ❤️
                                    ${Number(
                                        post.likes || 0
                                    )}
                                </span>

                                <span>
                                    👁️
                                    ${Number(
                                        post.views || 0
                                    )}
                                </span>

                            </div>


                            <div class="mt-4">
                                ${tagsHTML}
                            </div>

                        </div>

                    </div>

                `;


                postsContainer.appendChild(
                    card
                );

            });


    } catch (error) {

        console.error(
            "RECENT POSTS ERROR:",
            error
        );


        postsContainer.innerHTML = `

            <div
                class="bg-[#181818]
                       border
                       border-red-900
                       rounded-2xl
                       p-5">

                <h3
                    class="text-lg
                           font-semibold
                           text-red-400">

                    Failed to Load Posts

                </h3>

                <p
                    class="text-gray-400
                           mt-2">

                    ${escapeHTML(
                        error.message
                    )}

                </p>

                <button
                    id="retryPosts"
                    class="mt-4
                           px-4
                           py-2
                           bg-[#D4AF37]
                           text-black
                           rounded-lg
                           font-semibold">

                    Retry

                </button>

            </div>

        `;


        const retryButton =
            document.getElementById(
                "retryPosts"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadRecentPosts
            );

        }

    }

}


// =====================================
// INITIAL LOAD
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "QRABES CMS initialized."
        );

        loadRecentPosts();

    }
);
