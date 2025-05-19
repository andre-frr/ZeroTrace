import {LevelManager} from './levelManager.js';
import {InputManager} from './inputManager.js';
import {Menu} from '../ui/menu.js';
import {Level1} from '../../levels/level1.js';

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
        // Inicializar o gestor de níveis
        this.levelManager = new LevelManager(this.ctx);

        // Carregar os níveis
        const level1 = new Level1(this.ctx);
        this.levelManager.loadLevels([level1]);

        // Inicializar o gestor de inputs com callback
        this.inputManager.initialize((key) => {
            if (!this.gameStarted && key === 'Enter') {
                this.gameStarted = true;
                this.levelManager.startLevel(0); // Iniciar o primeiro nível
            } else if (this.gameStarted) {
                const currentLevel = this.levelManager.levels[this.levelManager.currentLevel];
                if (currentLevel) {
                    currentLevel.handleInput(key);
                }
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