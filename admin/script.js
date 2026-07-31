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
