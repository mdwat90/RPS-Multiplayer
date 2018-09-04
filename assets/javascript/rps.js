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

    function player2Info() {
      database.ref("players/2").once("value").then(function (player2) {
        $("#player2").text(player2.val().name);
        $("#p2").append(paper2 + rock2 + scissors2);
        $('#join').prop('disabled', true);
      });
      database.ref("players/2").once("value").then(function (player2) {
        $("#chatbox").append("<p>" + player2.val().name + " is connected!" + "</p>");
      });
      disconnect("players/2");
    }

    function player1Info() {
      database.ref("players/1").once("value").then(function (player1) {
        $("#player1").text(player1.val().name);
        $("#p1").append(paper1 + rock1 + scissors1);
      });
      database.ref("players/1").once("value").then(function (player1) {
        $("#chatbox").append("<p>" + player1.val().name + " is connected!" + "</p>");
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
    }


    function addPlayer(name, wins, losses) {
      var name = $("#name").val().trim();
      database.ref().once("value").then(function (snapshot) {
        if (snapshot.child("players/1/name").exists()) {
          database.ref("players/2").set({
            name: name,
            wins: wins,
            losses: losses,
          });
          player2Info();
          $("#send").on("click", function () {
            var message = $("#chat").val().trim();
            database.ref("chat").set({
              message: message,
            });
            $("#chat").val('');
          })
        } else {
          database.ref("players/1").set({
            name: name,
            wins: wins,
            losses: losses,
          });
          player1Info();
          $("#send").on("click", function () {
            var message = $("#chat").val().trim();
            database.ref("chat").set({
              message: message,
            });
            $("#chat").val('');
          })
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


    function buttonValue(player, id, choice, choiceid) {
      $(document).on("click", id, function () {
        $("#winner").empty();
        $(id).animate({
          height: "100px",
          width: "100px"
        }, "slow");
        $(id).delay(1000).animate({
          height: "50px",
          width: "50px"
        });
        database.ref(player).update({
          choice: choice,
        });
        $(choiceid).text("You chose: " + choice);
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
      buttonValue("players/1", "#paper1", "Paper", "#choice1");
      buttonValue("players/1", "#rock1", "Rock", "#choice1");
      buttonValue("players/1", "#scissors1", "Scissors", "#choice1");
    });

    database.ref("players/2").once('value').then(function () {
      buttonValue("players/2", "#paper2", "Paper", "#choice2");
      buttonValue("players/2", "#rock2", "Rock", "#choice2");
      buttonValue("players/2", "#scissors2", "Scissors", "#choice2");
    });

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

    database.ref("players").on("child_removed", function (snapshot) {
      console.log("Child removed");
      console.log(snapshot.val().name);
      $("#chatbox").append("<p>" + snapshot.val().name + " has disconnected" + "</p>");
      signedOut();
      $('#join').prop('disabled', false);
    });

    // function turn() {
    //   var turn = 1;
    //   database.ref().update({
    //     turn: turn++,
    //   });
    // }


    function addWin(player) {
      database.ref(player).update({
        wins: wins++,
      });
    }

    function addLoss(player) {
      database.ref(player).update({
        losses: losses++,
      });
    }


    database.ref().on("value", function (snapshot) {
      if (snapshot.child("players/1/choice").val() === "Rock" && snapshot.child("players/2/choice").val() === "Scissors") {
        $("#winner").text(snapshot.child("players/1/name").val() + " Wins!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        addWin("players/1");
        addLoss("players/2");
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Rock" && snapshot.child("players/2/choice").val() === "Paper") {
        $("#winner").text(snapshot.child("players/2/name").val() + " Wins!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        addWin("players/2");
        addLoss("players/1");
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Rock" && snapshot.child("players/2/choice").val() === "Rock") {
        $("#winner").text("It's a Tie!");
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        clearChoice();
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Paper" && snapshot.child("players/2/choice").val() === "Scissors") {
        $("#winner").text(snapshot.child("players/2/name").val() + " Wins!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        addWin("players/2");
        addLoss("players/1");
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Paper" && snapshot.child("players/2/choice").val() === "Rock") {
        $("#winner").text(snapshot.child("players/1/name").val() + " Wins!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        addWin("players/1");
        addLoss("players/2");
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Paper" && snapshot.child("players/2/choice").val() === "Paper") {
        $("#winner").text("It's a Tie!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Scissors" && snapshot.child("players/2/choice").val() === "Rock") {
        $("#winner").text(snapshot.child("players/2/name").val() + " Wins!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        addWin("players/2");
        addLoss("players/1");
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Scissors" && snapshot.child("players/2/choice").val() === "Paper") {
        $("#winner").text(snapshot.child("players/1/name").val() + " Wins!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        addWin("players/1");
        addLoss("players/2");
        turn();
      }
      if (snapshot.child("players/1/choice").val() === "Scissors" && snapshot.child("players/2/choice").val() === "Scissors") {
        $("#winner").text("It's a Tie!");
        clearChoice();
        setTimeout(function () {
          $("#winner").empty();
          $("#choice1").empty();
          $("#choice2").empty();
        }, 3000);
        turn();
      }
    })


    var obj = document.createElement("audio");
    obj.src = "assets/audio/slow-spring-board.ogg";
    obj.volume = 0.7;
    obj.autoPlay = false;
    obj.preLoad = true;
    obj.controls = true;


    function updateChat() {
      database.ref("chat").on("value", function (snapshot) {
        if (snapshot.child("message").exists()) {
          $("#chatbox").append("<p>" + snapshot.val().message + "</p>");
          obj.play();
        }
      })
      database.ref(".info/connected").on("value", function (snap) {
        if (snap.val()) {
          database.ref("chat").onDisconnect().remove();
        }
      })
    }

    database.ref().once("value").then(function () {
      updateChat();
    });

    $("#name").on("keyup", function (event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        $("#join").click();
      }
    });

    $("#chat").on("keyup", function (event) {
      event.preventDefault();
      if (event.keyCode === 13) {
        $("#send").click();
      }
    });
  });