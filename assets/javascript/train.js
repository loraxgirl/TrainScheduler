$(document).ready(function () {

    // initialize firebase
    var config = {
      apiKey: "AIzaSyCD3JSIV-UM5woaYWnGuelCN3-Ku6ulnXE",
      authDomain: "heffalump2020-27238.firebaseapp.com",
      databaseURL: "https://heffalump2020-27238.firebaseio.com",
      storageBucket: "heffalump2020-27238.appspot.com",
      messagingSenderId: 378921356574
    };
    firebase.initializeApp(config);
  
    var database = firebase.database();
  
    // capture button click
    $("#addTrain").on("click", function (event) {
      event.preventDefault();
  
      // grab values from text input boxes
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = $("#interval").val().trim();
  
      // code to push
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
      });
    });
  
  
    // Firebase watcher & initial loader (code behaves similarly to .on("value")
    database.ref().on("child_added", function (childSnapshot) {
  
      var newTrain = childSnapshot.val().trainName;
      var newLocation = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFreq = childSnapshot.val().frequency;
  
      // Train Start Time (pushed back 1yr to make sure comes before current time)
      var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
  
      // Current Time
      var currentTime = moment();
  
      // difference between times
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  
      // time apart (remainder)
      var tRemainder = diffTime % newFreq;
  
      // minutes until next train
      var tMinutesTillTrain = newFreq - tRemainder;
  
      // next train time
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var catchTrain = moment(nextTrain).format("HH:mm");
  
      // push to page
      $("#all-display").append(
        ' <tr><td>' + newTrain +
        ' </td><td>' + newLocation +
        ' </td><td>' + newFreq +
        ' </td><td>' + catchTrain +
        ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
  
      // clear input fields
      $("#trainName, #destination, #firstTrain, #interval").val("");
      return false;
    },
      //handle errors
      function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
  
  }); 
  
  