import {LevelManager} from './levelManager.js';
import {InputManager} from './inputManager.js';

export class GameManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.levelManager = null;
        this.inputManager = new InputManager();
        this.gameStarted = false;

        // Configuração da imagem de fundo
        this.bgImage = new Image();
        this.bgLoaded = false;
        this.bgImage.src = './assets/images/bg.webp';
        this.bgImage.onload = () => {
            this.bgLoaded = true;
        };

        // Propriedades do scroll no eixo Y
        this.bgScrollY = 0; // Posição vertical do scroll
        this.bgScrollSpeed = 1; // Velocidade do scroll
    }

    start() {
        // Inicializar o gestor de inputs
        this.inputManager.initialize();

        // Inicializar o gestor de níveis
        this.levelManager = new LevelManager(this.ctx);

        // Listener para começar o jogo ao pressionar Enter
        window.addEventListener('keydown', (event) => {
            if (!this.gameStarted && event.key === 'Enter') {
                this.gameStarted = true;
            }
        });

        // Iniciar o loop do jogo
        this.gameLoop();
    }

    drawBackground() {
        if (this.bgLoaded) {
            const {ctx, bgImage, bgScrollY} = this;

            // Draw the original image
            ctx.drawImage(bgImage, 0, bgScrollY, ctx.canvas.width, ctx.canvas.height);

            // Draw the inverted image directly below the original
            ctx.drawImage(bgImage, 0, bgScrollY - ctx.canvas.height, ctx.canvas.width, ctx.canvas.height);

            // Update the scroll position
            this.bgScrollY += this.bgScrollSpeed;

            // Reset the scroll position when the original image fully scrolls out of view
            if (this.bgScrollY >= ctx.canvas.height) {
                this.bgScrollY = 0;
            }
        }
    }

    drawIntroMessage() {
        const {ctx} = this;

        // Mensagem introdutória
        ctx.fillStyle = 'white';
        ctx.font = '40px VT323';
        ctx.textAlign = 'center';
        ctx.fillText('Placeholder Text', ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    gameLoop() {
        // Limpar o canvas para o próximo frame
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawBackground();

        // Mostrar a mensagem de introdução se o jogo ainda não começou
        if (!this.gameStarted) {
            this.drawIntroMessage();
        } else {
            this.levelManager.update();
            this.levelManager.render();
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}