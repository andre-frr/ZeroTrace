// Classe responsável por gerir a entrada do utilizador
export class InputManager {
    constructor() {
        this.keysPressed = new Set(); // Conjunto de teclas atualmente pressionadas
    }

    // Inicializa os event listeners para capturar a entrada do utilizador
    initialize() {
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    // Evento disparado quando uma tecla é pressionada
    onKeyDown(event) {
        this.keysPressed.add(event.key);
    }

    // Evento disparado quando uma tecla é libertada
    onKeyUp(event) {
        this.keysPressed.delete(event.key);
    }

    // Verifica se uma tecla específica está pressionada
    isKeyPressed(key) {
        return this.keysPressed.has(key);
    }
}