import {HUD} from "../ui/hud.js";

export class BaseLevel {
    constructor(ctx, game, name, commands, hudImagePath) {
        this.ctx = ctx;
        this.game = game; // Store the game object
        this.name = name;
        this.commands = commands;
        this.currentCommandIndex = 0;
        this.input = '';
        this.completed = false;
        this.blink = true;
        this.blinkInterval = setInterval(() => {
            this.blink = !this.blink;
        }, 500);

        this.commandHistory = [];
        this.hud = new HUD(ctx, hudImagePath);

        this.adjustCanvasHeight();
    }

    adjustCanvasHeight() {
        const commandHeight = 30;
        const baseHeight = 200;
        const requiredHeight = baseHeight + this.commands.length * commandHeight;

        this.ctx.canvas.height = Math.max(this.ctx.canvas.height, requiredHeight);
        this.commandsAreaHeight = this.commands.length * commandHeight + 50;
    }

    handleInput(key) {
        if (key === 'Backspace') {
            this.input = this.input.slice(0, -1);
        } else if (key === 'Enter') {
            if (this.input === this.commands[this.currentCommandIndex]) {
                this.commandHistory.push(this.input);
                this.currentCommandIndex++;
                this.input = '';
                if (this.currentCommandIndex >= this.commands.length) {
                    this.completed = true;
                    console.log(`${this.name} completed!`);
                    clearInterval(this.blinkInterval);
                }                }else {
                // Comando errado ou incompleto - perde uma vida
                const hasLivesLeft = this.hud.loseLife();
                
                // Feedback visual para o erro (sem o texto [ERRO])
                this.commandHistory.push(`${this.input}`);
                this.input = '';
                
                // Reproduz som de erro se existir
                if (this.game.sounds.error) {
                    this.game.sounds.error.currentTime = 0;
                    this.game.sounds.error.play();
                }                  // Game over se não tiver mais vidas
                if (!hasLivesLeft) {
                    // O estado de game over já foi definido no método loseLife
                    
                    // Executa um efeito de "flash" vermelho na tela
                    const flashOverlay = document.createElement('div');
                    flashOverlay.style.position = 'fixed';
                    flashOverlay.style.top = '0';
                    flashOverlay.style.left = '0';
                    flashOverlay.style.width = '100%';
                    flashOverlay.style.height = '100%';
                    flashOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                    flashOverlay.style.zIndex = '1000';
                    flashOverlay.style.pointerEvents = 'none';
                    flashOverlay.style.animation = 'flash 0.5s';
                    document.body.appendChild(flashOverlay);
                    
                    // Remove o flash após a animação
                    setTimeout(() => {
                        document.body.removeChild(flashOverlay);
                    }, 500);
                    
                    clearInterval(this.blinkInterval); // Para a animação de piscar
                }
            }
        } else {
            this.input += key;
        }


        this.game.sounds.typing.currentTime = 0; // Reset playback position
        this.game.sounds.typing.play();

    }

    update() {
        this.hud.update();
    }    render() {
        const {ctx} = this;
        
        // Save the current context state at the beginning
        ctx.save();

        // Command area rendering
        const commandsAreaY = 65;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(ctx.canvas.width - 300, commandsAreaY, 250, this.commandsAreaHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1; // Explicitly set lineWidth to 1
        ctx.strokeRect(ctx.canvas.width - 300, commandsAreaY, 250, this.commandsAreaHeight);
       
        // Renderiza os corações de vida
        this.hud.renderLives();

        ctx.fillStyle = 'green';
        ctx.font = '20px VT323';
        ctx.textAlign = 'left';
        for (let i = 0; i < this.currentCommandIndex; i++) {
            ctx.fillText(this.commands[i], ctx.canvas.width - 290, commandsAreaY + 30 + i * 30);
        }

        if (this.currentCommandIndex < this.commands.length) {
            ctx.fillStyle = 'white';
            ctx.fillText(this.commands[this.currentCommandIndex], ctx.canvas.width - 290, commandsAreaY + 30 + this.currentCommandIndex * 30);
        }

        // Input area rendering with consistent settings
        const inputAreaX = 50;
        const inputAreaY = ctx.canvas.height - 115;
        const inputAreaWidth = ctx.canvas.width - 100;
        const inputAreaHeight = 50;
        const lineHeight = 25;

        const totalInputHeight = inputAreaHeight + (this.commandHistory.length * lineHeight);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(inputAreaX, inputAreaY - (this.commandHistory.length * lineHeight), inputAreaWidth, totalInputHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1; // Ensure lineWidth is 1 here too
        ctx.strokeRect(inputAreaX, inputAreaY - (this.commandHistory.length * lineHeight), inputAreaWidth, totalInputHeight);

        ctx.fillStyle = 'white';
        ctx.font = '20px VT323';
        this.commandHistory.forEach((cmd, index) => {
            ctx.fillText(`admin@desktop:~$ ${cmd}`, inputAreaX + 10, inputAreaY - (this.commandHistory.length * lineHeight) + (index * lineHeight) + 20);
        });

        const displayInput = this.input + (this.blink ? '_' : '');
        ctx.fillStyle = this.currentCommandIndex < this.commands.length && this.input === this.commands[this.currentCommandIndex].slice(0, this.input.length) ? 'white' : 'red';
        ctx.fillText(`admin@desktop:~$ ${displayInput}`, inputAreaX + 10, inputAreaY + 30);

        // Render progress bar
        this.hud.renderProgress(this.currentCommandIndex, this.commands.length);
        
        // Restore the context state to what it was before
        ctx.restore();
    }
}