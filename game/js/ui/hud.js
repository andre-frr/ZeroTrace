import '../entities/entity.js';
import '../entities/heartEmpty.js';
import '../entities/heartFull.js';

export class HUD {
    constructor(ctx) {
        this.ctx = ctx;

        // Progress Tracker properties
        this.virusImage = new Image();
        this.virusImage.src = "./assets/images/virus.png";
        this.virusLoaded = false;
        this.virusImage.onload = () => {
            this.virusLoaded = true;
        };
        this.virusScale = 1.0;
        this.virusScaleDirection = 0.01;
        this.lastUpdateTime = Date.now();

        // For Gisee animation timing
        this.lastGiseeUpdate = Date.now();

        // Lives system
        this.lives = 5;
        this.maxLives = 5;

        // Initialize heart entities
        this.hearts = [];
        for (let i = 0; i < this.maxLives; i++) {
            this.hearts.push({
                full: new heartFull(), empty: new heartEmpty()
            });
        }

        // Load heart images
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

        // Heart pulsation properties
        this.heartScale = 1.0;
        this.heartScaleDirection = 0.01;
        this.heartPulseActive = false;

        // Timer properties
        this.timerHandler = null;
        this.globalTime = 0;
        this.localTime = 0;
        this.maxTime = 45;

        // Gisee properties
        this.gisee = {
            states: {
                IDLE: [], MOVING: []
            },
            currentState: 'IDLE',
            currentFrame: 0,
            frameInterval: 1000 / 9,
            accumulated: 0,
            x: 300, // Initial position
            y: 400, // Position above gameOver message
            speed: 2, // Speed set to 2 for more noticeable movement
            direction: 1, // 1 for right, -1 for left
            loadedSprites: 0,
            totalSprites: 0,
            ready: false,
            positionInitialized: false, // Flag to track if position has been initialized
            stateChanged: false, // Flag to track animation state changes
            // Set fixed feet positions for consistent alignment
            idleHeight: 35,  // Default height from feet to top of sprite in idle state
            movingHeight: 35, // Default height from feet to top of sprite in moving state
            feetPosition: 0   // Y position where feet should be (will be set to box.y)
        };

        this.loadGiseeSprites();

        // Create timer visual element
        if (!document.getElementById("hud-timer")) {
            const timerElem = document.createElement("progress");
            timerElem.id = "hud-timer";
            timerElem.max = this.maxTime;
            timerElem.value = 0;
            timerElem.style.position = "fixed";
            timerElem.style.left = "0";
            timerElem.style.bottom = "0";
            timerElem.style.width = "100vw";
            timerElem.style.height = "17px";
            timerElem.style.zIndex = 1000;
            timerElem.style.backgroundColor = "#eee";
            timerElem.style.display = "none";
            document.body.appendChild(timerElem);
        }
    }

    loadGiseeSprites() {
        const idleSprites = [
            "idle(1).png", "idle(2).png", "idle(3).png", "idle(4).png",
            "idle(5).png", "idle(6).png", "idle(7).png", "idle(8).png"
        ];

        const movingSprites = [
            "moving(1).png", "moving(2).png", "moving(3).png", "moving(4).png",
            "moving(5).png", "moving(6).png", "moving(7).png", "moving(8).png",
            "moving(9).png", "moving(10).png"
        ];

        // Track loading progress
        this.gisee.loadedSprites = 0;
        this.gisee.totalSprites = idleSprites.length + movingSprites.length;
        this.gisee.ready = false;

        this.loadSprites(idleSprites, this.gisee.states.IDLE, './assets/gisee/');
        this.loadSprites(movingSprites, this.gisee.states.MOVING, './assets/gisee/');
    }

    loadSprites(spriteList, targetArray, basePath) {
        spriteList.forEach(spriteName => {
            const img = new Image();
            img.src = `${basePath}${spriteName}`;
            img.onload = () => {
                targetArray.push(img);
                this.gisee.loadedSprites++;
                if (this.gisee.loadedSprites === this.gisee.totalSprites) {
                    this.gisee.ready = true;
                    console.log("Gisee sprites fully loaded");
                }
            };
            img.onerror = () => {
                console.error(`Failed to load sprite: ${basePath}${spriteName}`);
                this.gisee.loadedSprites++;  // Count even failed loads to prevent hanging
            };
        });
    }

