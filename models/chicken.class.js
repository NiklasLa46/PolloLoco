class Chicken extends MovableObject {
    height = 100;
    y = 330;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEATH = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    energy = 20;
    isDying = false; // New flag to track death state
    offset = {
        top: -20,
        right: -5,
        bottom: -5,
        left: -5
    };

    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 200 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEATH);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead() && !this.isDying) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
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
