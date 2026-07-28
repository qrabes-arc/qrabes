// ======================================
// SUPABASE CONNECTION
// ======================================

const SUPABASE_URL = "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_KEY = "sb_publishable_l2J49vtmNJW8bp6KZp4img_UX-QyiQ_";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



// ======================================
// SIGNUP SYSTEM
// ======================================

const signupForm = document.getElementById("signupForm");


signupForm.addEventListener("submit", async (e)=>{

    e.preventDefault();



    const fullName = 
    document.getElementById("fullName").value.trim();


    const username =
    document.getElementById("username").value.trim();


    const email =
    document.getElementById("email").value.trim();


    const password =
    document.getElementById("password").value;


    const confirmPassword =
    document.getElementById("confirmPassword").value;



    // Password check

    if(password !== confirmPassword){

        alert("Passwords do not match");
        return;

    }



    // Signup Button loading

    const button =
    signupForm.querySelector("button");


    button.innerText = "Creating Account...";
    button.disabled = true;




    // ======================================
    // CREATE AUTH ACCOUNT
    // ======================================

    const {data, error} =
    await supabaseClient.auth.signUp({

        email: email,

        password: password

    });



    if(error){

        alert(error.message);

        button.innerText = "Create Account";
        button.disabled = false;

        return;

    }




    const user = data.user;



    // ======================================
    // SAVE PROFILE DATA
    // ======================================

    const {error: profileError} =

    await supabaseClient
    .from("profiles")
    .insert({

        id: user.id,

        username: username,

        full_name: fullName

    });



    if(profileError){

        alert(profileError.message);

    }

    else{

        alert("Account Created Successfully 🎉");


        window.location.href = "login.html";

    }



    button.innerText = "Create Account";
    button.disabled = false;



});
