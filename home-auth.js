// ======================================
// QRABES HOME AUTH TEST
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


async function checkHomeAuth() {

    console.log("🔥 HOME AUTH STARTED");


    const signupBtn =
        document.getElementById("signupBtn");


    if (!signupBtn) {

        console.error(
            "❌ signupBtn NOT FOUND"
        );

        return;
    }


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
            "SESSION ERROR:",
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

        signupBtn.textContent =
            "Sign Up";

        signupBtn.href =
            "/Log-in/login.html";

        return;
    }


    // ==================================
    // LOGGED IN
    // ==================================

    console.log(
        "🔥 USER LOGGED IN:",
        session.user.id
    );


    // ==================================
    // TEMPORARY PROFILE BUTTON
    // ==================================

    signupBtn.textContent =
        "testuser";

    signupBtn.href =
        "/profile.html";


    console.log(
        "✅ PROFILE BUTTON UPDATED"
    );

}


checkHomeAuth();
