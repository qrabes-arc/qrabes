// ======================================
// QRABES HOME AUTH SYSTEM
// ======================================


// ======================================
// SUPABASE CONNECTION
// ======================================

const SUPABASE_URL =
    "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_l2J49vtmNJW8bpK6Zp4img_UX-QyiQ_";


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ======================================
// CHECK HOME AUTH
// ======================================

async function updateHomeAuth() {

    console.log("🔥 HOME AUTH RUNNING");


    // ==================================
    // ELEMENTS
    // ==================================

    const signupBtn =
        document.getElementById("signupBtn");

    const userProfileBox =
        document.getElementById("userProfileBox");

    const profileUsername =
        document.getElementById("profileUsername");

    const followersCount =
        document.getElementById("followersCount");

    const followingCount =
        document.getElementById("followingCount");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // ==================================
    // ELEMENT CHECK
    // ==================================

    if (!signupBtn) {

        console.error(
            "❌ signupBtn NOT FOUND"
        );

        return;
    }


    // ==================================
    // GET SESSION
    // ==================================

    let session = null;

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "❌ SESSION ERROR:",
                error
            );

            return;
        }


        session =
            data?.session || null;


    } catch (error) {

        console.error(
            "❌ SESSION CHECK FAILED:",
            error
        );

        return;
    }


    console.log(
        "SESSION:",
        session
    );


    // ==================================
    // USER NOT LOGGED IN
    // ==================================

    if (!session || !session.user) {

        console.log(
            "👤 USER NOT LOGGED IN"
        );


        // SIGN UP SHOW

        signupBtn.classList.remove(
            "hidden"
        );

        signupBtn.textContent =
            "Sign Up";

        signupBtn.href =
            "/Log-in/login.html";


        // PROFILE HIDE

        if (userProfileBox) {

            userProfileBox.classList.add(
                "hidden"
            );

        }


        // LOGOUT HIDE

        if (logoutBtn) {

            logoutBtn.classList.add(
                "hidden"
            );

        }


        return;
    }


    // ==================================
    // USER LOGGED IN
    // ==================================

    const user =
        session.user;


    console.log(
        "🔥 USER LOGGED IN:",
        user.id
    );


    // ==================================
    // HIDE SIGN UP
    // ==================================

    signupBtn.classList.add(
        "hidden"
    );


    // ==================================
    // SHOW PROFILE
    // ==================================

    if (userProfileBox) {

        userProfileBox.classList.remove(
            "hidden"
        );

    }


    // ==================================
    // SHOW LOGOUT
    // ==================================

    if (logoutBtn) {

        logoutBtn.classList.remove(
            "hidden"
        );

    }


    // ==================================
    // DEFAULT USERNAME
    // ==================================

    if (profileUsername) {

        profileUsername.textContent =
            user.user_metadata?.username ||
            "User";

    }


    // ==================================
    // DEFAULT FOLLOWERS
    // ==================================

    if (followersCount) {

        followersCount.textContent =
            "0";

    }


    // ==================================
    // DEFAULT FOLLOWING
    // ==================================

    if (followingCount) {

        followingCount.textContent =
            "0";

    }


    // ==================================
    // LOAD PROFILE
    // ==================================

    try {

        console.log(
            "🔎 LOADING PROFILE..."
        );


        const {
            data: profile,
            error: profileError
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "id, username, full_name, last_seen, access_expires_at"
                )
                .eq(
                    "id",
                    user.id
                )
                .maybeSingle();


        // ==================================
        // PROFILE ERROR
        // ==================================

        if (profileError) {

            console.error(
                "❌ PROFILE ERROR:",
                profileError
            );

            return;
        }


        // ==================================
        // PROFILE NOT FOUND
        // ==================================

        if (!profile) {

            console.warn(
                "⚠️ PROFILE NOT FOUND"
            );

            return;
        }


        console.log(
            "✅ PROFILE LOADED:",
            profile
        );


        // ==================================
        // USERNAME
        // ==================================

        if (profileUsername) {

            profileUsername.textContent =
                profile.username ||
                profile.full_name ||
                user.user_metadata?.username ||
                "User";

        }


        // ==================================
        // LAST SEEN
        // ==================================

        console.log(
            "LAST SEEN:",
            profile.last_seen
        );


        // ==================================
        // ACCESS EXPIRES
        // ==================================

        console.log(
            "ACCESS EXPIRES:",
            profile.access_expires_at
        );


        // ==================================
        // FOLLOWERS
        // ==================================

        if (followersCount) {

            followersCount.textContent =
                "0";

        }


        // ==================================
        // FOLLOWING
        // ==================================

        if (followingCount) {

            followingCount.textContent =
                "0";

        }


        console.log(
            "✅ PROFILE UI UPDATED"
        );


    } catch (error) {

        console.error(
            "❌ PROFILE LOAD FAILED:",
            error
        );

    }

}


// ======================================
// LOGOUT
// ======================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            // ==================================
            // CONFIRM LOGOUT
            // ==================================

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            // CANCEL

            if (!confirmLogout) {

                return;

            }


            // ==================================
            // LOGOUT STARTED
            // ==================================

            console.log(
                "🚪 LOGOUT STARTED"
            );


            logoutBtn.disabled =
                true;

            logoutBtn.textContent =
                "Logging out...";


            try {

                const {
                    error
                } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    console.error(
                        "❌ LOGOUT ERROR:",
                        error
                    );


                    logoutBtn.disabled =
                        false;

                    logoutBtn.textContent =
                        "Logout";


                    alert(
                        "Logout failed. Please try again."
                    );

                    return;

                }


                console.log(
                    "✅ USER LOGGED OUT"
                );


                // ==================================
                // GO HOME
                // ==================================

                window.location.href =
                    "/";


            } catch (error) {

                console.error(
                    "❌ LOGOUT SYSTEM ERROR:",
                    error
                );


                logoutBtn.disabled =
                    false;

                logoutBtn.textContent =
                    "Logout";


                alert(
                    "Something went wrong. Please try again."
                );

            }

        }
    );

}


// ======================================
// AUTH STATE LISTENER
// ======================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "🔐 AUTH EVENT:",
            event
        );


        setTimeout(
            () => {

                updateHomeAuth();

            },
            0
        );

    }
);


// ======================================
// INITIAL RUN
// ======================================

updateHomeAuth();


// ======================================
// END
// ======================================
