let config = {
    type: Phaser.CANVAS,
    width: 640,
    height:480,
    scene: [Menu, Play],
}

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyLEFT, keyRIGHT, keyF, keyR;

//60 points: change the game's aesthetic, I changed the game's aesthetic to a western theme where you catch snakes in the desert
//20 points: I made a smaller and faster snake that is worth more points
//10 points: I made a foreground frame to replace the white borders
//I tried a couple other mod ideas but I couldn't get them to work, and I also find coding really frustrating so I finished with those three