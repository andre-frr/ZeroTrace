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
          // Animação do vírus - apenas pulsação
        this.virusScale = 1.0;
        this.virusScaleDirection = 0.01;
        this.lastUpdateTime = Date.now();
    }
      update() {
        // Atualizar animação do vírus - apenas pulsação
        const now = Date.now();
        if (now - this.lastUpdateTime > 16) { // ~60fps
            // Pulsar o tamanho do vírus
            this.virusScale += this.virusScaleDirection;
            if (this.virusScale > 1.1 || this.virusScale < 0.9) {
                this.virusScaleDirection *= -1;
            }
            
            this.lastUpdateTime = now;
        }
    }
    
    render(currentCommandIndex, totalCommands, commandHistoryLength = 0) {
        if (!this.virusLoaded) {
            return;
        }

        const { ctx } = this;
        const progressBarWidth = ctx.canvas.width - 400; // Adjusted width
        const progressBarHeight = 25; // Slightly taller for better visibility
        const progressBarX = 200; // Centered
          // Posicionar na parte inferior da tela com margem segura
        const progressBarY = ctx.canvas.height - progressBarHeight - 20; // 20px margin from bottom
        
        // Draw progress bar background with terminal-style design
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Darker for better visibility
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.strokeStyle = '#00ff00'; // Green border for terminal feel
        ctx.lineWidth = 2;
        ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.lineWidth = 1;        // Add progress percentage text
        const percentage = Math.floor((currentCommandIndex / totalCommands) * 100);
        ctx.fillStyle = '#00ff00';
        ctx.font = '16px VT323';
        ctx.textAlign = 'right';
        ctx.fillText(`${percentage}%`, progressBarX + progressBarWidth - 10, progressBarY + progressBarHeight - 5);

        // Draw progress
        const progress = (currentCommandIndex / totalCommands) * progressBarWidth;
        
        // Create gradient for progress bar
        const gradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progress, 0);
        gradient.addColorStop(0, '#007700');
        gradient.addColorStop(1, '#00ff00');
        ctx.fillStyle = gradient;
        ctx.fillRect(progressBarX, progressBarY, progress, progressBarHeight);
          // Draw virus icon with glow effect and pulsation animation
        const baseVirusSize = 45; // Base size
        const virusSize = baseVirusSize * this.virusScale; // Animated size (pulsation)
        const virusX = progressBarX + progress - virusSize / 2; // Center virus on progress
        const virusY = progressBarY + progressBarHeight / 2 - virusSize / 2; // Center virus vertically
        
        // Add glow effect
        ctx.save();
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw virus without rotation
        ctx.drawImage(this.virusImage, virusX, virusY, virusSize, virusSize);
        ctx.restore();
    }
}
