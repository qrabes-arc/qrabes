// ======================================
// SUPABASE CONNECTION
// ======================================

const SUPABASE_URL =
    "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_l2J49vtmNJW8bpK6Zp4img_UX-QyiQ_";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ======================================
// SIGNUP SYSTEM
// ======================================

const signupForm =
    document.getElementById("signupForm");


if (!signupForm) {

    console.error("SIGNUP FORM NOT FOUND");

} else {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        console.log("SIGNUP STARTED");


        // ==================================
        // GET INPUTS
        // ==================================

        const username =
            document.getElementById("username").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // ==================================
        // BASIC VALIDATION
        // ==================================

        if (!username) {

            alert("Please enter a username");
            return;

        }


        if (!email) {

            alert("Please enter your email");
            return;

        }


        if (password.length < 6) {

            alert("Password must be at least 6 characters");
            return;

        }


        if (password !== confirmPassword) {

            alert("Passwords do not match");
            return;

        }


        // ==================================
        // BUTTON LOADING
        // ==================================

        const button =
            signupForm.querySelector("button[type='submit']");


        button.disabled = true;
        button.innerText = "Creating Account...";


        try {


            // ==================================
            // CREATE SUPABASE AUTH USER
            // ==================================

            console.log("Creating Supabase Auth user...");


            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            username: username

                        }

                    }

                });


            console.log("SIGNUP RESPONSE:", data);


            if (error) {

                console.error("SUPABASE SIGNUP ERROR:", error);

                alert(error.message);

                button.disabled = false;
                button.innerText = "Create Account";

                return;

            }


            if (!data.user) {

                alert("Account could not be created.");

                button.disabled = false;
                button.innerText = "Create Account";

                return;

            }


            console.log(
                "AUTH USER CREATED:",
                data.user.id
            );


            // ==================================
            // SUCCESS
            // ==================================

            alert(
                "Account created successfully! 🎉"
            );


            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "SIGNUP SYSTEM ERROR:",
                error
            );

            alert(
                error.message ||
                "Something went wrong. Please try again."
            );


        } finally {

            button.disabled = false;
            button.innerText = "Create Account";

        }

    });

}
