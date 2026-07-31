// ===============================
// QRABES CMS
// ===============================

// Apna Supabase Project URL
const SUPABASE_URL = "YOUR_SUPABASE_URL";

// Apni Supabase Anon Key
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Supabase Client
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ===============================
// Elements
// ===============================

const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

// ===============================
// Image Preview
// ===============================

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    preview.src = URL.createObjectURL(file);

    preview.style.display = "block";

});
// ===============================
// Upload Image to Supabase
// ===============================

async function uploadImage(file) {

    // Unique File Name

    const extension = file.name.split(".").pop();

    const fileName =
        "post_" +
        Date.now() +
        "." +
        extension;

    // Upload

    const { error } = await supabase
        .storage
        .from("posts")
        .upload(fileName, file);

    if (error) {

        alert(error.message);

        return null;

    }

    // Public URL

    const { data } = supabase
        .storage
        .from("posts")
        .getPublicUrl(fileName);

    return {

        fileName,

        imageUrl: data.publicUrl

    };

}
// ===============================
// Publish Button
// ===============================

const publishBtn = document.getElementById("publishBtn");

publishBtn.addEventListener("click", async () => {

    const file = imageInput.files[0];

    const title = document.getElementById("title").value.trim();

    const description = document.getElementById("description").value.trim();

    const category = document.getElementById("category").value;

    const author = document.getElementById("author").value.trim();

    const tags = document
        .getElementById("tags")
        .value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);

    const featured =
        document.getElementById("featured").checked;

    const trending =
        document.getElementById("trending").checked;

    const status =
        document.getElementById("status").value;

    // Validation

    if (!file) {

        alert("Please select a cover image.");

        return;

    }

    if (!title) {

        alert("Please enter a title.");

        return;

    }

    if (!description) {

        alert("Please enter a description.");

        return;

    }

    publishBtn.disabled = true;

    publishBtn.innerText = "Uploading...";

    // Upload Image

    const upload = await uploadImage(file);

    if (!upload) {

        publishBtn.disabled = false;

        publishBtn.innerText = "🚀 Publish Post";

        return;

    }

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

        shares: 0,

        views: 0,

        published_at: new Date().toISOString()

    };

    console.log(post);

});
