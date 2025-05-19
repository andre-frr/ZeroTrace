// js/core/inputManager.js
export class InputManager {
    constructor() {
        this.keysPressed = new Set();
        this.inputCallback = null;
    }

    initialize(inputCallback) {
        this.inputCallback = inputCallback;
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
        window.addEventListener('keyup', (event) => this.onKeyUp(event));
    }

    onKeyDown(event) {
        // Ignore non-character keys
        if (event.key.length === 1 || event.key === 'Enter' || event.key === 'Backspace') {
            this.keysPressed.add(event.key);
            if (this.inputCallback) {
                this.inputCallback(event.key);
            }
        }
    }

    onKeyUp(event) {
        this.keysPressed.delete(event.key);
    }

    isKeyPressed(key) {
        return this.keysPressed.has(key);
    }
}