    updateGiseeAnimation(deltaTime) {
        const gisee = this.gisee;

        // Only update animation if sprites are ready
        if (!gisee.ready || gisee.states[gisee.currentState].length === 0) return;

        // Accumulate time and update frame if enough time has passed
        gisee.accumulated += deltaTime;
        if (gisee.accumulated >= gisee.frameInterval) {
            gisee.currentFrame = (gisee.currentFrame + 1) % gisee.states[gisee.currentState].length;
            gisee.accumulated = 0;
        }
    }

    updateGiseeMovement(gameOverBox) {
        const gisee = this.gisee;

        // Only update movement if sprites are ready
        if (!gisee.ready) return;

        // Ensure speed is non-zero
        if (gisee.speed === 0) gisee.speed = 2;

        // Get the current sprite frame
        const frame = gisee.states[gisee.currentState][gisee.currentFrame];
        if (!frame) return;

        // Get sprite width for boundary detection
        const giseeWidth = frame.width;

        // Set the feet position to the top of the game over box
        // This is the absolute Y coordinate where Gisee's feet should be
        if (!gisee.positionInitialized) {
            gisee.feetPosition = gameOverBox.y - 3; // Slightly above box to make feet visible on box
            gisee.positionInitialized = true;

            // Center horizontally
            gisee.x = gameOverBox.x + (gameOverBox.width / 2) - (giseeWidth / 2);

            console.log("Initialized Gisee position:", gisee.x, gisee.feetPosition);
        }

        // Adjust position based on animation state to keep feet at the same level
        if (gisee.currentState === 'IDLE') {
            // For idle animation, position Y so feet are at feetPosition
            gisee.y = gisee.feetPosition - gisee.idleHeight;
        } else {
            // For moving animation, position Y so feet are at feetPosition
            gisee.y = gisee.feetPosition - gisee.movingHeight;
        }

        // Increase chances of moving to make movement more obvious
        if (Math.random() < 0.03) {
            const previousState = gisee.currentState;
            gisee.currentState = gisee.currentState === 'IDLE' ? 'MOVING' : 'IDLE';

            // When switching to moving, set a random direction
            if (gisee.currentState === 'MOVING') {
                gisee.direction = Math.random() > 0.5 ? 1 : -1;
                console.log("Gisee moving:", gisee.direction > 0 ? "right" : "left");
            }
        }

        // Actually move Gisee when in moving state
        if (gisee.currentState === 'MOVING') {
            // Update position based on direction and speed
            gisee.x += gisee.speed * gisee.direction;

            // Check if Gisee is going out of bounds of the game over box
            const leftBoundary = gameOverBox.x + 20;
            const rightBoundary = gameOverBox.x + gameOverBox.width - giseeWidth - 20;

            // Collision detection with boundaries
            if (gisee.x < leftBoundary) {
                gisee.x = leftBoundary; // Prevent going beyond left edge
                gisee.direction = 1; // Change direction to right
                console.log("Gisee hit left boundary, moving right");
            } else if (gisee.x > rightBoundary) {
                gisee.x = rightBoundary; // Prevent going beyond right edge
                gisee.direction = -1; // Change direction to left
                console.log("Gisee hit right boundary, moving left");
            }
        }
    }

