class ThrowableObject extends DrawableObject {
    speedY = 20;
    speedX = 15; 
    gravity = 2;
    timer;
    splashTimer;
    animationIndex = 0;
    hasCollided = false;
    isRemoved = false; // New property to track removal

    THROW_IMAGES = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];
    SPLASH_IMAGES = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 60 ;
        this.loadImages(this.THROW_IMAGES);
        this.loadImages(this.SPLASH_IMAGES);
        this.img = this.imageCache[this.THROW_IMAGES[0]]; // Initialize with the first image
    }

    throw() {
        this.timer = setInterval(() => {
            if (this.hasCollided) return; // Stop throwing if a collision occurred

            this.x += this.speedX;
            this.y -= this.speedY;
            this.speedY -= this.gravity; // Simulate gravity

            // Cycle through rotation images
            this.animationIndex = (this.animationIndex + 1) % this.THROW_IMAGES.length;
            this.img = this.imageCache[this.THROW_IMAGES[this.animationIndex]];

            // Stop when it hits the ground
            if (this.y >= 380)  { // Adjust based on your ground level
                this.y = 380 ;
                this.playSplashAnimation();
            }  
        }, 50);
    }

    playSplashAnimation() {
        clearInterval(this.timer); // Stop the throw animation
        this.speedX = 0;
        this.speedY = 0;
    
        let splashInterval = setInterval(() => {f
            this.animationIndex++;
            if (this.animationIndex < this.SPLASH_IMAGES.length) {
                this.img = this.imageCache[this.SPLASH_IMAGES[this.animationIndex]];
            } else {
                clearInterval(splashInterval);
                this.isRemoved = true; // Mark the bottle for removal
            }
        }, 100); // Adjust the frame duration as needed
    }
    
    stop() {
        clearInterval(this.timer);
    }
}


