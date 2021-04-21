class Snake extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, red) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.snakeSpeed;
        if(red = true) {
            this.moveSpeed = game.settings.snake2Speed;
        }
    }

    update() {
        this.x -= this.moveSpeed;

        if(this.x < -this.width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width + 50;
        this.alpha = 1
    }
}