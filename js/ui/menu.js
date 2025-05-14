// Funções relacionadas com o menu
export class Menu {
    constructor(ctx) {
        this.ctx = ctx;
    }

    drawIntroMessage() {
        const {ctx} = this;

        // Mensagem introdutória
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

        const lines = message.split('\n'); // Dividir o texto em linhas
        const lineHeight = 30; // Altura entre linhas
        const startX = ctx.canvas.width / 2;
        let startY = ctx.canvas.height / 2 - (lines.length * lineHeight) / 2;

        ctx.fillStyle = 'white';
        ctx.font = '28px VT323';
        ctx.textAlign = 'center';

        // Desenhar cada linha no canvas
        lines.forEach((line) => {
            ctx.fillText(line, startX, startY);
            startY += lineHeight;
        });
    }
}