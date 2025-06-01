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

        const level = this.levels[levelIndex];
        const timeLimit = level.timeLimit || 45;

        if (level.hud?.stopTimer) {
            level.hud.stopTimer();
        }
        if (level.hud?.resetAllTimers) {
            level.hud.resetAllTimers();
        }
        if (level.hud?.startTimer) {
            level.hud.startTimer(timeLimit);
        }
    }

    update() {
        this.levels[this.currentLevel]?.update();
    }

    render() {
        this.levels[this.currentLevel]?.render(this.ctx);
    }
}