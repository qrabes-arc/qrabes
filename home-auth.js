// ======================================
// QRABES HOME AUTH TEST
// ======================================

alert("HOME AUTH JS WORKING");


const SUPABASE_URL =
    "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_l2J49vtmNJW8bpK6Zp4img_UX-QyiQ_";


console.log("1. SUPABASE SCRIPT:", typeof supabase);


const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log(
    "2. SUPABASE CLIENT CREATED"
);


async function testHomeAuth() {

    console.log(
        "3. CHECKING SESSION..."
    );


    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    console.log(
        "4. SESSION DATA:",
        data
    );


    console.log(
        "5. SESSION ERROR:",
        error
    );


    if (error) {

        alert(
            "SESSION ERROR: " +
            error.message
        );

        return;
    }


    if (!data.session) {

        alert(
            "NO SESSION FOUND"
        );

        return;
    }


    alert(
        "USER LOGGED IN ✅"
    );


    console.log(
        "USER ID:",
        data.session.user.id
    );


    // ==================================
    // CHECK PROFILE
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
            .eq(
                "id",
                data.session.user.id
            )
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

        alert(
            "PROFILE ERROR: " +
            profileError.message
        );

        return;
    }


    if (!profile) {

        alert(
            "PROFILE NOT FOUND"
        );

        return;
    }


    alert(
        "PROFILE FOUND: " +
        profile.username
    );

}


testHomeAuth();
