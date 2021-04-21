class Menu extends Phaser.Scene {
    constructor() {
      super("menuScene");
    }

    preload() {
      this.load.image("background", "./assets/MenuBG.png");

      this.load.audio("select_menu", "./assets/MenuSelect.mp3");
    }
    
    create() {
        // Menu Config
        this.add.image(0,0, 'background').setOrigin(0,0)

        let menuConfig = {
            fontFamily: 'Garamond',
            fontSize: '28px',
            color: '#FFFFF0',
            alighn: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        // CREATE MENU... JESUS WEPT    
        menuConfig.fontSize = "48px";    
        this.add.text(game.config.width/2, game.config.height/2 - key * 4, 'PIANO PATROL', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = "28px";   
        this.add.text(game.config.width/2, game.config.height/2 - key/2, 'Use <--> arrows to move & (F) to play', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#04471C';
        let startButton = this.add.text(game.config.width/2, game.config.height/2 + key * 2, 'Click here to start', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        startButton.setInteractive();
        startButton.on('pointerdown', () => {
          this.sound.play('select_menu');
          this.scene.start('playScene');
        });
    }
  }