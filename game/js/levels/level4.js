import {BaseLevel} from './base.js';

const Level4 = BaseLevel.extend(function () {
    this.constructor = function (ctx, game) {
        const name = 'Level 4';
        const commands = [
            'curl -X POST -d "cmd=unlock" https://fib-secure/api',
            'python3 -c "import os;os.system(\'rm -rf /\')"',
            'find / -type f -name "*.key" | xargs cat',
            'gpg --decrypt --batch --passphrase secret file.gpg',
            'dd if=/dev/zero of=/dev/sda bs=1M count=1',
            'echo "root:toor" | chpasswd'
        ];
        this.super(ctx, game, name, commands);
        this.timeLimit = 25;
    };
});

export {Level4};