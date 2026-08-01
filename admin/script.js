// =====================================
// QRABES CMS
// Part 1
// =====================================

// ---------------------------
// Supabase Config
// ---------------------------

const SUPABASE_URL =
"https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY2p1d2JleXJkcmdmb2VqYWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyMTYzMTksImV4cCI6MjEwMDc5MjMxOX0.oTHDKWrHJWQf-OrNsWxnL4U8ouZa16bPmCWeNL_L_CE";

// ---------------------------
// Client
// ---------------------------

const supabase =
window.supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

// ---------------------------
// Elements
// ---------------------------

const imageInput =
document.getElementById("image");

const preview =
document.getElementById("preview");

const publishBtn =
document.getElementById("publishBtn");

const message =
document.getElementById("message");

// ---------------------------
// Preview
// ---------------------------

imageInput.addEventListener("change", () => {

const file = imageInput.files[0];

if(!file){

preview.style.display="none";

return;

}

preview.src =
URL.createObjectURL(file);

preview.style.display="block";

});

// ---------------------------
// Upload Image
// ---------------------------

async function uploadImage(file){

const extension =
file.name.split(".").pop();

const filename =
"post_" +
Date.now() +
"." +
extension;

const { error } =
await supabase.storage
.from("posts")
.upload(filename,file);

if(error){

throw new Error(error.message);

}

const { data } =
supabase.storage
.from("posts")
.getPublicUrl(filename);

return data.publicUrl;

}

// ---------------------------
// Publish
// ---------------------------

publishBtn.addEventListener(
"click",
publishPost
);

