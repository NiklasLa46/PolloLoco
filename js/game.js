let canvas;
let ctx;
let keyboard = new Keyboard();
allObjects = [];
allIntervalls = [
    clearInterval(this.bottleInterval),
    clearInterval(this.longidleInterval),
    clearInterval(this.characterInterval),
    clearInterval(this.characterDamageInterval),
    clearInterval(this.gravityIntervall),
    clearInterval(this.chickenIntervall),
    clearInterval(this.chickenDeathIntervall),
    clearInterval(this.coinIntervall),
    clearInterval(this.bossInterval),
    clearInterval(this.bossWalkIntervall),
    clearInterval(this.bossDeathInterval),
    clearInterval(this.movableDeathInterval),
    clearInterval(this.smallChickenInterval),
    clearInterval(this.smallChickenDeathInterval),
    clearInterval(this.timer),
    clearInterval(this.worldCollisionsInterval)
];
originalPlay = HTMLMediaElement.prototype.play;

/**
 * Initializes the game, sets up the canvas, and initializes the world object with keyboard input.
 * Also shows bottom buttons if the screen width is below 1200px.
 */
document.addEventListener("DOMContentLoaded", () => {
    let leftBtn = document.getElementById('leftBtn');
    let rightBtn = document.getElementById('rightBtn');
    let jumpBtn = document.getElementById('jumpBtn');
    let throwBtn = document.getElementById('throwBtn');

    const setMovementState = (direction, state) => {
        keyboard[direction] = state;
    };

    leftBtn.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        setMovementState('LEFT', true);
    });

    leftBtn.addEventListener('pointerup', (event) => {
        setMovementState('LEFT', false);
    });

    leftBtn.addEventListener('pointercancel', (event) => {
        setMovementState('LEFT', false);
    });

    rightBtn.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        setMovementState('RIGHT', true);
    });

    rightBtn.addEventListener('pointerup', (event) => {
        setMovementState('RIGHT', false);
    });

    rightBtn.addEventListener('pointercancel', (event) => {
        setMovementState('RIGHT', false);
    });

    jumpBtn.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        setMovementState('SPACE', true);
    });

    jumpBtn.addEventListener('pointerup', (event) => {
        setMovementState('SPACE', false);
    });

    jumpBtn.addEventListener('pointercancel', (event) => {
        setMovementState('SPACE', false);
    });

    throwBtn.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        setMovementState('D', true);
        world.throwBottle();
    });

    throwBtn.addEventListener('pointerup', (event) => {
        setMovementState('D', false);
    });

    throwBtn.addEventListener('pointercancel', (event) => {
        setMovementState('D', false);
    });
});

/**
 * Initializes the game level, creates a canvas, and starts the world with keyboard input.
 * Additionally, it adjusts the visibility of the bottom buttons for smaller screens.
 */
function init() {
    initLevel();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    showBottomButtons();
    HTMLMediaElement.prototype.play = originalPlay;


}

/**
 * Displays the bottom buttons and mute option on small screens (below 1200px width).
 */
function showBottomButtons() {
    if (window.innerWidth <= 1200) {
        document.querySelector('.bottom-buttons').style.display = 'flex';
        document.querySelector('.mute-responsive').style.display = 'flex';
    }
}

/**
 * Resets the game state and displays the main menu after stopping the current game.
 */
function resetAndMainMenu() {
    stopGame();
    document.getElementById('game-buttons-div').style.display = 'none';
    mainMenu();
}

/**
 * Restarts the game by stopping the current game and reinitializing it.
 */
function restartGame() {
    stopGame();
    hideRestartButton()
  
    setTimeout(() => {
        this.world.resetBottomButtonsState();
    }, 500);
    document.getElementById('game-buttons-div').style.display = 'flex';
    init();
}

/**
 * Hides the restart Button after restart.
 */
function hideRestartButton() {
    const allCanvasButtons = document.getElementById('all-canvas-buttons');
    if (window.innerWidth <= 1200) {
        allCanvasButtons.style.display = 'none';  // Hide buttons on small screens
    }
    document.getElementById('restartButton').style.display = 'none'; // Hide main restart button
}
/**
 * Clears all active intervals and timeouts, including those related to character idle animations.
 */
