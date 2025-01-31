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
            for (let index = 0; index < this.level.enemies.length; index++) {
                const enemy = this.level.enemies[index];
    
                // Check for jumping on the enemy (character lands on top of enemy)
                this.character.checkJumpOnEnemy(enemy);
    
                // Only check for a hit if the character is touching the enemy physically
                if (!this.character.isJumping && !this.character.isHurt() && !this.character.isDead()) {
                    // Use the collision method to see if the character and enemy are actually colliding
                    if (this.character.isColliding(enemy)) {
                        this.character.hit();
                        this.dmg_sound.currentTime = 0; // Reset sound
                        this.dmg_sound.play();
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }
    
                // Handle enemy death animation logic
                if (enemy.isDead() && !enemy.deathAnimationPlaying) {
                    enemy.playDeathAnimation(enemy.IMAGE_DEATH); // Start the death animation
                    enemy.deathAnimationPlaying = true; // Mark the death animation as playing
    
                    // After the animation finishes (1 second in this case), remove the enemy
                    setTimeout(() => {
                        const index = this.level.enemies.indexOf(enemy);
                        if (index !== -1) {
                            this.level.enemies.splice(index, 1); // Remove the enemy from the array
                        }
                    }, 1000); // Adjust this duration to match the length of the death animation
                }
            }
    
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
                        if (enemy.isDead() && !enemy.deathAnimationPlaying) {
                            enemy.playDeathAnimation(enemy.IMAGE_DEATH); // Start the death animation
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
    
        // Filter out removed throwable objects
        this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.isRemoved);
        this.addObjectsToMap(this.throwableObjects); // This should now render only active objects
    
        this.addToMap(this.character);
    
        this.ctx.translate(-this.camera_x, 0);
    
        // Draw fixed UI elements
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
