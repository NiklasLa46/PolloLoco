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
    ]
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ]
    world;
    walking_sound = new Audio('./audio/footstep.mp3');
    sleeping_sound = new Audio('./audio/snoring.mp3');
    jumping_sound = new Audio('./audio/jump3.mp3')
    lastActionTime = Date.now();
    gameover_sound = new Audio('./audio/gameover.mp3')
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
    }

    constructor() {
        super().loadImage('./img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DEATH);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity();
        this.jumping_sound.volume = 0.3;
        this.sleeping_sound.volume = 0.7;
        this.animate();
    }

    resetIdleTimers() {
        this.stopIdleAnimations();
        this.lastActionTime = Date.now();

        this.startIdleAnimationTimers();
    }

    stopIdleAnimations() {
        this.sleeping_sound.pause();
        if (this.idleTimeout) {
            clearTimeout(this.idleTimeout);
            this.idleTimeout = null;
        }
        if (this.longIdleTimeout) {
            clearTimeout(this.longIdleTimeout);
            this.longIdleTimeout = null;
        }
        if (this.idleInterval) {
            clearInterval(this.idleInterval);
            this.idleInterval = null;
        }
        if (this.longIdleInterval) {
            clearInterval(this.longIdleInterval);
            this.longIdleInterval = null;
        }
    }

    startIdleAnimationTimers() {
        this.idleTimeout = setTimeout(() => {
            this.animationFrame = 0; 
            this.idleInterval = setInterval(() => this.playAnimation(this.IMAGES_IDLE), 200);
        }, 100);

        this.longIdleTimeout = setTimeout(() => {
            this.handleLongIdleAnimation();
        }, 10000);
    }

    handleLongIdleAnimation() {
        if (this.idleInterval) clearInterval(this.idleInterval); 
        this.animationFrame = 0; 
        this.longIdleInterval = setInterval(() => this.playAnimation(this.IMAGES_SLEEP), 200);
        this.sleeping_sound.play();
    }

    animate() {
        this.characterInterval = setInterval(() => {
            this.walking_sound.pause();
            let moving = this.handleMovement();

            if (this.world.keyboard.SPACE) {
                this.handleJump();
            }

            if (moving || this.isAboveGround() || this.isHurt() || this.isDead()) {
                this.resetIdleTimers();
            }

            this.updateCamera();
        }, 1000 / 60);

        this.characterDamageInterval = setInterval(() => {
            this.handleAnimations();
        }, 100);

        this.resetIdleTimers(); 
    }

    handleMovement() {
        let moving = false;

        if (this.world.keyboard.RIGHT && this.x < 719 * 5) {
            this.moveRight();
            this.otherDirection = false;
            this.playWalkingSound();
            moving = true;
        }

        if (this.world.keyboard.LEFT && this.x > -400) {
            this.moveLeft();
            this.otherDirection = true;
            this.playWalkingSound();
            moving = true;
        }

        return moving;
    }

    handleJump() {
        if (!this.isAboveGround() && !this.isJumping) {
            this.jump();
        }
    }

    updateCamera() {
        this.world.camera_x = -this.x + 100;
    }

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

    handleDeath() {
        if (!this.world.gameOverTriggered) {
            this.playDeathAnimation(this.IMAGES_DEATH); 
            this.gameover_sound.play();
            setTimeout(() => {
                this.world.showGameOverScreen();
                this.world.gamePaused = true; 
                this.world.gameOverTriggered = true;
            }, 1600); 
        }
    }

    playWalkingSound() {
        if (!this.isAboveGround()) {
            this.walking_sound.play();
        }
    }

    checkJumpOnEnemy(enemy) {
        if (this.isJumping && this.y < enemy.y) {
           
            if (this.isColliding(enemy)) {
                enemy.hit(); 
                this.isJumping = false; 
                this.jump(true);
                setTimeout(() => {
                    this.y = 130; 
                }, 600);
            }
        }
    }

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

    isAboveGround() {
        return this.y < 120;
    }

}
