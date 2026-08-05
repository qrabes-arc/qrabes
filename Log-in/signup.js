// ======================================
// SUPABASE CONNECTION
// ======================================

const SUPABASE_URL =
    "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_l2J49vtmNJW8bp6KZp4img_UX-QyiQ_";

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
        // VALIDATION
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
            // 1. CREATE AUTH USER
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

                console.error(
                    "SUPABASE SIGNUP ERROR:",
                    error
                );

                alert(error.message);

                return;
            }


            if (!data.user) {

                alert("Account could not be created.");

                return;
            }


            const userId =
                data.user.id;


            console.log(
                "AUTH USER CREATED:",
                userId
            );


            // ==================================
            // 2. CREATE 30-DAY ACCESS
            // ==================================

            const now =
                new Date();


            const expiresAt =
                new Date(
                    now.getTime() +
                    (30 * 24 * 60 * 60 * 1000)
                );


            // ==================================
            // 3. INSERT PROFILE
            // ==================================

            const { error: profileError } =
                await supabaseClient
                    .from("profiles")
                    .insert({

                        id: userId,

                        username: username,

                        full_name: username,

                        last_seen:
                            now.toISOString(),

                        access_expires_at:
                            expiresAt.toISOString()

                    });


            if (profileError) {

                console.error(
                    "PROFILE INSERT ERROR:",
                    profileError
                );

                alert(
                    "Account created, but profile setup failed. Please contact support."
                );

                return;
            }


            console.log(
                "PROFILE CREATED SUCCESSFULLY"
            );


            console.log(
                "ACCESS EXPIRES:",
                expiresAt.toISOString()
            );


            // ==================================
            // SUCCESS
            // ==================================

            alert(
                "Account created successfully! 🎉\n\nYour 30-day access has started."
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
