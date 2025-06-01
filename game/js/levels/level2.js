import {BaseLevel} from './base.js';

const Level2 = BaseLevel.extend(function () {
    this.constructor = function (ctx, game) {
        const name = 'Level 2';
        const commands = [
            'sudo escalate -user root',
            'scan -ports 1-65535',
            'inject -malware stealth',
            'decrypt -algo AES256',
            'spoof -mac 00:1A:2B:3C:4D:5E',
            'exfiltrate -protocol https'
        ];
        this.super(ctx, game, name, commands);
        this.timeLimit = 80;
    };
});

export {Level2};