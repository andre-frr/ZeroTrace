export class InputManager {
    constructor() {
        this.keysPressed = new Set();
        this.inputCallback = null;
    }

    initialize(inputCallback) {
        this.inputCallback = inputCallback;
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    onKeyDown = (event) => {
        if (event.key.length === 1 || event.key === 'Enter' || event.key === 'Backspace') {
            this.keysPressed.add(event.key);
            this.inputCallback?.(event.key);
        }
    };

    onKeyUp = (event) => {
        this.keysPressed.delete(event.key);
    };

    isKeyPressed(key) {
        return this.keysPressed.has(key);
    }
}