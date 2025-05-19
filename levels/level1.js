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
    }

    initialize() {
        console.log(`${this.name} initialized`);
    }

    handleInput(key) {
        if (key === 'Backspace') {
            this.input = this.input.slice(0, -1);
        } else if (key === 'Enter') {
            if (this.input === this.commands[this.currentCommandIndex]) {
                this.currentCommandIndex++;
                this.input = '';
                if (this.currentCommandIndex >= this.commands.length) {
                    this.completed = true;
                    console.log(`${this.name} completed!`);
                }
            }
        } else {
            this.input += key;
        }
    }

    update() {
        // Logic for updating the level (e.g., animations, timers)
    }

    render() {
        const {ctx} = this;

        // Draw the "commands to be written" area
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(ctx.canvas.width - 300, 50, 250, 150);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(ctx.canvas.width - 300, 50, 250, 150);

        // Display the current command
        ctx.fillStyle = 'white';
        ctx.font = '20px VT323';
        ctx.textAlign = 'left';
        ctx.fillText(`${this.commands[this.currentCommandIndex] || 'All commands completed!'}`, ctx.canvas.width - 290, 80);

        // Draw the "player input" area
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(50, ctx.canvas.height - 100, ctx.canvas.width - 100, 50);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(50, ctx.canvas.height - 100, ctx.canvas.width - 100, 50);

        // Display the player's input
        ctx.fillStyle = 'white';
        ctx.fillText(`admin@desktop:~$ ${this.input}`, 60, ctx.canvas.height - 70);
    }
}