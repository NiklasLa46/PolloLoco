class CharacterManager {
    constructor(world) {
        this.world = world;
    }

    throwBottle() {
        if (this.world.character.bottles > 0) {
            let throwDirection = this.world.character.otherDirection ? -1 : 1;
            let bottle = new ThrowableObject(this.world.character.x + 30, this.world.character.y + 90);
            bottle.speedX = throwDirection * 20;
            bottle.throw();
            this.world.soundManager.allSounds[7].play();
            this.world.throwableObjects.push(bottle);
            this.world.character.bottles -= 10;
            this.world.bottleBar.setPercentage(this.world.character.bottles);
            this.world.character.resetIdleTimers();
        }
    }
}
