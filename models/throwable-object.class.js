class ThrowableObject extends DrawableObject {
    /**
     * Represents an object that can be thrown, such as a bottle.
     * It includes logic for throwing, animating the throw, handling collisions,
     * and playing the splash animation when the object lands.
     */
    speedY = 20;
    speedX = 15;
    gravity = 2;
    timer;
    splashTimer;
    animationIndex = 0;
    hasCollided = false;
    bottlebreak_sound = new Audio('/audio/bottle-break.mp3');

    THROW_IMAGES = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    SPLASH_IMAGES = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    /**
     * Constructor for the ThrowableObject class.
     * Initializes the position, dimensions, and image sets for the object.
     * 
     * @param {number} x - The initial x-coordinate of the object.
     * @param {number} y - The initial y-coordinate of the object.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 60;
        this.loadImages(this.THROW_IMAGES);
        this.loadImages(this.SPLASH_IMAGES);
        this.img = this.imageCache[this.THROW_IMAGES[0]]; // Initialize with the first image
    }

/**
 * Starts the throwing action by updating the object's position and animation.
 * The object will follow a parabolic path, simulating gravity.
 */
throw() {
    this.timer = setInterval(() => {
        if (this.hasCollided) return;

        this.updatePosition(); // Update the object's position based on speed and gravity
        this.updateAnimation(); // Cycle through throw animation images

        if (this.isGrounded()) {
            this.handleSplash(); // Handle splash when the object reaches the ground
        }
    }, 50);
}

/**
 * Updates the object's position based on speed and gravity.
 */
updatePosition() {
    this.x += this.speedX;
    this.y -= this.speedY;
    this.speedY -= this.gravity;
}

/**
 * Updates the object's animation to show the throw progression.
 */
updateAnimation() {
    this.animationIndex = (this.animationIndex + 1) % this.THROW_IMAGES.length;
    this.img = this.imageCache[this.THROW_IMAGES[this.animationIndex]];
}

/**
 * Checks if the object has reached the ground.
 * 
 * @returns {boolean} - True if the object has reached the ground.
 */
isGrounded() {
    return this.y >= 378; // Ground level (adjust as needed)
}

/**
 * Handles the splash effect when the object reaches the ground.
 */
handleSplash() {
    this.y = 378;
    this.playSplashAnimation();
}


    /**
     * Plays the splash animation when the object hits the ground.
     * Stops the throw animation, plays a sound, and displays splash frames.
     */
    playSplashAnimation() {
        clearInterval(this.timer);
        this.speedX = 0;
        this.speedY = 0;
        let splashInterval = setInterval(() => {
            this.animationIndex++;
            if (this.animationIndex < this.SPLASH_IMAGES.length) {
                this.img = this.imageCache[this.SPLASH_IMAGES[this.animationIndex]];
            } else {
                clearInterval(splashInterval);
                this.isRemoved = true;
            }
        }, 100);
    }

    /**
     * Stops the throwing action, halting any further movement or animation.
     */
    stop() {
        clearInterval(this.timer);
    }
}



