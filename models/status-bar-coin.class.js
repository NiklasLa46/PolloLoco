class CoinBar extends StatusBar {
    constructor(maxCoins = 10) { // Specify max coins
        super();
        this.maxCoins = maxCoins; // Total coins to collect
        this.IMAGES = [
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
        ];
        this.loadImages(this.IMAGES);
        this.x = 20;
        this.y = 120;
        this.setPercentage(0); // Start at 0 coins collected
    }


}

