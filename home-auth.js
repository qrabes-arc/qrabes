// ======================================
// QRABES HOME AUTH
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

async function checkHomeAuth() {

    console.log("🔥 HOME AUTH STARTED");


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


    // ==================================
    // CHECK ELEMENTS
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

    const {
        data: { session },
        error
    } =
        await supabaseClient.auth.getSession();


    console.log(
        "SESSION:",
        session
    );


    if (error) {

        console.error(
            "❌ SESSION ERROR:",
            error
        );

        return;
    }


    // ==================================
    // NOT LOGGED IN
    // ==================================

    if (!session || !session.user) {

        console.log(
            "USER NOT LOGGED IN"
        );


        // Show Sign Up

        signupBtn.classList.remove(
            "hidden"
        );


        // Hide Profile

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
    // GET USER PROFILE
    // ==================================

    const {
        data: profile,
        error: profileError
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "username"
            )
            .eq(
                "id",
                user.id
            )
            .maybeSingle();


    if (profileError) {

        console.error(
            "❌ PROFILE ERROR:",
            profileError
        );

        return;
    }


    console.log(
        "✅ PROFILE:",
        profile
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
    // USERNAME
    // ==================================

    if (profileUsername) {

        profileUsername.textContent =
            profile?.username ||
            user.user_metadata?.username ||
            "User";

    }


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

}


// ======================================
// RUN
// ======================================

checkHomeAuth();