async function publishPost(){

const file =
imageInput.files[0];

const title =
document.getElementById("title")
.value.trim();

const description =
document.getElementById("description")
.value.trim();

const category =
document.getElementById("category")
.value;

const author =
document.getElementById("author")
.value.trim();

const tags =
document.getElementById("tags")
.value
.split(",")
.map(tag=>tag.trim())
.filter(Boolean);

const featured =
document.getElementById("featured")
.checked;

const trending =
document.getElementById("trending")
.checked;

const status =
document.getElementById("status")
.value;

// Validation

if(!file){

alert("Select image");

return;

}

if(!title){

alert("Enter title");

return;

}

if(!description){

alert("Enter description");

return;

}

publishBtn.disabled=true;

publishBtn.innerText="Uploading...";

try{

// upload image

const imageUrl =
await uploadImage(file);
// ===============================
// Publish Button
// ===============================

const publishBtn = document.getElementById("publishBtn");
const message = document.getElementById("message");

publishBtn.addEventListener("click", async () => {

    const file = imageInput.files[0];

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const author = document.getElementById("author").value.trim();
    const tags = document.getElementById("tags").value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

    const featured = document.getElementById("featured").checked;
    const trending = document.getElementById("trending").checked;
    const status = document.getElementById("status").value;

    // Validation

    if (!file) {
        alert("Please select an image.");
        return;
    }

    if (!title) {
        alert("Please enter title.");
        return;
    }

    if (!description) {
        alert("Please enter description.");
        return;
    }

    publishBtn.disabled = true;
    publishBtn.innerText = "Uploading Image...";

    // Upload image to Supabase

    const upload = await uploadImage(file);

    if (!upload) {

        publishBtn.disabled = false;
        publishBtn.innerText = "🚀 Publish Post";
        return;

    }

    publishBtn.innerText = "Publishing...";

    // Post Object

    const post = {

        title,
        description,
        image: upload.imageUrl,
        category,
        author,
        tags,
        featured,
        trending,
        status,

        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,

        published_at: new Date().toISOString()

    };

    try {

        const response = await fetch("/api/publish", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(post)

        });

        const result = await response.json();

if (!response.ok) {

    throw new Error(result.error || "Publish Failed");

}

// Success message

message.classList.remove("hidden");

message.innerText = "✅ Post Published Successfully";

// Refresh Recent Posts

await loadRecentPosts();

setTimeout(() => {

    message.classList.add("hidden");

}, 3000);

// Reset Form

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "";
        document.getElementById("author").value = "";
        document.getElementById("tags").value = "";

        document.getElementById("featured").checked = false;
        document.getElementById("trending").checked = false;
        document.getElementById("status").value = "publish";

        imageInput.value = "";

        preview.src = "";
        preview.style.display = "none";

    } catch (err) {

        alert(err.message);

    }

    publishBtn.disabled = false;
    publishBtn.innerText = "🚀 Publish Post";

});

// ===============================
// PART 3
// RECENT POSTS
// ===============================

async function loadRecentPosts() {

    const postsContainer =
        document.getElementById("postsContainer");

    if (!postsContainer) return;

    // Loading state

    postsContainer.innerHTML = `
        <div class="bg-[#181818] border border-gray-700 rounded-2xl p-5 text-center">
            <p class="text-gray-400">
                Loading posts...
            </p>
        </div>
    `;

    try {

        // Add timestamp to prevent old cached JSON

        const response = await fetch(
            `/user_posts.json?t=${Date.now()}`
        );

        if (!response.ok) {

            throw new Error(
                `Failed to load posts (${response.status})`
            );

        }

        const posts = await response.json();

        // No posts

        if (!Array.isArray(posts) || posts.length === 0) {

            postsContainer.innerHTML = `
                <div class="bg-[#181818] border border-gray-700 rounded-2xl p-5">
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

        // Clear container

        postsContainer.innerHTML = "";

        // Show latest first

        posts.slice(0, 20).forEach(post => {

            const card =
                document.createElement("div");

            card.className =
                "bg-[#181818] border border-gray-700 rounded-2xl p-5";

            // Date

            let formattedDate = "Unknown date";

            if (post.published_at) {

                const date =
                    new Date(post.published_at);

                if (!isNaN(date.getTime())) {

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

            // Tags

            let tagsHTML = "";

            if (
                Array.isArray(post.tags) &&
                post.tags.length
            ) {

                tagsHTML = post.tags
                    .map(tag => `
                        <span class="inline-block bg-[#252525] text-gray-300 text-xs px-3 py-1 rounded-full mr-1 mb-1">
                            #${escapeHTML(tag)}
                        </span>
                    `)
                    .join("");

            }

            // Featured

            const featuredHTML =
                post.featured
                    ? `
                        <span class="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold">
                            ⭐ Featured
                        </span>
                    `
                    : "";

            // Trending

            const trendingHTML =
                post.trending
                    ? `
                        <span class="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-semibold">
                            🔥 Trending
                        </span>
                    `
                    : "";

            card.innerHTML = `

                <div class="flex flex-col md:flex-row gap-5">

                    <!-- Image -->

                    <div class="w-full md:w-48 h-40 flex-shrink-0">

                        <img
                            src="${escapeHTML(post.image || "")}"
                            alt="${escapeHTML(post.title || "Post")}"
                            class="w-full h-full object-cover rounded-xl border border-gray-700"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        >

                    </div>


                    <!-- Content -->

                    <div class="flex-1">

                        <div class="flex flex-wrap gap-2 mb-3">

                            ${featuredHTML}

                            ${trendingHTML}

                            ${
                                post.category
                                    ? `
                                        <span class="text-xs bg-[#252525] text-gray-300 px-2 py-1 rounded-full">
                                            ${escapeHTML(post.category)}
                                        </span>
                                    `
                                    : ""
                            }

                        </div>


                        <h3 class="text-xl font-semibold text-white">

                            ${escapeHTML(
                                post.title || "Untitled Post"
                            )}

                        </h3>


                        <p class="text-gray-400 mt-2 line-clamp-3">

                            ${escapeHTML(
                                post.description || ""
                            )}

                        </p>


                        <div class="flex flex-wrap gap-3 text-sm text-gray-500 mt-4">

                            <span>
                                👤 ${escapeHTML(
                                    post.author || "QRABES"
                                )}
                            </span>

                            <span>
                                📅 ${formattedDate}
                            </span>

                            <span>
                                ❤️ ${Number(post.likes || 0)}
                            </span>

                            <span>
                                👁️ ${Number(post.views || 0)}
                            </span>

                        </div>


                        <div class="mt-4">

                            ${tagsHTML}

                        </div>

                    </div>

                </div>

            `;

            postsContainer.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Recent Posts Error:",
            error
        );

        postsContainer.innerHTML = `

            <div class="bg-[#181818] border border-red-900 rounded-2xl p-5">

                <h3 class="text-lg font-semibold text-red-400">

                    Failed to Load Posts

                </h3>

                <p class="text-gray-400 mt-2">

                    ${escapeHTML(error.message)}

                </p>

                <button
                    id="retryPosts"
                    class="mt-4 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold">

                    Retry

                </button>

            </div>

        `;

        const retryButton =
            document.getElementById("retryPosts");

        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadRecentPosts
            );

        }

    }

}


// ===============================
// HTML SAFETY
// ===============================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// LOAD POSTS WHEN ADMIN OPENS
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadRecentPosts();

    }
);
