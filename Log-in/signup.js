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


        // ======================================
        // GET FORM VALUES
        // ======================================

        const username =
            document.getElementById("username")
                .value
                .trim();


        const email =
            document.getElementById("email")
                .value
                .trim();


        const password =
            document.getElementById("password")
                .value;


        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;



        // ======================================
        // BASIC VALIDATION
        // ======================================

        if (!username) {

            alert("Please create a username.");
            return;

        }


        if (username.length < 3) {

            alert("Username must be at least 3 characters.");
            return;

        }


        if (password.length < 6) {

            alert("Password must be at least 6 characters.");
            return;

        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");
            return;

        }



        // ======================================
        // SIGNUP BUTTON
        // ======================================

        const button =
            signupForm.querySelector(
                'button[type="submit"]'
            );


        const originalText =
            button
                ? button.innerText
                : "Create Account";


        if (button) {

            button.innerText =
                "Creating Account...";

            button.disabled = true;

            button.style.opacity = "0.6";
            button.style.pointerEvents = "none";

        }



        try {


            // ======================================
            // CREATE SUPABASE AUTH ACCOUNT
            // ======================================

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



            // ======================================
            // AUTH ERROR
            // ======================================

            if (error) {

                throw error;

            }


            const user =
                data.user;


            if (!user) {

                throw new Error(
                    "Account could not be created."
                );

            }



            // ======================================
            // SAVE PROFILE
            // ======================================

            const { error: profileError } =

                await supabaseClient
                    .from("profiles")
                    .insert({

                        id: user.id,

                        username: username

                    });



            // ======================================
            // PROFILE ERROR
            // ======================================

            if (profileError) {

                console.error(
                    "PROFILE ERROR:",
                    profileError
                );


                // Auth account already exists.
                // Don't hide the actual problem.

                alert(
                    "Account created, but profile could not be saved.\n\n" +
                    profileError.message
                );

                return;

            }



            // ======================================
            // CHECK SESSION
            // ======================================

            const { data: sessionData } =

                await supabaseClient.auth.getSession();



            const session =
                sessionData.session;



            // ======================================
            // EMAIL CONFIRMATION ENABLED
            // ======================================

            if (!session) {

                alert(
                    "Account created successfully 🎉\n\n" +
                    "Please check your email and verify your account."
                );


                window.location.href =
                    "login.html";


                return;

            }



            // ======================================
            // ACCOUNT CREATED + LOGGED IN
            // ======================================

            alert(
                "Account Created Successfully 🎉"
            );


            // ======================================
            // GO TO QRABES HOME
            // ======================================

            window.location.href =
                "/";



        } catch (error) {


            console.error(
                "SIGNUP ERROR:",
                error
            );


            alert(
                error.message ||
                "Something went wrong while creating your account."
            );


        } finally {


            // ======================================
            // RESTORE BUTTON
            // ======================================

            if (button) {

                button.innerText =
                    originalText;

                button.disabled = false;

                button.style.opacity = "";
                button.style.pointerEvents = "";

            }

        }

    });

}
