/**
 * Represents an object that cannot be moved in the game world.
 * This class can be used for objects like coins or bottles.
 */
class UnmovableObject extends DrawableObject {
    x = 120;
    y = 290;
    height = 150;
    width = 100;
    img;
    imageCache = [];
    currentImage = 0;
    isCoin = false;  // Flag to mark the object as a coin
    isBottle = false; // Flag to mark the object as a bottle

    /**
     * Creates an instance of the UnmovableObject.
     * 
     * @param {number} x - The initial x-coordinate of the object.
     * @param {number} y - The initial y-coordinate of the object.
     * @param {number} width - The width of the object.
     * @param {number} height - The height of the object.
     * @param {boolean} isCoin - A flag to indicate if this object represents a coin.
     * @param {boolean} isBottle - A flag to indicate if this object represents a bottle.
     */
    constructor(x, y, width, height, isCoin = false, isBottle = false) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isCoin = isCoin;
        this.isBottle = isBottle;
        this.img = new Image();
    }

    /**
     * Plays the animation for the object by cycling through the given image paths.
     * 
     * @param {Array<string>} images - The array of image paths for the animation.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}

