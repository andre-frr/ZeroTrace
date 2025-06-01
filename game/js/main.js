// game/js/main.js
import {InputManager} from './core/inputManager.js';
import {LevelManager} from './core/levelManager.js';
import {HUD} from './ui/hud.js';
import {Level1} from './levels/level1.js';
import {Level2} from './levels/level2.js';
import {Level3} from './levels/level3.js';
import {Level4} from './levels/level4.js';

// Ponto de entrada principal: inicializa o jogo, carrega recursos e inicia o ciclo de jogo
const game = {};
window.game = game; // Torna o jogo acessível globalmente
const sounds = {typing: "", ambience: "", error: "", defeat: "", victory: ""};
game.sounds = sounds;
game.defeatPlayed = false; // Controla o estado do som de derrota

let ctx, canvas, levelManager, inputManager, hud, gameStarted = false;
window.gameOver = false;
let bgImage, bgLoaded = false, bgScrollY = 0, bgScrollSpeed = 1;

// Configura o jogo quando a janela carrega
window.onload = function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    hud = new HUD(ctx, './assets/images/virus.png');
    inputManager = new InputManager();
    levelManager = new LevelManager(ctx);
    game.levelManager = levelManager;

    // Carrega a imagem de fundo
    bgImage = new Image();
    bgImage.src = './assets/images/bg.webp';
    bgImage.onload = () => {
        bgLoaded = true;
    };

    // Inicializa o gestor de áudio
    audioManager();

    // Carrega os níveis do jogo
    const level1 = new Level1(ctx, game);
    const level2 = new Level2(ctx, game);
    const level3 = new Level3(ctx, game);
    const level4 = new Level4(ctx, game);
    levelManager.loadLevels([level1, level2, level3, level4]);

    // Configura o gestor de input
    inputManager.initialize(loadHandler);
    gameLoop();

    // Desbloqueia o áudio no primeiro evento de teclado físico
    window.addEventListener('keydown', function unlockAudioOnce() {
        for (const key in game.sounds) {
            const sound = game.sounds[key];
            if (sound && typeof sound.play === 'function' && key !== 'ambience') {
                try {
                    sound.play().catch(() => {
                    });
                } catch {
                }
                sound.pause();
                sound.currentTime = 0;
            }
        }
        window.removeEventListener('keydown', unlockAudioOnce);
    }, {once: true});
};

// Processa o input do teclado e direciona para o handler correto
function loadHandler(key) {
    if (!gameStarted && key === 'Enter') {
        gameStarted = true;
        game.defeatPlayed = false; // Reinicia a flag de derrota no novo jogo
        levelManager.startLevel(0);
    } else if (window.gameOver && key === 'Enter') {
        game.defeatPlayed = false; // Reinicia a flag de derrota ao recomeçar
        window.location.reload();
    } else if (gameStarted && !window.gameOver) {
        const currentLevel = levelManager.levels[levelManager.currentLevel];
        if (currentLevel && typeof currentLevel.handleInput === 'function') {
            currentLevel.handleInput(key);
        }
    }
}

// Atualiza o estado do jogo
function update() {
    if (gameStarted && !window.gameOver) {
        levelManager.update();
    }
}

// Desenha todos os elementos do jogo
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

// Desenha o fundo animado do jogo
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

// Ciclo principal do jogo: atualiza e renderiza a cada frame
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Inicializa e configura todos os elementos de áudio
function audioManager() {
    game.sounds.typing = document.getElementById('type');
    game.sounds.ambience = document.getElementById('ambience');
    game.sounds.error = document.getElementById('error');
    game.sounds.defeat = document.getElementById('defeat');
    game.sounds.victory = document.getElementById('victory');

    // Configura o volume para todos os sons
    for (const key in game.sounds) {
        const sound = game.sounds[key];
        if (sound && typeof sound.volume === 'number') {
            sound.volume = 0.1;
        }
    }
}