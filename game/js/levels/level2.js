// game/js/levels/level2.js
import {BaseLevel} from './base.js';

// Nível 2: comandos de base de dados
const Level2 = BaseLevel.extend(function () {
    // Define o nome, comandos e tempo limite do nível 2
    this.constructor = function (ctx, game) {
        const name = 'Level 2';
        const commands = [
            'connect db-main',
            'select * from users;',
            'update password set value="secure123";',
            'disconnect',
            'insert into logs values ("access", now());',
            'delete from sessions where expired=1;',
            'grant all on db-main to admin;',
            'backup database db-main;'
        ];
        this.super(ctx, game, name, commands);
        this.timeLimit = 80;
    };
});

export {Level2};