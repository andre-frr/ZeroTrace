// game/js/entities/entity.js
// Classe base para entidades do jogo
const Entity = Class.extend(function () {
    // Define as propriedades básicas para todas as entidades
    this.sprite = {
        sourceX: 0,
        sourceY: 0,
        sourceWidth: 382,
        sourceHeight: 330,
        img: null,
        imgURL: ""
    };
    this.x = 0;
    this.y = 0;
    this.width = 382;
    this.height = 330;
});