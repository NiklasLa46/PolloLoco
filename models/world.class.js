/**
 * The World class handles the game world, including the main character, level, sounds, 
 * and in-game status bars. It manages the game environment, collisions, and game state.
 */
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
    bottle_sound = new Audio('/audio/bottlepickup.mp3');
    chickendeath_sound = new Audio('audio/chickendeath1.mp3');
    smallchickendeath_sound = new Audio('audio/chickendeath2.mp3');
    bossdmg_sound = new Audio('audio/bossdmg.mp3');
    throw_sound = new Audio('audio/throwing.mp3');
    gamewin_sound = new Audio('audio/winsound.mp3');
    gameover_sound = new Audio('audio/gameover.mp3');
    bossdeath_sound = new Audio('audio/bossdeath.mp3')
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    bossBar = new BossBar();
    coinBar = new CoinBar();
    throwableObjects = [];
    IMAGE_GAMEOVER = ['img/9_intro_outro_screens/game_over/game over.png'];
    IMAGE_WIN = ['img/9_intro_outro_screens/win/win_1.png'];
    gamePaused = false;
    hasWinSoundPlayed = false;
    allSounds = [
        this.background_music,
        this.dmg_sound,
        this.coin_sound,
        this.bottle_sound,
        this.chickendeath_sound,
        this.smallchickendeath_sound,
        this.bossdmg_sound,
        this.throw_sound,
        this.gamewin_sound,
        this.gameover_sound,
        this.character.walking_sound,
        this.character.sleeping_sound,
        this.character.jumping_sound,
        this.character.gameover_sound,
    ];

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
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.background_music.volume = 0.4;
        this.background_music.loop = true;
        this.initializeMuteButton();
    }

    /**
     * Initializes the mute button and sets up the event listeners to toggle mute/unmute.
     */
    initializeMuteButton() {
        const muteButton = document.getElementById('muteButton');
        const muteButtonRespo = document.getElementById('mute-responsive');
        muteButton.addEventListener('click', () => this.toggleMute());
        muteButtonRespo.addEventListener('click', () => this.toggleMute());
    }

    /**
     * Toggles the mute state of all sounds in the game.
     * If any sound is unmuted, it will mute them all, and vice versa.
     */
    toggleMute() {
        const isMuted = this.allSounds.every(sound => sound.muted);

        this.allSounds.forEach(sound => {
            sound.muted = !isMuted;
        });

        const muteButton = document.getElementById('muteButton');
        muteButton.textContent = isMuted ? 'Mute' : 'Unmute';
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
        this.throw_sound.play();
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
            this.dmg_sound.currentTime = 0;
            this.dmg_sound.play();
            this.healthBar.setPercentage(this.character.energy);
        }
    }
}


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
        this.bossdmg_sound.play();
    }
}

/**
 * Checks if the boss is dead and triggers its death animation.
 * @param {Endboss} enemy - The boss enemy to check for death.
 */
checkAndTriggerBossDeath(enemy) {
    if (enemy.isDead() && !enemy.deathAnimationPlaying) {
        this.bossdeath_sound.play()
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
            this.smallchickendeath_sound.play();
        }
        if (enemy instanceof Chicken) {
            this.chickendeath_sound.play();
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
            this.coin_sound.currentTime = 0;
            this.coin_sound.play();
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
            this.bottle_sound.currentTime = 0;
            this.bottle_sound.play();
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
    this.stopBackgroundMusic();
    this.muteCharacterSleepingSound();
    this.displayGameOverImage();
    this.hideBottomButtons();

    setTimeout(() => {
        this.showRestartButton();
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
 * Displays the restart button and makes it visible on the screen.
 */
showRestartButton() {
    document.querySelector('.restart-button').style.display = 'flex';
    if (window.innerWidth <= 1200) {
        document.querySelector('.all-canvas-buttons').style.display = 'block';
    }
}

/**
 * Hides the bottom buttons on smaller screens.
 */
hideBottomButtons() {
    if (window.innerWidth <= 1200) {
        document.querySelector('.bottom-buttons').style.display = 'none';
    }
}

/**
 * Displays the win screen, stops the background music, plays the win sound, 
 * and shows the end screen image.
 */
showWinScreen() {
    this.stopBackgroundMusic();
    this.muteCharacterSleepingSound();
    this.playWinSound();
    this.displayEndScreenImage(this.IMAGE_WIN[0]);

    setTimeout(() => {
        this.showRestartButton();
    }, 200);
}

/**
 * Stops the background music by pausing it.
 */
stopBackgroundMusic() {
    this.background_music.pause();
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
 * Plays the win sound if it hasn't been played already.
 */
playWinSound() {
    if (!this.hasWinSoundPlayed) {
        this.gamewin_sound.play();
        this.hasWinSoundPlayed = true;
    }
}

/**
 * Displays the end screen image at the center of the canvas.
 * @param {string} imageSrc - The source URL of the image to display.
 */
displayEndScreenImage(imageSrc) {
    const endImage = new Image();
    endImage.src = imageSrc;
    endImage.onload = () => {
        this.drawCenteredImage(endImage, 0.8);
    };
}

/**
 * Main drawing function that updates the game state and redraws everything on the canvas.
 * It will stop drawing if the game is paused.
 */
draw() {
    if (this.gamePaused) return;

    this.clearCanvas();
    this.translateCanvas();

    this.drawBackgroundObjects();
    this.drawLevelObjects();
    this.drawEnemies();
    this.drawThrowableObjects();
    this.drawCharacter();
    this.resetCanvasTranslation();
    
    this.drawUI();

    requestAnimationFrame(() => this.draw());

    this.playBackgroundMusicIfNeeded();
}

/**
 * Clears the canvas before drawing each frame.
 */
clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

/**
 * Translates the canvas for camera movement.
 */
translateCanvas() {
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
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
}

/**
 * Draws enemies, including updating the boss bar if the endboss is visible.
 */
drawEnemies() {
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
 * Plays the background music if it is not already playing.
 */
playBackgroundMusicIfNeeded() {
    if (!this.background_music.playing) {
        this.background_music.play().catch(() => { });
    }
}


/**
 * Adds a list of objects to the map for drawing.
 * @param {Array} objects - The objects to add to the map.
 */
addObjectsToMap(objects) {
    objects.forEach(o => {
        this.addToMap(o);
    });
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
            this.flipImageBack(mo)
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
