// game/js/ui/hud.js
import {Gisee} from './gisee.js';
import {Hearts} from './hearts.js';

// Gere e apresenta a interface do utilizador no jogo
export class HUD {
    constructor(ctx) {
        this.ctx = ctx;
        this.virusImage = new Image();
        this.virusImage.src = "./assets/images/virus.png";
        this.virusLoaded = false;
        this.virusImage.onload = () => {
            this.virusLoaded = true;
        };
        this.virusScale = 1.0;
        this.virusScaleDirection = 0.01;
        this.lastUpdateTime = Date.now();

        this.hearts = new Hearts(ctx, 5);
        this.gisee = new Gisee(ctx);

        this.timerHandler = null;
        this.globalTime = 0;
        this.localTime = 0;
        this.maxTime = 45;
        this.lastGiseeUpdate = Date.now();

        this.timerElem = this.initializeTimerElement();
    }

    // Cria o elemento da barra de progresso do temporizador
    initializeTimerElement() {
        let timerElem = document.getElementById("hud-timer");
        if (!timerElem) {
            timerElem = document.createElement("progress");
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
        return timerElem;
    }

    // Reinicia todos os temporizadores e esconde a barra de progresso
    resetAllTimers() {
        this.globalTime = 0;
        this.localTime = 0;
        if (this.timerElem) {
            this.timerElem.value = 0;
            this.timerElem.classList.remove("almost");
            this.timerElem.classList.remove("timer-blink");
            this.timerElem.style.display = "none";
        }
    }

    // Apresenta a mensagem de introdução ao início do jogo
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

    // Método genérico para desenhar um ecrã de mensagem (game over ou vitória)
    drawMessageScreen(options) {
        const {
            title,
            messages,
            buttonText,
            primaryColor,
            gradientStart,
            gradientEnd,
            showIcons = false
        } = options;

        const ctx = this.ctx;
        const boxWidth = 600, boxHeight = 350;
        const boxX = (ctx.canvas.width - boxWidth) / 2;
        const boxY = (ctx.canvas.height - boxHeight) / 2;
        const containerBox = {x: boxX, y: boxY, width: boxWidth, height: boxHeight};

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.lineWidth = 4;
        const now = Date.now();
        const pulseIntensity = Math.sin(now / 200) * 0.3 + 0.7;
        const glowValue = Math.floor(255 * pulseIntensity);

        // Define a cor baseada em vermelho (game over) ou verde (vitória)
        if (primaryColor === 'red') {
            ctx.strokeStyle = `rgb(${glowValue}, 0, 0)`;
            ctx.shadowColor = '#ff0000';
        } else {
            ctx.strokeStyle = `rgb(0, ${glowValue}, 0)`;
            ctx.shadowColor = '#00ff00';
        }

        // Cria o gradiente
        const gradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
        gradient.addColorStop(0, gradientStart);
        gradient.addColorStop(1, gradientEnd);
        ctx.fillStyle = gradient;

        // Desenha a caixa
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Desenha o título
        ctx.fillStyle = primaryColor;
        ctx.font = '42px VT323';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        ctx.fillText(title, ctx.canvas.width / 2, boxY + 60);

        // Desenha as mensagens
        ctx.font = '32px VT323';
        messages.forEach((message, index) => {
            ctx.fillText(message, ctx.canvas.width / 2, boxY + 140 + (index * 40));
        });

        // Desenha o texto do botão
        ctx.fillStyle = 'white';
        ctx.font = '26px VT323';
        ctx.fillText(buttonText, ctx.canvas.width / 2, boxY + boxHeight - 50);

        // Desenha ícones se necessário
        if (showIcons) {
            this.drawAlertIcon(ctx, boxX + 80, boxY + 60);
            this.drawAlertIcon(ctx, boxX + boxWidth - 80, boxY + 60);
        }

        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 0;
        ctx.restore();

        // Atualiza e renderiza a mascote
        this.gisee.updateAnimation();
        this.gisee.updateMovement(containerBox);
        this.gisee.render();
    }

    // Apresenta a mensagem de fim de jogo com animação da mascote
    drawGameOverMessage() {
        this.drawMessageScreen({
            title: '[ALERTA DE SEGURANÇA]',
            messages: [
                'Intruso detectado',
                'Acesso negado ao sistema'
            ],
            buttonText: 'Prima ENTER para tentar novamente',
            primaryColor: 'red',
            gradientStart: 'rgba(80, 0, 0, 0.9)',
            gradientEnd: 'rgba(40, 0, 0, 0.9)',
            showIcons: true
        });
    }

    // Apresenta a mensagem de vitória ao concluir um nível
    drawWinScreen(levelName, isLastLevel = false) {
        const messages = [];

        if (isLastLevel) {
            messages.push('Todos os níveis concluídos!');
        } else if (levelName) {
            messages.push(`${levelName} concluído com sucesso!`);
        }

        this.drawMessageScreen({
            title: '[NÍVEL CONCLUÍDO]',
            messages: messages,
            buttonText: isLastLevel ? 'Missão concluída' : 'Prima ENTER para continuar',
            primaryColor: '#00ff00',
            gradientStart: 'rgba(0, 80, 0, 0.9)',
            gradientEnd: 'rgba(0, 40, 0, 0.9)',
            showIcons: false
        });
    }

    // Desenha um ícone de alerta triangular com ponto de exclamação
    drawAlertIcon(ctx, x, y) {
        const size = 30;
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '30px VT323';
        ctx.textAlign = 'center';
        ctx.fillText('!', 0, 10);
        ctx.restore();
    }

    // Atualiza os elementos animados do HUD
    update() {
        const now = Date.now();
        if (now - this.lastUpdateTime > 16) {
            this.virusScale += this.virusScaleDirection;
            if (this.virusScale > 1.1 || this.virusScale < 0.9) {
                this.virusScaleDirection *= -1;
            }
            this.lastUpdateTime = now;
        }
        this.hearts.updatePulse();
        this.gisee.updateAnimation();
        if (window.gameOver && this.gisee.ready) {
            const boxWidth = 600, boxHeight = 350;
            const boxX = (this.ctx.canvas.width - boxWidth) / 2;
            const boxY = (this.ctx.canvas.height - boxHeight) / 2;
            const containerBox = {x: boxX, y: boxY, width: boxWidth, height: boxHeight};
            this.gisee.updateMovement(containerBox);
        }
    }

    // Desenha a barra de progresso com o ícone de vírus
    renderProgress(currentCommandIndex, totalCommands) {
        if (!this.virusLoaded) return;
        const ctx = this.ctx;
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

    // Renderiza os corações de vida
    renderLives() {
        this.hearts.render();
    }

    // Reduz uma vida e verifica se o jogo terminou
    loseLife() {
        return this.hearts.loseLife();
    }

    // Inicia o temporizador para o limite de tempo do nível
    startTimer(timeLimitInSeconds) {
        this.stopTimer();
        this.resetAllTimers();
        if (timeLimitInSeconds !== undefined) {
            this.maxTime = timeLimitInSeconds;
        }
        const timerElem = this.timerElem;
        timerElem.max = this.maxTime;
        timerElem.value = 0;
        this.localTime = 0;
        timerElem.style.display = "block";
        timerElem.classList.remove("almost");
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
            }
            if (this.localTime >= this.maxTime) {
                timerElem.classList.add("timer-blink");
                window.gameOver = true;
                this.stopTimer();
            }
        }, 1000);
    }

    // Para o temporizador e esconde a barra de progresso
    stopTimer() {
        if (this.timerHandler) {
            clearInterval(this.timerHandler);
            this.timerHandler = null;
        }
        const timerElem = this.timerElem;
        if (timerElem) {
            timerElem.style.display = "none";
            timerElem.classList.remove("almost");
            timerElem.classList.remove("timer-blink");
        }
    }
}