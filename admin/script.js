// =====================================
// QRABES CMS
// FINAL admin/script.js
// =====================================


// =====================================
// SUPABASE CONFIG
// =====================================

const SUPABASE_URL =
    "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY2p1d2JleXJkcmdmb2VqYWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzMTksImV4cCI6MjEwMDc5MjMxOX0.oTHDKWrHJWQf-OrNsWxnL4U8ouZa16bPmCWeNL_L_CE";


// =====================================
// SUPABASE CLIENT
// =====================================

const supabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// =====================================
// ELEMENTS
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
// IMAGE PREVIEW
// =====================================

if (imageInput) {

    imageInput.addEventListener("change", () => {

        const file =
            imageInput.files[0];

        if (!file) {

            preview.style.display = "none";
            preview.src = "";

            return;

        }

        preview.src =
            URL.createObjectURL(file);

        preview.style.display =
            "block";

    });

}


// =====================================
// UPLOAD IMAGE TO SUPABASE
// =====================================

async function uploadImage(file) {

    if (!file) {

        throw new Error(
            "No image selected."
        );

    }


    // File extension

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    // Unique filename

    const filename =
        "post_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8) +
        "." +
        extension;


    // Upload to Supabase Storage

    const { error } =
        await supabase
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


    if (error) {

        throw new Error(
            "Image upload failed: " +
            error.message
        );

    }


    // Get public URL

    const { data } =
        supabase
            .storage
            .from("image_posts")
            .getPublicUrl(filename);


    if (!data || !data.publicUrl) {

        throw new Error(
            "Could not create image URL."
        );

    }


    // IMPORTANT:
    // Direct URL return hoga

    return data.publicUrl;

}


// =====================================
// PUBLISH BUTTON
// =====================================

if (publishBtn) {

    publishBtn.addEventListener(
        "click",
        publishPost
    );

}


// =====================================
// PUBLISH POST
// =====================================

async function publishPost() {

    const file =
        imageInput.files[0];


    const title =
        document
            .getElementById("title")
            .value
            .trim();


    const description =
        document
            .getElementById("description")
            .value
            .trim();


    const category =
        document
            .getElementById("category")
            .value;


    const author =
        document
            .getElementById("author")
            .value
            .trim();


    const tags =
        document
            .getElementById("tags")
            .value
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);


    const featured =
        document
            .getElementById("featured")
            .checked;


    const trending =
        document
            .getElementById("trending")
            .checked;


    const status =
        document
            .getElementById("status")
            .value;


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
    // DISABLE BUTTON
    // =================================

    publishBtn.disabled = true;

    publishBtn.innerText =
        "Uploading Image...";


    try {


        // =================================
        // 1. UPLOAD IMAGE
        // =================================

        const imageUrl =
            await uploadImage(file);


        console.log(
            "Supabase Image URL:",
            imageUrl
        );


        // =================================
        // 2. CREATE POST OBJECT
        // =================================

        const post = {

            title: title,

            description: description,

            image: imageUrl,

            category: category || "",

            author:
                author || "QRABES",

            tags: tags,

            featured:
                featured,

            trending:
                trending,

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
            "Post Data:",
            post
        );


        // =================================
        // 3. SEND TO VERCEL API
        // =================================

        publishBtn.innerText =
            "Publishing...";


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


        // Try to read JSON response

        let result = {};

        try {

            result =
                await response.json();

        } catch {

            result = {};

        }


        // =================================
        // API ERROR
        // =================================

        if (!response.ok) {

            let errorMessage =
                "Publish failed.";

            if (
                typeof result.error ===
                "string"
            ) {

                errorMessage =
                    result.error;

            } else if (
                result.error
            ) {

                errorMessage =
                    JSON.stringify(
                        result.error
                    );

            }


            throw new Error(
                errorMessage
            );

        }


        // =================================
        // SUCCESS
        // =================================

        console.log(
            "Publish Result:",
            result
        );


        message.classList.remove(
            "hidden"
        );

        message.innerText =
            "✅ Post Published Successfully";


        // =================================
        // RESET FORM
        // =================================

        document
            .getElementById("title")
            .value = "";


        document
            .getElementById("description")
            .value = "";


        document
            .getElementById("category")
            .value = "";


        document
            .getElementById("author")
            .value = "";


        document
            .getElementById("tags")
            .value = "";


        document
            .getElementById("featured")
            .checked = false;


        document
            .getElementById("trending")
            .checked = false;


        document
            .getElementById("status")
            .value = "publish";


        imageInput.value = "";


        preview.src = "";

        preview.style.display =
            "none";


        // =================================
        // REFRESH POSTS
        // =================================

        await loadRecentPosts();


        // =================================
        // HIDE SUCCESS MESSAGE
        // =================================

        setTimeout(() => {

            message.classList.add(
                "hidden"
            );

        }, 3000);


    } catch (error) {

        console.error(
            "Publish Error:",
            error
        );


        alert(
            error.message ||
            "Something went wrong."
        );


    } finally {

        publishBtn.disabled =
            false;

        publishBtn.innerText =
            "🚀 Publish Post";

    }

}


