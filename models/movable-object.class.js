class MovableObject extends DrawableObject{
    speed = 0.15;
    otherDirection = false;
    
    lastHit = 0;

    hit() {
        if (!this.isHurt()) { // Only allow hit if not currently hurt
            console.log(this.energy)
            this.energy -= 10;
            if (this.energy < 0) {
                this.energy = 0;
            } else {
                this.lastHit = new Date().getTime();
            }
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

