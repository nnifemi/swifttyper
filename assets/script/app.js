'use strict';

// Selectors
const word = document.querySelector("#word");
const text = document.querySelector("#text");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const endGameElement = document.querySelector("#end-game-container");
const backgroundMusic = document.querySelector("#background-music");

const words = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building',
    'population', 'weather', 'bottle', 'history', 'dream', 'character', 'money',
    'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow',
    'bicycle', 'eclipse', 'calculator', 'trouble', 'watermelon', 'developer',
    'philosophy', 'database', 'periodic', 'capitalism', 'abominable',
    'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada',
    'coffee', 'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'promise',
    'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
    'baseball', 'beyond', 'evolution', 'banana', 'perfume', 'computer',
    'management', 'discovery', 'ambition', 'music', 'eagle', 'crown', 'chess',
    'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library',
    'unboxing', 'bookstore', 'language', 'homework', 'fantastic', 'economy',
    'interview', 'awesome', 'challenge', 'science', 'mystery', 'famous',
    'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
    'keyboard', 'window', 'beans', 'truck', 'sheep', 'band', 'level', 'hope',
    'download', 'blue', 'actor', 'desk', 'watch', 'giraffe', 'brazil', 'mask',
    'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'escape'
];

let originalState = null; // Store the original game state

// List of words for the game
let wordsCopy = [...words]; // Make a copy of the original words array
let randomWord;
let score = 0;
let time = 99; // Initial time set to 99 seconds
let timeInterval = setInterval(updateGameTime, 1500); 
let gameStarted = false; // Track if the game has started

// Focus on text input on start
text.focus();

// Add event listener to keep focus on text input
document.body.addEventListener('click', function (event) {
    // Check if the click event target is not the text input
    if (event.target !== text) {
        // Re-focus on the text input
        text.focus();
    }
});


// Function to start the game
function startGame() {
    // Initialize the game state
    score = 0;
    time = 99;
    wordsCopy = [...words];
    addWordToElement();

    // Hide the restart button and end game element
    restartButton.classList.add('hide');
    endGameElement.style.display = 'none';

    // Reset UI
    scoreElement.innerHTML = score;
    timeElement.innerHTML = time + 's';

    // Add event listener for text input
    text.addEventListener('input', handleInput);

    // Add event listener for the Start button
    startButtonTopLeft.addEventListener('click', startCountdown);
}

// Function to handle text input during the game
function handleInput(e) {
    const insertedText = e.target.value;

    // Validate input
    const validInput = /^[a-zA-Z ]*$/.test(insertedText); // Only letters and spaces allowed

    if (validInput && gameStarted) {
        const cleanedText = insertedText.trim().toLowerCase();

        if (cleanedText === randomWord) {
            addWordToElement();
            updateScore();

            e.target.value = '';
        }
    } else {
        // If the input is invalid or game not started, you can handle it here.
        // For now, I'm just clearing the input.
        e.target.value = '';
    }
}

// Countdown timer for starting the game
function startGameCountdown() {
    startButtonTopLeft.disabled = true; // Disable the Start button during countdown
    startButtonTopLeft.style.display = "none"; // Hide the Start button during countdown

    // 3-second countdown
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            backgroundMusic.play(); // Play background music
            timeInterval = setInterval(updateGameTime, 10000); // Change interval to 1000ms (1 second)
            startButtonTopLeft.disabled = false; // Enable the Start button after countdown
            gameStarted = true; // Set gameStarted to true
        }
    }, 1000);
}

// Function to update the game time
function updateGameTime() {
    if (gameStarted) {
        if (time > 0) {
            time--;

            const timeDisplay = document.getElementById('time');
            timeDisplay.innerHTML = time + "s";
        } else {
            gameOver();
        }
    }
}


// Function to get a random word
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordsCopy.length);
    return wordsCopy.splice(randomIndex, 1)[0];
}

// Function to add word
function addWordToElement() {
    randomWord = getRandomWord();
    word.innerHTML = randomWord;
}

// Function to update score
function updateScore() {
    score++;
    scoreElement.innerHTML = score;
}

// Function to show game over screen
function gameOver() {
    backgroundMusic.pause(); // Pause background music

    if (wordsCopy.length === 0) {
        endGameElement.innerHTML = `
            <h1>Congratulations! You got all the words right!</h1>
            <p>Your final score is: ${score}</p>
        `;
    } else {
        endGameElement.innerHTML = `
            <h1>Time ran out</h1>
            <p>Your final score is: ${score}</p>
        `;
    }

    // Show the restart button
    const restartButton = document.getElementById('restart-btn');
    restartButton.classList.remove('hide');

    endGameElement.style.display = "flex";
    gameStarted = false; // Reset gameStarted to false

    // Reset UI
    scoreElement.innerHTML = score;
    timeElement.innerHTML = time + "s";
}


// New selector for the Restart button
const restartButton = document.getElementById('restart-btn');

// Add click event listener to the Restart button
restartButton.addEventListener('click', restartGame);

// New selector for the Restart button within the container
const restartButtonBlock = document.getElementById('restart-button');

// Add click event listener to the Restart button
restartButtonBlock.addEventListener('click', restartGame);


// New selector for the Start button at the top left
const startButtonTopLeft = document.querySelector("#start-btn-top-left");

// Call the startGame function to initialize the game
startGame();

// Add click event listener to the new Start button
startButtonTopLeft.addEventListener('click', startGameCountdown);

function restartGame() {
    clearInterval(timeInterval);
    score = 0;
    time = 99; // Reset time to 99 seconds
    wordsCopy = [...words]; // Reset the words array
    addWordToElement();

    restartButton.classList.add('hide');
    endGameElement.style.display = "none";

    // Reset UI
    scoreElement.innerHTML = score;
    timeElement.innerHTML = time + "s";

    // Initiate countdown for the game to start again
    startGameCountdown();
}


// Typing event
text.addEventListener("input", (e) => {
    const insertedText = e.target.value;

    // Validate input
    const validInput = /^[a-zA-Z ]*$/.test(insertedText); // Only letters and spaces allowed

    if (validInput && gameStarted) {
        const cleanedText = insertedText.trim().toLowerCase();

        if (cleanedText === randomWord) {
            addWordToElement();
            updateScore();

            e.target.value = "";
        }
    } else {
        // If the input is invalid or game not started, you can handle it here.
        // For now, I'm just clearing the input.
        e.target.value = "";
    }
});

const countdownOverlay = document.getElementById('countdown-overlay');
const countdownElement = document.getElementById('countdown');
const readyElement = document.getElementById('ready');
const setElement = document.getElementById('set');
const goElement = document.getElementById('go');

// Add click event listener to the Start button
startButtonTopLeft.addEventListener('click', startCountdown);

function startCountdown() {
    startButtonTopLeft.disabled = true;
    startButtonTopLeft.style.display = "none";
    countdownOverlay.classList.remove('hide');
    runCountdown(3);
}

function runCountdown(seconds) {
    let currentCount = seconds;

    function updateCountdown() {
        countdownElement.textContent = currentCount;

        if (currentCount === 2) {
            readyElement.style.display = 'block';
        } else if (currentCount === 1) {
            readyElement.style.display = 'none';
            setElement.style.display = 'block';
        } else if (currentCount === 0) {
            setElement.style.display = 'none';
            goElement.style.display = 'block';
        } else if (currentCount < 0) {
            countdownOverlay.classList.add('hide');
            goElement.style.display = 'none';
            startGameCountdown();
            countdownOverlay.style.display = 'none';
            return;
        }

        setTimeout(updateCountdown, 1000);
        currentCount--;
    }

    updateCountdown();
}
