class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    
    lastHit = 0;

    hit() {
        if (!this.isHurt()) { // Only allow hit if not currently hurt
            
            this.energy -= 20;
            console.log(this.energy)
            if (this.energy < 0) {
                this.energy = 0;
            } else {
                this.lastHit = new Date().getTime();
            }
        }
    }

    playDeathAnimation(images) {
        if (this.isDead() && !this.deathAnimationPlaying) {
            this.deathAnimationPlaying = true; // Set the flag to indicate the animation is playing
            this.currentImage = 0; // Reset the current image index

            const deathInterval = setInterval(() => {
                if (this.currentImage < images.length) {
                    this.playAnimation(images); // Play the next frame of the death animation
                } else {
                    clearInterval(deathInterval); // Clear the interval when the animation is done
                    this.isRemoved = true; // Mark the object for removal
                    this.deathAnimationPlaying = false; // Reset the flag
                }
            }, 200); // Adjust the interval as needed for animation speed
        }
    }

    isDead(){
        return this.energy == 0;
    }

    isHurt(){
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft(){
        this.x -= this.speed;
    }

    jump(){
        this.jumping_sound.currentTime = 0;
        this.jumping_sound.play();
        this.speedY = 30; // Set jump speed
        this.isJumping = true; // Set jumping flag
    }

    playAnimation(images) {
        let i = this.currentImage % images.length; // Use the length of the provided images array
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
}

