/**
 * Represents a bottle object in the game that the character can collect.
 * The bottle is unmovable and animates between a set of images when displayed.
 */
class Bottle extends UnmovableObject {
    height = 70;
    width = 70;
    y = 355;
    IMAGES_STAND = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
    ];
    offset = {
        top: -10,
        right: -10, 
        bottom: -10,
        left: -10
    };

    constructor() {
        super();
        this.x = 200 + Math.random() * 3000;
        this.loadImage(this.IMAGES_STAND[0]);
        this.loadImages(this.IMAGES_STAND);
        this.animate();
    }

    /**
     * Animates the bottle by cycling through its images.
     */
    animate() {
        this.bottleInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_STAND);
        }, 800);
    }

    /**
     * Increases the character's bottle count when collected, capping the maximum at 100.
     * 
     * @param {Object} character - The character collecting the bottle.
     */
    pickup(character) {
        character.bottles = Math.min(character.bottles + 10, 100);
    }
}
