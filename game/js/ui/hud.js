import '../entities/entity.js';
import '../entities/heartEmpty.js';
import '../entities/heartFull.js';

export class HUD {
    constructor(ctx, virusImagePath) {
        this.ctx = ctx;

        // Progress Tracker properties
        this.virusImage = new Image();
        this.virusImage.src = virusImagePath;
        this.virusLoaded = false;
        this.virusImage.onload = () => {
            this.virusLoaded = true;
        };
        this.virusScale = 1.0;
        this.virusScaleDirection = 0.01;
        this.lastUpdateTime = Date.now();

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
            // Set the image for all heart entities
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

    update() {
        const now = Date.now();
        if (now - this.lastUpdateTime > 16) { // ~60fps
            // Animação do vírus na barra de progresso
            this.virusScale += this.virusScaleDirection;
            if (this.virusScale > 1.1 || this.virusScale < 0.9) {
                this.virusScaleDirection *= -1;
            }

            // Animação de palpitação dos corações quando restam 2 ou menos vidas
            this.heartPulseActive = (this.lives <= 2 && this.lives > 0);
            if (this.heartPulseActive) {
                this.heartScale += this.heartScaleDirection;
                if (this.heartScale > 1.15 || this.heartScale < 0.85) {
                    this.heartScaleDirection *= -1;
                }
            } else {
                // Resetar para o tamanho normal se não estiver pulsando
                this.heartScale = 1.0;
            }

            this.lastUpdateTime = now;
        }
    }

    renderProgress(currentCommandIndex, totalCommands) {
        if (!this.virusLoaded) {
            return;
        }
        const {ctx} = this;
        ctx.save();
        // Barra de progresso mais para cima (ajuste Y de 40 para 10)
        const progressBarWidth = ctx.canvas.width - 400;
        const progressBarHeight = 25;
        const progressBarX = 200;
        const progressBarY = 18; // Agora 10px do topo

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

        // Container dimensions
        const containerWidth = 200;
        const containerHeight = 50;
        const containerX = 30;
        const containerY = 80;

        // Heart dimensions
        const heartWidth = 25;
        const heartHeight = 35;
        const spacing = 12;

        // Calculate total width for centering
        const totalHeartsWidth = (this.maxLives * heartWidth) + ((this.maxLives - 1) * spacing);

        // Draw background container
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(containerX, containerY, containerWidth, containerHeight);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);

        // Calculate starting position for hearts
        const startX = containerX + Math.round((containerWidth - totalHeartsWidth) / 2);

        // Draw hearts using entities
        for (let i = 0; i < this.maxLives; i++) {
            const heart = i < this.lives ? this.hearts[i].full : this.hearts[i].empty;

            // Apply pulse effect if needed
            const scale = (this.heartPulseActive && i < this.lives) ? this.heartScale : 1.0;

            const heartX = startX + (i * (heartWidth + spacing));
            const heartY = containerY + Math.round((containerHeight - heartHeight) / 2);

            // Draw the heart entity with scaling from its center
            ctx.save();
            ctx.translate(heartX + heartWidth / 2, heartY + heartHeight / 2); // Move to heart center
            ctx.scale(scale, scale); // Apply scaling
            ctx.translate(-heartWidth / 2, -heartHeight / 2); // Move back to top-left corner
            ctx.drawImage(heart.sprite.img, heart.sprite.sourceX, heart.sprite.sourceY, heart.sprite.sourceWidth, heart.sprite.sourceHeight, 0, 0, heartWidth, heartHeight);
            ctx.restore();
        }
        ctx.restore();
    }

    loseLife() {
        if (this.lives > 1) {
            // Se tiver mais de 1 vida, apenas perde uma vida
            this.lives--;
            return true; // Retorna true porque ainda tem vidas restantes
        } else if (this.lives === 1) {
            // Se tiver exatamente 1 vida, essa é a última
            this.lives = 0; // Zera a vida

            window.gameOver = true;

            return false; // Retorna false indicando que não tem mais vidas
        }
        return false; // Já está sem vidas
    }

    resetLives() {
        this.lives = this.maxLives;
    }

    getLives() {
        return this.lives;
    }

    drawGameOverMessage() {
        const {ctx} = this;

        // Save the current context state to restore it later
        ctx.save();

        // Semi-transparente para ver o jogo por baixo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Desenha a caixa de alerta no centro
        const boxWidth = 600;
        const boxHeight = 350;
        const boxX = (ctx.canvas.width - boxWidth) / 2;
        const boxY = (ctx.canvas.height - boxHeight) / 2;

        // Contorno vermelho pulsante
        ctx.lineWidth = 4;
        const now = Date.now();
        const pulseIntensity = Math.sin(now / 200) * 0.3 + 0.7; // Pulsação suave
        const redGlow = Math.floor(255 * pulseIntensity);
        ctx.strokeStyle = `rgb(${redGlow}, 0, 0)`;

        // Desenha o fundo da caixa com gradiente
        const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
        gradient.addColorStop(0, 'rgba(80, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(40, 0, 0, 0.9)');
        ctx.fillStyle = gradient;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Título do alerta
        ctx.fillStyle = 'red';
        ctx.font = '42px VT323';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 10;
        ctx.fillText('[ALERTA DE SEGURANÇA]', ctx.canvas.width / 2, boxY + 60);

        // Mensagens
        ctx.font = '32px VT323';
        ctx.fillText('Firewall ativada! Foste detetado!', ctx.canvas.width / 2, boxY + 160);
        ctx.fillText('Ligação terminada forçadamente.', ctx.canvas.width / 2, boxY + 200);

        // Instruções
        ctx.fillStyle = 'white';
        ctx.font = '26px VT323';
        ctx.fillText('Prima ENTER para tentar novamente', ctx.canvas.width / 2, boxY + boxHeight - 50);

        // Adiciona ícones de alerta
        this.drawAlertIcon(ctx, boxX + 80, boxY + 60);
        this.drawAlertIcon(ctx, boxX + boxWidth - 80, boxY + 60);

        // Reset shadow effects
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 0;

        // Restore the context state to what it was before
        ctx.restore();
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

    startTimer() {
        this.stopTimer();
        this.localTime = 0;
        const timerElem = document.getElementById("hud-timer");
        timerElem.classList.remove("almost");
        timerElem.value = 0;
        timerElem.style.display = "block";
        this.timerHandler = setInterval(() => {
            // Só atualiza se não for game over
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
                // Aqui pode disparar lógica de fim de tempo se necessário
                window.gameOver = true; // Dispara o game over ao acabar o tempo
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerHandler) {
            clearInterval(this.timerHandler);
            this.timerHandler = null;
        }
        // Esconde o timer ao parar
        const timerElem = document.getElementById("hud-timer");
        if (timerElem) {
            timerElem.style.display = "none";
            timerElem.classList.remove("almost");
            timerElem.classList.remove("timer-blink");
        }
    }
}