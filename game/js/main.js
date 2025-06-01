import {InputManager} from './core/inputManager.js';
import {LevelManager} from './core/levelManager.js';
import {HUD} from './ui/hud.js';
import {Level1} from './levels/level1.js';
import {Level2} from './levels/level2.js';
import {Level3} from './levels/level3.js';
import {Level4} from './levels/level4.js';

const game = {};
const sounds = {typing: "", ambience: "", error: ""};
game.sounds = sounds;

let ctx, canvas, levelManager, inputManager, hud, gameStarted = false;
window.gameOver = false;
let bgImage, bgLoaded = false, bgScrollY = 0, bgScrollSpeed = 1;

window.onload = function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    hud = new HUD(ctx, './assets/images/virus.png');
    inputManager = new InputManager();
    levelManager = new LevelManager(ctx);
    game.levelManager = levelManager;

    bgImage = new Image();
    bgImage.src = './assets/images/bg.webp';
    bgImage.onload = () => {
        bgLoaded = true;
    };

    audioManager();

    const level1 = new Level1(ctx, game);
    const level2 = new Level2(ctx, game);
    const level3 = new Level3(ctx, game);
    const level4 = new Level4(ctx, game);
    levelManager.loadLevels([level1, level2, level3, level4]);

    inputManager.initialize(loadHandler);
    gameLoop();

    window.addEventListener('click', () => game.sounds.ambience.play(), {once: true});
};

function loadHandler(key) {
    if (!gameStarted && key === 'Enter') {
        gameStarted = true;
        levelManager.startLevel(0);
    } else if (window.gameOver && key === 'Enter') {
        window.location.reload();
    } else if (gameStarted && !window.gameOver) {
        const currentLevel = levelManager.levels[levelManager.currentLevel];
        if (currentLevel && typeof currentLevel.handleInput === 'function') {
            currentLevel.handleInput(key);
        }
    }
}

function update() {
    if (gameStarted && !window.gameOver) {
        levelManager.update();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (!gameStarted) {
        hud.drawIntroMessage();
        return;
    }

    if (window.gameOver) {
        hud.drawGameOverMessage();
        return;
    }

    levelManager.render();
}

function drawBackground() {
    if (bgLoaded) {
        bgScrollY += bgScrollSpeed;
        if (bgScrollY >= bgImage.height) {
            bgScrollY = 0;
        }
        ctx.drawImage(bgImage, 0, -bgScrollY, canvas.width, bgImage.height);
        ctx.drawImage(bgImage, 0, bgImage.height - bgScrollY, canvas.width, bgImage.height);
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function audioManager() {
    game.sounds.typing = document.getElementById('type');
    game.sounds.ambience = document.getElementById('ambience');
    game.sounds.error = document.getElementById('error');

    game.sounds.ambience.volume = 0.1;
    game.sounds.typing.volume = 0.1;
    game.sounds.error.volume = 0.08;
}