/**
 * Represents a collectible coin in the game.
 * Coins are stationary and animate between two frames to create a shimmering effect.
 */
class Coin extends UnmovableObject {
    height = 150;
    width = 150;
    y = 300;

    IMAGES_STAND = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png',
    ];

    offset = {
        top: -50,
        right: -50,
        bottom: -50,
        left: -50
    };

    constructor() {
        super();
        this.x = 200 + Math.random() * 3000;
        this.loadImage(this.IMAGES_STAND[0]);
        this.loadImages(this.IMAGES_STAND);
        this.startAnimation();
    }

    /**
     * Starts the coin animation to toggle between the images for a shimmering effect.
     */
    startAnimation() {
        this.coinInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_STAND);
        }, 500);
    }

    /**
     * Increases the character's coin count by 10 when picked up.
     * @param {Character} character - The character picking up the coin.
     */
    pickup(character) {
        character.coins += 10;
    }
}
