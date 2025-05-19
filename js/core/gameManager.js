import {AudioManager} from './audioManager.js';
import {InputManager} from './inputManager.js';
import {LevelManager} from './levelManager.js';
import {Menu} from '../ui/menu.js';
import {Level1} from '../../levels/level1.js';

export class GameManager {
    constructor(ctx) {
        this.ctx = ctx;
        this.levelManager = null;
        this.inputManager = new InputManager();
        this.menu = new Menu(ctx);
        this.gameStarted = false;

        // Background image setup
        this.bgImage = new Image();
        this.bgLoaded = false;
        this.bgImage.src = './assets/images/bg.webp';
        this.bgImage.onload = () => {
            this.bgLoaded = true;
        };

        // Background scroll properties
        this.bgScrollY = 0;
        this.bgScrollSpeed = 1;

        // AudioManager setup
        this.audioManager = new AudioManager();
        this.audioManager.loadSound('ambience', './assets/audio/ambience.mp3'); // Load ambience sound
        this.audioManager.setVolume('ambience', 0.1);
    }

    start() {
        // Start ambience sound
        window.addEventListener('click', () => {
            this.audioManager.playSound('ambience');
        }, {once: true});

        // Initialize level manager
        this.levelManager = new LevelManager(this.ctx);

        // Load levels
        const level1 = new Level1(this.ctx);
        this.levelManager.loadLevels([level1]);

        // Initialize input manager with callback
        this.inputManager.initialize((key) => {
            if (!this.gameStarted && key === 'Enter') {
                this.gameStarted = true;
                this.levelManager.startLevel(0); // Start the first level
            } else if (this.gameStarted) {
                const currentLevel = this.levelManager.levels[this.levelManager.currentLevel];
                if (currentLevel) {
                    currentLevel.handleInput(key);
                }
            }
        });

        // Start the game loop
        this.gameLoop();
    }

    drawBackground() {
        if (this.bgLoaded) {
            const {ctx, bgImage, bgScrollY} = this;

            // Draw the original image
            ctx.drawImage(bgImage, 0, bgScrollY, ctx.canvas.width, ctx.canvas.height);

            // Draw the inverted image directly below the original
            ctx.drawImage(bgImage, 0, bgScrollY - ctx.canvas.height, ctx.canvas.width, ctx.canvas.height);

            // Update scroll position
            this.bgScrollY += this.bgScrollSpeed;

            // Reset scroll position when the original image scrolls out of view
            if (this.bgScrollY >= ctx.canvas.height) {
                this.bgScrollY = 0;
            }
        }
    }

    gameLoop() {
        // Clear the canvas for the next frame
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawBackground();

        // Show intro message if the game hasn't started
        if (!this.gameStarted) {
            this.menu.drawIntroMessage();
        } else {
            this.levelManager.update();
            this.levelManager.render();
        }

        // Request the next animation frame
        requestAnimationFrame(() => this.gameLoop());
    }
}