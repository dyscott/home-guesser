// Tracks gamestate, displays score info, and handles user input

var score = 0;
var maxScore = 0;

const gamestates = {
    LOADING: "loading",
    WAITING: "waiting",
    GUESSING: "guessing",
    GUESSED: "guessed"
}

var gamestate = gamestates.LOADING;

// Finalizes the player's guess when "guess" is clicked and calculates score
function clickGuess() {
    if (gamestate == gamestates.GUESSING) {
        var distance = makeGuess();
        document.getElementById("distance").innerText = distance.toFixed(2) + " mi";
        document.getElementById("distancediv").classList.remove("invisible");

        // Set score for this round
        var currentScore = Math.max(Math.ceil(100 - distance / 10), 0);
        document.getElementById("score").innerText = currentScore + "/" + "100";
        document.getElementById("scorediv").classList.remove("invisible");

        // Update total score
        maxScore += 100;
        score += currentScore;
        document.getElementById("totalscore").innerText = score + "/" + maxScore;
        document.getElementById("totalscorediv").classList.remove("invisible");

        gamestate = gamestates.GUESSED;

        document.getElementById("guess").disabled = true;
        document.getElementById("next").disabled = false;
    }
}

// Places a guess whenever the map is clicked
function clickMap(latlng) {
    if (gamestate == gamestates.WAITING) {
        // Enable the guess button
        document.getElementById("guess").disabled = false;

        gamestate = gamestates.GUESSING;
    }
    if (gamestate == gamestates.GUESSING) {
        // Place the marker
        placeGuessMarker(latlng);
    }
}

// Resets the game whenever the "next" button is pressed
async function clickNext() {
    if (gamestate == gamestates.GUESSED) { // This should always be the case
        gamestate = gamestates.LOADING;

        await reset();

        document.getElementById("next").disabled = true;
        document.getElementById("distancediv").classList.add("invisible");
        document.getElementById("scorediv").classList.add("invisible");
    }
}

// Resets the map and gets a new house
async function reset() {
    await newHouse();
    resetMap();
    gamestate = gamestates.WAITING;
}

async function main() {
    await newHouse();
    initMap();
    gamestate = gamestates.WAITING;
}

main();