/* ============================================
   CLICK THE TARGET
   GAME JAVASCRIPT
   ============================================ */


/* ============================================
   DOM ELEMENTS
   ============================================ */

const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");

const startButton =
    document.getElementById("startButton");

const playAgainButton =
    document.getElementById("playAgainButton");

const homeButton =
    document.getElementById("homeButton");

const soundButton =
    document.getElementById("soundButton");

const target =
    document.getElementById("target");

const gameArea =
    document.getElementById("gameArea");

const gameMessage =
    document.getElementById("gameMessage");

const scoreElement =
    document.getElementById("score");

const timerElement =
    document.getElementById("timer");

const comboElement =
    document.getElementById("combo");

const timeProgress =
    document.getElementById("timeProgress");

const finalScore =
    document.getElementById("finalScore");

const finalHits =
    document.getElementById("finalHits");

const finalCombo =
    document.getElementById("finalCombo");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalDifficulty =
    document.getElementById("finalDifficulty");

const resultMessage =
    document.getElementById("resultMessage");

const newRecord =
    document.getElementById("newRecord");

const startBestScore =
    document.getElementById("startBestScore");

const clickEffectContainer =
    document.getElementById("clickEffectContainer");

const confettiContainer =
    document.getElementById("confettiContainer");


/* ============================================
   GAME SETTINGS
   ============================================ */

const GAME_DURATION = 30;

const difficultySettings = {

    easy: {
        name: "Easy",
        targetSize: 82,
        moveDelay: 1100,
        points: 1
    },

    normal: {
        name: "Normal",
        targetSize: 72,
        moveDelay: 800,
        points: 2
    },

    hard: {
        name: "Hard",
        targetSize: 60,
        moveDelay: 560,
        points: 3
    }

};


/* ============================================
   GAME STATE
   ============================================ */

let selectedDifficulty = "easy";

let score = 0;

let hits = 0;

let misses = 0;

let combo = 0;

let bestCombo = 0;

let timeLeft = GAME_DURATION;

let gameRunning = false;

let timerInterval = null;

let targetMoveTimeout = null;

let soundEnabled = true;

let bestScore = loadBestScore();


/* ============================================
   LOAD BEST SCORE
   ============================================ */

function loadBestScore() {

    const savedScore =
        localStorage.getItem("clickTargetBestScore");

    if (!savedScore) {
        return 0;
    }

    const numberScore =
        Number(savedScore);

    if (Number.isNaN(numberScore)) {
        return 0;
    }

    return numberScore;

}


/* ============================================
   SAVE BEST SCORE
   ============================================ */

function saveBestScore(value) {

    localStorage.setItem(
        "clickTargetBestScore",
        String(value)
    );

}


/* ============================================
   INITIAL UI
   ============================================ */

function updateBestScoreDisplay() {

    startBestScore.textContent =
        bestScore;

}

updateBestScoreDisplay();


/* ============================================
   DIFFICULTY BUTTONS
   ============================================ */

const difficultyButtons =
    document.querySelectorAll(
        ".difficulty-button"
    );


difficultyButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (gameRunning) {
                return;
            }

            difficultyButtons.forEach(
                otherButton => {
                    otherButton.classList.remove(
                        "active"
                    );
                }
            );

            button.classList.add("active");

            selectedDifficulty =
                button.dataset.difficulty;

        }
    );

});


/* ============================================
   START BUTTON
   ============================================ */

startButton.addEventListener(
    "click",
    startGame
);


/* ============================================
   PLAY AGAIN
   ============================================ */

playAgainButton.addEventListener(
    "click",
    () => {

        resultScreen.classList.add(
            "hidden"
        );

        startGame();

    }
);


/* ============================================
   HOME BUTTON
   ============================================ */

homeButton.addEventListener(
    "click",
    showHome
);


/* ============================================
   SOUND BUTTON
   ============================================ */

soundButton.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;

        soundButton.textContent =
            soundEnabled
                ? "🔊"
                : "🔇";

    }
);


/* ============================================
   START GAME
   ============================================ */

function startGame() {

    clearGameTimers();

    resetGameState();

    startScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );

    gameRunning = true;

    updateGameUI();

    showCountdown();

}


/* ============================================
   RESET GAME
   ============================================ */

function resetGameState() {

    score = 0;

    hits = 0;

    misses = 0;

    combo = 0;

    bestCombo = 0;

    timeLeft = GAME_DURATION;

    gameRunning = false;

    target.classList.add("hidden");

    gameMessage.classList.remove(
        "hidden"
    );

    gameMessage.innerHTML =
        "<span>GET READY!</span>";

    timeProgress.style.width =
        "100%";

}


