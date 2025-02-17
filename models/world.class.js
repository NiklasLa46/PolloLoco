class World {
    character = new Character();
    level = level1;
    canvas;
    keyboard;
    ctx;
    camera_x = 0;
    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    bossBar = new BossBar();
    coinBar = new CoinBar();
    throwableObjects = [];
    IMAGE_GAMEOVER = ['img/9_intro_outro_screens/game_over/game over.png'];
    IMAGE_WIN = ['img/9_intro_outro_screens/win/win_1.png'];
    gamePaused = false;
    hasWinSoundPlayed = false;
   
    soundManager = new SoundManager(this.character);
    boss = new Endboss();

    

    collisionManager = new CollisionManager(
        this.character,
        this.level,
        this.soundManager,
        this.healthBar,
        this.bottleBar,
        this.bossBar,
        this.throwableObjects,
    );


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
        this.restartButtonVisible = false; 
        this.bottomButtonsHidden = false;
        this.draw();
        this.setWorld();
        this.soundManager.background_music.volume = 0.3;
        this.soundManager.background_music.loop = true;
        this.soundManager.playBackgroundMusicIfNeeded(); // Make sure background music is playing
        this.initializeMuteButton();
        this.checkCollisions();
    }

           /**
     * Calls the Function to stop Collision checking.
     */
    stopCollisionChecks() {
        this.collisionManager.stopCollisions();
    }

       /**
     * Calls the Collsion Managers main Function.
     */
    checkCollisions() {
        this.collisionManager.checkCollisions();
    }

    /**
     * Initializes the mute button and sets up the event listeners to toggle mute/unmute.
     */
    initializeMuteButton() {
        const muteButton = document.getElementById('muteButton');
        const muteButtonRespo = document.getElementById('mute-responsive');
        muteButton.addEventListener('click', () => this.soundManager.toggleMute());
        muteButtonRespo.addEventListener('click', () => this.soundManager.toggleMute());
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
            this.collisionManager.throwableObjects.push(bottle);
            this.throwableObjects.push(bottle);
            this.character.bottles -= 10;
            this.bottleBar.setPercentage(this.character.bottles);
            this.character.resetIdleTimers();
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
        if (window.innerWidth <= 1200) {
            const allCanvasButtons = document.getElementById('all-canvas-buttons');
            if (!this.restartButtonVisible) {
                allCanvasButtons.style.display = 'flex';  
                this.restartButtonVisible = true;
            }
        } else {
            document.getElementById('restartButton').style.display = 'flex';
        }
    }
    

    /**
     * Hides the bottom buttons on smaller screens.
     */
    hideBottomButtons() {
        if (window.innerWidth <= 1200 && !this.bottomButtonsHidden) {
            document.querySelector('.bottom-buttons').style.display = 'none';
            this.bottomButtonsHidden = true; 
        }
    }

        /**
     * Resets the bottomButtons state.
     */
    resetBottomButtonsState() {
        this.bottomButtonsHidden = false; 
    }

    /**
     * Displays the win screen, stops the background music, plays the win sound, 
     * and shows the end screen image.
     */
    showWinScreen() {
        this.soundManager.stopBackgroundMusic();
        this.muteCharacterSleepingSound(); 
        this.soundManager.playSound(8); 
        this.displayEndScreenImage(this.IMAGE_WIN[0]);
        this.hideBottomButtons();
        setTimeout(() => {
            this.showRestartButton();
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
        if (this.gamePaused) return
        this.clearCanvas();
        this.applyCanvasTranslation();
        this.drawBackgroundObjects();
        this.drawLevelObjects();
        this.drawEnemies();
        this.drawThrowableObjects();
        this.resetCanvasTranslation();
        this.drawUI();
        this.applyCanvasTranslation();
        this.drawCharacter();
        this.resetCanvasTranslation();
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
