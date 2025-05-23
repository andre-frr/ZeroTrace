import {InputManager} from './core/inputManager.js';
import {LevelManager} from './core/levelManager.js';
import {HUD} from './ui/hud.js';
import {Level1} from './levels/level1.js';

const game = {};
const sounds = {typing: "", ambience: "", error: ""};
game.sounds = sounds;

// Variáveis globais para o estado do jogo
let ctx, canvas, levelManager, inputManager, hud, gameStarted = false;
window.gameOver = false; // Flag global para indicar quando o jogador perdeu todas as vidas
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

    inputManager.initialize(loadHandler);    gameLoop();

    // Adiciona evento para iniciar o áudio com clique do mouse ou qualquer tecla
    const startAudio = () => {
        game.sounds.ambience.play();
        // Remove todos os event listeners depois que o áudio começar
        window.removeEventListener('click', startAudio);
        window.removeEventListener('keydown', startAudio);
    };
    
    window.addEventListener('click', startAudio, {once: true});
    window.addEventListener('keydown', startAudio, {once: true});
};

function loadHandler(key) {
    if (!gameStarted && key === 'Enter') {
        gameStarted = true;
        levelManager.startLevel(0);
    } else if (window.gameOver && key === 'Enter') {
        // Reinicia o jogo ao pressionar Enter quando estiver em game over
        resetGame();
    } else if (gameStarted && !window.gameOver) {
        const currentLevel = levelManager.levels[levelManager.currentLevel];
        if (currentLevel) {
            currentLevel.handleInput(key);
        }
    }
}

function update() {
    // Atualizamos apenas quando o jogo está ativo e não em game over
    if (gameStarted && !window.gameOver) {
        levelManager.update();
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Para depuração
    if (window.gameOver) {
        console.log("Renderizando alerta de Game Over");
    }

    if (!gameStarted) {
        hud.drawIntroMessage();
    } else {
        // Sempre renderiza o jogo, independente do estado
        levelManager.render();
        
        // Se estiver em game over, adiciona o alerta por cima
        if (window.gameOver) {
            hud.drawGameOverMessage();
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

function audioManager() {
    game.sounds.ambience = document.querySelector('#ambience');
    game.sounds.typing = document.querySelector('#type');
    game.sounds.error = document.querySelector('#error');

    game.sounds.ambience.volume = 0.2;
    game.sounds.typing.volume = 0.2;
    game.sounds.error.volume = 0.08;
}

function resetGame() {
    window.gameOver = false;
    gameStarted = true;
    
    // Reiniciar os níveis
    levelManager.currentLevel = 0;
    levelManager.levels.forEach(level => {
        if (level.hud) {
            level.hud.resetLives(); // Restaura todas as vidas
        }
        level.currentCommandIndex = 0;
        level.input = '';
        level.commandHistory = [];
        level.completed = false;
          // Reiniciar o blink sempre que reiniciar o jogo
        // Limpa o intervalo anterior se existir
        if (level.blinkInterval) {
            clearInterval(level.blinkInterval);
        }
        
        // Cria um novo intervalo
        level.blink = true;
        level.blinkInterval = setInterval(() => {
            level.blink = !level.blink;
        }, 500);
    });
    
    // Inicia o primeiro nível novamente
    levelManager.startLevel(0);
}