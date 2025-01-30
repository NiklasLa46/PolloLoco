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
    idleTimeout = null;
    longIdleTimeout = null;
    speedY = 0;
    acceleration = 3;
    isJumping = false; // Flag to prevent multiple jump
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
        this.sleeping_sound.volume = 0;
        this.animate();
 
    }

    resetIdleTimers() {
        this.sleeping_sound.pause();
        this.lastActionTime = Date.now();
    
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
    
        this.idleTimeout = setTimeout(() => {
            this.animationFrame = 0; // Reset animation frame
            this.idleInterval = setInterval(() => this.playAnimation(this.IMAGES_IDLE), 200); // Play idle animation
        }, 100);
    
        this.longIdleTimeout = setTimeout(() => {
            if (this.idleInterval) clearInterval(this.idleInterval); // Stop idle animation
            this.animationFrame = 0; // Reset animation frame
            this.longIdleInterval = setInterval(() => this.playAnimation(this.IMAGES_SLEEP), 200); // Play long idle animation
            this.sleeping_sound.play();
        }, 10000);
    }
    

    animate() {
        setInterval(() => {
            this.walking_sound.pause();
            let moving = false;

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                if (!this.isAboveGround()) {
                    this.walking_sound.play();
                }
                moving = true;
            }

            if (this.world.keyboard.LEFT && this.x > -400) {
                this.moveLeft();
                this.otherDirection = true;
                if (!this.isAboveGround()) {
                    this.walking_sound.play();
                }
                moving = true;
            }

            if (this.world.keyboard.SPACE) {
                if (!this.isAboveGround() && !this.isJumping) {
                    this.jump();
                }
            }

            if (moving || this.isAboveGround() || this.isHurt() || this.isDead()) {
                this.resetIdleTimers();
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation(this.IMAGES_DEATH); // Use the new method for death animation
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMP);
                if (!this.isAboveGround()) {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 100);

        this.resetIdleTimers(); // Initialize idle timers on character load
    }
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.isJumping = false; // Reset jumping flag when character lands
            }
        }, 1000 / 25);
    }

    isAboveGround(){
        return this.y < 120;
    }

}
