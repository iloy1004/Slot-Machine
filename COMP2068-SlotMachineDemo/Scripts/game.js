﻿/// <reference path="objects/button.ts" />
var canvas;
var stage;

// Game Objects
var game;
var background;
var spinButton;
var betMaxButton;
var betOneButton;
var resetButton;
var powerButton;
var tiles = [];
var tileContainers = [];

// sound objects
var sndSpin;
var sndBgm;
var sndBtn;

createjs.Sound.addEventListener("fileload", handleFileLoad);
createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.registerSound([
    { id: "background", src: "background.mp3" },
    { id: "button", src: "button.mp3" }], "assets/");

function handleFileLoad(event) {
    // A sound has been preloaded. This will fire TWICE
    console.log("Preloaded:", event.id, event.src);
}

// Game Variables
var playerMoney = 1000;
var winnings = 0;
var jackpot = 5000;
var turn = 0;
var playerBet = 5;
var maxBet = 20;
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var fruits = "";
var winRatio = 0;

// text objects
var playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");
var credit = new createjs.Text(playerMoney.toString(), "40px Arial", "#FF1100");
var bet = new createjs.Text(playerBet.toString(), "40px Arial", "#FF1100");
var winnerPaid = new createjs.Text(winnings.toString(), "40px Arial", "#FF1100");
var lose = new createjs.Text("Lose: " + lossNumber.toString(), "40px Arial", "#FF1100");
var win = new createjs.Text("Win: " + winNumber.toString(), "40px Arial", "#FF1100");

/* Tally Variables */
var grapes = 0;
var watermalon = 0;
var oranges = 0;
var cherries = 0;
var crown = 0;
var seven = 0;
var seven3 = 0;
var dollor = 0;
var blank = 0;

function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20); // Enable mouse events
    createjs.Ticker.setFPS(60); // 60 frames per second
    createjs.Ticker.addEventListener("tick", gameLoop);

    main();

    createjs.Sound.play("background");
}

function gameLoop() {
    stage.update(); // Refreshes our stage
}

/* tility function to reset all fruit tallies */
function resetFruitTally() {
    grapes = 0;
    watermalon = 0;
    oranges = 0;
    cherries = 0;
    crown = 0;
    seven = 0;
    dollor = 0;
    blank = 0;
}

/* Utility function to reset the player stats */
function resetAll() {
    playerMoney = 1000;
    winnings = 0;
    jackpot = 5000;
    turn = 0;
    playerBet = 5;
    maxBet = 20;
    winNumber = 0;
    lossNumber = 0;
    winRatio = 0;

    resetText();

    setEnableSpin();
}

// Event handlers
/*function spinButtonOut() {
spinButton.alpha = 1.0;
}
function spinButtonOver() {
spinButton.alpha = 0.5;
}*/
function resetText() {
    // Reset Text
    //credit = new createjs.Text("credit", "40px Arial", "#FF1100");
    credit.text = "" + playerMoney;
    credit.x = 200;
    credit.y = 536;

    game.addChild(credit);

    //bet = new createjs.Text("BET", "40px Arial", "#FF1100");
    bet.text = "" + playerBet;
    bet.x = 800;
    bet.y = 536;

    game.addChild(bet);

    //winnerPaid = new createjs.Text("winnerpaid", "40px Arial", "#FF1100");
    winnerPaid.text = "" + winnings;
    winnerPaid.x = 1000;
    winnerPaid.y = 536;

    game.addChild(winnerPaid);

    //win = new createjs.Text("numWin", "40px Arial", "#FF1100");
    win.text = "Win: " + winNumber;
    win.x = 360;
    win.y = 20;

    game.addChild(win);

    lose.text = "Lose: " + lossNumber;
    lose.x = 630;
    lose.y = 20;

    game.addChild(lose);
}

function betMax() {
    if (confirm("Do you want to bet max 20?")) {
        playerBet = maxBet;

        bet.text = "" + playerBet;
        bet.x = 800;
        bet.y = 536;

        game.addChild(bet);

        setEnableSpin();
    }
}

