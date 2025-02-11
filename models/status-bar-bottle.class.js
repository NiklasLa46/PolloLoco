class BottleBar extends StatusBar {
    /**
     * Constructor for the BottleBar class.
     * Initializes the maximum number of bottles and the images for the bottle bar,
     * sets the position on the screen, and starts the bottle bar at 0% full.
     * 
     * @param {number} maxBottles The maximum number of bottles (default is 10).
     */
    constructor(maxBottles = 10) {
        super();
        this.maxBottles = maxBottles;
        this.IMAGES = [
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png'
        ];
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 65;
        this.setPercentage(0);
    }
}


