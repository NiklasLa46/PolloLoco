class UnmovableObject extends DrawableObject {
    x = 120;
    y = 290;
    height = 150;
    width = 100;
    img;
    imageCache = [];
    currentImage = 0;
    isCoin = false;  // Flag to mark the object as a coin
    isBottle = false; // Flag to mark the object as a bottle

    constructor(x, y, width, height, isCoin = false, isBottle = false) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isCoin = isCoin;
        this.isBottle = isBottle;
        this.img = new Image();
    }



    playAnimation(images) {
        let i = this.currentImage % images.length; // Use the length of the provided images array
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