function betOne() {
    if (confirm("Do you want to bet basic 5?")) {
        playerBet = 5;

        bet.text = "" + playerBet;
        bet.x = 800;
        bet.y = 536;

        game.addChild(bet);

        setEnableSpin();
    }
}

function setEnableSpin() {
    if (playerMoney < playerBet) {
        spinButton = new objects.Button("/assets/images/btnSpin_grey.png", 584, 532);
        spinButton.setScale(129 / 132, 128 / 131);
        game.addChild(spinButton.getImage());
    } else {
        spinButton = new objects.Button("/assets/images/btnSpin.png", 584, 532);
        spinButton.setScale(129 / 132, 128 / 131);
        game.addChild(spinButton.getImage());
        spinButton.getImage().addEventListener("click", spinReels);
    }
}

function spinReels() {
    if (playerMoney < playerBet) {
        alert("You don't have enough money for betting. Please press the reset button.");

        setEnableSpin();
    } else {
        createjs.Sound.play("button");

        // Add Spin Reels code here
        spinResult = Reels();
        fruits = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2] + " - " + spinResult[3] + " - " + spinResult[4];
        console.log(fruits);

        for (var tile = 0; tile < 5; tile++) {
            //if (turn > 0) {
            game.removeChild(tiles[tile]);

            //}
            tiles[tile] = new createjs.Bitmap("assets/images/" + spinResult[tile] + ".png");
            tiles[tile].x = 110 + (190 * tile);
            tiles[tile].y = 220;

            game.addChild(tiles[tile]);
            console.log(game.getNumChildren());
        }

        determineWinnings();
        resetText();
    }
}

/* Utility function to check if a value falls within a range of bounds */
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    } else {
        return !value;
    }
}

/* When this function is called it determines the betLine results.
e.g. Bar - Orange - Banana */
function Reels() {
    var betLine = [" ", " ", " ", " ", " "];
    var outCome = [0, 0, 0, 0, 0];

    for (var spin = 0; spin < 5; spin++) {
        outCome[spin] = Math.floor((Math.random() * 65) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 27):
                betLine[spin] = "blank";
                blank++;
                break;
            case checkRange(outCome[spin], 28, 37):
                betLine[spin] = "grapes";
                grapes++;
                break;
            case checkRange(outCome[spin], 38, 46):
                betLine[spin] = "watermalon";
                watermalon++;
                break;
            case checkRange(outCome[spin], 47, 54):
                betLine[spin] = "orange";
                oranges++;
                break;
            case checkRange(outCome[spin], 55, 59):
                betLine[spin] = "cherry";
                cherries++;
                break;
            case checkRange(outCome[spin], 60, 62):
                betLine[spin] = "crown";
                crown++;
                break;
            case checkRange(outCome[spin], 63, 64):
                betLine[spin] = "dollor";
                dollor++;
                break;
            case checkRange(outCome[spin], 65, 65):
                betLine[spin] = "seven";
                seven++;
                break;
        }
    }

    //alert(betLine[0] + "  " + betLine[1] + "  " + betLine[2] + "  " + betLine[3] + "  " + betLine[4]);
    return betLine;
}

