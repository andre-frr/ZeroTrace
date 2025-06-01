import {InputManager} from './core/inputManager.js';
import {LevelManager} from './core/levelManager.js';
import {HUD} from './ui/hud.js';
import {Level1} from './levels/level1.js';

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

    window.addEventListener('click', () => game.sounds.ambience.play(), {once: true});
};

function loadHandler(key) {
    if (!gameStarted && key === 'Enter') {
        gameStarted = true;
        levelManager.startLevel(0);
    } else if (window.gameOver && key === 'Enter') {
        resetGame();
    } else if (gameStarted && !window.gameOver) {
        const currentLevel = levelManager.levels[levelManager.currentLevel];
        if (currentLevel) {
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
    } else {
        levelManager.render();
        if (window.gameOver) {
            if (!render.loggedGameOver) {
                console.log("Game Over");
                render.loggedGameOver = true;
            }
            hud.drawGameOverMessage();
        } else {
            render.loggedGameOver = false;
        }
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

function resetGame() {
    window.gameOver = false;
    gameStarted = true;

    levelManager.currentLevel = 0;
    levelManager.levels.forEach(level => {
        if (level.hud) {
            level.hud.resetLives();
        }
        level.currentCommandIndex = 0;
        level.input = '';
        level.commandHistory = [];
        level.completed = false;
        if (level.blinkInterval) {
            clearInterval(level.blinkInterval);
        }
        level.blink = true;
        level.blinkInterval = setInterval(() => {
            level.blink = !level.blink;
        }, 500);
    });

    levelManager.startLevel(0);
}

function audioManager() {
    game.sounds.ambience = document.querySelector('#ambience');
    game.sounds.typing = document.querySelector('#type');
    game.sounds.error = document.querySelector('#error');

    game.sounds.ambience.volume = 0.2;
    game.sounds.typing.volume = 0.2;
    game.sounds.error.volume = 0.08;
}