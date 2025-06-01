// game/js/levels/level1.js
import {BaseLevel} from './base.js';

// Nível 1: comandos básicos
const Level1 = BaseLevel.extend(function () {
    // Define o nome, comandos e tempo limite do nível 1
    this.constructor = function (ctx, game) {
        const name = 'Level 1';
        const commands = [
            'login',
            'ls -l',
            'cd /home/user',
            'cat welcome.txt',
            'ps aux',
            'grep "FIB" processes.log',
            'mkdir test_folder',
            'touch hack.txt'
        ];
        this.super(ctx, game, name, commands);
        this.timeLimit = 90;
    };
});

export {Level1};