/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blank == 0) {
        if (grapes == 5) {
            winnings = playerBet * 10;
        } else if (watermalon == 5) {
            winnings = playerBet * 20;
        } else if (oranges == 5) {
            winnings = playerBet * 30;
        } else if (cherries == 5) {
            winnings = playerBet * 40;
        } else if (crown == 5) {
            winnings = playerBet * 50;
        } else if (dollor == 5) {
            winnings = playerBet * 75;
        } else if (seven == 5) {
            winnings = playerBet * 100;
        } else if (grapes == 4) {
            winnings = playerBet * 12;
        } else if (watermalon == 4) {
            winnings = playerBet * 12;
        } else if (oranges == 4) {
            winnings = playerBet * 13;
        } else if (cherries == 4) {
            winnings = playerBet * 14;
        } else if (crown == 4) {
            winnings = playerBet * 15;
        } else if (dollor == 4) {
            winnings = playerBet * 20;
        } else if (seven == 4) {
            winnings = playerBet * 40;
        } else if (grapes == 3) {
            winnings = playerBet * 6;
        } else if (watermalon == 3) {
            winnings = playerBet * 6;
        } else if (oranges == 3) {
            winnings = playerBet * 7;
        } else if (cherries == 3) {
            winnings = playerBet * 8;
        } else if (crown == 3) {
            winnings = playerBet * 9;
        } else if (dollor == 3) {
            winnings = playerBet * 15;
        } else if (seven == 3) {
            winnings = playerBet * 30;
        } else if (grapes == 2) {
            winnings = playerBet * 2;
        } else if (watermalon == 2) {
            winnings = playerBet * 2;
        } else if (oranges == 2) {
            winnings = playerBet * 3;
        } else if (cherries == 2) {
            winnings = playerBet * 4;
        } else if (crown == 2) {
            winnings = playerBet * 5;
        } else if (dollor == 2) {
            winnings = playerBet * 10;
        } else if (seven == 2) {
            winnings = playerBet * 20;
        } else {
            winnings = playerBet * 1;
        }

        if (seven == 1) {
            winnings = playerBet * 5;
        }
        winNumber++;
        playerMoney = playerMoney + winnings;
        //showWinMessage();
    } else {
        lossNumber++;
        playerMoney = playerMoney - playerBet;
        //showLossMessage();
    }

    resetFruitTally();
}

function powerOff() {
    if (confirm("Do you want to close the window?")) {
        window.close();
    }
}

function createUI() {
    createjs.Sound.play("background");

    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.registerSound("assets/audio/button.mp3", "bntSound", 1);

    // instantiate my background
    background = new createjs.Bitmap("/assets/images/background.png");

    game.addChild(background);

    // Spin Button
    spinButton = new objects.Button("/assets/images/btnSpin.png", 584, 532);
    spinButton.setScale(129 / 132, 128 / 131);
    game.addChild(spinButton.getImage());

    spinButton.getImage().addEventListener("click", spinReels);

    // Bet Max Button
    betMaxButton = new objects.Button("/assets/images/btnBetMax.png", 325, 533);
    betMaxButton.setScale(129 / 132, 128 / 131);
    game.addChild(betMaxButton.getImage());
    betMaxButton.getImage().addEventListener("click", betMax);

    // Bet one Button
    betOneButton = new objects.Button("/assets/images/btnBetOne.png", 454, 533);
    betOneButton.setScale(129 / 132, 128 / 131);
    game.addChild(betOneButton.getImage());
    betOneButton.getImage().addEventListener("click", betOne);

    // Reset Button
    resetButton = new objects.Button("/assets/images/btnReset.png", 46, 594);
    resetButton.setScale(95 / 132, 95 / 131);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", resetAll);

    // power Button
    powerButton = new objects.Button("/assets/images/btnPower.png", 941, 2);
    powerButton.setScale(81 / 102, 80 / 101);
    game.addChild(powerButton.getImage());
    powerButton.getImage().addEventListener("click", powerOff);

    // Reset Text
    credit.x = 200;
    credit.y = 536;
    game.addChild(credit);

    bet.x = 800;
    bet.y = 536;
    game.addChild(bet);

    winnerPaid.x = 1000;
    winnerPaid.y = 536;
    game.addChild(winnerPaid);

    win.x = 360;
    win.y = 20;
    game.addChild(win);

    lose.x = 630;
    lose.y = 20;
    game.addChild(lose);

    resetText();
}

// Our Game Kicks off in here
function main() {
    // instantiate my game container
    game = new createjs.Container();
    game.x = 0;
    game.y = 0;

    // Create Slotmachine User Interface
    createUI();

    stage.addChild(game);
}
//# sourceMappingURL=game.js.map
