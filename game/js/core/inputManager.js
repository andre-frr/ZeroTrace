// game/js/core/inputManager.js
// Gere o input do teclado para o jogo
export class InputManager {
    constructor() {
        this.keysPressed = new Set();
        this.inputCallback = null;
        // Garante o contexto correto dos métodos
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    // Inicializa o gestor de input e define o callback a invocar quando há input
    initialize(inputCallback) {
        this.inputCallback = inputCallback;
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    // Lida com o evento de tecla pressionada e invoca o callback se for relevante
    onKeyDown(event) {
        // Aceita apenas teclas relevantes para o jogo
        if (event.key.length === 1 || event.key === 'Enter' || event.key === 'Backspace') {
            this.keysPressed.add(event.key);
            this.inputCallback?.(event.key);
        }
    }

    // Remove a tecla do conjunto quando é libertada
    onKeyUp(event) {
        this.keysPressed.delete(event.key);
    }
}