const heartFull = Entity.extend(function () {
    this.constructor = function () {
        this.super(); // Construtor da superclasse

        this.sprite.img = "";
        this.sprite.imgURL = "game/assets/images/heart.png";
        this.sprite.sourceX = 0;
        this.sprite.sourceY = 0;
        this.sprite.sourceWidth = 382;
        this.sprite.sourceHeight = 330;
    };

    this.update = function () {
    };
});