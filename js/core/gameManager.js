import {LevelManager} from './levelManager.js';
import {InputManager} from './inputManager.js';

export class GameManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.levelManager = null;
        this.inputManager = new InputManager(); // Instancia o InputManager
    }

    start() {
        // Inicializa o gestor de inputs do utilizador
        this.inputManager.initialize();

        // Inicializa o gestor de níveis e inicia o ciclo do jogo
        this.levelManager = new LevelManager(this.ctx);
        this.gameLoop();
    }

    gameLoop() {
        // Limpa o canvas antes de desenhar o próximo frame
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Atualiza e renderiza o nível atual
        if (this.levelManager) {
            this.levelManager.update();
            this.levelManager.render();
        }

        // Solicita o próximo frame de animação
        requestAnimationFrame(() => this.gameLoop());
    }
}