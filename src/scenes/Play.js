class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image("desert", "assets/desert.png");
        this.load.image("tranq", "assets/tranq.png");
        this.load.image("snake", "assets/snake.png")
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.desert = this.add.tileSprite(
            0,0,640,480, "desert"
        ).setOrigin(0,0);

        this.p1Tranq = new Tranq(this, game.config.width/2, game.config.height- borderUISize - borderPadding, "tranq")

        // add snakes (x4)
        this.snake1 = new Snake(this, game.config.width + borderUISize*6, borderUISize*4, 'snake', 0, 30, false).setOrigin(0, 0);
        this.snake2 = new Snake(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'snake', 0, 20, false).setOrigin(0,0);
        this.snake3 = new Snake(this, game.config.width, borderUISize*6 + borderPadding*4, 'snake', 0, 10, false).setOrigin(0,0);
        this.snake4 = new Snake(this, game.config.width, borderUISize*6 + borderPadding*4, 'snake', 0, 10, true).setOrigin(0,0);

        //green UI bg
        this.add.rectangle(0 , borderUISize + borderPadding, game.config.width, borderUISize*2, 0x987554,).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
 
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
       
        // animation config
        this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);


        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() { 
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.desert.tilePositionX -= 4;

        if (!this.gameOver) {               
            this.p1Tranq.update();         // update tranq sprite
            this.snake1.update();           // update snakes (x4)
            this.snake2.update();
            this.snake3.update();
            this.snake4.update();
        } 
        // check collisions
        if(this.checkCollision(this.p1Tranq, this.snake3)) {
            this.p1Tranq.reset();
            this.snakeExplode(this.snake3);  
        }
        if (this.checkCollision(this.p1Tranq, this.snake2)) {
            this.p1Tranq.reset();
            this.snakeExplode(this.snake2);  
        }
        if (this.checkCollision(this.p1Tranq, this.snake1)) {
            this.p1Tranq.reset();
            this.snakeExplode(this.snake1);  
        }

        if (this.checkCollision(this.p1Tranq, this.snake4)) {
            this.p1Tranq.reset();
            this.snakeExplode(this.snake4);  
        }
    }

    checkCollision(tranq, snake) {
        // simple AABB checking
        if (tranq.x < snake.x + snake.width && 
            tranq.x + tranq.width > snake.x && 
            tranq.y < snake.y + snake.height &&
            tranq.height + tranq.y > snake.y) {
                return true;
        } else {
            return false;
        }
    }

    snakeExplode(snake) {
        // temporarily hide snake
        snake.alpha = 0;                         
        // create explosion sprite at snake's position
        let boom = this.add.sprite(snake.x, snake.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
          snake.reset();                       // reset snake position
          snake.alpha = 1;                     // make snake visible again
          boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += snake.points;
        this.scoreLeft.text = this.p1Score;   
        this.sound.play('sfx_explosion');    
      }
}