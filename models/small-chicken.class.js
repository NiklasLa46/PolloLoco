class SmallChicken extends MovableObject {
    height = 70;
    width = 70;
    y = 350; // Initial Y position
    IMAGES_DEATH = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    isDying = false; // New flag to track death state
    energy = 20;
    offset = {
        top: -15,
        right: -5,
        bottom: -5,
        left: -5
    };

    jumpInterval; // Variable to store jump interval
    isJumping = false; // Track jumping state
    speedY = 0; // Initial vertical speed for jump
    jumpHeight = 15; // Set a fixed jump height (lower than the character's jump)

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 300 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEATH);
        this.animate();
        this.startJumping(); // Start random jumping after instantiation
    }

    // New method to trigger random jumps
    startJumping() {
        this.jumpInterval = setInterval(() => {
            this.jump(); // Trigger a fixed jump every 5-10 seconds
        }, 5000 + Math.random() * 5000); // Random interval between 5-10 seconds
    }

    // Jump method (same height for each jump)
    jump() {
        if (this.jumping_sound) {
            this.jumping_sound.currentTime = 0; // Reset sound to the start
            this.jumping_sound.play();
        }
        this.speedY = this.jumpHeight; // Fixed jump height
        this.isJumping = true; // Mark as jumping
    }

    // Update the vertical position when jumping
    updateJump() {
        if (this.isJumping) {
            this.y -= this.speedY; // Move up
            this.speedY -= 1; // Simulate gravity (decrease upward speed)

            // If the chicken reaches the peak of the jump, stop the jump
            if (this.speedY <= 0) {
                this.isJumping = false;
            }
        } else {
            // If not jumping, apply gravity to bring the chicken down
            if (this.y < 350) { // Ensure it doesn't go below ground level
                this.y += 5; // Falling speed (gravity)
            }
        }
    }

    animate() {
        this.smallChickenInterval = setInterval(() => {
            if (!this.isDead() && !this.isDying) {
                this.moveLeft();
                this.updateJump(); // Update jumping logic
            }
        }, 1000 / 60);

        this.smallChickenDeathInterval = setInterval(() => {
            if (!this.isDead() && !this.isDying) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    playDeathImage() {
        if (this.isDying) return; // Ensure this runs only once

        this.isDying = true; // Mark as dying
        this.img = this.imageCache[this.IMAGES_DEATH[0]]; // Set death image
        setTimeout(() => {
            this.isRemoved = true; // Mark for removal
        }, 1000); // Wait for death animation to finish
    }

    isDead() {
        return this.energy <= 0 || this.isRemoved; // Include removal check
    }
}

