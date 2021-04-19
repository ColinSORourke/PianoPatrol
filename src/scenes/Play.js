class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('notes', './assets/DoubleNote.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('sheet', './assets/BackGround.png');
        this.load.image('finger', './assets/finger.png');
        this.load.audio('theJoke', './assets/Megalovania.mp3');
        this.load.audio('initialNotes', './assets/InitialNotes.mp3');
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

        this.note01 = new Note(this, game.config.width + key* 6 * Math.random(), key, 'notes', 0, 30, 3).setOrigin(0, 0);
        this.note02 = new Note(this, game.config.width + key* 6 * Math.random(), key*2.25, 'notes', 0, 20, 4).setOrigin(0,0);
        this.note03 = new Note(this, game.config.width + key* 6 * Math.random(), key*5.25,'notes', 0, 10, 5).setOrigin(0,0);
        this.note04 = new Note(this, game.config.width + key* 6 * Math.random(), key*7, 'notes', 0, 10, 6).setOrigin(0,0);

        this.fired = [];
        this.firedCooldown = 0;

        // Black borders
        this.add.rectangle(0, 0, game.config.width, (key/3)*2, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, 0, (key/3)*2, game.config.height, 0x000000).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - (key/3)*2, game.config.width, (key/3)*2, 0x000000).setOrigin(0, 0);
        this.add.rectangle(game.config.width - (key/3)*2, 0, (key/3)*2, game.config.height, 0x000000).setOrigin(0, 0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.music = this.sound.add('theJoke');
        this.notes = this.sound.add('initialNotes');
        this.score = 0;
        this.noteDurations = [0.44, 0.96, 1.5, 2.04, 2.56, 3.08, 3.6, 4.12, 4.64, 5.16];



        this.musicConfig =  {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        };
    }

    update(time, delta) {
        this.myFinger.update();
        this.note01.update();
        this.note02.update();
        this.note03.update();
        this.note04.update();

        if (this.firedCooldown > 0){
            this.firedCooldown -= delta;
        }

        if (Phaser.Input.Keyboard.JustDown(keyF)){
            for (var i = 0; i<= 9; i++){
                let myKey = this.keys["key"+i];
                if(this.checkCollision(this.myFinger, myKey)) {

                    myKey.setFillStyle(0xDDDDDD, 1);
                    myKey.height += 2;

                    if (this.firedCooldown <= 0){
                        this.fired.push(this.add.rectangle(myKey.x + myKey.width/2, myKey.y, 15, 30,  0xCCA43B).setOrigin(0.5, 0));
                        this.firedCooldown = 250;
                    }
                    
                    if (this.fired.length > 3){
                        let bullet = this.fired[0];
                        if (bullet){
                            bullet.destroy();
                        }
                        this.fired.shift();
                    }
                    
                    break;
                }
            }
        }

        for (var i = 0; i <= this.fired.length; i++){
            if (i == 0 && this.fired[i] == false){
                console.log("removed a bullet");
                this.fired.shift();
                i -= 1;
                break;
            }
            let bullet = this.fired[i];
            if (bullet) {
                bullet.y -= 4;
                if (bullet.y <= key){
                    this.fired[i] = false;
                    bullet.destroy();
                }
                if(this.checkCollision(bullet, this.note01)) {
                    this.incrementScore();
                    this.fired[i] = false;
                    bullet.destroy();
                    this.note01.reset();
                }
                if(this.checkCollision(bullet, this.note02)) {
                    this.incrementScore();
                    this.fired[i] = false;
                    bullet.destroy();
                    this.note02.reset();
                }
                if(this.checkCollision(bullet, this.note03)) {
                    this.incrementScore();
                    this.fired[i] = false;
                    bullet.destroy();
                    this.note03.reset();
                }
                if(this.checkCollision(bullet, this.note04)) {
                    this.incrementScore();
                    this.fired[i] = false;
                    bullet.destroy();
                    this.note04.reset();
                }
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.incrementScore();
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

    incrementScore() {
        if(this.score <= 9){
            this.notes.addMarker({name: "notes" + this.score, start: 0, duration: this.noteDurations[this.score], config: this.musicConfig})

            this.notes.play("notes" + this.score);
            this.score += 1;
            
        } else if (this.score == 10){
            console.log("2nd segment");
            this.notes.addMarker({name: "notes" + this.score, start: 6, duration: 4.5, config: this.musicConfig});

            this.notes.play("notes" + this.score);
            this.score += 1;
        } else if (this.score == 11){
            console.log("3rd segment");
            this.notes.addMarker({name: "notes" + this.score, start: 11.2, duration: 3.8, config: this.musicConfig});

            this.notes.play("notes" + this.score);
            this.score += 1;
        } else if (this.score == 12){
            console.log("4th segment");
            this.notes.addMarker({name: "notes" + this.score, start: 16.5, duration: 4, config: this.musicConfig});

            this.notes.play("notes" + this.score);
            this.score += 1;
        } else if (this.score == 13){
            this.music.addMarker({name: "Intro", start: 0, duration: 33.391, config: this.musicConfig});
            this.music.play("Intro");
            this.music.addMarker({name: "loop", start: 16.696, duration: 16.65, config: this.musicConfig});
            this.music.once('complete', function(music){audioController(music);});
            this.score += 1;
        } else {
            this.score += 1;
        }
        
        
    }
 }



function audioController(music){
    music.play("loop");
    music.once('complete', function(music){audioController(music);});
}