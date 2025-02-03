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
    IMAGE_GAMEOVER = [
        'img/9_intro_outro_screens/game_over/game over.png'
    ]



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
            this.character.bottles -= 1; // Decrease by 1, not 11
            this.bottleBar.setPercentage(this.character.bottles); // Update the bottle bar
    
            // Reset the idle timers on bottle throw
            this.character.resetIdleTimers();
        }
    }

    checkCollisions() {
        setInterval(() => {
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
                // Handle Endboss-specific logic
                if (enemy instanceof Endboss) {
                    // Update the BossBar when the boss takes damage
                    if (enemy.isHurt() && !enemy.isDead()) {
                        this.bossBar.setPercentage(enemy.energy);
                    }
    
                    // Trigger death animation for Endboss
                    if (enemy.isDead() && !enemy.deathAnimationPlaying) {
                        enemy.playDeathAnimationBoss(enemy.IMAGES_DEATH); // Start the boss's death animation
                        enemy.deathAnimationPlaying = true;
    
                        setTimeout(() => {
                            const index = this.level.enemies.indexOf(enemy);
                            if (index !== -1) {
                                this.level.enemies.splice(index, 1); // Remove the boss from the array
                            }
                        }, 2000); // Adjust to match the boss's death animation duration
                    }
                }
    
                // Handle enemy death animation for regular enemies
                if (enemy.isDead() && !enemy.isDying && !(enemy instanceof Endboss)) {
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
    
                        // Update the BossBar for the Endboss
                        if (enemy instanceof Endboss && !enemy.isDead()) {
                            this.bossBar.setPercentage(enemy.energy);
                        }
    
                        if (enemy.isDead() && !enemy.deathAnimationPlaying && !(enemy instanceof Endboss)) {
                            enemy.playDeathAnimation(enemy.IMAGES_DEATH); // Start the death animation
                            enemy.deathAnimationPlaying = true;
    
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
    
    showGameOverScreen() {
        // Stop the background music
        this.background_music.pause();
    
        // Display the game over screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const gameOverImage = new Image();
        gameOverImage.src = this.IMAGE_GAMEOVER[0];
        gameOverImage.onload = () => {
            // Calculate the scaling factors for the image
            const scaleX = this.canvas.width / gameOverImage.width;
            const scaleY = this.canvas.height / gameOverImage.height;
    
            // Use the smaller scaling factor to preserve the aspect ratio
            const scale = Math.min(scaleX, scaleY);
    
            // Calculate new width and height
            const width = gameOverImage.width * scale;
            const height = gameOverImage.height * scale;
    
            // Draw the image in the center of the canvas
            this.ctx.drawImage(
                gameOverImage,
                (this.canvas.width - width) / 2, // Center horizontally
                (this.canvas.height - height) / 2, // Center vertically
                width, // New width
                height // New height
            );
        };
    }
    

    draw() {
        if (this.gameOverTriggered) {
            return; // Stop the game loop
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                enemy.checkVisibility(this.camera_x, this.canvas.width);
                if (enemy.isVisible) {
                    this.bossBar.x = enemy.x + 40;
                    this.bossBar.y = enemy.y - 20;
                    this.addToMap(this.bossBar);
                }
            }
        });
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.isRemoved);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
    
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
