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
    isRemoved = false;
    


    draw(ctx, cameraX = 0) {
        if (this.isRemoved) return; // Don't render if removed
    
        const drawX = this.isFixed ? this.x : this.x - cameraX; // Adjust position based on `isFixed`
        ctx.drawImage(this.img, drawX, this.y, this.width, this.height);
    }

    
    isOverlapping(x, y, width, height) {
        for (let obj of allObjects) {
            if (Math.abs(obj.x - x) < width && Math.abs(obj.y - y) < height) {
                return true; // If overlap is detected
            }
        }
        return false; // No overlap
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