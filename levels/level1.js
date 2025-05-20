import {AudioManager} from '../js/core/audioManager.js';
import {ProgressTracker} from '../js/ui/progressTracker.js';

export class Level1 {
    constructor(ctx) {
        this.ctx = ctx;
        this.name = 'Level 1';
        this.commands = [
            'connect -secure',
            'decrypt -key FIBX',
            'extract -data classified',
            'bypass -firewall',
            'upload -payload',
            'disconnect -trace'];
        this.currentCommandIndex = 0;
        this.input = '';
        this.completed = false;
        this.blink = true; // For blinking underscore
        this.blinkInterval = setInterval(() => {
            this.blink = !this.blink;
        }, 500); // Toggle every 500ms

        this.commandHistory = []; // Adiciona esta linha para guardar o histórico de comandos

        this.audioManager = new AudioManager();
        this.audioManager.loadSound('type', './assets/audio/typing.mp3'); // Load typing sound
        this.audioManager.setVolume('type', 0.2);

        // Initialize Progress Tracker
        this.progressTracker = new ProgressTracker(ctx, './assets/images/virus.png');

        this.adjustCanvasHeight();
    }

    adjustCanvasHeight() {
        const commandHeight = 30; // Height per command
        const baseHeight = 200; // Base height for other UI elements
        const requiredHeight = baseHeight + this.commands.length * commandHeight;

        // Dynamically adjust the canvas height
        this.ctx.canvas.height = Math.max(this.ctx.canvas.height, requiredHeight);

        // Store the height of the commands area
        this.commandsAreaHeight = this.commands.length * commandHeight + 50; // Add padding
    }

    initialize() {
        console.log(`${this.name} initialized`);
    }

    handleInput(key) {
        if (key === 'Backspace') {
            this.input = this.input.slice(0, -1);
        } else if (key === 'Enter') {
            if (this.input === this.commands[this.currentCommandIndex]) {
                this.commandHistory.push(this.input); // Adiciona o comando ao histórico
                this.currentCommandIndex++;
                this.input = '';
                if (this.currentCommandIndex >= this.commands.length) {
                    this.completed = true;
                    console.log(`${this.name} completed!`);
                    clearInterval(this.blinkInterval); // Stop blinking when completed
                }
            }
        } else {
            this.input += key;
        }

        // Play typing sound
        this.audioManager.playSound('type');
    }

    update() {
        // Logic for updating the level (e.g., animations, timers)
    }

    render() {
        const {ctx} = this;

        // Draw the "commands to be written" area
        const commandsAreaY = 50; // Top margin
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(ctx.canvas.width - 300, commandsAreaY, 250, this.commandsAreaHeight);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(ctx.canvas.width - 300, commandsAreaY, 250, this.commandsAreaHeight);

        // Display completed commands in green
        ctx.fillStyle = 'green';
        ctx.font = '20px VT323';
        ctx.textAlign = 'left';
        for (let i = 0; i < this.currentCommandIndex; i++) {
            ctx.fillText(this.commands[i], ctx.canvas.width - 290, commandsAreaY + 30 + i * 30);
        }

        // Display the current command in white
        if (this.currentCommandIndex < this.commands.length) {
            ctx.fillStyle = 'white';
            ctx.fillText(this.commands[this.currentCommandIndex], ctx.canvas.width - 290, commandsAreaY + 30 + this.currentCommandIndex * 30);
        }

        // Draw the "player input" area
        const inputAreaX = 50;
        const inputAreaY = ctx.canvas.height - 100;
        const inputAreaWidth = ctx.canvas.width - 100;
        const inputAreaHeight = 50;
        const lineHeight = 25;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(inputAreaX, inputAreaY - (this.commandHistory.length * lineHeight), inputAreaWidth, inputAreaHeight + (this.commandHistory.length * lineHeight));
        ctx.strokeStyle = 'white';
        ctx.strokeRect(inputAreaX, inputAreaY - (this.commandHistory.length * lineHeight), inputAreaWidth, inputAreaHeight + (this.commandHistory.length * lineHeight));

        // Display command history
        ctx.fillStyle = 'white';
        ctx.font = '20px VT323';
        this.commandHistory.forEach((cmd, index) => {
            ctx.fillText(`admin@desktop:~$ ${cmd}`, inputAreaX + 10, inputAreaY - (this.commandHistory.length * lineHeight) + (index * lineHeight) + 20);
        });

        // Display the player's input with blinking underscore
        const displayInput = this.input + (this.blink ? '_' : '');
        ctx.fillStyle = this.input === this.commands[this.currentCommandIndex].slice(0, this.input.length) ? 'white' : 'red';
        ctx.fillText(`admin@desktop:~$ ${displayInput}`, inputAreaX + 10, inputAreaY + 30);

        // Draw progress tracker
        this.progressTracker.render(this.currentCommandIndex, this.commands.length);
    }
}