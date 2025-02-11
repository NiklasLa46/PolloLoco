class Chicken extends MovableObject {
    height = 100;
    y = 320;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGES_DEATH = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];
    energy = 20;
    isDying = false;
    offset = {
        top: -20,
        right: -5,
        bottom: -5,
        left: -5
    };

    constructor() {
        super().loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.x = 300 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEATH);
        this.startAnimation();
    }

    /**
     * Starts the animation cycles for the chicken, handling both movement and walking animation.
     */
    startAnimation() {
        this.startMovementAnimation();
        this.startWalkingAnimation();
    }

    /**
     * Animates the chicken's movement by continuously moving it to the left if alive.
     */
    startMovementAnimation() {
        this.chickenMovementInterval = setInterval(() => {
            if (this.canMove()) {
                this.moveLeft();
            }
        }, 1000 / 60);
    }

    /**
     * Animates the chicken's walking by cycling through walking images if alive.
     */
    startWalkingAnimation() {
        this.chickenWalkingInterval = setInterval(() => {
            if (this.canMove()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Displays the chicken's death image and schedules removal from the game.
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
     * Checks if the chicken is still able to move.
     * @returns {boolean} True if the chicken is not dead or dying.
     */
    canMove() {
        return !this.isDead() && !this.isDying;
    }

    /**
     * Determines if the chicken is dead based on energy or removal status.
     * @returns {boolean} True if the chicken is dead or removed.
     */
    isDead() {
        return this.energy <= 0 || this.isRemoved;
    }
}
