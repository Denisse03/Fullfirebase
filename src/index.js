import * as $ from "jquery";

import {
  createAccount,
  showUser,
  signUserOut,
  signUserIn,
  addCampgroundToDB,
  showAllCamps,
} from "./model";

function initListeners() {
  console.log("ready");
  $("#submit").on("click", (e) => {
    let fn = $("#fName").val();
    let ln = $("#lName").val();
    let imgURL = $("#imageURL").val();
    let email = $("#email").val();
    let pw = $("#password").val();

    createAccount(email, pw, fn, ln, imgURL);
  });

  $("#show").on("click", (e) => {
    showUser();
  });

  $("#signout").on("click", (e) => {
    signUserOut();
  });

  $("#signInBtn").on("click", (e) => {
    let em = $("#sEmail").val();
    let spw = $("#sPassword").val();
    signUserIn(em, spw);
  });

  $("#addCampground").on("click", (e) => {
    console.log("addCampground");
    let campName = $("#campName").val();
    let campImage = $("#campImage").val();
    let campPrice = $("#campPrice").val();
    let campDescription = $("#campDescription").val();

    let campObj = {
      campName: campName,
      campImage: campImage,
      price: campPrice,
      description: campDescription,
    };

    addCampgroundToDB(campObj);
  });

  $("#camps").on("click", (e) => {
    console.log("camps clicked");
    showAllCamps();
  });
}

$(document).ready(function () {
  initListeners();
});
