class HealthBar extends StatusBar {
    /**
     * Constructor for the HealthBar class.
     * Initializes the images for the health bar, sets the position on the screen,
     * and starts the health bar at 100% full health.
     */
    constructor() {
        super();
        this.IMAGES = [
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
        ];
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 10;
        this.setPercentage(100);
    }
}

