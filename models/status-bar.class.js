class StatusBar extends DrawableObject {
    percentage = 100;
    IMAGES = []; // Subclasses will define this

    constructor() {
        super();
        this.x = 20;
        this.y = 10;
        this.width = 180;
        this.height = 60;
        this.isFixed = true; // Mark this object as fixed
    }

    setPercentage(percentage) {
        
        this.percentage = Math.max(0, Math.min(percentage, 100)); // Clamp percentage between 0 and 100
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    

    resolveImageIndex() {
        if (this.percentage === 0) return 0; // Explicitly handle 0% first
        if (this.percentage > 80) return 5; // 81-100%
        if (this.percentage > 60) return 4; // 61-80%
        if (this.percentage > 40) return 3; // 41-60%
        if (this.percentage > 20) return 2; // 21-40%
        return 1; // 1-20%
    }
    
    
}


