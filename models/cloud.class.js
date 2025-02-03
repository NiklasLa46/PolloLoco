class Cloud extends MovableObject{
    y = 20;
    height = 250;
    width = 450; 


    constructor() {
        super().loadImage('./img/5_background/layers/4_clouds/1.png');
        
        let newX, newY;
        do {
            newX = Math.random() * 3000; // Generate random x position
            newY = 20; // y position remains constant for Cloud
        } while (this.isOverlapping(newX, newY, this.width, this.height)); // Check if the position overlaps

        this.x = newX; // Set the position
        this.animate();
        allObjects.push(this); // Add this object to the list
    }

    animate(){
        this.moveLeft()
    }


}