/* ============================================
   COUNTDOWN
   ============================================ */

function showCountdown() {

    let count = 3;

    gameMessage.innerHTML =
        `<span>${count}</span>`;

    playStartSound();


    const countdownInterval =
        setInterval(
            () => {

                count--;

                if (count > 0) {

                    gameMessage.innerHTML =
                        `<span>${count}</span>`;

                    playStartSound();

                    return;
                }


                if (count === 0) {

                    gameMessage.innerHTML =
                        "<span>GO!</span>";

                    playStartSound();

                    setTimeout(
                        () => {

                            gameMessage.classList.add(
                                "hidden"
                            );

                            beginGameplay();

                        },
                        350
                    );

                    clearInterval(
                        countdownInterval
                    );

                }

            },
            800
        );

}


/* ============================================
   BEGIN GAMEPLAY
   ============================================ */

function beginGameplay() {

    if (!gameRunning) {
        return;
    }

    showNewTarget();

    startTimer();

}


/* ============================================
   START TIMER
   ============================================ */

function startTimer() {

    timerInterval =
        setInterval(
            () => {

                timeLeft--;

                updateGameUI();

                if (timeLeft <= 0) {

                    endGame();

                }

            },
            1000
        );

}


/* ============================================
   UPDATE GAME UI
   ============================================ */

function updateGameUI() {

    scoreElement.textContent =
        score;

    timerElement.textContent =
        timeLeft;

    comboElement.textContent =
        combo;


    const progress =
        (timeLeft / GAME_DURATION) * 100;

    timeProgress.style.width =
        `${progress}%`;


    if (timeLeft <= 5) {

        timerElement.style.color =
            "#ff6b8f";

    } else {

        timerElement.style.color =
            "#b5aaff";

    }

}


/* ============================================
   SHOW NEW TARGET
   ============================================ */

function showNewTarget() {

    if (!gameRunning) {
        return;
    }

    const settings =
        difficultySettings[
            selectedDifficulty
        ];


    const areaWidth =
        gameArea.clientWidth;

    const areaHeight =
        gameArea.clientHeight;


    const padding =
        settings.targetSize / 2 + 15;


    const availableWidth =
        Math.max(
            1,
            areaWidth - padding * 2
        );

    const availableHeight =
        Math.max(
            1,
            areaHeight - padding * 2
        );


    const x =
        padding +
        Math.random() *
        availableWidth;

    const y =
        padding +
        Math.random() *
        availableHeight;


    target.style.left =
        `${x}px`;

    target.style.top =
        `${y}px`;

    target.style.width =
        `${settings.targetSize}px`;

    target.style.height =
        `${settings.targetSize}px`;


    target.classList.remove(
        "hidden"
    );


    clearTimeout(
        targetMoveTimeout
    );


    targetMoveTimeout =
        setTimeout(
            () => {

                if (!gameRunning) {
                    return;
                }

                misses++;

                combo = 0;

                updateGameUI();

                shakeGame();

                showNewTarget();

            },
            settings.moveDelay
        );

}


/* ============================================
   TARGET CLICK
   ============================================ */

target.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        if (!gameRunning) {
            return;
        }

        handleTargetHit(
            event
        );

    }
);


/* ============================================
   HANDLE TARGET HIT
   ============================================ */

function handleTargetHit(event) {

    clearTimeout(
        targetMoveTimeout
    );


    const settings =
        difficultySettings[
            selectedDifficulty
        ];


    hits++;

    combo++;

    if (combo > bestCombo) {

        bestCombo =
            combo;

    }


    let points =
        settings.points;


    if (combo >= 10) {

        points += 3;

    } else if (combo >= 5) {

        points += 2;

    } else if (combo >= 3) {

        points += 1;

    }


    score += points;


    createClickEffect(
        event
    );


    createScorePopup(
        event,
        points
    );


    playClickSound();


    updateGameUI();


    if (combo > 0 && combo % 5 === 0) {

        showComboMessage();

    }


    showNewTarget();

}


/* ============================================
   GAME AREA MISS
   ============================================ */

gameArea.addEventListener(
    "click",
    event => {

        if (!gameRunning) {
            return;
        }

        if (
            event.target === target ||
            target.contains(event.target)
        ) {
            return;
        }


        misses++;

        combo = 0;

        updateGameUI();

        shakeGame();

    }
);


/* ============================================
   CREATE CLICK EFFECT
   ============================================ */

