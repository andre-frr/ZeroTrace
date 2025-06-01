export class LevelManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.currentLevel = 0;
        this.levels = [];
    }

    loadLevels(levelData) {
        this.levels = levelData;
    }

    startLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= this.levels.length) {
            return;
        }
        this.currentLevel = levelIndex;
        this.levels[levelIndex].hud?.startTimer?.();
    }

    update() {
        this.levels[this.currentLevel]?.update();
    }

    render() {
        this.levels[this.currentLevel]?.render(this.ctx);
    }
}