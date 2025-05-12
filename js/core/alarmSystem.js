// Classe responsável por gerir o alarme do jogo
export class AlarmSystem {
    constructor() {
        this.triggerCondition = null; // Condição para disparar o alarme
        this.onTrigger = null; // Função a executar quando o alarme dispara
        this.triggered = false; // Estado do alarme
    }

    // Configura o alarme
    setAlarm(triggerCondition, onTrigger) {
        this.triggerCondition = triggerCondition;
        this.onTrigger = onTrigger;
        this.triggered = false;
    }

    // Atualiza o estado do alarme
    update() {
        if (!this.triggered && this.triggerCondition && this.triggerCondition()) {
            this.triggered = true;
            if (this.onTrigger) this.onTrigger();
        }
    }

    // Reinicia o alarme
    reset() {
        this.triggered = false;
    }
}