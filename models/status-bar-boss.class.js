class BossBar extends StatusBar {
    constructor() {
        super();
        this.IMAGES = [
                'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
                'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
                'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
                'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
                'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
                'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
            ];
        this.loadImages(this.IMAGES);
        this.x = 719 * 5 - 200
        this.y = 20;
        this.setPercentage(100); // Start at full health
    }


}





