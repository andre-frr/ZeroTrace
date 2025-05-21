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
    }

    drawIntroMessage() {
        const {ctx} = this;

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
            this.virusScale += this.virusScaleDirection;
            if (this.virusScale > 1.1 || this.virusScale < 0.9) {
                this.virusScaleDirection *= -1;
            }
            this.lastUpdateTime = now;
        }
    }

    renderProgress(currentCommandIndex, totalCommands) {
        if (!this.virusLoaded) {
            return;
        }

        const {ctx} = this;
        const progressBarWidth = ctx.canvas.width - 400;
        const progressBarHeight = 25;
        const progressBarX = 200;
        const progressBarY = ctx.canvas.height - progressBarHeight - 20;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.lineWidth = 1;

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
    }
}