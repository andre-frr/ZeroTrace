// Inicialização principal do jogo
import {GameManager} from './core/gameManager.js';

window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Define o tamanho do canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Inicializa e inicia o jogo
    const gameManager = new GameManager(ctx);
    gameManager.start();
};