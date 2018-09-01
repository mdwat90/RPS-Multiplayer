  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD9e4oMNREdUm20XP6XUFA5k0MZyAWO-JQ",
    authDomain: "david-s-project-3759f.firebaseapp.com",
    databaseURL: "https://david-s-project-3759f.firebaseio.com",
    projectId: "david-s-project-3759f",
    storageBucket: "david-s-project-3759f.appspot.com",
    messagingSenderId: "1556554270"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var wins = 0;
  var losses = 0;
  var turn = 0;

  var paper1 = "<div><img src=" + 'assets/images/paper.png' + " height = '50px' width = '50px' class = 'choices' id = 'paper1'></div>";
  var rock1 = "<div><img src=" + 'assets/images/rock.png' + " height = '50px' width = '50px' class = 'choices' id = 'rock1'></div>";
  var scissors1 = "<div><img src=" + 'assets/images/scissors.png' + " height = '50px' width = '50px' class = 'choices' id = 'scissors1'></div>";
  var paper2 = "<div><img src=" + 'assets/images/paper.png' + " height = '50px' width = '50px' class = 'choices' id = 'paper2'></div>";
  var rock2 = "<div><img src=" + 'assets/images/rock.png' + " height = '50px' width = '50px' class = 'choices' id = 'rock2'></div>";
  var scissors2 = "<div><img src=" + 'assets/images/scissors.png' + " height = '50px' width = '50px' class = 'choices' id = 'scissors2'></div>";


  $(document).ready(function () {
    console.log("ready!");

    $("#enter").hide();


    function disconnect(player) {
      database.ref(".info/connected").on("value", function (snap) {
        if (snap.val()) {
          database.ref(player).onDisconnect().remove();
        }
      })
    }

    function signedOut() {
      database.ref(".info/connected").on("value", function (snap) {
        if (snap.val()) {
          database.ref("players/2").onDisconnect().remove();
          $("#player2").text("Waiting for Player 2");
        }
      })
      database.ref(".info/connected").on("value", function (snap) {
        if (snap.val()) {
          database.ref("players/1").onDisconnect().remove();
          $("#player1").text("Waiting for Player 1");
        }
      })
    }

    function player2Info() {
      database.ref("players/2").once("value").then(function (player2) {
        $("#player2").text(player2.val().name);
        $("#p2").append(paper2 + rock2 + scissors2);
        $('#join').prop('disabled', true);
      });
      disconnect("players/2");
    }

    function player1Info() {
      database.ref("players/1").once("value").then(function (player1) {
        $("#player1").text(player1.val().name);
        $("#p1").append(paper1 + rock1 + scissors1);
      });
      disconnect("players/1");
    }

    function clearChoice() {
      database.ref("players/1").update({
        choice: null,
      });
      database.ref("players/2").update({
        choice: null,
      });
      $(".choices").animate({
        height: "50px",
        width: "50px"
      });
    }

    // function turn() {
    //   turn++;
    //   database.ref().update({
    //     turn: turn,
    //   });
    // }


    // function addWin(player) {
    //   var wins = 0;
    //   database.ref(player).update({
    //     wins: wins++,
    //   });
    // }

    // function addLoss(player) {
    //   var losses = 0;
    //   database.ref(player).update({
    //     losses: 1,
    //   });
    // }


    function addPlayer(name, wins, losses) {
      var name = $("#name").val().trim();
      var wins = 0;
      var losses = 0;
      database.ref().once("value").then(function (snapshot) {
        if (snapshot.child("players/1/name").exists()) {
          database.ref("players/2").set({
            name: name,
            wins: wins,
            losses: losses,
          });
          player2Info();
        } else {
          database.ref("players/1").set({
            name: name,
            wins: wins,
            losses: losses,
          });
          player1Info();
        }
      });
    };

    function updateInfo() {
      database.ref("players/2").on("value", function (snapshot) {
        $("#player2").text(snapshot.val().name);
        $('#join').prop('disabled', true);
      });
      database.ref("players/1").on("value", function (snapshot) {
        $("#player1").text(snapshot.val().name);
        $('#join').prop('disabled', true);
      });
    }

    // function animateButtons(id) {
    //   if ($(id).attr("class", "animate")) {
    //     $(id).animate({
    //       height: "100px",
    //       width: "100px"
    //     });
    //   };
    //   else {
    //     $(".choices").animate({
    //       height: "50px",
    //       width: "50px"
    //     });
    //   }
    // }

    function buttonValue(player, id, choice) {
      $(document).on("click", id, function () {
        $("#winner").empty();
        $(id).animate({
          height: "100px",
          width: "100px"
        });
        database.ref(player).update({
          choice: choice,
        });
      });
    }


    $("#join").on("click", function () {
      // event.preventDefault();
      var name = $("#name").val().trim();
      if (name.length < 1) {
        $("#enter").show();
      } else {
        $("#enter").hide();
        var name = $("#name").val().trim();
        addPlayer(name, wins, losses);
        updateInfo();
      }
      $("#name").val('');
    });

    database.ref("players/1").once('value').then(function () {
      buttonValue("players/1", "#paper1", "Paper");
      buttonValue("players/1", "#rock1", "Rock");
      buttonValue("players/1", "#scissors1", "Scissors");
    });

    database.ref("players/2").once('value').then(function () {
      buttonValue("players/2", "#paper2", "Paper");
      buttonValue("players/2", "#rock2", "Rock");
      buttonValue("players/2", "#scissors2", "Scissors");
    });


    database.ref("players").on("child_removed", function (snapshot) {
      console.log("Child removed");
      console.log(snapshot.val().name);
      signedOut();
      $('#join').prop('disabled', false);
    });


    database.ref().on("value", function (snapshot) {
      if (snapshot.child("players/1/choice").val() === "Rock" && snapshot.child("players/2/choice").val() === "Scissors") {
        $("#winner").text(snapshot.child("players/1/name").val() + " Wins!");
        clearChoice();
        addWin("players/1");
        addLoss("players/2");
      }
      if (snapshot.child("players/1/choice").val() === "Rock" && snapshot.child("players/2/choice").val() === "Paper") {
        $("#winner").text(snapshot.child("players/2/name").val() + " Wins!");
        clearChoice();
        addWin("players/2/wins");
        addLoss("players/1/losses");
      }
      if (snapshot.child("players/1/choice").val() === "Rock" && snapshot.child("players/2/choice").val() === "Rock") {
        $("#winner").text("It's a Tie!");
        clearChoice();
      }
      if (snapshot.child("players/1/choice").val() === "Paper" && snapshot.child("players/2/choice").val() === "Scissors") {
        $("#winner").text(snapshot.child("players/2/name").val() + " Wins!");
        clearChoice();
        addWin("players/2/wins");
        addLoss("players/1/losses");
      }
      if (snapshot.child("players/1/choice").val() === "Paper" && snapshot.child("players/2/choice").val() === "Rock") {
        $("#winner").text(snapshot.child("players/1/name").val() + " Wins!");
        clearChoice();
        addWin("players/1/wins");
        addLoss("players/2/losses");
      }
      if (snapshot.child("players/1/choice").val() === "Paper" && snapshot.child("players/2/choice").val() === "Paper") {
        $("#winner").text("It's a Tie!");
        clearChoice();
      }
      if (snapshot.child("players/1/choice").val() === "Scissors" && snapshot.child("players/2/choice").val() === "Rock") {
        $("#winner").text(snapshot.child("players/2/name").val() + " Wins!");
        clearChoice();
        addWin("players/2/wins");
        addLoss("players/1/losses");
      }
      if (snapshot.child("players/1/choice").val() === "Scissors" && snapshot.child("players/2/choice").val() === "Paper") {
        $("#winner").text(snapshot.child("players/1/name").val() + " Wins!");
        clearChoice();
        addWin("players/1/wins");
        addLoss("players/2/losses");
      }
      if (snapshot.child("players/1/choice").val() === "Scissors" && snapshot.child("players/2/choice").val() === "Scissors") {
        $("#winner").text("It's a Tie!");
        clearChoice();
      }
    })


    function updateChat() {
      database.ref("chat").on("value", function (snapshot) {
        if (snapshot.child("message").exists()) {
          $("#chatbox").append("<p>" + snapshot.val().message + "</p>");
        }
      })
      database.ref(".info/connected").on("value", function (snap) {
        if (snap.val()) {
          database.ref("chat").onDisconnect().remove();
        }
      })
    }

    $("#send").on("click", function () {
      var message = $("#chat").val().trim();
      database.ref("chat").set({
        message: message,
      });
      $("#chat").val('');
    })

    database.ref().once("value").then(function () {
      updateChat();
    });


    // To Do:
    // increment turn()
    // increment wins()
    // increment losses()
    // make chat work

  });