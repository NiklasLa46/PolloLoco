class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    startCollisions() {
        setInterval(() => {
            this.checkEnemyCollisions();
            this.checkCoinCollisions();
            this.checkBottleCollisions();
            this.checkThrowableBottleCollisions();
        }, 50);
    }

    checkEnemyCollisions() {
        if (!this.world.level || !this.world.level.enemies) {
            return;
        }

        this.world.level.enemies.forEach((enemy) => {
            if (this.isValidEnemy(enemy)) {
                this.checkCharacterCollisionsWithEnemy(enemy);
                this.handleEndbossCollision(enemy);
                this.handleEnemyDeath(enemy);
            }
        });
    }

    checkCharacterCollisionsWithEnemy(enemy) {
        this.world.character.checkJumpOnEnemy(enemy);
        if (!this.world.character.isJumping && !this.world.character.isHurt() && !this.world.character.isDead()) {
            if (this.world.character.isColliding(enemy)) {
                this.world.character.hit();
                this.world.soundManager.allSounds[1].play();
                this.world.healthBar.setPercentage(this.world.character.energy);
            }
        }
    }

    handleEndbossCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.world.bossBar.setPercentage(enemy.energy);
        }
    }

    handleEnemyDeath(enemy) {
        if (enemy.isDead() && !enemy.isDying && !(enemy instanceof Endboss)) {
            enemy.playDeathImage();
            this.world.soundManager.allSounds[4].play(); // Chicken death sound
        }
    }

    checkCoinCollisions() {
        if (!this.world.level || !this.world.level.coins) {
            return;
        }

        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isColliding(coin)) {
                coin.pickup(this.world.character);
                this.world.soundManager.allSounds[2].play();
                this.world.level.coins.splice(index, 1);
                this.world.coinBar.setPercentage(this.world.character.coins);
            }
        });
    }

    checkBottleCollisions() {
        if (!this.world.level || !this.world.level.bottles) {
            return;
        }

        this.world.level.bottles.forEach((bottle, index) => {
            if (this.world.character.isColliding(bottle) && typeof bottle.pickup === 'function') {
                bottle.pickup(this.world.character);
                this.world.soundManager.allSounds[3].play();
                this.world.level.bottles.splice(index, 1);
                this.world.bottleBar.setPercentage(this.world.character.bottles);
            }
        });
    }

    checkThrowableBottleCollisions() {
        this.world.throwableObjects.forEach((bottle) => {
            this.world.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy) && !bottle.hasCollided) {
                    bottle.playSplashAnimation();
                    bottle.hasCollided = true;
                    enemy.hit();
                }
            });
        });
    }
}
