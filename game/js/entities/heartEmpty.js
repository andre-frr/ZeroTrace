const heartEmpty = Entity.extend(function () {
    this.constructor = function () {
        this.super();
        this.sprite.img = "";
        this.sprite.imgURL = "game/assets/images/heart.png";
        this.sprite.sourceX = 382;
        this.sprite.sourceY = 0;
        this.sprite.sourceWidth = 382;
        this.sprite.sourceHeight = 330;
    };
});