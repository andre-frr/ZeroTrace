// game/js/core/levelManager.js
// Gere os níveis do jogo
export class LevelManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.currentLevel = 0;
        this.levels = [];
    }

    // Carrega os dados dos níveis para o jogo
    loadLevels(levelData) {
        this.levels = levelData;
    }

    // Inicia um nível específico e reinicia o temporizador do HUD
    startLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= this.levels.length) return;
        this.currentLevel = levelIndex;
        const level = this.levels[levelIndex];
        const timeLimit = level.timeLimit || 45;

        // Reinicia e inicia o temporizador do HUD se disponível
        level.hud?.stopTimer?.();
        level.hud?.resetAllTimers?.();
        level.hud?.startTimer?.(timeLimit);
    }

    // Atualiza o estado do nível atual
    update() {
        this.levels[this.currentLevel]?.update();
    }

    // Renderiza o nível atual
    render() {
        this.levels[this.currentLevel]?.render(this.ctx);
    }
}