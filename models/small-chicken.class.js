class SmallChicken extends MovableObject {
    height = 70;
    width = 70;
    y = 350; 
    IMAGES_DEATH = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    isDying = false; 
    energy = 20;
    offset = {
        top: -15,
        right: -5,
        bottom: -5,
        left: -5
    };

    jumpInterval; 
    isJumping = false; 
    speedY = 0; 
    jumpHeight = 15; 

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 300 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEATH);
        this.animate();
        this.startJumping(); 
    }

    /**
     * Starts a random interval for triggering jumps.
     * The chicken will jump every 5-10 seconds.
     */
    startJumping() {
        this.jumpInterval = setInterval(() => {
            this.jump(); 
        }, 5000 + Math.random() * 5000); 
    }

    /**
     * Makes the chicken jump with a fixed height.
     * Plays the jumping sound each time.
     */
    jump() {
        if (this.jumping_sound) {
            this.jumping_sound.currentTime = 0; 
            this.jumping_sound.play();
        }
        this.speedY = this.jumpHeight; 
        this.isJumping = true; 
    }

    /**
     * Updates the vertical position when the chicken is jumping.
     * Simulates gravity when the jump is completed.
     */
    updateJump() {
        if (this.isJumping) {
            this.y -= this.speedY; 
            this.speedY -= 1; 

            if (this.speedY <= 0) {
                this.isJumping = false;
            }
        } else {
            if (this.y < 350) { 
                this.y += 5; 
            }
        }
    }

    /**
     * Animates the chicken’s movements.
     * Handles walking and jumping logic, and plays the walking animation.
     */
    animate() {
        this.smallChickenInterval = setInterval(() => {
            if (!this.isDead() && !this.isDying) {
                this.moveLeft();
                this.updateJump(); 
            }
        }, 1000 / 60);

        this.smallChickenDeathInterval = setInterval(() => {
            if (!this.isDead() && !this.isDying) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Plays the death image and marks the chicken for removal.
     * Stops the death animation once completed.
     */
    playDeathImage() {
        if (this.isDying) return; 

        this.isDying = true; 
        this.img = this.imageCache[this.IMAGES_DEATH[0]]; 
        setTimeout(() => {
            this.isRemoved = true; 
        }, 1000); 
    }

    /**
     * Checks if the chicken is dead based on its energy or removal status.
     * @returns {boolean} True if the chicken is dead, false otherwise.
     */
    isDead() {
        return this.energy <= 0 || this.isRemoved; 
    }
}