// =====================================
// RECENT POSTS
// =====================================

async function loadRecentPosts() {

    if (!postsContainer) {
        return;
    }


    // Loading

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


        // =================================
        // IMPORTANT
        // public → data
        // =================================

        const response =
            await fetch(
                `/data/user_posts.json?t=${Date.now()}`
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load posts (${response.status})`
            );

        }


        const posts =
            await response.json();


        // =================================
        // NO POSTS
        // =================================

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


        // Clear

        postsContainer.innerHTML =
            "";


        // =================================
        // LATEST 20 POSTS
        // =================================

        posts
            .slice(0, 20)
            .forEach(post => {


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "bg-[#181818] border border-gray-700 rounded-2xl p-5";


                // =================================
                // DATE
                // =================================

                let formattedDate =
                    "Unknown date";


                if (
                    post.published_at
                ) {

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


                // =================================
                // TAGS
                // =================================

                let tagsHTML =
                    "";


                if (
                    Array.isArray(
                        post.tags
                    ) &&
                    post.tags.length
                ) {

                    tagsHTML =
                        post.tags
                            .map(tag => `

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

                            `)
                            .join("");

                }


                // =================================
                // FEATURED
                // =================================

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


                // =================================
                // TRENDING
                // =================================

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


                // =================================
                // CARD
                // =================================

                card.innerHTML = `

                    <div
                        class="flex
                               flex-col
                               md:flex-row
                               gap-5">


                        <!-- IMAGE -->

                        <div
                            class="w-full
                                   md:w-48
                                   h-40
                                   flex-shrink-0">

                            <img
                                src="${escapeHTML(post.image || "")}"
                                alt="${escapeHTML(post.title || "Post")}"
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


                        <!-- CONTENT -->

                        <div
                            class="flex-1">


                            <!-- BADGES -->

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


                            <!-- TITLE -->

                            <h3
                                class="text-xl
                                       font-semibold
                                       text-white">

                                ${escapeHTML(
                                    post.title ||
                                    "Untitled Post"
                                )}

                            </h3>


                            <!-- DESCRIPTION -->

                            <p
                                class="text-gray-400
                                       mt-2
                                       line-clamp-3">

                                ${escapeHTML(
                                    post.description ||
                                    ""
                                )}

                            </p>


                            <!-- META -->

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
                                        post.likes ||
                                        0
                                    )}

                                </span>


                                <span>

                                    👁️
                                    ${Number(
                                        post.views ||
                                        0
                                    )}

                                </span>

                            </div>


                            <!-- TAGS -->

                            <div
                                class="mt-4">

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
            "Recent Posts Error:",
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
// HTML SAFETY
// =====================================

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================
// LOAD POSTS WHEN ADMIN OPENS
// =====================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadRecentPosts();

    }
);
