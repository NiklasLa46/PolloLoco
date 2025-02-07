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
]

function init() {
    initLevel()
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);


    console.log('My characte is', world.character)
}

function resetAndMainMenu() {
    stopGame();  // Stop the current game
    mainMenu();  // Show the main menu
}

function clearTimers() {
    allIntervalls.forEach(clearInterval);

    if (world.character) {
        // Clear character's idle-related timeouts and intervals
        const { character } = world;

        if (character.idleTimeout) clearTimeout(character.idleTimeout);
        if (character.longIdleTimeout) clearTimeout(character.longIdleTimeout);
        if (character.idleInterval) clearInterval(character.idleInterval);
        if (character.longIdleInterval) clearInterval(character.longIdleInterval);

        // Reset character's idle state
        character.idleTimeout = character.longIdleTimeout = character.idleInterval = character.longIdleInterval = null;
    }
}

// Helper function to stop sounds
function stopSounds() {
    if (world.sleeping_sound) {
        world.sleeping_sound.pause();
        world.sleeping_sound.currentTime = 0;
    }

    if (world.background_music) {
        world.background_music.pause();
    }
}

// Helper function to reset game state
function resetGameState() {
    if (world.character) {
        world.character.stopIdleAnimations();
    }

    world.gamePaused = true;
    world.character = null;
    world.level = null;

    // Reset canvas and objects
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allObjects = [];
    this.throwableObjects = [];
    this.healthBar = null;
    this.bottleBar = null;
    this.coinBar = null;
}

function stopGame() {
    clearTimers();
    stopSounds();
    resetGameState();
}





function toggleFullscreen() {
    const canvas = document.getElementById('canvas');

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        // Enter fullscreen mode
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
        // Exit fullscreen mode
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

// Listen for the Escape key to exit fullscreen mode
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

function startGame() {
    document.getElementById('start-page').style.display = 'none'; // Hide start page
    document.getElementById('canvas').style.display = 'block'; // Show canvas
    document.getElementById('game-title').style.display = 'flex'; // Show game title
    document.getElementById('instructions-page').style.display = 'none';
    document.getElementById('game-buttons-div').style.display = 'flex';
    init(); // Start the game
};

function showInstructions() {
    document.getElementById('start-page').style.display = 'none'; // Hide start page
    document.getElementById('instructions-page').style.display = 'flex'; // Show canvas

};

function mainMenu() {
    document.getElementById('start-page').style.display = 'flex'; // Hide start page
    document.getElementById('instructions-page').style.display = 'none'; // Show canvas
    document.getElementById('canvas').style.display = 'none'; // Show canvas
    document.getElementById('game-title').style.display = 'none'; // Show game title
    document.getElementById('game-buttons-div').style.display = 'none';

};

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
})