// game/js/entities/heartFull.js
// Entidade de coração cheio (vida ativa)
const heartFull = Entity.extend(function () {
    // Configura o sprite para representar um coração cheio
    this.constructor = function () {
        this.super();
        this.sprite.img = "";
        this.sprite.imgURL = "game/assets/images/heart.png";
        this.sprite.sourceX = 0;
        this.sprite.sourceY = 0;
        this.sprite.sourceWidth = 382;
        this.sprite.sourceHeight = 330;
    };
});