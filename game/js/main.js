import {InputManager} from './core/inputManager.js';
import {LevelManager} from './core/levelManager.js';
import {HUD} from './ui/hud.js';
import {Level1} from './levels/level1.js';

const game = {};
const sounds = {typing: "", ambience: ""};
game.sounds = sounds;

let ctx, canvas, levelManager, inputManager, hud, gameStarted = false;
let bgImage, bgLoaded = false, bgScrollY = 0, bgScrollSpeed = 1;

window.onload = function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    hud = new HUD(ctx, './assets/images/virus.png');
    inputManager = new InputManager();
    levelManager = new LevelManager(ctx);

    bgImage = new Image();
    bgImage.src = './assets/images/bg.webp';
    bgImage.onload = () => {
        bgLoaded = true;
    };

    audioManager();

    const level1 = new Level1(ctx, game);
    levelManager.loadLevels([level1]);

    inputManager.initialize(loadHandler);

    gameLoop();
};

function loadHandler(key) {
    if (!gameStarted && key === 'Enter') {
        gameStarted = true;
        levelManager.startLevel(0);
    } else if (gameStarted) {
        const currentLevel = levelManager.levels[levelManager.currentLevel];
        if (currentLevel) {
            currentLevel.handleInput(key);
        }
    }
}

function update() {
    if (gameStarted) {
        levelManager.update();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (!gameStarted) {
        hud.drawIntroMessage();
    } else {
        levelManager.render();
    }
}

function drawBackground() {
    if (bgLoaded) {
        ctx.drawImage(bgImage, 0, bgScrollY, canvas.width, canvas.height);
        ctx.drawImage(bgImage, 0, bgScrollY - canvas.height, canvas.width, canvas.height);

        bgScrollY += bgScrollSpeed;

        if (bgScrollY >= canvas.height) {
            bgScrollY = 0;
        }
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function audioManager() {
    game.sounds.ambience = document.querySelector('#ambience');
    game.sounds.typing = document.querySelector('#type');

    game.sounds.ambience.volume = 0.2;
    game.sounds.typing.volume = 0.2;
}