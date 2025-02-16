/**
 * Toggles fullscreen mode for the game canvas, either entering or exiting fullscreen.
 */
function toggleFullscreen() {
    const canvas = document.getElementById('canvas');

    if (isFullscreen()) {
        exitFullscreen();
    } else {
        enterFullscreen(canvas);
    }
}

/**
 * Checks if the game is currently in fullscreen mode.
 * 
 * @returns {boolean} - True if in fullscreen, false otherwise.
 */
function isFullscreen() {
    return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
}

/**
 * Enters fullscreen mode by requesting the fullscreen API for the canvas element.
 * 
 * @param {HTMLCanvasElement} canvas - The canvas element to make fullscreen.
 */
function enterFullscreen(canvas) {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode by requesting the exit fullscreen API.
 */
function exitFullscreen() {
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