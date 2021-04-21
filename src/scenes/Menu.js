class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {
    }
    
    create() {
        // Menu Config
        game.Seed = -1;
    
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            alighn: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        // CREATE MENU... JESUS WEPT        
        this.add.text(game.config.width/2, game.config.height/2 - key * 2, 'PIANO PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, 'Use <--> arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        let startButton = this.add.text(game.config.width/2, game.config.height/2 + key * 2, 'Click here to start', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        startButton.setInteractive();
        startButton.on('pointerdown', () => {this.scene.start('playScene')});
    }
  }