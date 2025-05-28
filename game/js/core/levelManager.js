// Classe responsável por gerir os níveis do jogo
export class LevelManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.currentLevel = 0; // Índice do nível atual
        this.levels = []; // Lista de níveis carregados
    }

    // Carrega os dados dos níveis
    loadLevels(levelData) {
        this.levels = levelData;
    }

    // Inicia um nível específico
    startLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= this.levels.length) {
            console.error('Índice de nível inválido');
            return;
        }
        this.currentLevel = levelIndex;
        console.log(`A iniciar o ${this.levels[levelIndex].name}`);
        if (this.levels[levelIndex].hud?.startTimer) {
            this.levels[levelIndex].hud.startTimer();
        }
    }

    // Atualiza a lógica do nível atual
    update() {
        this.levels[this.currentLevel]?.update();
    }

    // Renderiza o nível atual
    render() {
        this.levels[this.currentLevel]?.render(this.ctx);
    }
}