class StatusBar extends DrawableObject {
    /**
     * Represents a status bar displaying a percentage (e.g., health, bottles, or coins).
     * The class manages the percentage and updates the image accordingly.
     */
    percentage = 100;
    IMAGES = [];

    /**
     * Constructor for the StatusBar class.
     * Initializes the position, size, and other properties of the status bar.
     */
    constructor() {
        super();
        this.x = 20;
        this.y = 10;
        this.width = 180;
        this.height = 60;
        this.isFixed = true;
    }

    /**
     * Sets the percentage value for the status bar and updates the displayed image.
     * The percentage is clamped between 0 and 100.
     * 
     * @param {number} percentage - The percentage to set (between 0 and 100).
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(percentage, 100));
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the appropriate image index based on the current percentage.
     * 
     * @returns {number} The index of the image to display, based on the current percentage.
     */
    resolveImageIndex() {
        if (this.percentage === 0) return 0;
        if (this.percentage > 80) return 5;
        if (this.percentage > 60) return 4;
        if (this.percentage > 40) return 3;
        if (this.percentage > 20) return 2;
        return 1;
    }
}


