import {BaseLevel} from './base.js';

const Level1 = BaseLevel.extend(function () {
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