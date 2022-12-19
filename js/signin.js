// ----------------- User Sign-In Page --------------------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {getDatabase, ref, set, update, child, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB0gnD_CXByUr26Ri0RyTuGmZPBvZc76us",
    authDomain: "changresearch2223.firebaseapp.com",
    projectId: "changresearch2223",
    databaseURL: "https://changresearch2223-default-rtdb.firebaseio.com",
    storageBucket: "changresearch2223.appspot.com",
    messagingSenderId: "561307488080",
    appId: "1:561307488080:web:64972117c9720bb6c7a655"
  };


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  // Initialize Auth
  const auth = getAuth();

  // Initialize Database
  const db = getDatabase(app);


// ---------------------- Sign-In User ---------------------------------------//
document.getElementById("signIn").onclick = function () {
    // Get the values from the form
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        //log sign in date in databse
        //update will only add the last_login
        let logDate = new Date();
        update(ref(db, "users/" + user.uid + "/accountInfo"), {
          last_login: logDate,
        }).then(() => {
          alert("Signed in successfully!");
  
          //get snapshot of all user info and pass it to the login() function
          get(ref(db, "users/" + user.uid)).then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              logIn(snapshot.val());
            } else {
              console.log("No data available");
            }
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  
  // ---------------- Keep User Logged In ----------------------------------//
  function logIn(user) {
    let keepLoggedIn = document.getElementById("keepLoggedInSwitch").checked;
  
    if (!keepLoggedIn) {
      sessionStorage.setItem("user", JSON.stringify(user));
      alert("You have signed in as a session");
      window.location = "index.html";
    } else {
      localStorage.setItem("keepLoggedIn", "yes");
      localStorage.setItem("user", JSON.stringify(user));
      alert("You have signed in as a local");
      window.location = "index.html";
    }
  }
