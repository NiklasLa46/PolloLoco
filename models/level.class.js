class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins; 
    level_end_x = 2200;

    constructor(enemies, clouds, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.bottles = bottles
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins; 
    }
}
