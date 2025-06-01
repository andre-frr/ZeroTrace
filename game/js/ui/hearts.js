import '../entities/heartEmpty.js';
import '../entities/heartFull.js';

export class Hearts {
    constructor(ctx, maxLives = 5) {
        this.ctx = ctx;
        this.maxLives = maxLives;
        this.lives = maxLives;
        this.hearts = [];
        for (let i = 0; i < this.maxLives; i++) {
            this.hearts.push({
                full: new heartFull(), empty: new heartEmpty()
            });
        }
        this.heartImage = new Image();
        this.heartImage.src = './assets/images/heart.png';
        this.heartsLoaded = false;
        this.heartImage.onload = () => {
            this.heartsLoaded = true;
            this.hearts.forEach(heart => {
                heart.full.sprite.img = this.heartImage;
                heart.empty.sprite.img = this.heartImage;
            });
        };
        this.heartScale = 1.0;
        this.heartScaleDirection = 0.01;
        this.heartPulseActive = false;
    }

    updatePulse() {
        this.heartPulseActive = (this.lives <= 2 && this.lives > 0);
        if (this.heartPulseActive) {
            this.heartScale += this.heartScaleDirection;
            if (this.heartScale > 1.15 || this.heartScale < 0.85) {
                this.heartScaleDirection *= -1;
            }
        } else {
            this.heartScale = 1.0;
        }
    }

    render() {
        if (!this.heartsLoaded) return;
        const ctx = this.ctx;
        ctx.save();
        const containerWidth = 250, containerHeight = 50, containerX = 40, containerY = 80;
        const heartWidth = 35, heartHeight = 35, spacing = 12;
        const totalHeartsWidth = (this.maxLives * heartWidth) + ((this.maxLives - 1) * spacing);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(containerX, containerY, containerWidth, containerHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);
        const startX = containerX + Math.round((containerWidth - totalHeartsWidth) / 2);
        for (let i = 0; i < this.maxLives; i++) {
            const heart = i < this.lives ? this.hearts[i].full : this.hearts[i].empty;
            const scale = (this.heartPulseActive && i < this.lives) ? this.heartScale : 1.0;
            const heartX = startX + (i * (heartWidth + spacing));
            const heartY = containerY + Math.round((containerHeight - heartHeight) / 2);
            ctx.save();
            ctx.translate(heartX + heartWidth / 2, heartY + heartHeight / 2);
            ctx.scale(scale, scale);
            ctx.translate(-heartWidth / 2, -heartHeight / 2);
            ctx.drawImage(heart.sprite.img, heart.sprite.sourceX, heart.sprite.sourceY, heart.sprite.sourceWidth, heart.sprite.sourceHeight, 0, 0, heartWidth, heartHeight);
            ctx.restore();
        }
        ctx.restore();
    }

    loseLife() {
        if (this.lives > 1) {
            this.lives--;
            return true;
        } else if (this.lives === 1) {
            this.lives = 0;
            window.gameOver = true;
            return false;
        }
        return false;
    }

    resetLives() {
        this.lives = this.maxLives;
    }
}