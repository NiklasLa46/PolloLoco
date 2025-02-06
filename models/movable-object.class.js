class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    
    lastHit = 0;

    hit() {
        if (!this.isHurt() && !this.isDead()) {  // Only allow hit if not currently hurt
            this.energy -= 20;
            console.log(this.energy);
            
            if (this.energy < 0) {
                this.energy = 0;
            } else {
                this.lastHit = new Date().getTime(); // Update last hit time
            }
        }
    }
    

    playDeathAnimation(images) {
        if (this.isDead() && !this.deathAnimationPlaying) {
            this.deathAnimationPlaying = true; // Set the flag to indicate the animation is playing
            this.currentImage = 0; // Reset the current image index

           this.movableDeathInterval = setInterval(() => {
                if (this.currentImage < images.length) {
                    this.playAnimation(images); // Play the next frame of the death animation
                } else {
                    clearInterval(this.movableDeathInterval); // Clear the interval when the animation is done
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
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;  // Convert to seconds
        return timePassed < 1;  // Only allow hurt state for 1 second after being hit
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft(){
        this.x -= this.speed;
       
    }

    jump(weak = false) {
        this.jumping_sound.currentTime = 0;
        this.jumping_sound.play();
        if (weak) {
            this.speedY = 20; // A weaker jump force
        } else {
            this.speedY = 30; // Normal jump force
        }
        this.isJumping = true; // Set jumping flag
    }
    

    playAnimation(images) {
        let i = this.currentImage % images.length; // Use the length of the provided images array
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    
}

