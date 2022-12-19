// ----------------- Page Loaded After User Sign-in -------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//


// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import {getDatabase, ref, set, update, child, get, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
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
  const analytics = getAnalytics(app);

  // Initialize Auth
  const auth = getAuth();

  // Initialize Database
  const db = getDatabase(app);




//my secret shit

// ---------------------// Get reference values -----------------------------
let userLink = document.getElementById("userLink");
let signOutLink = document.getElementById("signOut");
let welcome = document.getElementById("welcome");
let currentUser = null;

// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
  //grab value for key logged in switch
  let keeptLoggedIn = localStorage.getItem("keepLoggedIn");

  if (keeptLoggedIn == "yes") {
    currentUser = JSON.parse(localStorage.getItem("user"));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem("user"));
  }
  if (currentUser != null){
    currentUser = currentUser.accountInfo;
  }
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function signOutUser() {
  // Clear session and localStorage
  sessionStorage.removeItem("user");
  localStorage.removeItem("user");
  localStorage.removeItem("keepLoggedIn");

  auth.signOut()
    .then(() => {
        alert("Sign out successful")
    window.location = "index.html" })
    .catch((error) => alert(`Error: ${error.code} - ${error.message}`));
}

// ------------------------Set (insert) data into FRD ------------------------
function setData(year, month, day, temp, userID) {
  // Set the data
  set(ref(db, `users/${userID}/data/${year}/${month}`), {
    [day]: temp,
  })
    .then(() => {
      alert("Data saved successfully");
    })
    .catch((error) => {
      alert(`Error: ${error.code} - ${error.message}`);
    });
}

async function getDataSet(userID, year, month){
    let yearVal = document.getElementById('getSetYear');
    let monthVal = document.getElementById('getSetMonth');
    console.log(yearVal);
    console.log(monthVal);
    console.log(year);
    console.log(month);
    
    const days = [];
    const temps = [];
    const tbodyEl = document.getElementById(`tbody-2`)
    
    const dbref = ref(db);

    get(child(dbref, `users/${currentUser.uid}/data/${year}/${month}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(child => {
            days.push(child.key);
            console.log(child.key);
            temps.push(child.val());
            console.log(child.val());
        });
        for(let i=0; i < days.length; i++){
            addItemToTable(days[i],temps[i], tbodyEl)
        }

      } else {
        alert("No data available");
      }
      
    })
    .catch((error) => {
      alert(`Error: ${error.code} - ${error.message}`);
    });

    

    

}

function addItemToTable(day, temp, tbody){
    console.log(day, temp);
    let tRow = document.createElement("tr")
    let td1 = document.createElement("td")
    let td2 = document.createElement("td")

    td1.innerHTML = day;
    td2.innerHTML = temp;

    tRow.appendChild(td1);
    tRow.appendChild(td2);

    tbody.appendChild(tRow);

}

document.getElementById("getDataSet").onclick = function () {
    const year = document.getElementById("getSetYear").value;
    const month = document.getElementById("getSetMonth").value;
    
    const userID = currentUser.uid;
  
    getDataSet(userID, year, month);
  };

document.getElementById("set").onclick = function () {
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;
  const day = document.getElementById("day").value;
  const temp = document.getElementById("temperature").value;
  const userID = currentUser.uid;

  setData(year, month, day, temp, userID);
};

// -------------------------Update data in database --------------------------
function updateData(year, month, day, temp, userID) {
  // Set the data
  update(ref(db, `users/${userID}/data/${year}/${month}`), {
    [day]: temp,
  })
    .then(() => {
      alert("Data updated successfully");
    })
    .catch((error) => {
      alert(`Error: ${error.code} - ${error.message}`);
    });
}

document.getElementById("update").onclick = function () {
  const year = document.getElementById("year").value;
  const month = document.getElementById("month").value;
  const day = document.getElementById("day").value;
  const temp = document.getElementById("temperature").value;
  const userID = currentUser.uid;

  updateData(year, month, day, temp, userID);
};

// ----------------------Get a datum from FRD (single data point)---------------

// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph

// Add a item to the table of data

// -------------------------Delete a day's data from FRD ---------------------

// --------------------------- Home Page Loading -----------------------------

window.onload = function () {
  getUsername();

  if (currentUser == null) {
    userLink.innerText = "Create New Account";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = "register.html";

    signOutLink.innerText = "Sign In";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success");
    signOutLink.href = "signIn.html";
  } else {
    console.log(currentUser);

    userLink.innerText = currentUser.firstName;
    welcome.innerText = "Welcome, " + currentUser.firstName + ".";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = "#";

    signOutLink.innerText = "Sign Out";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success");
    signOutLink.addEventListener("click", (e) => {
      e.preventDefault();
      signOutUser();
    });
  }
};



// ------------------------- Set Welcome Message -------------------------

// Get, Set, Update, Delete Sharkriver Temp. Data in FRD
// Set (Insert) data function call

// Update data function call

// Get a datum function call
function getDatum(userID, year, month, day) {
  // Get the data
  let yearVal = document.getElementById("yearVal");
  let monthVal = document.getElementById("monthVal");
  let dayVal = document.getElementById("dayVal");
  let tempVal = document.getElementById("tempVal");

  const dbref = ref(db);

  get(child(dbref, `users/${currentUser.uid}/data/${year}/${month}/${day}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        yearVal.textContent = year;
        monthVal.textContent = month;
        dayVal.textContent = day;
        tempVal.textContent = snapshot.val();
      } else {
        alert("No data available");
      }
    })
    .catch((error) => {
      alert(`Error: ${error.code} - ${error.message}`);
    });
}

document.getElementById("get").onclick = function () {
  const year = document.getElementById("getYear").value;
  const month = document.getElementById("getMonth").value;
  const day = document.getElementById("getDay").value;

  getDatum(currentUser.uid, year, month, day);
};

// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, year, month, day){
    remove(ref(db, 'users/' + userID + '/data/' + year + '/' + month + '/' + day))
    .then(()=>{
      alert('Data removed succesfully')
    })
    .catch((error)=>{
      alert('unsuccessful, error: ' + error)
    })
  }
// Delete a single day's data function call
document.getElementById('delete').onclick = function(){
    const year = document.getElementById('delYear').value;
    const month = document.getElementById('delMonth').value;
    const day = document.getElementById('delDay').value;
    const userID = currentUser.uid;

    deleteData(userID, year, month, day)
}


// Get a data set function call

// Delete a single day's data function call
