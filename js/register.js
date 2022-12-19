// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {getDatabase, ref, set, update, child, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB0gnD_CXByUr26Ri0RyTuGmZPBvZc76us",
    authDomain: "changresearch2223.firebaseapp.com",
    projectId: "changresearch2223",
    storageBucket: "changresearch2223.appspot.com",
    messagingSenderId: "561307488080",
    appId: "1:561307488080:web:64972117c9720bb6c7a655"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  

  // Initialize Auth
  const auth = getAuth();

  // Initialize Database
  const db = getDatabase(app);

// ---------------- Register New Uswer --------------------------------//


// ---------------- Register New Uswer --------------------------------//
document.getElementById("submitData").onclick = function () {
  // Get the values from the form
  var email = document.getElementById("userEmail").value;
  var password = document.getElementById("userPass").value;
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  console.log(email);
  console.log(password);
  console.log(firstName);
  console.log(lastName);

  if (!validation(firstName, lastName, email, password)) {
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      // Add user to database
      set(ref(db, "users/" + user.uid + "/accountInfo"), {
        uid: user.uid, // save userID for home.js reference
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: encryptPass(password),
      });
      // ...
      alert("Registration Successful!");
      window.location = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      alert(`Error: ${errorCode} - ${errorMessage}`);
    });
};

// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

// ---------------------- Validate Registration Data -----------------------//
function validation(fName, lName, email, pWord) {
  let nameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^\w+@ctemc\.org$/;

  if (
    isEmptyorSpaces(fName) ||
    isEmptyorSpaces(lName) ||
    isEmptyorSpaces(email) ||
    isEmptyorSpaces(pWord)
  ) {
    alert("Please enter all the required information.");
    return false;
  }

  if (
    !fName.match(nameRegex) ||
    !lName.match(nameRegex) ||
    !email.match(emailRegex)
  ) {
    alert("Please enter valid inputs.");
    return false;
  }

  return true;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password) {
  let encrypted = CryptoJS.AES.encrypt(password, password);
  return encrypted.toString();
}

function decryptPass(password) {
  let decrypted = CryptoJS.AES.decrypt(password, password);
  return decrypted.toString();
}
