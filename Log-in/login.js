
/* ===========================
   QRABES LOGIN
=========================== */

const form = document.getElementById("loginForm");

const password = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const loginBtn = document.querySelector(".login-btn");

/* ===========================
   SHOW / HIDE PASSWORD
=========================== */

togglePassword.addEventListener("click",()=>{

if(password.type==="password"){

password.type="text";

togglePassword.innerHTML=`

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

}else{

password.type="password";

togglePassword.innerHTML=`

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

/* ===========================
   LOGIN BUTTON LOADING
=========================== */

form.addEventListener("submit",(e)=>{

e.preventDefault();

loginBtn.classList.add("loading");

loginBtn.innerHTML="Logging In";

setTimeout(()=>{

loginBtn.classList.remove("loading");

loginBtn.innerHTML="Login";

alert("Login Successful ✅");

},2000);

});
/* ===========================
   EMAIL VALIDATION
=========================== */

const email = document.querySelector('input[type="email"]');

function isValidEmail(emailValue){

const pattern =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return pattern.test(emailValue);

}


/* ===========================
   PASSWORD VALIDATION
=========================== */

function isStrongPassword(passwordValue){

return passwordValue.length>=8;

}


/* ===========================
   ERROR MESSAGE
=========================== */

function showError(message){

let old=document.querySelector(".error-box");

if(old){

old.remove();

}

const div=document.createElement("div");

div.className="error-box";

div.innerHTML=message;

form.prepend(div);

setTimeout(()=>{

div.remove();

},4000);

}


/* ===========================
   SUCCESS MESSAGE
=========================== */

function showSuccess(message){

let old=document.querySelector(".success-box");

if(old){

old.remove();

}

const div=document.createElement("div");

div.className="success-box";

div.innerHTML=message;

form.prepend(div);

setTimeout(()=>{

div.remove();

},3000);

}


/* ===========================
   LOGIN VALIDATION
=========================== */

form.addEventListener("submit",(e)=>{

e.preventDefault();

const emailValue=email.value.trim();

const passwordValue=password.value.trim();

if(emailValue===""){

showError("Email is required.");

return;

}

if(!isValidEmail(emailValue)){

showError("Please enter a valid email address.");

return;

}

if(passwordValue===""){

showError("Password is required.");

return;

}

if(!isStrongPassword(passwordValue)){

showError("Password must be at least 8 characters.");

return;

}

loginBtn.classList.add("loading");

loginBtn.innerHTML="Logging In...";

setTimeout(()=>{

loginBtn.classList.remove("loading");

loginBtn.innerHTML="Login";

showSuccess("Login Successful!");

window.location.href="index.html";

},2000);

});
