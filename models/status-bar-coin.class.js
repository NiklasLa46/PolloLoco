class CoinBar extends StatusBar {
    /**
     * Constructor for the CoinBar class.
     * Initializes the maximum number of coins and the images for the coin bar,
     * sets the position on the screen, and starts the coin bar at 0% full.
     * 
     * @param {number} maxCoins The maximum number of coins (default is 10).
     */
    constructor(maxCoins = 10) {
        super();
        this.maxCoins = maxCoins;
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
        this.setPercentage(0);
    }
}

