/**
 * Represents a cloud in the background of the game.
 * Clouds move continuously to the left to create a scrolling effect.
 */
class Cloud extends MovableObject{
    y = 20;
    height = 250;
    width = 800; 

    constructor(){
        super().loadImage('./img/5_background/layers/4_clouds/1.png')
        this.x = Math.random() * 3000;
    }

    /**
     * Initiates the movement of the cloud to the left.
     */
    animate(){
        this.moveLeft()
    }
}

