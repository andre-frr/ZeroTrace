import {BaseLevel} from './base.js';

const Level1 = BaseLevel.extend(function () {
    this.constructor = function (ctx, game) {
        const name = 'Level 1';
        const commands = [
            'connect -secure',
            'decrypt -key FIBX',
            'extract -data classified',
            'bypass -firewall',
            'upload -payload',
            'disconnect -trace'
        ];
        this.super(ctx, game, name, commands);
        this.timeLimit = 90;
    };
});

export {Level1};