    renderGisee() {
        const gisee = this.gisee;
        const {ctx} = this;

        // Only attempt to render if sprites are ready
        if (!gisee.ready || !gisee.states[gisee.currentState] || gisee.states[gisee.currentState].length === 0) {
            return;
        }

        const frame = gisee.states[gisee.currentState][gisee.currentFrame];
        if (frame) {
            // Flip horizontally if moving left
            if (gisee.currentState === 'MOVING' && gisee.direction === -1) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(frame, -gisee.x - frame.width, gisee.y);
                ctx.restore();
            } else {
                ctx.drawImage(frame, gisee.x, gisee.y);
            }
        }
    }

    drawIntroMessage() {
        const {ctx} = this;
        if (!HUD.introLogged) {
            console.log("[HUD] Mensagem inicial apresentada ao jogador.");
            HUD.introLogged = true;
        }

        const message = `[Conexão estabelecida…]

Canal seguro ativado.
Codificação de sessão: TRC-0225-FIBX

[Mensagem recebida do Grupo █████]

Bem-vindo, agente.

A tua missão é simples: infiltrar os sistemas da FIB, extrair informação classificada e sair sem deixar rasto.

Mas não te iludas — o sistema está armado. Cada erro aproxima-te da deteção total.
Digita com precisão. Mantém-te rápido. Não falhes.

Os terminais estão protegidos por firewalls reativas e protocolos de segurança automatizados.
O tempo joga contra ti. A IA da FIB está sempre a aprender.

Não estás sozinho. Receberás instruções da nossa parte ao longo da missão.
Mas lembra-te: se fores apanhado... nós nunca falámos.

Boa sorte,
Grupo █████`;

        const lines = message.split('\n');
        const lineHeight = 30;
        const startX = ctx.canvas.width / 2;
        let startY = ctx.canvas.height / 2 - (lines.length * lineHeight) / 2;

        ctx.fillStyle = 'white';
        ctx.font = '28px VT323';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;

        lines.forEach((line) => {
            ctx.fillText(line, startX, startY);
            startY += lineHeight;
        });

        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 0;
    }

    drawGameOverMessage() {
        const {ctx} = this;

        // Define the gameOverBox dimensions
        const boxWidth = 600;
        const boxHeight = 350;
        const boxX = (ctx.canvas.width - boxWidth) / 2;
        const boxY = (ctx.canvas.height - boxHeight) / 2;

        const gameOverBox = {x: boxX, y: boxY, width: boxWidth, height: boxHeight};

        // Save the current context state to restore it later
        ctx.save();

        // Semi-transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw the alert box
        ctx.lineWidth = 4;
        const now = Date.now();
        const pulseIntensity = Math.sin(now / 200) * 0.3 + 0.7; // Smooth pulsing effect
        const redGlow = Math.floor(255 * pulseIntensity);
        ctx.strokeStyle = `rgb(${redGlow}, 0, 0)`;

        const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
        gradient.addColorStop(0, 'rgba(80, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(40, 0, 0, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Title
        ctx.fillStyle = 'red';
        ctx.font = '42px VT323';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.fillText('[ALERTA DE SEGURANÇA]', ctx.canvas.width / 2, boxY + 60);

        // Messages
        ctx.font = '32px VT323';
        ctx.fillText('Firewall ativada! Foste detetado!', ctx.canvas.width / 2, boxY + 160);
        ctx.fillText('Ligação terminada forçadamente.', ctx.canvas.width / 2, boxY + 200);

        // Instructions
        ctx.fillStyle = 'white';
        ctx.font = '26px VT323';
        ctx.fillText('Prima ENTER para tentar novamente', ctx.canvas.width / 2, boxY + boxHeight - 50);

        // Add alert icons
        this.drawAlertIcon(ctx, boxX + 80, boxY + 60);
        this.drawAlertIcon(ctx, boxX + boxWidth - 80, boxY + 60);

        // Reset shadow effects
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 0;

        // Restore the context state to what it was before
        ctx.restore();

        // Calculate deltaTime manually for Gisee animation
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastGiseeUpdate;
        this.lastGiseeUpdate = currentTime;

        // Update and render Gisee with the calculated deltaTime
        this.updateGiseeAnimation(deltaTime);
        this.updateGiseeMovement(gameOverBox);
        this.renderGisee();
    }

    drawAlertIcon(ctx, x, y) {
        const size = 30;
        ctx.save();
        ctx.translate(x, y);

        // Triângulo de aviso
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.fill();

        // Ponto de exclamação
        ctx.fillStyle = 'white';
        ctx.font = '30px VT323';
        ctx.textAlign = 'center';
        ctx.fillText('!', 0, 10);

        ctx.restore();
    }

    update(deltaTime) {
        const now = Date.now();
        if (now - this.lastUpdateTime > 16) { // ~60fps
            this.virusScale += this.virusScaleDirection;
            if (this.virusScale > 1.1 || this.virusScale < 0.9) {
                this.virusScaleDirection *= -1;
            }

            this.heartPulseActive = (this.lives <= 2 && this.lives > 0);
            if (this.heartPulseActive) {
                this.heartScale += this.heartScaleDirection;
                if (this.heartScale > 1.15 || this.heartScale < 0.85) {
                    this.heartScaleDirection *= -1;
                }
            } else {
                this.heartScale = 1.0;
            }

            this.lastUpdateTime = now;
        }

        // Update Gisee animation with the provided deltaTime
        this.updateGiseeAnimation(deltaTime);

        // If we're in game over state, update Gisee's movement continuously
        if (window.gameOver && this.gisee.ready) {
            const boxWidth = 600;
            const boxHeight = 350;
            const boxX = (this.ctx.canvas.width - boxWidth) / 2;
            const boxY = (this.ctx.canvas.height - boxHeight) / 2;

            const gameOverBox = {x: boxX, y: boxY, width: boxWidth, height: boxHeight};
            this.updateGiseeMovement(gameOverBox);
        }
    }

    renderProgress(currentCommandIndex, totalCommands) {
        if (!this.virusLoaded) {
            return;
        }
        const {ctx} = this;
        ctx.save();
        const progressBarWidth = ctx.canvas.width - 400;
        const progressBarHeight = 25;
        const progressBarX = 200;
        const progressBarY = 18;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);

        const percentage = Math.floor((currentCommandIndex / totalCommands) * 100);
        ctx.fillStyle = '#00ff00';
        ctx.font = '16px VT323';
        ctx.textAlign = 'right';
        ctx.fillText(`${percentage}%`, progressBarX + progressBarWidth - 10, progressBarY + progressBarHeight - 5);

        const progress = (currentCommandIndex / totalCommands) * progressBarWidth;
        const gradient = ctx.createLinearGradient(progressBarX, 0, progressBarX + progress, 0);
        gradient.addColorStop(0, '#007700');
        gradient.addColorStop(1, '#00ff00');
        ctx.fillStyle = gradient;
        ctx.fillRect(progressBarX, progressBarY, progress, progressBarHeight);

        const baseVirusSize = 45;
        const virusSize = baseVirusSize * this.virusScale;
        const virusX = progressBarX + progress - virusSize / 2;
        const virusY = progressBarY + progressBarHeight / 2 - virusSize / 2;

        ctx.save();
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.drawImage(this.virusImage, virusX, virusY, virusSize, virusSize);
        ctx.restore();
        ctx.restore();
    }

    renderLives() {
        if (!this.heartsLoaded) {
            return;
        }
        const {ctx} = this;
        ctx.save();

        const containerWidth = 250;
        const containerHeight = 50;
        const containerX = 40;
        const containerY = 80;

        const heartWidth = 35;
        const heartHeight = 35;
        const spacing = 12;

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
        // Reset Gisee position flag when game is reset
        this.gisee.positionInitialized = false;
    }

    startTimer() {
        this.stopTimer();
        this.localTime = 0;
        const timerElem = document.getElementById("hud-timer");
        timerElem.classList.remove("almost");
        timerElem.value = 0;
        timerElem.style.display = "block";
        this.timerHandler = setInterval(() => {
            if (window.gameOver) {
                this.stopTimer();
                return;
            }
            this.globalTime++;
            this.localTime++;
            timerElem.value = this.localTime;
            if (this.localTime >= this.maxTime - 5) {
                timerElem.classList.add("almost");
            } else {
                timerElem.classList.remove("almost");
            }
            if (this.localTime >= this.maxTime) {
                timerElem.classList.remove("almost");
                this.stopTimer();
                timerElem.style.display = "none";
                window.gameOver = true;
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerHandler) {
            clearInterval(this.timerHandler);
            this.timerHandler = null;
        }
        const timerElem = document.getElementById("hud-timer");
        if (timerElem) {
            timerElem.style.display = "none";
            timerElem.classList.remove("almost");
            timerElem.classList.remove("timer-blink");
        }
    }
}