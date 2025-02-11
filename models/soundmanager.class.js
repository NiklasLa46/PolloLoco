class SoundManager {
    allSounds = [
        new Audio('./audio/background.mp3'),
        new Audio('/audio/pepedmg1.mp3'),
        new Audio('/audio/coinpickup.mp3'),
        new Audio('/audio/bottlepickup.mp3'),
        new Audio('audio/chickendeath1.mp3'),
        new Audio('audio/chickendeath2.mp3'),
        new Audio('audio/bossdmg.mp3'),
        new Audio('audio/throwing.mp3'),
        new Audio('audio/winsound.mp3'),
        new Audio('audio/gameover.mp3'),
        new Audio('audio/bossdeath.mp3'),
    ];

    background_music = this.allSounds[0];
    gamewin_sound = this.allSounds[8];
    gameover_sound = this.allSounds[9];

    initializeMuteButton() {
        const muteButton = document.getElementById('muteButton');
        muteButton.addEventListener('click', () => this.toggleMute());
    }

    toggleMute() {
        const isMuted = this.allSounds.every(sound => sound.muted);
        this.allSounds.forEach(sound => sound.muted = !isMuted);
        const muteButton = document.getElementById('muteButton');
        muteButton.textContent = isMuted ? 'Mute' : 'Unmute';
    }

    playBackgroundMusicIfNeeded() {
        if (!this.background_music.playing) {
            this.background_music.play().catch(() => { });
        }
    }

    stopBackgroundMusic() {
        this.background_music.pause();
    }

    playSound(index) {
        this.allSounds[index].currentTime = 0;
        this.allSounds[index].play();
    }

    muteCharacterSleepingSound() {
        if (this.character && this.character.sleeping_sound) {
            this.character.sleeping_sound.volume = 0.0;
            console.log(this.character.sleeping_sound.volume);
            console.log('log')
        }
    }

    /**
 * Stops the character's sleeping sound completely by pausing it and resetting its current time.
 */
stopCharacterSleepingSound() {
    if (this.character && this.character.sleeping_sound) {
        this.character.sleeping_sound.pause(); 
        this.character.sleeping_sound.currentTime = 0;
    }
}
}

