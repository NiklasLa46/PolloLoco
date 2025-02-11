class GameManager {
    constructor(soundManager) {
        this.soundManager = soundManager;
        this.gamePaused = false;
        this.hasWinSoundPlayed = false;
        this.initializeMuteButton();
    }

    initializeMuteButton() {
        const muteButton = document.getElementById('muteButton');
        const muteButtonRespo = document.getElementById('mute-responsive');
        muteButton.addEventListener('click', () => this.toggleMute());
        muteButtonRespo.addEventListener('click', () => this.toggleMute());
    }

    showRestartButton() {
        document.querySelector('.restart-button').style.display = 'flex';
        if (window.innerWidth <= 1200) {
            document.querySelector('.all-canvas-buttons').style.display = 'block';
        }
    }

    hideBottomButtons() {
        if (window.innerWidth <= 1200) {
            document.querySelector('.bottom-buttons').style.display = 'none';
        }
    }
}