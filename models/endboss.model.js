/**
 * Represents the end boss character in the game.
 * Provides methods for handling animation, movement, and death.
 */
class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 50;

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];
    IMAGES_DEATH = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    energy = 100;
    offset = {
        top: -120,
        right: -45,
        bottom: -25,
        left: -45,
    };

    isWalking = false;
    isVisible = false;
    deathAnimationPlaying = false;

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEATH);
        this.x = 719 * 5 - 200;
        this.speed = 2;

        setTimeout(() => this.animate(), 100);
    }

    /**
     * Checks if the boss is visible within the camera view.
     * @param {number} cameraX - The current X position of the camera.
     * @param {number} canvasWidth - The width of the canvas.
     */
    checkVisibility(cameraX, canvasWidth) {
        this.isVisible = this.x + this.width > -cameraX && this.x < -cameraX + canvasWidth;
    }

/**
 * Starts the main animation loop for the boss.
 * Handles different states of the boss (dead, hurt, walking, or alert).
 */
startBossAnimation() {
    this.bossInterval = setInterval(() => {
        if (this.isDead()) {
            this.handleDeath();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isWalking) {
            this.moveLeft();
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_ALERT);
        }
    }, 200);
}

/**
 * Starts the walking animation loop for the boss.
 * Activates the walking state when the boss is visible and not dead.
 */
startWalkingAnimation() {
    this.bossWalkInterval = setInterval(() => {
        if (this.isVisible && !this.isDead()) {
            this.isWalking = true;
        }
    }, 500);
}

/**
 * Main animation handler for the boss.
 * Calls the functions to initiate the boss animation and walking animation loops.
 */
animate() {
    this.startBossAnimation();
    this.startWalkingAnimation();
}

    

    /**
     * Handles the death animation of the boss.
     */
    handleDeath() {
        if (!this.deathAnimationPlaying) {
            this.deathAnimationPlaying = true;
            this.currentImage = 0;
            const deathInterval = setInterval(() => {
                if (this.currentImage < this.IMAGES_DEATH.length) {
                    this.playAnimation(this.IMAGES_DEATH);
                } else {
                    clearInterval(deathInterval);
                    world.gamePaused = true;
                    world.showWinScreen();
                }
            }, 350);
        }
    }
}


