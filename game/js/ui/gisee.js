export class Gisee {
    constructor(ctx) {
        this.ANIMATION_FPS = 9;
        this.MOVEMENT_SPEED = 1;
        this.STATE_CHANGE_CHANCE = 0.03;

        this.ctx = ctx;
        this.states = {IDLE: [], MOVING: []};
        this.currentState = 'IDLE';
        this.currentFrame = 0;
        this.frameInterval = 1000 / this.ANIMATION_FPS;
        this.accumulated = 0;
        this.x = 300;
        this.y = 400;
        this.speed = this.MOVEMENT_SPEED;
        this.direction = 1;
        this.facingDirection = 1;
        this.loadedSprites = 0;
        this.totalSprites = 0;
        this.ready = false;
        this.positionInitialized = false;
        this.feetPosition = 0;
        this.lastUpdate = Date.now();
        this.lastFrameHeight = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.stateChangeRequested = false;
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
                this.onSpriteLoaded();
            };
            img.onerror = () => {
                this.onSpriteLoaded();
            };
        });
    }

    onSpriteLoaded() {
        this.loadedSprites++;
        if (this.loadedSprites === this.totalSprites) {
            this.states.IDLE.sort((a, b) => a.src.localeCompare(b.src, undefined, {numeric: true}));
            this.states.MOVING.sort((a, b) => a.src.localeCompare(b.src, undefined, {numeric: true}));
            this.ready = true;
        }
    }

    updateAnimation() {
        if (!this.ready || this.states[this.currentState].length === 0) return;

        const now = Date.now();
        const elapsed = now - this.lastUpdate;
        this.lastUpdate = now;

        this.accumulated += elapsed;
        if (this.accumulated >= this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.states[this.currentState].length;
            this.accumulated = 0;
            if (this.stateChangeRequested && this.currentFrame === 0) {
                this.changeState();
                this.stateChangeRequested = false;
            }
        }
    }

    getCurrentFrame() {
        return this.states[this.currentState][this.currentFrame];
    }

    updateMovement(gameOverBox) {
        if (!this.ready) return;
        const frame = this.getCurrentFrame();
        if (!frame) return;
        this.updatePosition(frame, gameOverBox);
        this.updateState();
        this.handleMovement(frame, gameOverBox);
    }

    updatePosition(frame, gameOverBox) {
        if (!this.positionInitialized || this.lastFrameHeight !== frame.height) {
            this.feetPosition = gameOverBox.y;
            if (!this.positionInitialized) {
                this.x = gameOverBox.x + (gameOverBox.width / 2) - (frame.width / 2);
                this.positionInitialized = true;
            }
            this.lastFrameHeight = frame.height;
        }
        this.y = this.feetPosition - frame.height;
    }

    updateState() {
        if (!this.stateChangeRequested && Math.random() < this.STATE_CHANGE_CHANCE) {
            this.stateChangeRequested = true;
        }
    }

    changeState() {
        this.currentState = this.currentState === 'IDLE' ? 'MOVING' : 'IDLE';
        this.currentFrame = 0;
        if (this.currentState === 'MOVING') {
            this.direction = Math.random() > 0.5 ? 1 : -1;
            this.facingDirection = this.direction;
        }
    }

    handleMovement(frame, gameOverBox) {
        if (this.currentState !== 'MOVING') return;
        this.x += this.speed * this.direction;
        const leftBoundary = gameOverBox.x;
        const rightBoundary = gameOverBox.x + gameOverBox.width - frame.width;
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

    render() {
        if (!this.ready || !this.states[this.currentState].length) return;
        const frame = this.getCurrentFrame();
        if (!frame) return;
        this.lastX = this.x;
        this.lastY = this.y;
        if (this.facingDirection === -1) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(frame, -this.x - frame.width, this.y);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(frame, this.x, this.y);
        }
    }

    resetPosition() {
        this.positionInitialized = false;
    }
}