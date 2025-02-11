class DisplayManager {
    constructor(ctx, world) {
        this.ctx = ctx;
        this.world = world;
    }

    /**
     * Draws all UI elements like health bar, bottle bar, and coin bar.
     */
    drawUI() {
        this.addToMap(this.world.healthBar);
        this.addToMap(this.world.bottleBar);
        this.addToMap(this.world.coinBar);
    }

    /**
     * Adds a list of objects to the map for drawing.
     * @param {Array} objects - The objects to add to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Adds a single object to the map and draws it.
     * @param {Object} mo - The object to add to the map.
     */
    addToMap(mo) {
        if (typeof mo.draw === 'function') {
            if (mo.otherDirection) {
                this.flipImage(mo);
            }
            mo.draw(this.ctx);
            if (typeof mo.drawFrame === 'function') {
                mo.drawFrame(this.ctx);
            }
            if (mo.otherDirection) {
                this.flipImageBack(mo)
            }
        }
    }

    /**
     * Flips an object horizontally by applying a transformation on the canvas context.
     * @param {Object} mo - The object to flip.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Resets the transformation applied to flip an object back to its original state.
     * @param {Object} mo - The object to flip back.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
