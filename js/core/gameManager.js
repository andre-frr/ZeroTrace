import {LevelManager} from './levelManager.js';
import {InputManager} from './inputManager.js';
import {Menu} from '../ui/menu.js';

export class GameManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.levelManager = null;
        this.inputManager = new InputManager();
        this.menu = new Menu(ctx);
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

            // Desenhar a imagem original
            ctx.drawImage(bgImage, 0, bgScrollY, ctx.canvas.width, ctx.canvas.height);

            // Desenhar a imagem invertida diretamente abaixo da original
            ctx.drawImage(bgImage, 0, bgScrollY - ctx.canvas.height, ctx.canvas.width, ctx.canvas.height);

            // Atualizar a posição do scroll
            this.bgScrollY += this.bgScrollSpeed;

            // Resetar a posição do scroll quando a imagem original sair completamente da vista
            if (this.bgScrollY >= ctx.canvas.height) {
                this.bgScrollY = 0;
            }
        }
    }

    gameLoop() {
        // Limpar o canvas para o próximo frame
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawBackground();

        // Mostrar a mensagem de introdução se o jogo ainda não começou
        if (!this.gameStarted) {
            this.menu.drawIntroMessage();
        } else {
            this.levelManager.update();
            this.levelManager.render();
        }

        // Pedir o próximo frame de animação
        requestAnimationFrame(() => this.gameLoop());
    }
}