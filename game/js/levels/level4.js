import {BaseLevel} from './base.js';

const Level4 = BaseLevel.extend(function () {
    this.constructor = function (ctx, game) {
        const name = 'Level 4';
        const commands = [
            'curl -X POST -d "cmd=unl0ck" https://fib-secure/api',
            'pyth0n3 -c "import os;os.system(\'rm -rf /tmp/*\')"',
            'find / -type f -name "*.k3y" | xargs c4t',
            'gpg --decrypt --batch --passphrase s3cr3t file.gpg',
            'dd if=/dev/zero of=/dev/sda bs=1M count=1',
            'ech0 "root:toor" | chpasswd',
            'ls /s3cr3t | gr3p "flag"',
            't4r -xzvf arc#h1ve.tgz'
        ];
        this.super(ctx, game, name, commands);
        this.timeLimit = 60;
    };
});

export {Level4};