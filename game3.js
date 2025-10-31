// --- Game Configuration ---
const SIZES = [80, 120, 160]; // Small, Medium, Large sizes in pixels (width/height)
const PLANET_COLORS = ['#FF6347', '#4682B4', '#DAA520']; // Red, Blue, Gold
const GOALS = ['LARGEST', 'SMALLEST'];
let targetGoal = '';
let score = 0;
const SCORE_TO_WIN = 10; 

// --- DOM Elements ---
const messageElement = document.getElementById('message');
const scoreElement = document.getElementById('score');
const planetContainer = document.getElementById('planet-container');

// --- Helper Functions ---

/** Shuffles an array (Fisher-Yates algorithm). */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/** Determines the correct planet based on the current goal. */
function getCorrectPlanet(planets) {
    if (targetGoal === 'LARGEST') {
        // Correct planet is the one with the maximum size
        return planets.reduce((max, p) => (p.size > max.size ? p : max), planets[0]);
    } else {
        // Correct planet is the one with the minimum size
        return planets.reduce((min, p) => (p.size < min.size ? p : min), planets[0]);
    }
}


/** Handles the user clicking a planet. */
function handleGuess(event) {
    // Disable all planets after a click
    document.querySelectorAll('.planet').forEach(p => p.style.pointerEvents = 'none');
    
    const clickedSize = parseInt(event.target.getAttribute('data-size'));
    const correctSize = getCorrectPlanet(planetContainer.planets).size; // Retrieve correct size from stored data
    
    if (clickedSize === correctSize) {
        // Correct Guess
        score++;
        messageElement.textContent = `🪐 Correct! You found the ${targetGoal}!`;
        scoreElement.textContent = "Score: " + score;
        event.target.classList.add('correct'); // Highlight the correct planet

        if (score >= SCORE_TO_WIN) {
            handleWin();
            return;
        }

        setTimeout(newRound, 1500); // Start a new round after a pause

    } else {
        // Incorrect Guess
        messageElement.textContent = `Oops! Try again. Cosmo wants the ${targetGoal} one.`;
        
        // Optionally, briefly highlight the correct planet after a delay
        const correctPlanetElement = document.querySelector(`[data-size="${correctSize}"]`);
        if (correctPlanetElement) {
            correctPlanetElement.classList.add('correct');
        }
        
        setTimeout(() => {
            document.querySelectorAll('.planet').forEach(p => p.style.pointerEvents = 'auto'); // Re-enable planets
            if (correctPlanetElement) {
                correctPlanetElement.classList.remove('correct');
            }
        }, 1200);
    }
}

/** Handles the winning condition for Game 3 and links to Game 4. (UPDATED LINK) */
function handleWin() {
    messageElement.textContent = "🎉 MISSION COMPLETE! Unlock Game 4: Sequence Satellite Stream!";
    
    planetContainer.innerHTML = '';
    const nextGameButton = document.createElement('button');
    nextGameButton.textContent = "Continue to Game 4 >>";
    nextGameButton.style.cssText = "padding: 15px 30px; font-size: 2em; background-color: #008080; color: white; border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 5px 0 0 #005f5f;";
    
    // CRITICAL CHANGE: Linking to the external URL for Game 4!
    nextGameButton.onclick = () => window.open('https://ealimon.github.io/Satellite-Stream/', '_self');
    
    planetContainer.appendChild(nextGameButton);
}

/** Sets up a new round of the game. */
function newRound() {
    // Reset container and message
    planetContainer.innerHTML = '';
    
    // 1. Determine the goal (LARGEST or SMALLEST)
    targetGoal = GOALS[Math.floor(Math.random() * GOALS.length)];
    messageElement.textContent = `Click the ${targetGoal} planet!`;

    // 2. Create the planets with random, unique sizes and colors
    const currentSizes = [...SIZES];
    shuffleArray(currentSizes);
    
    const currentColors = [...PLANET_COLORS];
    shuffleArray(currentColors);

    const planetsData = currentSizes.map((size, index) => ({
        size: size,
        color: currentColors[index]
    }));
    
    // 3. Store planet data and create DOM elements
    planetContainer.planets = planetsData; // Store data for easy comparison later

    shuffleArray(planetsData); // Shuffle again to randomize display order

    planetsData.forEach(data => {
        const planetElement = document.createElement('div');
        planetElement.classList.add('planet');
        
        // Set unique size and color styles
        planetElement.style.width = `${data.size}px`;
        planetElement.style.height = `${data.size}px`;
        planetElement.style.backgroundColor = data.color;
        
        // Store size data for the click handler
        planetElement.setAttribute('data-size', data.size);
        
        planetElement.addEventListener('click', handleGuess);
        planetContainer.appendChild(planetElement);
    });
}


// --- Start the Game! ---
setTimeout(newRound, 500);
