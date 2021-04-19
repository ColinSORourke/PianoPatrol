let config = {
    type: Phaser.CANVAS,
    width: 960,
    height: 720,
    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config);

// set UI constant
let key = game.config.width / 16;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;