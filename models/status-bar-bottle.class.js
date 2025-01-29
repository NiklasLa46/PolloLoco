class BottleBar extends StatusBar {
    constructor(maxBottles = 10) { // Specify max bottles
        super();
        this.maxBottles = maxBottles; // Total bottles to collect
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
        this.setPercentage(0); // Start at 0 bottles collected
    }


}