function createClickEffect(event) {

    const rect =
        gameArea.getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;

    const y =
        event.clientY -
        rect.top;


    const effect =
        document.createElement(
            "div"
        );


    effect.className =
        "click-effect";


    effect.style.left =
        `${x}px`;

    effect.style.top =
        `${y}px`;


    clickEffectContainer.appendChild(
        effect
    );


    setTimeout(
        () => {

            effect.remove();

        },
        600
    );

}


/* ============================================
   SCORE POPUP
   ============================================ */

function createScorePopup(
    event,
    points
) {

    const rect =
        gameArea.getBoundingClientRect();


    const x =
        event.clientX -
        rect.left;

    const y =
        event.clientY -
        rect.top;


    const popup =
        document.createElement(
            "div"
        );


    popup.className =
        "score-popup";


    popup.textContent =
        `+${points}`;


    popup.style.left =
        `${x}px`;

    popup.style.top =
        `${y}px`;


    clickEffectContainer.appendChild(
        popup
    );


    setTimeout(
        () => {

            popup.remove();

        },
        800
    );

}


/* ============================================
   COMBO MESSAGE
   ============================================ */

function showComboMessage() {

    const message =
        document.createElement(
            "div"
        );


    message.className =
        "score-popup";


    message.textContent =
        `🔥 ${combo} COMBO!`;


    message.style.left =
        "50%";

    message.style.top =
        "50%";


    clickEffectContainer.appendChild(
        message
    );


    setTimeout(
        () => {

            message.remove();

        },
        900
    );

}


/* ============================================
   SCREEN SHAKE
   ============================================ */

function shakeGame() {

    gameArea.classList.remove(
        "shake"
    );


    void gameArea.offsetWidth;


    gameArea.classList.add(
        "shake"
    );


    setTimeout(
        () => {

            gameArea.classList.remove(
                "shake"
            );

        },
        300
    );

}


/* ============================================
   END GAME
   ============================================ */

function endGame() {

    if (!gameRunning) {
        return;
    }


    gameRunning = false;


    clearGameTimers();


    target.classList.add(
        "hidden"
    );


    gameMessage.classList.add(
        "hidden"
    );


    playGameOverSound();


    const previousBest =
        bestScore;


    const isNewRecord =
        score > previousBest;


    if (isNewRecord) {

        bestScore =
            score;

        saveBestScore(
            bestScore
        );

    }


    updateResultScreen(
        isNewRecord
    );


    setTimeout(
        () => {

            gameScreen.classList.add(
                "hidden"
            );

            resultScreen.classList.remove(
                "hidden"
            );


            if (isNewRecord) {

                createConfetti();

            }

        },
        500
    );

}


/* ============================================
   UPDATE RESULT SCREEN
   ============================================ */

function updateResultScreen(
    isNewRecord
) {

    finalScore.textContent =
        score;

    finalHits.textContent =
        hits;

    finalCombo.textContent =
        bestCombo;

    finalDifficulty.textContent =
        difficultySettings[
            selectedDifficulty
        ].name;


    const totalAttempts =
        hits + misses;


    let accuracy = 0;


    if (totalAttempts > 0) {

        accuracy =
            Math.round(
                (hits / totalAttempts) *
                100
            );

    }


    finalAccuracy.textContent =
        `${accuracy}%`;


    newRecord.classList.toggle(
        "hidden",
        !isNewRecord
    );


    resultMessage.textContent =
        getResultMessage();

}


/* ============================================
   RESULT MESSAGE
   ============================================ */

function getResultMessage() {

    if (score === 0) {

        return "Bro... did you even click? 💀";

    }

    if (score < 15) {

        return "Not bad. Your reflex journey begins!";

    }

    if (score < 30) {

        return "Nice! You're getting faster.";

    }

    if (score < 50) {

        return "🔥 Your reflexes are seriously good!";

    }

    if (score < 75) {

        return "⚡ Okay, you're actually cracked.";

    }

    if (score < 100) {

        return "🚀 Your mouse is fighting for its life.";

    }

    return "👑 LEGENDARY REFLEXES!";

}


/* ============================================
   CLEAR GAME TIMERS
   ============================================ */

function clearGameTimers() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval =
            null;

    }


    if (targetMoveTimeout) {

        clearTimeout(
            targetMoveTimeout
        );

        targetMoveTimeout =
            null;

    }

}


/* ============================================
   SHOW HOME
   ============================================ */

function showHome() {

    clearGameTimers();

    gameRunning = false;


    gameScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.add(
        "hidden"
    );

    startScreen.classList.remove(
        "hidden"
    );


    updateBestScoreDisplay();

}


/* ============================================
   CONFETTI
   ============================================ */

