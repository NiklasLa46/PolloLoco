class World {
    character = new Character();
    level = level1;
    canvas;
    keyboard;
    ctx;
    camera_x = 0;
    background_music = new Audio('./audio/background.mp3');
    dmg_sound = new Audio('/audio/pepedmg1.mp3');
    coin_sound = new Audio('/audio/coinpickup.mp3');
    bottle_sound = new Audio('/audio/bottlepickup.mp3')
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    bossBar = new BossBar();
    coinBar = new CoinBar();
    throwableObjects = [];




    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions()
        this.background_music.volume = 0;
        this.background_music.loop = true;

    }

    setWorld() {
        this.character.world = this;
    }

    throwBottle() {
        if (this.character.bottles > 0) {
            let throwDirection = this.character.otherDirection ? -1 : 1; // -1 for left, 1 for right
            let bottle = new ThrowableObject(this.character.x + 30, this.character.y + 90); // Create bottle at character position
            bottle.speedX = throwDirection * 20; // Set speedX based on direction
            bottle.throw(); // Start throwing the bottle
            this.throwableObjects.push(bottle); // Push bottle into throwableObjects array for collision detection

            // Reduce character's bottle count by 1
            this.character.bottles -= 11; // Decrease by 1, not 11
            this.bottleBar.setPercentage(this.character.bottles); // Update the bottle bar
        }
    }

    checkCollisions() {
        setInterval(() => {
            // Check collisions with enemies
            // Check collisions with enemies
            this.level.enemies.forEach((enemy, index) => {
                if (enemy.isDying || enemy.isRemoved) return; // Skip if enemy is dying or removed

                // Check for jumping on the enemy
                this.character.checkJumpOnEnemy(enemy);

                // Check physical collision
                if (!this.character.isJumping && !this.character.isHurt() && !this.character.isDead()) {
                    if (this.character.isColliding(enemy)) {
                        this.character.hit();
                        this.dmg_sound.currentTime = 0; // Reset sound
                        this.dmg_sound.play();
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }

                // Handle enemy death animation
                if (enemy.isDead() && !enemy.isDying  && !(enemy instanceof Endboss)) {
                    enemy.playDeathImage(); // Trigger the death image
                }
            });


            // Check collisions with coins
            this.level.coins.forEach((coin, index) => {
                if (this.character.isColliding(coin)) {
                    coin.pickup(this.character);
                    this.coin_sound.currentTime = 0; // Reset sound
                    this.coin_sound.play();
                    this.level.coins.splice(index, 1); // Remove picked-up coin
                    this.coinBar.setPercentage(this.character.coins); // Update coin bar
                }
            });

            // Check collisions with bottles
            this.level.bottles.forEach((bottle, index) => {
                if (this.character.isColliding(bottle) && typeof bottle.pickup === 'function') {
                    bottle.pickup(this.character);
                    this.bottle_sound.currentTime = 0; // Reset sound
                    this.bottle_sound.play();
                    this.level.bottles.splice(index, 1); // Remove picked-up bottle
                    this.bottleBar.setPercentage(this.character.bottles); // Update bottle bar
                }
            });

            // Handle throwable bottles separately
            this.throwableObjects.forEach((bottle) => {
                this.level.enemies.forEach((enemy) => {
                    if (bottle.isColliding(enemy) && !bottle.hasCollided) {
                        bottle.playSplashAnimation();
                        bottle.hasCollided = true; // Mark the bottle as collided
                        enemy.hit(); // Damage the enemy
    
                        if (enemy.isDead() && !enemy.deathAnimationPlaying && !(enemy instanceof Endboss)) {
                            enemy.playDeathAnimation(enemy.IMAGES_DEATH); // Start the death animation
                            enemy.deathAnimationPlaying = true; // Mark the death animation as playing
                            setTimeout(() => {
                                const index = this.level.enemies.indexOf(enemy);
                                if (index !== -1) {
                                    this.level.enemies.splice(index, 1); // Remove the enemy from the array
                                }
                            }, 1000); // Adjust this duration to match the length of the death animation
                        }
                    }
                });
            });

        }, 50);
    }




    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);

        // Check Endboss visibility
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                enemy.checkVisibility(this.camera_x, this.canvas.width);
            }
        });

        // Filter out removed throwable objects
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.isRemoved);
        this.addObjectsToMap(this.throwableObjects);

        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0);

        // Draw fixed UI elements
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bossBar);

        requestAnimationFrame(() => this.draw());

        if (!this.background_music.playing) {
            this.background_music.play().catch(() => { });
        }
    }





    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (typeof mo.draw === 'function') {
            if (mo.otherDirection) {
                this.flipImage(mo);
            }
            mo.draw(this.ctx);
            if (typeof mo.drawFrame === 'function') {
                mo.drawFrame(this.ctx);
            }
            if (mo.otherDirection) {
                this.flipImageBack(mo)
            }
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
