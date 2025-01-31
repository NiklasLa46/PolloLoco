class SmallChicken extends MovableObject {
    height = 70;
    width = 70;
    y = 350;
    IMAGE_DEATH = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];
    energy = 20;
    offset = {
        top: -15,
        right: -5,
        bottom: -5,
        left: -5
    };

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEATH);
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) {
                this.moveLeft();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (!this.isDead()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);

        setInterval(() => {
            if (this.isDead() && !this.deathAnimationPlaying) {
                this.playDeathImage();
            }
        }, 500);
    }

    playDeathImage() {
        this.deathAnimationPlaying = true; // Prevent further calls while playing the death animation
        this.img = this.imageCache[this.IMAGE_DEATH[0]]; // Display the death image
        setTimeout(() => {
            this.isRemoved = true; // Mark the small chicken for removal after 1 second
            this.deathAnimationPlaying = false; // Reset the flag for potential reuse
        }, 1000); // 1 second delay
    }
}