function createConfetti() {

    confettiContainer.innerHTML =
        "";


    const pieces =
        90;


    for (
        let i = 0;
        i < pieces;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );


        piece.className =
            "confetti";


        const left =
            Math.random() * 100;

        const drift =
            (Math.random() - 0.5) * 300;

        const duration =
            2.5 +
            Math.random() * 2.5;


        piece.style.left =
            `${left}%`;

        piece.style.setProperty(
            "--drift",
            `${drift}px`
        );

        piece.style.setProperty(
            "--duration",
            `${duration}s`
        );


        const shapes = [
            "circle",
            "square"
        ];


        const randomShape =
            shapes[
                Math.floor(
                    Math.random() *
                    shapes.length
                )
            ];


        if (
            randomShape ===
            "circle"
        ) {

            piece.style.borderRadius =
                "50%";

        }


        const size =
            5 +
            Math.random() * 7;


        piece.style.width =
            `${size}px`;

        piece.style.height =
            `${size * 1.5}px`;


        const hue =
            Math.floor(
                Math.random() * 360
            );


        piece.style.background =
            `hsl(${hue}, 90%, 65%)`;


        confettiContainer.appendChild(
            piece
        );

    }


    setTimeout(
        () => {

            confettiContainer.innerHTML =
                "";

        },
        5500
    );

}


/* ============================================
   SOUND
   ============================================ */

let audioContext = null;


/* ============================================
   AUDIO CONTEXT
   ============================================ */

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {
            return null;
        }


        audioContext =
            new AudioContext();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    return audioContext;

}


/* ============================================
   PLAY TONE
   ============================================ */

function playTone(
    frequency,
    duration,
    type = "sine",
    volume = 0.04
) {

    if (!soundEnabled) {
        return;
    }


    const context =
        getAudioContext();


    if (!context) {
        return;
    }


    const oscillator =
        context.createOscillator();


    const gain =
        context.createGain();


    oscillator.type =
        type;


    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        volume,
        context.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        context.currentTime +
        duration
    );


    oscillator.connect(
        gain
    );


    gain.connect(
        context.destination
    );


    oscillator.start();


    oscillator.stop(
        context.currentTime +
        duration
    );

}


/* ============================================
   CLICK SOUND
   ============================================ */

function playClickSound() {

    playTone(
        650,
        0.06,
        "sine",
        0.045
    );


    setTimeout(
        () => {

            playTone(
                900,
                0.05,
                "sine",
                0.025
            );

        },
        30
    );

}


/* ============================================
   START SOUND
   ============================================ */

function playStartSound() {

    playTone(
        500,
        0.09,
        "sine",
        0.035
    );

}


/* ============================================
   GAME OVER SOUND
   ============================================ */

function playGameOverSound() {

    playTone(
        350,
        0.12,
        "triangle",
        0.05
    );


    setTimeout(
        () => {

            playTone(
                250,
                0.2,
                "triangle",
                0.045
            );

        },
        120
    );

}


/* ============================================
   KEYBOARD SUPPORT
   ============================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            if (
                !gameRunning &&
                !startScreen.classList.contains(
                    "hidden"
                )
            ) {

                startGame();

            }

        }


        if (
            event.key ===
            "Escape"
        ) {

            if (gameRunning) {

                endGame();

            }

        }

    }
);


/* ============================================
   PREVENT ACCIDENTAL DRAGGING
   ============================================ */

target.addEventListener(
    "dragstart",
    event => {

        event.preventDefault();

    }
);


/* ============================================
   WINDOW RESIZE
   ============================================ */

window.addEventListener(
    "resize",
    () => {

        if (!gameRunning) {
            return;
        }


        const settings =
            difficultySettings[
                selectedDifficulty
            ];


        const areaWidth =
            gameArea.clientWidth;

        const areaHeight =
            gameArea.clientHeight;


        const currentLeft =
            parseFloat(
                target.style.left
            );

        const currentTop =
            parseFloat(
                target.style.top
            );


        if (
            Number.isNaN(currentLeft) ||
            Number.isNaN(currentTop)
        ) {

            return;

        }


        const padding =
            settings.targetSize / 2 +
            10;


        const safeX =
            Math.min(
                Math.max(
                    currentLeft,
                    padding
                ),
                areaWidth - padding
            );


        const safeY =
            Math.min(
                Math.max(
                    currentTop,
                    padding
                ),
                areaHeight - padding
            );


        target.style.left =
            `${safeX}px`;

        target.style.top =
            `${safeY}px`;

    }
);


/* ============================================
   INITIALIZE
   ============================================ */

updateBestScoreDisplay();

console.log(
    "🎯 Click the Target loaded successfully!"
);

console.log(
    "💻 Maybe study after this..."
);
