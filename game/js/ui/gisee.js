export class Gisee {
    constructor(ctx) {
        this.ctx = ctx;
        this.states = {IDLE: [], MOVING: []};
        this.currentState = 'IDLE';
        this.currentFrame = 0;
        this.frameInterval = 1000 / 9;
        this.accumulated = 0;
        this.x = 300;
        this.y = 400;
        this.speed = 1;
        this.direction = 1;  // 1 for right, -1 for left
        this.facingDirection = 1;  // The visual direction character faces
        this.loadedSprites = 0;
        this.totalSprites = 0;
        this.ready = false;
        this.positionInitialized = false;
        this.feetPosition = 0;
        this.lastUpdate = Date.now();
        this.lastFrameHeight = 0;
        this.loadSprites();
    }

    loadSprites() {
        const idleSprites = [
            "idle(1).png", "idle(2).png", "idle(3).png", "idle(4).png",
            "idle(5).png", "idle(6).png", "idle(7).png", "idle(8).png"
        ];
        const movingSprites = [
            "moving(1).png", "moving(2).png", "moving(3).png", "moving(4).png",
            "moving(5).png", "moving(6).png", "moving(7).png", "moving(8).png",
            "moving(9).png", "moving(10).png"
        ];
        this.totalSprites = idleSprites.length + movingSprites.length;
        this._loadSpriteList(idleSprites, this.states.IDLE, './assets/gisee/');
        this._loadSpriteList(movingSprites, this.states.MOVING, './assets/gisee/');
    }

    _loadSpriteList(spriteList, targetArray, basePath) {
        spriteList.forEach(spriteName => {
            const img = new Image();
            img.src = `${basePath}${spriteName}`;
            img.onload = () => {
                targetArray.push(img);
                this.loadedSprites++;
                if (this.loadedSprites === this.totalSprites) {
                    this.ready = true;
                }
            };
            img.onerror = () => {
                this.loadedSprites++;
            };
        });
    }

    updateAnimation(deltaTime) {
        if (!this.ready || this.states[this.currentState].length === 0) return;
        this.accumulated += deltaTime;
        if (this.accumulated >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.states[this.currentState].length;
            this.accumulated = 0;
        }
    }

    updateMovement(gameOverBox) {
        if (!this.ready) return;
        const frame = this.states[this.currentState][this.currentFrame];
        if (!frame) return;
        const giseeWidth = frame.width;

        if (!this.positionInitialized || this.lastFrameHeight !== frame.height) {
            this.feetPosition = gameOverBox.y;

            if (!this.positionInitialized) {
                this.x = gameOverBox.x + (gameOverBox.width / 2) - (giseeWidth / 2);
                this.positionInitialized = true;
            }

            this.lastFrameHeight = frame.height;
        }

        this.y = this.feetPosition - frame.height;

        if (Math.random() < 0.03) {
            const previousState = this.currentState;
            this.currentState = this.currentState === 'IDLE' ? 'MOVING' : 'IDLE';

            if (this.currentState === 'MOVING') {
                this.direction = Math.random() > 0.5 ? 1 : -1;
                this.facingDirection = this.direction;
            }
        }

        if (this.currentState === 'MOVING') {
            this.x += this.speed * this.direction;
            const leftBoundary = gameOverBox.x + 20;
            const rightBoundary = gameOverBox.x + gameOverBox.width - giseeWidth - 20;

            if (this.x < leftBoundary) {
                this.x = leftBoundary;
                this.direction = 1;
                this.facingDirection = 1;
            } else if (this.x > rightBoundary) {
                this.x = rightBoundary;
                this.direction = -1;
                this.facingDirection = -1;
            }
        }
    }

    render() {
        if (!this.ready || !this.states[this.currentState].length) return;
        const frame = this.states[this.currentState][this.currentFrame];
        if (frame) {
            if (this.facingDirection === -1) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(frame, -this.x - frame.width, this.y);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(frame, this.x, this.y);
            }
        }
    }

    resetPosition() {
        this.positionInitialized = false;
    }
}