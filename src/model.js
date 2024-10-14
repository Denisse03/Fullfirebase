import * as $ from "jquery";

import { initializeApp } from "firebase/app";

import { firebaseConfig } from "./firebaseConfig";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("logged in");
  } else {
    console.log("logged out");
  }
});

export function createAccount(email, pw, fn, ln, imgURL) {
  createUserWithEmailAndPassword(auth, email, pw)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: `${fn} ${ln}`,
        photoURL: imgURL,
      })
        .then(() => {
          console.log("user full name:" + user.displayName);
        })
        .catch((error) => {
          console.log("error", error.message);
        });
      console.log("create", user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("error" + errorMessage);
    });
}

export function showUser() {
  let user = auth.currentUser;
  if (user) {
    $(".profile .displayName").html(user.displayName);
    $(".profile .profileImage").html(`<img src="${user.photoURL}"/>`);
  } else {
    alert("No User is signed in. ");
  }
}

export function signUserOut() {
  signOut(auth)
    .then(() => {
      console.log("signed out");
      $(".profile .displayName").html("");
      $(".profile .profileImage").html("");
    })
    .catch((error) => {
      console.log("error", error.message);
    });
}

export function signUserIn(em, spw) {
  signInWithEmailAndPassword(auth, em, spw)
    .then((userCredential) => {
      console.log("signed in");
    })
    .catch((error) => {
      console.log("error", error.message);
    });
}

export async function addCampgroundToDB(campObj) {
  await addDoc(collection(db, "campgrounds"), campObj)
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", e.message);
    });
}

onSnapshot(collection(db, "campgrounds"), (snapshot) => {
  $(".showCamps").empty();
  let campstring = "";
  snapshot.forEach((doc) => {
    campstring += `<div class="camp">`;
    campstring += `<h3>${doc.data().campName}</h3>`;
    campstring += `<div class="campImg"><img src="${
      doc.data().campImage
    }"/></div>`;
    campstring += `<p class="campDescription">${doc.data().description}</p>`;
    campstring += `<p class="campPrice">${doc.data().price}</p>`;
    campstring += `</div>`;
  });
  $(".showCamps").append(campstring);
});

export async function showAllCamps() {
  try {
    const querySnapshot = await getDocs(collection(db, "campgrounds"));
    let campString = "";
    querySnapshot.forEach((doc) => {
      campString += `<div class ="camp">`;
      campString += `<h3>${doc.data().campName}</h3>`;
      campString += `<div class ="campImg"><img src="${
        doc.data().campImage
      }"/></div>`;
      campString += `<p class="campPrice">${doc.data().price}</p>`;
      campString += `<p class="campDesc">${doc.data().description}</p>`;
      campString += `</div>`;
      console.log(`${doc.id} => ${doc.data()}`);
    });
    $(".showCamps").append(campString);
  } catch (e) {
    console.error("Error getting documents: ", e.message);
  }
}
