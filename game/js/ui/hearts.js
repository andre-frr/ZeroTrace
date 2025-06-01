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

        this.containerWidth = 250;
        this.containerHeight = 50;
        this.containerX = 40;
        this.containerY = 80;
        this.heartWidth = 35;
        this.heartHeight = 35;
        this.spacing = 12;
        this.totalHeartsWidth = (this.maxLives * this.heartWidth) + ((this.maxLives - 1) * this.spacing);
        this.startX = this.containerX + Math.round((this.containerWidth - this.totalHeartsWidth) / 2);
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.containerX, this.containerY, this.containerWidth, this.containerHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.containerX, this.containerY, this.containerWidth, this.containerHeight);
        for (let i = 0; i < this.maxLives; i++) {
            const heart = i < this.lives ? this.hearts[i].full : this.hearts[i].empty;
            const scale = (this.heartPulseActive && i < this.lives) ? this.heartScale : 1.0;
            const heartX = this.startX + (i * (this.heartWidth + this.spacing));
            const heartY = this.containerY + Math.round((this.containerHeight - this.heartHeight) / 2);
            ctx.save();
            ctx.translate(heartX + this.heartWidth / 2, heartY + this.heartHeight / 2);
            ctx.scale(scale, scale);
            ctx.translate(-this.heartWidth / 2, -this.heartHeight / 2);
            ctx.drawImage(heart.sprite.img, heart.sprite.sourceX, heart.sprite.sourceY, heart.sprite.sourceWidth, heart.sprite.sourceHeight, 0, 0, this.heartWidth, this.heartHeight);
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
}