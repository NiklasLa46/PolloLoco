class CollisionManager {
    throwableObjects = [];
    constructor(character, level, soundManager, healthBar, bottleBar, bossBar, throwableObjects) {
        this.character = character;
        this.level = level;
        this.soundManager = soundManager;
        this.healthBar = healthBar;
        this.bottleBar = bottleBar;
        this.bossBar = bossBar;
        this.throwableObjects = throwableObjects;
        this.soundManager = new SoundManager()
    }

    checkCollisions() {
        this.worldCollisionsInterval = setInterval(() => {
            this.checkEnemyCollisions();
            this.checkCoinCollisions();
            this.checkBottleCollisions();
            this.checkThrowableBottleCollisions();
        }, 50);
    }
    checkEnemyCollisions() {
        if (!this.level || !this.level.enemies) return;
        this.level.enemies.forEach((enemy) => {
            if (this.isValidEnemy(enemy)) {
                this.checkCharacterCollisionsWithEnemy(enemy);
                this.handleEndbossCollision(enemy);
            }
        });
    }

    isValidEnemy(enemy) {
        return !enemy.isDying && !enemy.isRemoved;
    }

checkCharacterCollisionsWithEnemy(enemy) {
    this.character.checkJumpOnEnemy(enemy); // Check if the character jumps on the enemy

    if (!this.character.isJumping && !this.character.isHurt() && !this.character.isDead()) {
        if (this.character.isColliding(enemy)) {
            this.character.hit(); // Character hits the enemy
            this.soundManager.playSound(1); // Play damage sound
            this.healthBar.setPercentage(this.character.energy);
            
            if (enemy.isDead() && !enemy.isDying) {
                this.handleEnemyDeath(enemy); // Handle the death logic
            }
        }
    }
}

    
    
    /**
 * Handles the death animation for enemies that are not the endboss. This includes 
 * playing the death animation and triggering specific death sounds for each enemy type.
 * @param {Enemy} enemy - The enemy object that is being handled for death.
 */
handleEnemyDeath(enemy) {
    if (enemy.isDead() && !enemy.isDying && !(enemy instanceof Endboss)) {
        enemy.playDeathImage();
        if (enemy instanceof SmallChicken) {
            this.soundManager.playSound(5); // Play small chicken death sound
        }
        if (enemy instanceof Chicken) {
            this.soundManager.playSound(4); // Play chicken death sound
        }
    }
}


    handleEndbossCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.updateBossHealth(enemy);
            this.checkAndTriggerBossDeath(enemy);
        }
    }

    updateBossHealth(enemy) {
        if (enemy.isHurt()) {
            this.bossBar.setPercentage(enemy.energy);
            this.soundManager.playSound(6); // Play boss damage sound
        }
    }

    checkAndTriggerBossDeath(enemy) {
        if (enemy.isDead() && !enemy.deathAnimationPlaying) {
            this.soundManager.playSound(10); // Play boss death sound
            enemy.playDeathAnimation(enemy.IMAGES_DEATH);
            enemy.deathAnimationPlaying = true;

            setTimeout(() => {
                this.removeDeadBoss(enemy);
            }, 2000);
        }
    }

    removeDeadBoss(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index !== -1) {
            this.level.enemies.splice(index, 1);
        }
    }

    checkCoinCollisions() {
        if (!this.level || !this.level.coins) return;
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                coin.pickup(this.character);
                this.soundManager.playSound(2); // Play coin pickup sound
                this.level.coins.splice(index, 1);
                this.bottleBar.setPercentage(this.character.coins);
            }
        });
    }

    checkBottleCollisions() {
        if (!this.level || !this.level.bottles) return;
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle)) {
                bottle.pickup(this.character);
                this.soundManager.playSound(3); // Play bottle pickup sound
                this.level.bottles.splice(index, 1);
                this.bottleBar.setPercentage(this.character.bottles);
            }
        });
    }

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

    handleEnemyDeathAfterThrowableBottle(enemy) {
        if (enemy.isDead() && !enemy.deathAnimationPlaying && !(enemy instanceof Endboss)) {
            this.handleEnemyDeath(enemy)
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
