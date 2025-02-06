class Coin extends UnmovableObject {
    height = 150;
    width = 150; // Define width for proper scaling
    y = 300; // Position near the ground
    IMAGES_STAND = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];
    offset = {
        top: -50,
        right: -50,
        bottom: -50,
        left: -50
    }
    constructor() {
        super();
        this.x = 200 + Math.random() * 3000; // Randomize position
        this.loadImage(this.IMAGES_STAND[0]); // Load the first image initially
        this.loadImages(this.IMAGES_STAND); // Preload all images
      

        this.animate();
    }
 

    animate() {

       this.coinIntervall = setInterval(() => {
            this.playAnimation(this.IMAGES_STAND)
        }, 500);
    };


    pickup(character) {
        character.coins += 10; // Increment coins in the character

    }
}