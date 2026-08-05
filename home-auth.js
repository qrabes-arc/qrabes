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
// UPDATE HOME UI
// ======================================

async function updateHomeAuth() {

    console.log("🔥 HOME AUTH RUNNING");


    // ==================================
    // GET ELEMENTS
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

        const result =
            await supabaseClient.auth.getSession();


        if (result.error) {

            console.error(
                "❌ SESSION ERROR:",
                result.error
            );

            return;
        }


        session =
            result.data?.session || null;


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


        // SHOW SIGN UP

        signupBtn.classList.remove(
            "hidden"
        );


        signupBtn.textContent =
            "Sign Up";


        signupBtn.href =
            "/Log-in/login.html";


        // HIDE PROFILE

        if (userProfileBox) {

            userProfileBox.classList.add(
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
    // SHOW PROFILE BOX
    // ==================================

    if (userProfileBox) {

        userProfileBox.classList.remove(
            "hidden"
        );

    }


    // ==================================
    // TEMPORARY DEFAULT VALUES
    // ==================================

    if (profileUsername) {

        profileUsername.textContent =
            user.user_metadata?.username ||
            "User";

    }


    if (followersCount) {

        followersCount.textContent =
            "0";

    }


    if (followingCount) {

        followingCount.textContent =
            "0";

    }


    // ==================================
    // LOAD PROFILE FROM DATABASE
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

            // Profile error ke wajah se
            // pura UI hide nahi karenge.

            return;
        }


        // ==================================
        // PROFILE NOT FOUND
        // ==================================

        if (!profile) {

            console.warn(
                "⚠️ PROFILE NOT FOUND FOR USER:",
                user.id
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
        // ACCESS EXPIRATION
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
// AUTH STATE LISTENER
// ======================================

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "🔐 AUTH EVENT:",
            event
        );


        // Auth change ke baad UI update

        setTimeout(() => {

            updateHomeAuth();

        }, 0);

    }
);


// ======================================
// INITIAL LOAD
// ======================================

updateHomeAuth();


// ======================================
// END
// ======================================
