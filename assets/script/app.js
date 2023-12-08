'use strict';

class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, totalWords) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = (hits / totalWords) * 100;
    }

    get date() {
        return this.#date;
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage;
    }
}

// Selectors
const word = document.querySelector("#word");
const text = document.querySelector("#text");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");
const endGameElement = document.querySelector("#end-game-container");
const backgroundMusic = document.querySelector("#background-music");
const scoreboardContainer = document.querySelector("#scoreboard-container");

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
let time = 15; // Initial time now set to 15 seconds
let timeInterval = setInterval(updateGameTime, 1500); 
let gameStarted = false; // Track if the game has started
let scores = JSON.parse(localStorage.getItem('scores')) || [];

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
    time = 15; // Updated initial time to 15 seconds
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
    // Check if the game is over
    if (!gameStarted) {
        return;
    }

    const insertedText = e.target.value;

    // Validate input
    const validInput = /^[a-zA-Z ]*$/.test(insertedText); // Only letters and spaces allowed

    if (validInput) {
        const cleanedText = insertedText.trim().toLowerCase();

        if (cleanedText === randomWord) {
            addWordToElement();
            updateScore();

            e.target.value = '';
        }
    } else {
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
            clearInterval(timeInterval); // Clear the interval when the game is over
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

// New selector for the "Show Scoreboard" button
const showScoreboardButton = document.getElementById('show-scoreboard-btn');

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

    // Remove the event listener for text input
    text.removeEventListener('input', handleInput);

    // Show the "Show Scoreboard" button
    showScoreboardButton.style.display = 'block';

    // Show the restart button
    const restartButton = document.getElementById('restart-btn');
    restartButton.classList.remove('hide');

    endGameElement.style.display = "flex";
    gameStarted = true; // Reset gameStarted to true

    // Save the score
    saveScore({ hits: score, percentage: calculatePercentage(score, words.length), date: new Date() });

    // Reset UI
    scoreElement.innerHTML = score;
    timeElement.innerHTML = time + "s";

    // Remove the hidden class from the "Show Scoreboard" button
    showScoreboardButton.classList.remove('hide');

    // Toggle the "Show Scoreboard" button based on the game state
    // toggleScoreboard(); // Remove this line
}

// Function to save the score to localStorage
function saveScore(scoreObj) {
    const existingScoreIndex = scores.findIndex(
        (score) =>
            score.hits === scoreObj.hits &&
            score.percentage === scoreObj.percentage
    );

    if (existingScoreIndex === -1) {
        // Score with the same hits and percentage doesn't exist, add it to the array
        scores.push(scoreObj);
    } else {
        // Score with the same hits and percentage exists, update only if the new score is better
        if (scoreObj.hits > scores[existingScoreIndex].hits ||
            (scoreObj.hits === scores[existingScoreIndex].hits &&
             scoreObj.date > scores[existingScoreIndex].date)) {
            scores[existingScoreIndex] = scoreObj;
        }
    }

    // Sort scores by hits in descending order, and by date in ascending order for the same hits
    scores.sort((a, b) => {
        if (b.hits !== a.hits) {
            return b.hits - a.hits; // Sort by hits in descending order
        } else {
            return a.date - b.date; // Sort by date in ascending order
        }
    });

    // Keep only the top 10 scores
    scores = scores.slice(0, 10);

    // Store the sorted scores array in localStorage
    localStorage.setItem('scores', JSON.stringify(scores));

    // Display the updated scoreboard
    displayScoreboard();
}




// Function to calculate the percentage
function calculatePercentage(hits, totalWords) {
    return (hits / totalWords) * 100;
}

// Function to display the scoreboard
function displayScoreboard() {
    // Clear existing content
    scoreboardContainer.innerHTML = '';

    // Check if there are scores to display
    if (scores.length === 0) {
        scoreboardContainer.innerHTML = '<p id="no-scores">No games have been played yet.</p>';
        return;
    }

    // Create and append header
    const header = document.createElement('h2');
    header.textContent = 'High Scores';
    scoreboardContainer.appendChild(header);

    // Create and append scoreboard elements
    const scoreboardList = document.createElement('ul');
    scores.forEach((score, index) => {
        const listItem = document.createElement('li');

        // Format date and time
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        };

        const formattedDateTime = score.date.toLocaleString(undefined, options);

        listItem.textContent = `# ${index + 1} \u00A0 ${score.hits} words \u00A0 ${score.percentage.toFixed(2)}% \u00A0 ${formattedDateTime}`;
        scoreboardList.appendChild(listItem);
    });

    scoreboardContainer.appendChild(scoreboardList);
}



function toggleScoreboard() {
    // Toggle the display property of the scoreboard container
    scoreboardContainer.style.display = (scoreboardContainer.style.display === 'block') ? 'none' : 'block';

    // Update scoreboard content if it's being displayed
    if (scoreboardContainer.style.display === 'block') {
        // Update scoreboard content
        displayScoreboard();
    }
}   

// Add click event listener to the new button
showScoreboardButton.addEventListener('click', toggleScoreboard);

// New selector for the "Clear Scoreboard" button
const clearScoreboardButton = document.getElementById('clear-scoreboard-btn');

// Add click event listener to the "Clear Scoreboard" button
clearScoreboardButton.addEventListener('click', clearScoreboard);

// Function to clear the scoreboard
function clearScoreboard() {
    // Check if there is only one score
    if (scores.length <= 1) {
        return;
    }

    // Clear scores in localStorage
    localStorage.removeItem('scores');

    // Clear the scores array
    scores = [];

    // Update the displayed scoreboard
    displayScoreboard();
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
    if (gameStarted) {
        clearInterval(timeInterval);

        // Clear localStorage
        localStorage.removeItem('scores');

        // Reset other game variables
        score = 0;
        time = 15;
        wordsCopy = [...words];
        addWordToElement();

        // Hide the scoreboard container
        scoreboardContainer.style.display = 'none';

        showScoreboardButton.style.display = 'none';

        restartButton.classList.add('hide');
        endGameElement.style.display = 'none';

        // Hide the Clear Scoreboard button
        clearScoreboardButton.style.display = 'none';

        // Reset UI
        scoreElement.innerHTML = score;
        timeElement.innerHTML = time + 's';

        // Clear the input value
        text.value = '';

        // Initiate countdown for the game to start again
        startGameCountdown();
    }
}



// Add click event listener to the "Show Scoreboard" button
showScoreboardButton.addEventListener('click', toggleScoreboard);

showScoreboardButton.addEventListener('click', function () {
    clearScoreboardButton.style.display = 'block';
});


// Add click event listener to the Restart button
restartButton.addEventListener('click', restartGame);

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
