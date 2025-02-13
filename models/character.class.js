/**
 * Represents the main character in the game, controlled by the player.
 * Handles movement, animations, interactions, and state management.
 */
class Character extends MovableObject {
    height = 300;
    y = 130;
    speed = 10;
    energy = 100;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];
    IMAGES_SLEEP = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];
    IMAGES_JUMP = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEATH = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];
    world;
    walking_sound = new Audio('./audio/footstep.mp3');
    sleeping_sound = new Audio('./audio/snoring.mp3');
    jumping_sound = new Audio('./audio/jump3.mp3');
    gameover_sound = new Audio('./audio/gameover.mp3');
    chicken_sound = new Audio('audio/chickendeath1.mp3');
    smallchicken_sound = new Audio('audio/chickendeath2.mp3');
    lastActionTime = Date.now();
    idleTimeout = null;
    longIdleTimeout = null;
    speedY = 0;
    acceleration = 3;
    isJumping = false;
    coins = 0;
    bottles = 0;
    offset = {
        top: -130,
        right: -25,
        bottom: -15,
        left: -25
    };
    isDeadPlaying = false;

    constructor(collisionManager) {
        super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
        this.initializeImages();
        this.applyGravity();
        this.jumping_sound.volume = 0.3;
        this.sleeping_sound.volume = 0.7;
        this.animate();
        this.collisionManager = collisionManager;
    }

    /**
     * Preloads all image sequences for the character animations.
     */
    initializeImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DEATH);
        this.loadImages(this.IMAGES_HURT);
    }

    /**
     * Resets idle timers to prevent idle animations from triggering during activity.
     */
    resetIdleTimers() {
        this.stopIdleAnimations();
        this.lastActionTime = Date.now();
        this.startIdleAnimationTimers();
    }

    /**
     * Stops all idle animation timers and sounds.
     */
    stopIdleAnimations() {
        this.sleeping_sound.pause();
        this.clearTimer(this.idleTimeout);
        this.clearTimer(this.longIdleTimeout);
        this.clearTimer(this.idleInterval);
        this.clearTimer(this.longIdleInterval);
    }

    /**
     * Starts timers for idle and long idle animations.
     */
    startIdleAnimationTimers() {
        this.idleTimeout = setTimeout(() => {
            this.idleInterval = setInterval(() => this.playAnimation(this.IMAGES_IDLE), 200);
        }, 100);

        this.longIdleTimeout = setTimeout(() => this.handleLongIdleAnimation(), 10000);
    }

    /**
     * Handles the long idle animation with sound effects.
     */
    handleLongIdleAnimation() {
        this.clearTimer(this.idleInterval);
        this.longIdleInterval = setInterval(() => this.playAnimation(this.IMAGES_SLEEP), 200);
        this.sleeping_sound.play();
    }

    /**
     * Main animation loop for character movement and interactions.
     */
    animate() {
        this.characterInterval = setInterval(() => {
            this.walking_sound.pause();
            const moving = this.handleMovement();
            if (this.world.keyboard.SPACE) this.handleJump();
            if (moving || this.isAboveGround() || this.isHurt() || this.isDead()) {
                this.resetIdleTimers();
            }
            this.updateCamera();
        }, 1000 / 60);

        this.characterDamageInterval = setInterval(() => this.handleAnimations(), 100);
        this.resetIdleTimers();
    }

    /**
     * Handles the character's movement based on keyboard input.
     * @returns {boolean} Whether the character is moving.
     */
    handleMovement() {
        if (this.isDeadPlaying) return false;

        const isMovingRight = this.checkAndMoveRight();
        const isMovingLeft = this.checkAndMoveLeft();

        return isMovingRight || isMovingLeft;
    }

    /**
     * Checks if the character should move right and handles the movement.
     * @returns {boolean} Whether the character moved right.
     */
    checkAndMoveRight() {
        if (this.world.keyboard.RIGHT && this.x < 719 * 5) {
            this.moveRight();
            this.otherDirection = false;
            this.playWalkingSound();
            return true;
        }
        return false;
    }

    /**
     * Checks if the character should move left and handles the movement.
     * @returns {boolean} Whether the character moved left.
     */
    checkAndMoveLeft() {
        if (this.world.keyboard.LEFT && this.x > -400) {
            this.moveLeft();
            this.otherDirection = true;
            this.playWalkingSound();
            return true;
        }
        return false;
    }


    /**
     * Handles the character's jump action.
     */
    handleJump() {
        if (!this.isAboveGround() && !this.isJumping) {
            this.jump();
        }
    }

    /**
     * Updates the camera position based on the character's location.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Handles character animations based on the current state.
     */
    handleAnimations() {
        if (this.isDead()) {
            this.handleDeath();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMP);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Handles character death, triggering death animations and ending the game.
     */
    handleDeath() {
        if (!this.world.gameOverTriggered) {
            this.isDeadPlaying = true;
            this.playDeathAnimation(this.IMAGES_DEATH);
            this.gameover_sound.play();
            this.world.keyboard.RIGHT = false;
            this.world.keyboard.LEFT = false;

            setTimeout(() => {
                this.world.showGameOverScreen();
                this.world.gamePaused = true;
                this.world.gameOverTriggered = true;
            }, 1600);
        }
    }

    /**
     * Plays the walking sound if the character is not jumping.
     */
    playWalkingSound() {
        if (!this.isAboveGround()) this.walking_sound.play();
    }

    /**
     * Checks and handles when the character jumps on an enemy.
     * @param {Object} enemy - The enemy to check collision with.
     */
    checkJumpOnEnemy(enemy) {
        if (this.isJumping && this.y < enemy.y && this.isColliding(enemy)) {
            enemy.hit();
            this.isJumping = false;
            this.jump(true);
            this.handleEnemyDeath(enemy)
            setTimeout(() => {
                this.y = 130;
            }, 600);
        }
    }

    
    /**
     * Handles the death animation and sound for an enemy.
     * @param {Enemy} enemy - The enemy to handle the death for.
     */
    handleEnemyDeath(enemy) {
        if (enemy.isDead() && !enemy.isDying && !(enemy instanceof Endboss)) {
            enemy.playDeathImage();
           

            if (enemy instanceof SmallChicken) {
                this.smallchicken_sound.play();
            }
            if (enemy instanceof Chicken) {
                this.chicken_sound.play();
            }
        }
    }

    /**
     * Applies gravity to the character, pulling them downward when in the air.
     */
    applyGravity() {
        this.gravityIntervall = setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.isJumping = false;
            }
        }, 1000 / 25);
    }

    /**
     * Determines if the character is above the ground.
     * @returns {boolean} True if the character is above the ground.
     */
    isAboveGround() {
        return this.y < 120;
    }

    /**
     * Clears a timer or interval if it exists.
     * @param {number|null} timer - The timer or interval ID to clear.
     */
    clearTimer(timer) {
        if (timer) clearTimeout(timer) || clearInterval(timer);
    }

    muteSounds() {
        this.walking_sound.muted = true;
        this.sleeping_sound.muted = true;
        this.jumping_sound.muted = true;
        this.gameover_sound.muted = true;
        this.chicken_sound.muted = true;
        this.smallchicken_sound.muted = true;
    }

    // Add a method to unmute all character sounds
    unmuteSounds() {
        this.walking_sound.muted = false;
        this.sleeping_sound.muted = false;
        this.jumping_sound.muted = false;
        this.gameover_sound.muted = false;
        this.chicken_sound.muted = false;
        this.smallchicken_sound.muted = false;
    }
}

