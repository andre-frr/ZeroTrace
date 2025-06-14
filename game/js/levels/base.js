// game/js/levels/base.js
import {HUD} from "../ui/hud.js";

// Classe base para níveis do jogo
const BaseLevel = Class.extend(function () {
    // Inicializa um nível com contexto, jogo, nome e comandos
    this.constructor = function (ctx, game, name, commands) {
        this.ctx = ctx;
        this.game = game;
        this.name = name;
        this.commands = commands;
        this.currentCommandIndex = 0;
        this.input = '';
        this.completed = false;
        this.showWinScreen = false;
        this.blink = true;
        this.blinkInterval = setInterval(() => {
            this.blink = !this.blink;
        }, 500);

        this.commandHistory = [];
        this.hud = new HUD(ctx);

        this.adjustCanvasHeight();
    };

    // Ajusta a altura do canvas conforme o número de comandos do nível
    this.adjustCanvasHeight = function () {
        const commandHeight = 30;
        const baseHeight = 200;
        const requiredHeight = baseHeight + this.commands.length * commandHeight;

        this.ctx.canvas.height = Math.max(this.ctx.canvas.height, requiredHeight);
        this.commandsAreaHeight = this.commands.length * commandHeight + 50;
    };

    // Lida com o input do jogador e valida os comandos inseridos
    this.handleInput = function (key) {
        if (this.showWinScreen && key === 'Enter') {
            if (this.game.levelManager.currentLevel < this.game.levelManager.levels.length - 1) {
                this.game.levelManager.startLevel(this.game.levelManager.currentLevel + 1);
            } else {
                window.gameOver = false;
                this.game.levelManager.currentLevel = 0;
                this.game.levelManager.startLevel(0);
            }
            return;
        }
        if (this.completed || this.showWinScreen) return;

        if (key === 'Backspace') {
            this.input = this.input.slice(0, -1);
        } else if (key === 'Enter') {
            if (this.input === this.commands[this.currentCommandIndex]) {
                this.commandHistory.push(this.input);
                this.currentCommandIndex++;
                this.input = '';
                if (this.currentCommandIndex >= this.commands.length) {
                    this.completed = true;
                    clearInterval(this.blinkInterval);
                    this.showWinScreen = true;
                    this.hud.stopTimer();
                    // Toca som de vitória quando o nível é completado
                    if (this.game.sounds.victory) {
                        this.game.sounds.victory.currentTime = 0;
                        this.game.sounds.victory.play();
                    }
                }
            } else {
                const hasLivesLeft = this.hud.loseLife();
                this.commandHistory.push(this.input);
                this.input = '';

                if (!hasLivesLeft) {
                    const flashOverlay = document.createElement('div');
                    flashOverlay.style = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 0, 0, 0.3);
                    z-index: 1000;
                    pointer-events: none;
                    animation: flash 0.5s;
                `;
                    document.body.appendChild(flashOverlay);

                    setTimeout(() => {
                        document.body.removeChild(flashOverlay);
                    }, 500);

                    clearInterval(this.blinkInterval);
                }
            }
        } else {
            this.input += key;
        }

        this.game.sounds.typing.currentTime = 0;
        this.game.sounds.typing.play();
    };

    // Atualiza o estado do HUD do nível
    this.update = function () {
        this.hud.update();
    };

    // Renderiza o nível e todos os seus elementos visuais
    this.render = function () {
        if (this.showWinScreen) {
            this.hud.drawWinScreen(this.name, this.game.levelManager.currentLevel === this.game.levelManager.levels.length - 1);
            return;
        }
        const ctx = this.ctx;
        const commandsAreaY = 65;
        const commandBoxWidth = 500;
        const commandBoxX = ctx.canvas.width - commandBoxWidth - 50;

        // Desenha a caixa de comandos
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(commandBoxX, commandsAreaY, commandBoxWidth, this.commandsAreaHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(commandBoxX, commandsAreaY, commandBoxWidth, this.commandsAreaHeight);

        // Desenha as vidas
        this.hud.renderLives();

        // Desenha os comandos completados e o atual
        ctx.fillStyle = 'green';
        ctx.font = '20px VT323';
        ctx.textAlign = 'left';
        for (let i = 0; i < this.currentCommandIndex; i++) {
            ctx.fillText(this.commands[i], commandBoxX + 10, commandsAreaY + 30 + i * 30);
        }

        if (this.currentCommandIndex < this.commands.length) {
            ctx.fillStyle = 'white';
            ctx.fillText(this.commands[this.currentCommandIndex], commandBoxX + 10, commandsAreaY + 30 + this.currentCommandIndex * 30);
        }

        // Desenha a área de input
        const inputAreaX = 50;
        const inputAreaY = ctx.canvas.height - 115;
        const inputAreaWidth = ctx.canvas.width - 100;
        const inputAreaHeight = 50;
        const lineHeight = 25;
        const totalInputHeight = inputAreaHeight + (this.commandHistory.length * lineHeight);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(inputAreaX, inputAreaY - (this.commandHistory.length * lineHeight), inputAreaWidth, totalInputHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(inputAreaX, inputAreaY - (this.commandHistory.length * lineHeight), inputAreaWidth, totalInputHeight);

        // Desenha o histórico de comandos
        ctx.fillStyle = 'white';
        ctx.font = '20px VT323';
        this.commandHistory.forEach((cmd, index) => {
            ctx.fillText(`admin@desktop:~$ ${cmd}`, inputAreaX + 10, inputAreaY - (this.commandHistory.length * lineHeight) + (index * lineHeight) + 20);
        });

        // Desenha o input atual com cursor piscante
        const displayInput = this.input + (this.blink ? '_' : '');
        ctx.fillStyle = this.currentCommandIndex < this.commands.length && this.input === this.commands[this.currentCommandIndex].slice(0, this.input.length) ? 'white' : 'red';
        ctx.fillText(`admin@desktop:~$ ${displayInput}`, inputAreaX + 10, inputAreaY + 30);

        // Desenha o progresso do nível
        this.hud.renderProgress(this.currentCommandIndex, this.commands.length);
    };
});

export {BaseLevel};
window.BaseLevel = BaseLevel;