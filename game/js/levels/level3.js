// game/js/levels/level3.js
import {BaseLevel} from './base.js';

// Nível 3: comandos avançados de sistema
const Level3 = BaseLevel.extend(function () {
    // Define o nome, comandos e tempo limite do nível 3
    this.constructor = function (ctx, game) {
        const name = 'Level 3';
        const commands = [
            'ssh -i id_rsa admin@10.0.0.5',
            'mount -t nfs 192.168.1.10:/data /mnt',
            'grep -r "classified" /mnt',
            'openssl enc -aes-256-cbc -d -in secret.enc',
            'iptables -A INPUT -p tcp --dport 22 -j ACCEPT',
            'nc -lvnp 4444',
            'sudo systemctl restart firewall',
            'journalctl -u firewall | tail -n 20'
        ];
        this.super(ctx, game, name, commands);
        this.timeLimit = 75;
    };
});

export {Level3};