function clearTimers() {
    allIntervalls.forEach(clearInterval);
    this.world.stopCollisionChecks()
    if (world.character) {
        const { character } = world;

        if (character.idleTimeout) clearTimeout(character.idleTimeout);
        if (character.longIdleTimeout) clearTimeout(character.longIdleTimeout);
        if (character.idleInterval) clearInterval(character.idleInterval);
        if (character.longIdleInterval) clearInterval(character.longIdleInterval);

        character.idleTimeout = character.longIdleTimeout = character.idleInterval = character.longIdleInterval = null;
    }
}

/**
 * Stops all active sounds and resets their playback position.
 */
function stopSounds() {
    if (world.soundManager.sleeping_sound) {
        world.soundManager.sleeping_sound.pause();
        world.soundManager.sleeping_sound.currentTime = 0;
    }

    // Override the play method to prevent audio or video from playing
    HTMLMediaElement.prototype.play = function () {
        return Promise.resolve();  // Just return a resolved promise, so it doesn't play
    };

    if (world.soundManager.background_music) {
        world.soundManager.background_music.pause();
    }
}

/**
 * Resets the game state, including clearing the canvas, removing all objects, and resetting the UI elements.
 */
function resetGameState() {
    if (world.character) {
        world.character.stopIdleAnimations();
    }

    world.gamePaused = true;
    world.character = null;
    world.level = null;

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allObjects = [];
    this.throwableObjects = [];
    this.healthBar = null;
    this.bottleBar = null;
    this.coinBar = null;
}

/**
 * Stops the game, clears all timers, stops sounds, and resets the game state.
 */
function stopGame() {
    clearInterval(this.worldCollisionsInterval);
    clearTimers();
    stopSounds();
    resetGameState();
}

/**
 * Checks the screen orientation and displays a message if the screen is in portrait mode.
 */
function checkOrientation() {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const turnMessage = document.getElementById("turnMessage");

    if (isTouchDevice && !isLandscape) {
        turnMessage.style.display = "block";
    } else {
        turnMessage.style.display = "none";
    }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);

/**
 * Toggles fullscreen mode for the game canvas, either entering or exiting fullscreen.
 */
function toggleFullscreen() {
    const canvas = document.getElementById('canvas');

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
            canvas.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
 * Listens for the Escape key press to exit fullscreen mode if in fullscreen.
 */
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
});

/**
 * Starts the game by hiding the start page, displaying the canvas, and initializing the game.
 */
function startGame() {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('game-title').style.display = 'flex';
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('game-buttons-div').style.display = 'flex';
    document.getElementById('link-div').style.display = 'none';
    init();
}

/**
 * Displays the instructions page and hides the start page.
 */
function showInstructions() {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('instructions-page').style.display = 'flex';
    document.getElementById('link-div').style.display = 'none'
}

/**
 * Displays the main menu, hides the game interface, and stops the game.
 */
function mainMenu() {
    document.getElementById('start-page').style.display = 'flex';
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('game-title').style.display = 'none';
    document.getElementById('game-buttons-div').style.display = 'none';
    document.getElementById('all-canvas-buttons').style.display = 'none';
    document.getElementById('link-div').style.display = 'flex';
}

/**
 * Listens for keydown events and updates the keyboard state based on the pressed keys.
 */
window.addEventListener('keydown', (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (event.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (event.keyCode == 38) {
        keyboard.UP = true;
    }

    if (event.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (event.keyCode == 68) {
        keyboard.D = true;
        world.throwBottle();
    }
});

/**
 * Listens for keyup events and updates the keyboard state when keys are released.
 */
window.addEventListener('keyup', (event) => {
    if (event.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (event.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (event.keyCode == 38) {
        keyboard.UP = false;
    }

    if (event.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (event.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (event.keyCode == 68) {
        keyboard.D = false;
    }
});
