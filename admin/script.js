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
