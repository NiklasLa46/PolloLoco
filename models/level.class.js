/**
 * Represents a level in the game, containing all the objects within that level.
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 2200;

    /**
     * Creates a new Level instance.
     * @param {Array} enemies - The enemies present in this level.
     * @param {Array} clouds - The clouds in the level's background.
     * @param {Array} backgroundObjects - Other background objects in the level (e.g., platforms, structures).
     * @param {Array} bottles - Collectible bottles present in the level.
     * @param {Array} coins - Coins that the player can collect in this level.
     */
    constructor(enemies, clouds, backgroundObjects, bottles, coins) {
        this.enemies = enemies;
        this.bottles = bottles;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
    }
}

