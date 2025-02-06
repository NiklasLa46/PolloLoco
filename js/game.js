let canvas;
let ctx;
let keyboard = new Keyboard();
allObjects = [];

function init() {
    initLevel()
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);


    console.log('My characte is', world.character)
}

function restartGame(){
    world.reset()
}

function resetAndMainMenu() {
    world.toggleMute()
    mainMenu();
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