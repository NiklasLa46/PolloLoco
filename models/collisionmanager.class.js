class CollisionManager {
    throwableObjects = [];

    /**
     * Creates an instance of the CollisionManager.
     * @param {Character} character - The main character of the game.
     * @param {Level} level - The level of the game containing enemies, coins, and bottles.
     * @param {SoundManager} soundManager - The sound manager for playing sounds.
     * @param {HealthBar} healthBar - The health bar to display the character's health.
     * @param {BottleBar} bottleBar - The bottle bar to display the character's bottle count.
     * @param {BossBar} bossBar - The boss bar to display the boss's health.
     * @param {Array} throwableObjects - List of throwable objects in the game.
     */
    constructor(character, level, soundManager, healthBar, bottleBar, bossBar, throwableObjects) {
        this.character = character;
        this.level = level;
        this.soundManager = soundManager;
        this.healthBar = healthBar;
        this.bottleBar = bottleBar;
        this.bossBar = bossBar;
        this.throwableObjects = throwableObjects;
        this.soundManager = new SoundManager();
    }

    /**
     * Starts the collision checks at a fixed interval.
     */
    checkCollisions() {
        this.worldCollisionsInterval = setInterval(() => {
            this.checkEnemyCollisions();
            this.checkCoinCollisions();
            this.checkBottleCollisions();
            this.checkThrowableBottleCollisions();
        }, 50);
    }

    /**
     * Checks for collisions between the character and enemies.
     */
    checkEnemyCollisions() {
        if (!this.level || !this.level.enemies) return;
        this.level.enemies.forEach((enemy) => {
            if (this.isValidEnemy(enemy)) {
                this.checkCharacterCollisionsWithEnemy(enemy);
                this.handleEndbossCollision(enemy);
            }
        });
    }

    /**
     * Determines if the enemy is valid for collision checks.
     * @param {Enemy} enemy - The enemy to check.
     * @returns {boolean} - Whether the enemy is valid for collision.
     */
    isValidEnemy(enemy) {
        return !enemy.isDying && !enemy.isRemoved;
    }

    /**
     * Checks for collisions between the character and a specific enemy.
     * @param {Enemy} enemy - The enemy to check for collisions with.
     */
    checkCharacterCollisionsWithEnemy(enemy) {
        this.character.checkJumpOnEnemy(enemy);
        
        if (!this.character.isJumping && !this.character.isHurt() && !this.character.isDead()) {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.soundManager.playSound(1);
                this.healthBar.setPercentage(this.character.energy);
                
                if (enemy.isDead() && !enemy.isDying) {
                    this.handleEnemyDeath(enemy);
                }
            }
        }
    }

    /**
     * Handles the death animation and sound for an enemy.
     * @param {Enemy} enemy - The enemy to handle the death for.
     */
    handleEnemyDeath(enemy) {
        if (enemy.isDead() && !enemy.isDying && !(enemy instanceof Endboss)) {
            enemy.playDeathImage();
            if (enemy instanceof SmallChicken) {
                this.soundManager.playSound(5);
            }
            if (enemy instanceof Chicken) {
                this.soundManager.playSound(4);
            }
        }
    }

    /**
     * Handles collisions with the Endboss.
     * @param {Enemy} enemy - The enemy being checked for Endboss collision.
     */
    handleEndbossCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.updateBossHealth(enemy);
            this.checkAndTriggerBossDeath(enemy);
        }
    }

    /**
     * Updates the health bar for the Endboss.
     * @param {Endboss} enemy - The Endboss to update the health for.
     */
    updateBossHealth(enemy) {
        if (enemy.isHurt()) {
            this.bossBar.setPercentage(enemy.energy);
            this.soundManager.playSound(6);
        }
    }

    /**
     * Checks and triggers the death of the Endboss.
     * @param {Endboss} enemy - The Endboss to check for death.
     */
    checkAndTriggerBossDeath(enemy) {
        if (enemy.isDead() && !enemy.deathAnimationPlaying) {
            this.soundManager.playSound(10);
            enemy.playDeathAnimation(enemy.IMAGES_DEATH);
            enemy.deathAnimationPlaying = true;

            setTimeout(() => {
                this.removeDeadBoss(enemy);
            }, 2000);
        }
    }

    /**
     * Removes a dead boss from the level.
     * @param {Endboss} enemy - The Endboss to remove.
     */
    removeDeadBoss(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index !== -1) {
            this.level.enemies.splice(index, 1);
        }
    }

    /**
     * Checks for collisions between the character and coins.
     */
    checkCoinCollisions() {
        if (!this.level || !this.level.coins) return;
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                coin.pickup(this.character);
                this.soundManager.playSound(2);
                this.level.coins.splice(index, 1);
                this.bottleBar.setPercentage(this.character.coins);
            }
        });
    }

    /**
     * Checks for collisions between the character and bottles.
     */
    checkBottleCollisions() {
        if (!this.level || !this.level.bottles) return;
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                bottle.pickup(this.character);
                this.soundManager.playSound(3);
                this.level.bottles.splice(index, 1);
                this.bottleBar.setPercentage(this.character.bottles);
            }
        });
    }

    /**
     * Checks for collisions between throwable bottles and enemies.
     */
    checkThrowableBottleCollisions() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.hasCollided) {
                    bottle.playSplashAnimation();
                    bottle.hasCollided = true;
                    enemy.hit();
                    if (enemy instanceof Endboss && !enemy.isDead()) {
                        this.bossBar.setPercentage(enemy.energy);
                    }
                    this.handleEnemyDeathAfterThrowableBottle(enemy);
                }
            });
        });
    }

    /**
     * Handles the death of an enemy after being hit by a throwable bottle.
     * @param {Enemy} enemy - The enemy to check for death after a bottle hit.
     */
    handleEnemyDeathAfterThrowableBottle(enemy) {
        if (enemy.isDead() && !enemy.deathAnimationPlaying && !(enemy instanceof Endboss)) {
            this.handleEnemyDeath(enemy);
            enemy.deathAnimationPlaying = true;

            setTimeout(() => {
                const index = this.level.enemies.indexOf(enemy);
                if (index !== -1) {
                    this.level.enemies.splice(index, 1);
                }
            }, 1000);
        }
    }
}

