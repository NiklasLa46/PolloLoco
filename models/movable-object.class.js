class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    lastHit = 0;
    isRemoved = false;
    isJumping = false;
    deathAnimationPlaying = false;

    /**
     * Reduces energy when the object is hit.
     * Prevents repeated hits while in the "hurt" state.
     */
    hit() {
        if (!this.isHurt() && !this.isDead()) {
            this.energy = Math.max(0, this.energy - 20); // Prevent energy from going below 0
            if (this.energy > 0) {
                this.lastHit = Date.now(); // Record time of hit
            }
        }
    }

    /**
     * Resets the object to its initial position and state.
     */
    reset() {
        this.x = initialX;
        this.y = initialY;
        this.energy = 100;
        this.isJumping = false;
        this.isWalking = false;
        this.speed = 0.15;
    }

    /**
     * Plays the death animation sequence for the object.
     * Removes the object after the animation completes.
     * @param {Array} images - The sequence of images for the death animation.
     */
    playDeathAnimation(images) {
        if (this.isDead() && !this.deathAnimationPlaying) {
            this.deathAnimationPlaying = true;
            this.currentImage = 0;
            this.movableDeathInterval = setInterval(() => {
                if (this.currentImage < images.length) {
                    this.playAnimation(images);
                } else {
                    clearInterval(this.movableDeathInterval); 
                    this.isRemoved = true; 
                    this.deathAnimationPlaying = false;
                }
            }, 200);
        }
    }

    /**
     * Checks if the object is dead based on its energy level.
     * @returns {boolean} Whether the object is dead.
     */
    isDead() {
        return this.energy === 0;
    }

    /**
     * Checks if the object is in the "hurt" state (within 1 second of being hit).
     * @returns {boolean} Whether the object is hurt.
     */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 1;
    }

    /**
     * Moves the object to the right.
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the object jump with an optional weaker force.
     * @param {boolean} weak - Whether the jump force should be weak.
     */
    jump(weak = false) {
        if (this.jumping_sound) {
            this.jumping_sound.currentTime = 0; 
            this.jumping_sound.play();
        }
        this.speedY = weak ? 20 : 30; 
        this.isJumping = true;
    }

    /**
     * Plays an animation by cycling through an array of image paths.
     * @param {Array} images - The array of image paths for the animation.
     */
    playAnimation(images) {
        if (images.length > 0) {
            let i = this.currentImage % images.length; 
            this.img = this.imageCache[images[i]]; 
            this.currentImage++;
        }
    }
}
