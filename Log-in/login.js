/* =========================================
   QRABES LOGIN + SUPABASE AUTH
========================================= */


// =========================================
// SUPABASE CONNECTION
// =========================================

const SUPABASE_URL =
    "https://bfcjuwbeyrdrgfoejaaw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_l2J49vtmNJW8bp6KZp4img_UX-QyiQ_";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================
// ELEMENTS
// =========================================

const form =
    document.getElementById("loginForm");

const password =
    document.getElementById("password");

const email =
    document.querySelector('input[type="email"]');

const togglePassword =
    document.getElementById("togglePassword");

const loginBtn =
    document.querySelector(".login-btn");

const remember =
    document.querySelector("input[type='checkbox']");


// =========================================
// SHOW / HIDE PASSWORD
// =========================================

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.innerHTML = `

        <svg xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24">

        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12c.73-2.06 2.01-3.87 3.64-5.29"/>

        <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.05 11.05 0 0 1-4.17 5.31"/>

        <line x1="1" y1="1" x2="23" y2="23"/>

        </svg>

        `;

    } else {

        password.type = "password";

        togglePassword.innerHTML = `

        <svg xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24">

        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12"/>

        <circle cx="12" cy="12" r="3"/>

        </svg>

        `;

    }

});


// =========================================
// ERROR MESSAGE
// =========================================

function showError(message) {

    let old =
        document.querySelector(".error-box");

    if (old) {
        old.remove();
    }

    const div =
        document.createElement("div");

    div.className =
        "error-box";

    div.textContent =
        message;

    form.prepend(div);

    setTimeout(() => {

        div.remove();

    }, 5000);

}


// =========================================
// SUCCESS MESSAGE
// =========================================

function showSuccess(message) {

    let old =
        document.querySelector(".success-box");

    if (old) {
        old.remove();
    }

    const div =
        document.createElement("div");

    div.className =
        "success-box";

    div.textContent =
        message;

    form.prepend(div);

}


// =========================================
// EMAIL VALIDATION
// =========================================

function isValidEmail(emailValue) {

    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(emailValue);

}


// =========================================
// REMEMBER EMAIL
// =========================================

window.addEventListener("load", () => {

    const savedEmail =
        localStorage.getItem("qrabes_email");

    if (savedEmail) {

        email.value =
            savedEmail;

        remember.checked =
            true;

    }

});


remember.addEventListener("change", () => {

    if (remember.checked) {

        localStorage.setItem(
            "qrabes_email",
            email.value.trim()
        );

    } else {

        localStorage.removeItem(
            "qrabes_email"
        );

    }

});


// =========================================
// REAL SUPABASE LOGIN
// =========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();


    const emailValue =
        email.value.trim();

    const passwordValue =
        password.value;


    // =====================================
    // VALIDATION
    // =====================================

    if (!emailValue) {

        showError(
            "Email is required."
        );

        return;

    }


    if (!isValidEmail(emailValue)) {

        showError(
            "Please enter a valid email address."
        );

        return;

    }


    if (!passwordValue) {

        showError(
            "Password is required."
        );

        return;

    }


    if (passwordValue.length < 6) {

        showError(
            "Password must be at least 6 characters."
        );

        return;

    }


    // =====================================
    // REMEMBER EMAIL
    // =====================================

    if (remember.checked) {

        localStorage.setItem(
            "qrabes_email",
            emailValue
        );

    }


    // =====================================
    // BUTTON LOADING
    // =====================================

    loginBtn.disabled =
        true;

    loginBtn.innerHTML =
        "Logging In...";


    try {


        // =================================
        // SUPABASE LOGIN
        // =================================

        console.log(
            "QRABES LOGIN STARTED"
        );


        const {
            data,
            error
        } =
            await supabaseClient.auth.signInWithPassword({

                email:
                    emailValue,

                password:
                    passwordValue

            });


        console.log(
            "LOGIN RESPONSE:",
            data
        );


        // =================================
        // LOGIN ERROR
        // =================================

        if (error) {

            console.error(
                "SUPABASE LOGIN ERROR:",
                error
            );

            showError(
                error.message
            );

            return;

        }


        if (!data.user) {

            showError(
                "Login failed. Please try again."
            );

            return;

        }


        // =================================
        // USER SUCCESSFULLY LOGGED IN
        // =================================

        console.log(
            "LOGIN SUCCESS:",
            data.user.id
        );


        showSuccess(
            "Login Successful! Redirecting..."
        );


        // =================================
        // GO HOME
        // =================================

        setTimeout(() => {

            window.location.href =
                "/";

        }, 800);


    } catch (error) {

        console.error(
            "LOGIN SYSTEM ERROR:",
            error
        );

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );


    } finally {

        loginBtn.disabled =
            false;

        loginBtn.innerHTML =
            "Login";

    }

});


// =========================================
// ENTER KEY
// =========================================

document.addEventListener(
    "keydown",
    (e) => {

        if (
            e.key === "Enter" &&
            document.activeElement !==
            loginBtn
        ) {

            form.requestSubmit();

        }

    }
);


// =========================================
// END
// =========================================
