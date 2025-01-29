class HealthBar extends StatusBar {
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
        this.setPercentage(100); // Start at full health
    }


}

