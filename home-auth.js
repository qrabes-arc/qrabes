// ======================================
// QRABES HOME AUTH SYSTEM
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
// CHECK LOGIN STATUS
// ======================================

async function checkHomeAuth() {

    const signupBtn =
        document.getElementById("signupBtn");

    if (!signupBtn) return;


    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();


    if (error) {

        console.error(
            "SESSION CHECK ERROR:",
            error
        );

        return;
    }


    // ==================================
    // USER NOT LOGGED IN
    // ==================================

    if (!session || !session.user) {

        signupBtn.textContent = "Sign Up";

        signupBtn.href = "/Log-in/login.html";

        return;
    }


    // ==================================
    // USER LOGGED IN
    // ==================================

    const user =
        session.user;


    console.log(
        "LOGGED IN USER:",
        user.id
    );


    // ==================================
    // GET PROFILE
    // ==================================

    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select(
            "username, access_expires_at"
        )
        .eq("id", user.id)
        .single();


    if (profileError) {

        console.error(
            "PROFILE LOAD ERROR:",
            profileError
        );

        return;
    }


    // ==================================
    // SHOW PROFILE BUTTON
    // ==================================

    signupBtn.textContent =
        profile.username || "Profile";

    signupBtn.href =
        "/profile.html";

}


// ======================================
// RUN
// ======================================

checkHomeAuth();
