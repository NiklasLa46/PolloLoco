/**
 * Represents a drawable object in the game.
 * Provides methods for loading images, drawing the object, 
 * and checking for collisions with other objects.
 */
class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 290;
    height = 150;
    width = 100;
    isFixed = false;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    isRemoved = false;

    /**
     * Draws the object onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The rendering context.
     * @param {number} cameraX - The camera's x position for adjusting the object's position.
     */
    draw(ctx, cameraX = 0) {
        if (this.isRemoved) return;

        const drawX = this.isFixed ? this.x : this.x - cameraX;
        ctx.drawImage(this.img, drawX, this.y, this.width, this.height);
    }

    /**
     * Checks if the object overlaps with another area based on given coordinates and dimensions.
     * @param {number} x - The x position of the area to check.
     * @param {number} y - The y position of the area to check.
     * @param {number} width - The width of the area to check.
     * @param {number} height - The height of the area to check.
     * @returns {boolean} - Whether there is an overlap.
     */
    isOverlapping(x, y, width, height) {
        for (let obj of allObjects) {
            if (Math.abs(obj.x - x) < width && Math.abs(obj.y - y) < height) {
                return true;
            }
        }
        return false;
    }

    /**
     * Loads an image from the given path.
     * @param {string} path - The path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images from an array of paths.
     * @param {string[]} arr - An array of image paths to load.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Checks if this object is colliding with another movable object.
     * @param {MovableObject} mo - The movable object to check for collision.
     * @returns {boolean} - Whether the two objects are colliding.
     */
    isColliding(mo) {
        const thisLeft = this.x - this.offset.left;
        const thisRight = this.x + this.width + this.offset.right;
        const thisTop = this.y - this.offset.top;
        const thisBottom = this.y + this.height + this.offset.bottom;

        const moLeft = mo.x - mo.offset.left;
        const moRight = mo.x + mo.width + mo.offset.right;
        const moTop = mo.y - mo.offset.top;
        const moBottom = mo.y + mo.height + mo.offset.bottom;

        return thisRight > moLeft &&
            thisLeft < moRight &&
            thisBottom > moTop &&
            thisTop < moBottom;
    }
}
