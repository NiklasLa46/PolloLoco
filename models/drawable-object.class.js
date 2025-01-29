class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 290;
    height = 150;
    width = 100;
    isFixed = false; // Determines if the object is static on the screen
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }


    draw(ctx, cameraX = 0) {
        const drawX = this.isFixed ? this.x : this.x - cameraX; // Adjust position based on `isFixed`
        ctx.drawImage(this.img, drawX, this.y, this.width, this.height);
    }

    loadImage(path){
        this.img = new Image();
        this.img.src = path;
    }
 
    loadImages(arr){
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    drawFrame(ctx) {
        if (this instanceof Chicken || this instanceof Character || this instanceof SmallChicken || this instanceof Bottle || this instanceof Coin || this instanceof Endboss) {
    
            // Visualize the actual bounding box considering the offset
            const offsetX = this.x - this.offset.left;
            const offsetY = this.y - this.offset.top;
            const offsetWidth = this.width + this.offset.left + this.offset.right;
            const offsetHeight = this.height + this.offset.top + this.offset.bottom;
    
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';  // Change color for visual clarity
            ctx.rect(offsetX, offsetY, offsetWidth, offsetHeight);
            ctx.stroke();
        }
    }
    

    
    isColliding(mo) {
        // Adjust the bounds based on the offset
        const thisLeft = this.x - this.offset.left;
        const thisRight = this.x + this.width + this.offset.right;
        const thisTop = this.y - this.offset.top;
        const thisBottom = this.y + this.height + this.offset.bottom;
    
        const moLeft = mo.x - mo.offset.left;
        const moRight = mo.x + mo.width + mo.offset.right;
        const moTop = mo.y - mo.offset.top;
        const moBottom = mo.y + mo.height + mo.offset.bottom;
    
        // Perform the collision check with the adjusted bounds
        return thisRight > moLeft &&
               thisLeft < moRight &&
               thisBottom > moTop &&
               thisTop < moBottom;
    }
    


}