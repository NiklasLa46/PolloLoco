class World {
    character = new Character();
    level = level1;
    canvas;
    keyboard;
    ctx;
    camera_x = 0;
    
    // Remove direct sound declarations from here
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    bossBar = new BossBar();
    coinBar = new CoinBar();
    throwableObjects = [];
    IMAGE_GAMEOVER = ['img/9_intro_outro_screens/game_over/game over.png'];
    IMAGE_WIN = ['img/9_intro_outro_screens/win/win_1.png'];
    gamePaused = false;
    hasWinSoundPlayed = false;
    
    soundManager = new SoundManager(); // Initialize SoundManager
    gameManager;

    allIntervalls = [
        clearInterval(this.bottleInterval),
        clearInterval(this.longidleInterval),
        clearInterval(this.characterInterval),
        clearInterval(this.characterDamageInterval),
        clearInterval(this.gravityIntervall),
        clearInterval(this.chickenIntervall),
        clearInterval(this.chickenDeathIntervall),
        clearInterval(this.coinIntervall),
        clearInterval(this.bossInterval),
        clearInterval(this.bossWalkIntervall),
        clearInterval(this.bossDeathInterval),
        clearInterval(this.movableDeathInterval),
        clearInterval(this.smallChickenInterval),
        clearInterval(this.smallChickenDeathInterval),
        clearInterval(this.timer),
    ];

    /**
     * Creates a new instance of the World class, setting up the canvas, keyboard,
     * and initializing the world with the provided configuration.
     * @param {HTMLCanvasElement} canvas - The canvas element used for rendering the game.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.gameManager = new GameManager(this.soundManager);
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.soundManager.background_music.volume = 0.4;
        this.soundManager.background_music.loop = true;
        this.soundManager.playBackgroundMusicIfNeeded(); // Make sure background music is playing
       
    }


    /**
     * Sets up the world by assigning the character's world context.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Throws a bottle if the character has bottles available, sets the throwing direction,
     * and handles the bottle's movement and collision detection.
     */
    throwBottle() {
        if (this.character.bottles > 0) {
            let throwDirection = this.character.otherDirection ? -1 : 1;
            let bottle = new ThrowableObject(this.character.x + 30, this.character.y + 90);
            bottle.speedX = throwDirection * 20;
            bottle.throw();
            this.soundManager.playSound(7); // Play throwing sound
            this.throwableObjects.push(bottle);
            this.character.bottles -= 10;
            this.bottleBar.setPercentage(this.character.bottles);
            this.character.resetIdleTimers();
        }
    }

    /**
     * Starts the collision check interval that continuously checks for collisions between 
     * the player, enemies, coins, bottles, and throwable bottles.
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
     * Checks for collisions between the character and the enemies in the level.
     */
    checkEnemyCollisions() {
        if (!this.level || !this.level.enemies) {
            return;
        }

        this.level.enemies.forEach((enemy) => {
            if (this.isValidEnemy(enemy)) {
                this.checkCharacterCollisionsWithEnemy(enemy);
                this.handleEndbossCollision(enemy);
                this.handleEnemyDeath(enemy);
            }
        });
    }

    /**
     * Checks if the enemy is valid for collision (not dying or removed).
     * @param {Enemy} enemy - The enemy object to check.
     * @returns {boolean} - Whether the enemy is valid for checking collisions.
     */
    isValidEnemy(enemy) {
        return !enemy.isDying && !enemy.isRemoved;
    }

    /**
     * Checks for collisions between the character and a valid enemy.
     * If a collision is detected, the character takes damage.
     * @param {Enemy} enemy - The enemy to check for collisions.
     */
    checkCharacterCollisionsWithEnemy(enemy) {
        this.character.checkJumpOnEnemy(enemy);

        if (!this.character.isJumping && !this.character.isHurt() && !this.character.isDead()) {
            if (this.character.isColliding(enemy)) {
                this.character.hit();
                this.soundManager.playSound(1); // Play damage sound
                this.healthBar.setPercentage(this.character.energy);
            }
        }
    }

    // Additional sound-related methods can be refactored similarly, using `soundManager.playSound()`



/**
 * Handles the collision with the endboss, updating the boss's health and triggering 
 * its death animation when necessary.
 * @param {Enemy} enemy - The enemy object involved in the collision (specifically an Endboss).
 */
handleEndbossCollision(enemy) {
    if (enemy instanceof Endboss) {
        this.updateBossHealth(enemy);
        this.checkAndTriggerBossDeath(enemy);
    }
}

/**
 * Updates the boss's health and plays the damage sound if the boss is hurt.
 * @param {Endboss} enemy - The boss enemy whose health is to be updated.
 */
updateBossHealth(enemy) {
    if (enemy.isHurt()) {
        this.bossBar.setPercentage(enemy.energy);
        this.soundManager.playSound(6); // Play boss damage sound
    }
}

/**
 * Checks if the boss is dead and triggers its death animation.
 * @param {Endboss} enemy - The boss enemy to check for death.
 */
checkAndTriggerBossDeath(enemy) {
    if (enemy.isDead() && !enemy.deathAnimationPlaying) {
        this.soundManager.playSound(10); // Play boss death sound
        enemy.playDeathAnimation(enemy.IMAGES_DEATH);
        enemy.deathAnimationPlaying = true;

        setTimeout(() => {
            this.removeDeadBoss(enemy);
        }, 2000); // Adjust to match the boss's death animation duration
    }
}

/**
 * Removes the boss from the level after its death animation has finished.
 * @param {Endboss} enemy - The dead boss to remove from the level.
 */
removeDeadBoss(enemy) {
    const index = this.level.enemies.indexOf(enemy);
    if (index !== -1) {
        this.level.enemies.splice(index, 1);
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

/**
 * Checks for collisions between the character and the coins in the level. If a 
 * collision is detected, the coin is picked up, and the coin bar is updated.
 */
checkCoinCollisions() {
    if (!this.level || !this.level.coins) {
        return;
    }

    this.level.coins.forEach((coin, index) => {
        if (this.character.isColliding(coin)) {
            coin.pickup(this.character);
            this.soundManager.playSound(2); // Play coin pickup sound
            this.level.coins.splice(index, 1);
            this.coinBar.setPercentage(this.character.coins);
        }
    });
}

/**
 * Checks for collisions between the character and the bottles in the level. If a 
 * collision is detected, the bottle is picked up, and the bottle bar is updated.
 */
checkBottleCollisions() {
    if (!this.level || !this.level.bottles) {
        return;
    }

    this.level.bottles.forEach((bottle, index) => {
        if (this.character.isColliding(bottle) && typeof bottle.pickup === 'function') {
            bottle.pickup(this.character);
            this.soundManager.playSound(3); // Play bottle pickup sound
            this.level.bottles.splice(index, 1);
            this.bottleBar.setPercentage(this.character.bottles);
        }
    });
}

/**
 * Checks for collisions between throwable bottles and enemies. If a collision is 
 * detected, the bottle triggers a splash animation, and the enemy takes damage.
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
 * Handles enemy death after a throwable bottle collision by triggering the death 
 * animation and removing the enemy from the level.
 * @param {Enemy} enemy - The enemy to be removed from the level.
 */
handleEnemyDeathAfterThrowableBottle(enemy) {
    if (enemy.isDead() && !enemy.deathAnimationPlaying && !(enemy instanceof Endboss)) {
        enemy.playDeathAnimation(enemy.IMAGES_DEATH);
        enemy.deathAnimationPlaying = true;

        setTimeout(() => {
            const index = this.level.enemies.indexOf(enemy);
            if (index !== -1) {
                this.level.enemies.splice(index, 1);
            }
        }, 1000);
    }
}


/**
 * Displays the game over screen, stops the background music, and hides the 
 * bottom buttons.
 */
showGameOverScreen() {
    this.soundManager.stopBackgroundMusic();
    this.muteCharacterSleepingSound();
    this.displayGameOverImage();
    this.gameManager.hideBottomButtons();

    setTimeout(() => {
        this.gameManager.showRestartButton();
    }, 200);
}

/**
 * Displays the game over image centered on the canvas.
 */
displayGameOverImage() {
    const gameOverImage = new Image();
    gameOverImage.src = this.IMAGE_GAMEOVER[0];
    gameOverImage.onload = () => {
        this.drawCenteredImage(gameOverImage, 1.2);
    };
}

/**
 * Draws an image centered on the canvas with a scaling factor.
 * @param {HTMLImageElement} image - The image to draw.
 * @param {number} scaleFactor - The scaling factor to apply to the image.
 */
drawCenteredImage(image, scaleFactor) {
    const scaleX = this.canvas.width / image.width;
    const scaleY = this.canvas.height / image.height;
    const scale = Math.min(scaleX, scaleY) * scaleFactor;
    const width = image.width * scale;
    const height = image.height * scale;

    this.ctx.drawImage(
        image,
        (this.canvas.width - width) / 2,
        (this.canvas.height - height) / 2,
        width,
        height
    );
}


/**
 * Displays the win screen, stops the background music, plays the win sound, 
 * and shows the end screen image.
 */
showWinScreen() {
    
    this.soundManager.stopBackgroundMusic();
    this.muteCharacterSleepingSound(); // Mute before playing the win sound
    this.soundManager.playSound(8); // Play the win sound
    this.displayEndScreenImage(this.IMAGE_WIN[0]);
    setTimeout(() => {
        this.gameManager.showRestartButton();
    }, 200);
}

/**
 * Mutes the character's sleeping sound by setting its volume to 0.
 */
muteCharacterSleepingSound() {
    if (this.character && this.character.sleeping_sound) {
        this.character.sleeping_sound.volume = 0.0;
    }
}

/**
 * Displays the end screen image (win or game over).
 * @param {string} imageSrc - The source of the image to display.
 */
displayEndScreenImage(imageSrc) {
    const endScreenImage = new Image();
    endScreenImage.src = imageSrc;
    endScreenImage.onload = () => {
        this.drawCenteredImage(endScreenImage, 0.8);
    };
}


/**
 * Main drawing function that updates the game state and redraws everything on the canvas.
 * It will stop drawing if the game is paused.
 */
draw() {
    if (this.gamePaused) return;

    this.clearCanvas();
    this.applyCanvasTranslation();
    
    this.drawBackgroundObjects();
    this.drawLevelObjects();
    this.drawEnemies();
    this.drawThrowableObjects();
    this.drawCharacter();
    this.resetCanvasTranslation();

    this.drawUI();

    requestAnimationFrame(() => this.draw());

    this.soundManager.playBackgroundMusicIfNeeded();
}

/**
 * Clears the canvas before drawing each frame.
 */
clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/**
 * Applies the translation to the canvas for camera movement.
 */
applyCanvasTranslation() {
    this.ctx.translate(this.camera_x, 0);
}

/**
 * Draws the background objects to the canvas.
 */
drawBackgroundObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
}

/**
 * Draws all objects (coins, bottles, enemies, clouds) to the canvas.
 */
drawLevelObjects() {
    this.addObjectsToMap([...this.level.bottles, ...this.level.coins, ...this.level.clouds, ...this.level.enemies]);
}

/**
 * Draws enemies, including updating the boss bar if the endboss is visible.
 */
drawEnemies() {
    this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss) {
            this.updateBossVisibility(enemy);
        }
    });
}

