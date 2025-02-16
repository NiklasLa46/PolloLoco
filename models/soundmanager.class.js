/**
 * The `SoundManager` class is responsible for managing game sounds and background music.
 * It provides methods to play, pause, and mute/unmute sounds and music.
 */
class SoundManager {
    /**
     * An array of all the audio files used in the game.
     */
    allSounds = [
        new Audio('./audio/background.mp3'),
        new Audio('./audio/pepedmg1.mp3'),
        new Audio('./audio/coinpickup.mp3'),
        new Audio('./audio/bottlepickup.mp3'),
        new Audio('./audio/chickendeath1.mp3'),
        new Audio('./audio/chickendeath2.mp3'),
        new Audio('./audio/bossdmg.mp3'),
        new Audio('./audio/throwing.mp3'),
        new Audio('./audio/winsound.mp3'),
        new Audio('./audio/gameover.mp3'),
        new Audio('./audio/deathboss.mp3'),
        new Audio('./audio/bottle-break.mp3')
    ];

    /**
     * Background music audio.
     */
    background_music = this.allSounds[0];

    /**
     * Game win sound.
     */
    gamewin_sound = this.allSounds[8];

    /**
     * Game over sound.
     */
    gameover_sound = this.allSounds[9];

    /**
     * Constructs the `SoundManager` instance.
     * @param {Object} character - The character object, responsible for game sound-related actions.
     */
    constructor(character) {
        this.character = character;
        this.allSounds.forEach(sound => {
            sound.volume = 0.8; // Set volume to 0.8
        });

        const savedMuteState = localStorage.getItem('muteState');
        const isMuted = savedMuteState === 'true'; 
        this.allSounds.forEach(sound => sound.muted = isMuted);

        if (isMuted) {
            this.character.muteSounds();
        } else {
            this.character.unmuteSounds();
        }
    }

    /**
     * Initializes the mute button functionality by attaching a click event listener.
     * The button toggles mute/unmute for all sounds and saves the state in localStorage.
     */
    initializeMuteButton() {
        const muteButton = document.getElementById('muteButton');
        const isMuted = this.allSounds.every(sound => sound.muted);
        muteButton.textContent = isMuted ? 'Unmute' : 'Mute'; 

        muteButton.addEventListener('click', () => this.toggleMute());
    }

    /**
     * Toggles the mute state for all sounds.
     * Updates the text of the mute button to reflect the current state ("Mute" or "Unmute").
     * Saves the mute state to localStorage.
     */
    toggleMute() {
        const isMuted = this.allSounds.every(sound => sound.muted);
        this.allSounds.forEach(sound => sound.muted = !isMuted);

        if (isMuted) {
            this.character.unmuteSounds();
        } else {
            this.character.muteSounds();
        }
        
        localStorage.setItem('muteState', !isMuted);

        const muteButton = document.getElementById('muteButton');
        muteButton.textContent = isMuted ? 'Mute' : 'Unmute';
    }

    /**
     * Plays the background music if it is not already playing.
     * Catches errors to ensure the game doesn't break if playback is blocked.
     */
    playBackgroundMusicIfNeeded() {
        if (!this.background_music.playing) {
            this.background_music.play().catch(() => { });
        }
    }

    /**
     * Stops the background music by pausing it.
     */
    stopBackgroundMusic() {
        this.background_music.pause();
    }

    /**
     * Plays a specific sound from the `allSounds` array.
     * @param {number} index - The index of the sound in the `allSounds` array.
     */
    playSound(index) {
        this.allSounds[index].currentTime = 0; // Reset the sound to the beginning.
        this.allSounds[index].play();
    }
}
