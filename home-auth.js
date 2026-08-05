alert("HOME AUTH JS WORKING");
// ======================================
// QRABES HOME AUTH DEBUG
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

    console.log("HOME AUTH JS LOADED");


    const signupBtn =
        document.getElementById("signupBtn");


    console.log(
        "SIGNUP BUTTON:",
        signupBtn
    );


    if (!signupBtn) {

        console.error(
            "signupBtn NOT FOUND"
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


    console.log(
        "SESSION ERROR:",
        error
    );


    if (error) {

        console.error(
            "SESSION CHECK ERROR:",
            error
        );

        return;
    }


    if (!session || !session.user) {

        console.log(
            "USER IS NOT LOGGED IN"
        );

        signupBtn.textContent =
            "Sign Up";

        signupBtn.href =
            "/Log-in/login.html";

        return;
    }
console.log(
    "🔥 USER LOGGED IN:",
    session.user.id
);
    const user =
    session.user;

    const user =
        session.user;


    console.log(
        "LOGGED IN USER ID:",
        user.id
    );


    // ==================================
    // PROFILE
    // ==================================

    const {
        data: profile,
        error: profileError
    } =
        await supabaseClient
            .from("profiles")
            .select(
                "id, username, access_expires_at"
            )
            .eq("id", user.id)
            .maybeSingle();


    console.log(
        "PROFILE:",
        profile
    );


    console.log(
        "PROFILE ERROR:",
        profileError
    );


    if (profileError) {

        console.error(
            "PROFILE LOAD ERROR:",
            profileError
        );

        return;
    }


    if (!profile) {

        console.error(
            "NO PROFILE FOUND FOR USER:",
            user.id
        );

        return;
    }


    // ==================================
    // SHOW PROFILE
    // ==================================

    signupBtn.textContent =
        profile.username || "Profile";

    signupBtn.href =
        "/profile.html";


    console.log(
        "PROFILE BUTTON UPDATED"
    );

}
console.log("🔥 HOME AUTH RUNNING");

checkHomeAuth();