/**
 * Updates the visibility of the endboss and draws the boss bar.
 */
updateBossVisibility(enemy) {
    enemy.checkVisibility(this.camera_x, this.canvas.width);
    if (enemy.isVisible) {
        this.bossBar.x = enemy.x + 40;
        this.bossBar.y = enemy.y - 20;
        this.addToMap(this.bossBar);
    }
}

/**
 * Draws throwable objects (e.g., bottles) to the canvas.
 */
drawThrowableObjects() {
    this.throwableObjects = this.throwableObjects.filter(bottle => !bottle.isRemoved);
    this.addObjectsToMap(this.throwableObjects);
}

/**
 * Draws the character to the canvas.
 */
drawCharacter() {
    this.addToMap(this.character);
}

/**
 * Resets the canvas translation after drawing the character and other objects.
 */
resetCanvasTranslation() {
    this.ctx.translate(-this.camera_x, 0);
}

/**
 * Draws the UI elements like health bar, bottle bar, and coin bar.
 */
drawUI() {
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
}

/**
 * Adds a list of objects to the map for drawing.
 * @param {Array} objects - The objects to add to the map.
 */
addObjectsToMap(objects) {
    objects.forEach(o => this.addToMap(o));
}

/**
 * Adds a single object to the map and draws it.
 * @param {Object} mo - The object to add to the map.
 */
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
            this.flipImageBack(mo);
        }
    }
}

/**
 * Flips an object horizontally by applying a transformation on the canvas context.
 * @param {Object} mo - The object to flip.
 */
flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
}

/**
 * Resets the transformation applied to flip an object back to its original state.
 * @param {Object} mo - The object to flip back.
 */
flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
}
}
