import {BaseLevel} from './base.js';

export class Level1 extends BaseLevel {
    constructor(ctx) {
        const name = 'Level 1';
        const commands = [
            'connect -secure',
            'decrypt -key FIBX',
            'extract -data classified',
            'bypass -firewall',
            'upload -payload',
            'disconnect -trace'
        ];
        const hudImagePath = './assets/images/virus.png';
        super(ctx, name, commands, hudImagePath);
    }
}