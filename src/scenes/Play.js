class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('notes', './assets/DoubleNote.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('sheet', './assets/BackGround.png');
        this.load.image('finger', './assets/finger.png');
    }

    create() {
        // Set Background Color
        this.cameras.main.setBackgroundColor(0xFFFFFF);

        this.add.image((key/3)*2,(key/3)*2, 'sheet').setOrigin(0,0);

        // Brown Piano Background
        this.add.rectangle(0, game.config.height - key*3.25, game.config.width, (key*2) + key/3, 0x7A4419).setOrigin(0, 0);
        

        this.keys = {};

        for (var i = 0; i<= 9; i++){
            this.keys["key" + i] = this.add.rectangle(key*2.8 + (key + (key/30))*i, game.config.height - (key*3 + key/12), key, key*2, 0xFFFFFF).setOrigin(0,0);
        }
        for (var i = 0; i<= 8; i++){
            let extra = 0
            if (i == 2 || i == 6){
                extra = key + (key/30);
            } else {
                extra = 0;
            }
            this.add.rectangle(key*3.55 + ((key + (key/30))*i) + extra, game.config.height - (key*3 + key/12), key * 0.55, key * 1.2, 0x000000).setOrigin(0,0)
        }

        this.myFinger = new Finger(this, game.config.width/2, game.config.height - (key*2), 'finger').setOrigin(0.5, 0);

        this.ship01 = new Note(this, game.config.width + key, key*2, 'notes', 0, 30, 2).setOrigin(0, 0);
        this.ship02 = new Note(this, game.config.width + key * 1, key*4, 'notes', 0, 20, 2).setOrigin(0,0);
        this.ship03 = new Note(this, game.config.width + key * 2, key*6, 'notes', 0, 10, 2).setOrigin(0,0);

        // Black borders
        this.add.rectangle(0, 0, game.config.width, (key/3)*2, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 0, (key/3)*2, game.config.height, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - (key/3)*2, game.config.width, (key/3)*2, 0x000000).setOrigin(0, 0);
        this.add.rectangle(game.config.width - (key/3)*2, 0, (key/3)*2, game.config.height, 0x000000).setOrigin(0, 0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.myFinger.update();
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        if (Phaser.Input.Keyboard.JustDown(keyF)){
            for (var i = 0; i<= 9; i++){
                if(this.checkCollision(this.myFinger, this.keys["key"+i])) {
                    this.keys["key"+i].setFillStyle(0xDDDDDD, 1);
                    this.keys["key"+i].height += 2;
                }
            }
        }
    }

    checkCollision(A, B) {
        // simple AABB checking
        if (A.x < B.x + B.width && 
            A.x + A.width/2 > B.x && 
            A.y < B.y + B.height &&
            A.height + A.y > B.y) {
                return true;
        } else {
            return false;
        }
    }
 }