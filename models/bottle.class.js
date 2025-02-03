class Bottle extends UnmovableObject {
    height = 70;
    width = 70; // Define width for proper scaling
    y = 355; // Position near the ground
    IMAGES_STAND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];
    offset = {
        top: -10,
        right: -10, 
        bottom: -10,
        left: -10
    }

    constructor() {
        super();
        this.x = 200 + Math.random() * 2000; // Randomize position
        this.loadImage(this.IMAGES_STAND[0]); // Load the first image initially
        this.loadImages(this.IMAGES_STAND); // Preload all images
     
        this.animate();
    }


    animate() {

        setInterval(() => {
            this.playAnimation(this.IMAGES_STAND)
        }, 800);
    };


    pickup(character) {
        // Increment bottles but cap at 100
        character.bottles = Math.min(character.bottles + 10, 100);
    }
}
