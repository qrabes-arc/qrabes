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
// LOGOUT CONFIRMATION MODAL
// ======================================

const logoutBtn =
    document.getElementById("logoutBtn");

const logoutModal =
    document.getElementById("logoutModal");

const cancelLogout =
    document.getElementById("cancelLogout");

const confirmLogout =
    document.getElementById("confirmLogout");


// ======================================
// OPEN MODAL
// ======================================

if (logoutBtn && logoutModal) {

    logoutBtn.addEventListener(
        "click",
        () => {

            logoutModal.classList.remove("hidden");

            logoutModal.classList.add("flex");

            document.body.style.overflow = "hidden";

        }
    );

}


// ======================================
// CLOSE MODAL
// ======================================

function closeLogoutModal() {

    if (!logoutModal) return;

    logoutModal.classList.remove("flex");

    logoutModal.classList.add("hidden");

    document.body.style.overflow = "";

}


// ======================================
// CANCEL
// ======================================

if (cancelLogout) {

    cancelLogout.addEventListener(
        "click",
        closeLogoutModal
    );

}


// ======================================
// CLICK OUTSIDE
// ======================================

if (logoutModal) {

    logoutModal.addEventListener(
        "click",
        (e) => {

            if (e.target === logoutModal) {

                closeLogoutModal();

            }

        }
    );

}


// ======================================
// CONFIRM LOGOUT
// ======================================

if (confirmLogout) {

    confirmLogout.addEventListener(
        "click",
        async () => {

            console.log(
                "🚪 LOGOUT STARTED"
            );


            confirmLogout.disabled = true;

            confirmLogout.textContent =
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


                    confirmLogout.disabled =
                        false;

                    confirmLogout.textContent =
                        "Logout";

                    return;

                }


                console.log(
                    "✅ USER LOGGED OUT"
                );


                window.location.href = "/";


            } catch (error) {

                console.error(
                    "❌ LOGOUT SYSTEM ERROR:",
                    error
                );


                confirmLogout.disabled =
                    false;

                confirmLogout.textContent =
                    "Logout";

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
