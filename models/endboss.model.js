class Endboss extends MovableObject {
    height = 400;
    width = 250;
    y = 50;
  
    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
         'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    energy = 60;
    offset = {
        top: -120,
        right: -45,
        bottom: -25,
        left: -45
    };
    isWalking = false; // New property to track walking state

    constructor() {
        super().loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT) 
        this.loadImages(this.IMAGES_DEAD) 
        this.x = 719 * 5 - 200;
        this.speed = 2; 
        this.animate();
    }
    checkVisibility(cameraX, canvasWidth) {
        if (!this.isVisible) {
            const isOnScreen = this.x < Math.abs(cameraX) + canvasWidth;
            if (isOnScreen) {
                this.isVisible = true;
            }
        }
    }
 
    animate() {
        setInterval(() => {
            if (!this.isWalking && this.isVisible()) {
                this.isWalking = true;
            }
    
            if (this.isWalking) {
                this.moveLeft(); // This should reduce 'x' and move the boss left
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 200);
        setInterval(() => {
            if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isWalking) {
                this.moveLeft(); // Move left if walking
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.playAnimation(this.IMAGES_ALERT);
            }
        }, 500);
    }
    

    isVisible() {
        // Check if the end boss is visible within the camera view
        return this.x + this.width > -world.camera_x && this.x < -world.camera_x + world.canvas.width;
    }
}

