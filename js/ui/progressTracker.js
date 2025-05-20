// js/ui/progressTracker.js
export class ProgressTracker {
    constructor(ctx, virusImagePath) {
        this.ctx = ctx;
        this.virusImage = new Image();
        this.virusImage.src = virusImagePath;
        this.virusLoaded = false;
        this.virusImage.onload = () => {
            this.virusLoaded = true;
        };
    }

    render(currentCommandIndex, totalCommands) {
        if (!this.virusLoaded) {
            return;
        }

        const { ctx } = this;
        const progressBarWidth = ctx.canvas.width - 400; // Adjusted width
        const progressBarHeight = 20;
        const progressBarX = 200; // Centered
        const progressBarY = ctx.canvas.height - 150; // Position above input area

        // Draw progress bar background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.strokeStyle = 'white';
        ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        // Draw progress
        const progress = (currentCommandIndex / totalCommands) * progressBarWidth;
        ctx.fillStyle = '#00ff00'; // Green progress
        ctx.fillRect(progressBarX, progressBarY, progress, progressBarHeight);

        // Draw virus icon
        const virusSize = 40; // Increased size for visibility
        const virusX = progressBarX + progress - virusSize / 2; // Center virus on progress
        const virusY = progressBarY + progressBarHeight / 2 - virusSize / 2; // Center virus vertically
        ctx.drawImage(this.virusImage, virusX, virusY, virusSize, virusSize);
    }
}
