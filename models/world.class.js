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
    chickendeath_sound = new Audio('audio/chickendeath1.mp3')
    smallchickendeath_sound = new Audio('audio/chickendeath2.mp3')
    bossdmg_sound = new Audio('audio/bossdmg.mp3')
    throw_sound = new Audio('audio/throwing.mp3') 
    gamewin_sound = new Audio('audio/winsound.mp3')
    gameover_sound = new Audio('audio/gameover.mp3')

    healthBar = new HealthBar();
    bottleBar = new BottleBar();
    bossBar = new BossBar();
    coinBar = new CoinBar();
    throwableObjects = [];
    IMAGE_GAMEOVER = [
        'img/9_intro_outro_screens/game_over/game over.png'
    ]
    IMAGE_WIN = [
         'img/9_intro_outro_screens/win/win_1.png'
    ]
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

    gameLoopInterval = null; // Store the game loop interval ID
    collisionCheckInterval = null; 

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions()
        this.background_music.volume = 0.4;
        this.background_music.loop = true;
        this.initializeMuteButton();
        this.startGameLoop();
    }

    startGameLoop() {
        this.gameLoopInterval = requestAnimationFrame(() => this.draw());
    }


    stopGame() {
        // Clear the game loop
        if (this.gameLoopInterval) {
            cancelAnimationFrame(this.gameLoopInterval);
            this.gameLoopInterval = null; // Reset the interval ID
        }

        // Clear any other intervals
        if (this.collisionCheckInterval) {
            clearInterval(this.collisionCheckInterval);
            this.collisionCheckInterval = null; // Reset the interval ID
        }

        // Stop any animations or timeouts related to characters or objects
        if (this.character) {
            clearTimeout(this.character.idleTimeout);
            clearTimeout(this.character.longIdleTimeout);
        }

        // Stop sounds
        this.character.walking_sound.pause();
        this.character.sleeping_sound.pause();
        this.character.jumping_sound.pause();
        this.character.gameover_sound.pause();

        // Nullify references to prevent memory leaks
        this.character = null;
        this.enemies = [];
        this.coins = [];
        this.bottles = [];
    }


    initializeMuteButton() {
        const muteButton = document.getElementById('muteButton');
        muteButton.addEventListener('click', () => this.toggleMute());
    }

    toggleMute() {
        const isMuted = this.allSounds.every(sound => sound.muted);

        this.allSounds.forEach(sound => {
            sound.muted = !isMuted;
        });

        // Update button text
        const muteButton = document.getElementById('muteButton');
        muteButton.textContent = isMuted ? 'Mute' : 'Unmute';
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
            this.throw_sound.play();
            this.throwableObjects.push(bottle); // Push bottle into throwableObjects array for collision detection
    
            // Reduce character's bottle count by 1
            this.character.bottles -= 10; // Decrease by 1, not 11
            this.bottleBar.setPercentage(this.character.bottles); // Update the bottle bar
    
            // Reset the idle timers on bottle throw
            this.character.resetIdleTimers();
        }
    }

    checkCollisions() {
        this.collisionCheckInterval = setInterval(() => {
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
                        if (enemy.isHurt() ) {
                            this.bossBar.setPercentage(enemy.energy);
                            this.bossdmg_sound.play();
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
                        if (enemy instanceof SmallChicken) {
                            this.smallchickendeath_sound.play();
                        }
                        if (enemy instanceof Chicken) {
                            this.chickendeath_sound.play();
                        }
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
        
        }, 50)
       
    }
    
    showGameOverScreen() {
        // Stop the background music
        this.background_music.pause();
        this.character.sleeping_sound.volume = 0.0;
        // Display the game over screen
        
        const gameOverImage = new Image();
        gameOverImage.src = this.IMAGE_GAMEOVER[0];
        gameOverImage.onload = () => {
            // Calculate the scaling factors for the image
            const scaleX = this.canvas.width / gameOverImage.width;
            const scaleY = this.canvas.height / gameOverImage.height;
    
            // Use the smaller scaling factor to preserve the aspect ratio
            const scale = Math.min(scaleX, scaleY) * 1.2;
    
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
        document.querySelector('.restart-button').style.display = 'flex';
    }
    

    showWinScreen() {
        this.background_music.pause();
        this.character.sleeping_sound.volume = 0.0;
        if (!this.hasWinSoundPlayed) {
            this.gamewin_sound.play();
            this.hasWinSoundPlayed = true; // Set the flag to true after playing
        }

        const winImage = new Image();
        winImage.src = this.IMAGE_WIN[0];
        winImage.onload = () => {
            // Calculate the scaling factors for the image
            const scaleX = this.canvas.width / winImage.width;
            const scaleY = this.canvas.height / winImage.height;

            // Use the smaller scaling factor to preserve the aspect ratio
            const scale = Math.min(scaleX, scaleY) * 0.8;

            // Calculate new width and height
            const width = winImage.width * scale;
            const height = winImage.height * scale;

            // Draw the image in the center of the canvas (foreground)
            this.ctx.drawImage(
                winImage,
                (this.canvas.width - width) / 2, // Center horizontally
                (this.canvas.height - height) / 2, // Center vertically
                width, // New width
                height // New height
            );
        };
    }

    draw() {
        if (this.gamePaused) {
            return; // Stop the game loop when paused
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
        if (mo && typeof mo.draw === 'function') {  // Check if mo is defined and has a draw function
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
