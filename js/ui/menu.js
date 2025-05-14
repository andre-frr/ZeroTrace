// Funções relacionadas com o menu
export class Menu {
    constructor(ctx) {
        this.ctx = ctx;
    }

    drawIntroMessage() {
        const {ctx} = this;

        // Mensagem introdutória
        ctx.fillStyle = 'white';
        ctx.font = '40px VT323';
        ctx.textAlign = 'center';
        ctx.fillText('Pressiona Enter para Começar', ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
}