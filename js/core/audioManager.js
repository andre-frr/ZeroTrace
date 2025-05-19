// Classe responsável por gerir os sons do jogo
export class AudioManager {
    constructor() {
        this.sounds = new Map(); // Mapa de nomes de sons para objetos de áudio
    }

    // Carrega um ficheiro de som
    loadSound(name, src) {
        const audio = new Audio(src);
        this.sounds.set(name, audio);
    }

    // Reproduz um som
    playSound(name) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0; // Reinicia a posição de reprodução
            sound.play();
        } else {
            console.error(`Som "${name}" não encontrado`);
        }
    }

    // Para a reprodução de um som
    stopSound(name) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    // Ajusta o volume de um som
    setVolume(name, volume) {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.volume = volume;
        } else {
            console.error(`Som "${name}" não encontrado`);
        }
    }
}