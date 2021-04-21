class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.spritesheet('notes', './assets/DoubleNote.png', {frameWidth: 64, frameHeight: 64});
        this.load.image('sheet', './assets/BackGround.png');
        this.load.image('finger', './assets/Finger.png');
        this.load.audio('theJoke', './assets/Megalovania.mp3');
        this.load.audio('initialNotes', './assets/InitialNotes.mp3');
        this.load.audio('scale', './assets/Scale.mp3');
        this.load.image('him', './assets/Unknown.png');
        this.load.spritesheet('notesDestroy', './assets/DoubleNoteDestroy.png', {frameWidth: 64, frameHeight: 64});
        
    }

    create() {
        // Set Background Color
        this.cameras.main.setBackgroundColor(0xFFFFFF);
        this.gameOver = false;
        this.inFinale = false;

        this.add.image((key/3)*2,(key/3)*2, 'sheet').setOrigin(0,0);

        // Brown Piano Background
        this.add.rectangle(0, game.config.height - key*3.25, game.config.width, (key*2) + key/3, 0x7A4419).setOrigin(0, 0);
        

        
        this.keys = {};
        this.keyPress = this.sound.add('scale');

        for (var i = 0; i<= 9; i++){
            this.keys["key" + i] = this.add.rectangle(key*2.8 + (key + (key/30))*i, game.config.height - (key*3 + key/12), key, key*2, 0xFFFFFF).setOrigin(0,0);
            this.keyPress.addMarker({name: "key" + i, start: i, duration: 0.5, config: {
                mute: false,
                volume: 0.25,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0
            }})
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

        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
          }
        
        this.warnConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            align: 'center',
            color: '#9DD1F1',
        }
          

        this.myFinger = new Finger(this, game.config.width/2, game.config.height - (key*2), 'finger').setOrigin(0.5, 0);

        this.him = this.add.sprite(game.config.width * 0.45, game.config.height * 0.225, 'him').setScale(0.5);
        this.him.setOrigin(0,0);
        this.him.alpha = 0;
        this.himSpeed = 3;
        this.himWave = 1;

        this.note01 = new Note(this, game.config.width + key* 6 * Math.random(), key, 'notes', 0, 3).setOrigin(0, 0);
        this.note02 = new Note(this, game.config.width + key* 6 * Math.random(), key*2.25, 'notes', 0, 4).setOrigin(0,0);
        this.note03 = new Note(this, game.config.width + key* 6 * Math.random(), key*5.25,'notes', 0, 5).setOrigin(0,0);
        this.note04 = new Note(this, game.config.width + key* 6 * Math.random(), key*7, 'notes', 0, 6).setOrigin(0,0);

        this.anims.create({
            key: 'break',
            frames: this.anims.generateFrameNumbers('notesDestroy', { start: 0, end: 14, first: 0}),
            frameRate: 30
        });

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
        this.scoreInc = 1;
        this.noteDurations = [0.44, 0.96, 1.5, 2.04, 2.56, 3.08, 3.6, 4.12, 4.64, 5.16];

        this.scoreLeft = this.add.text(key, game.config.height - key*3, this.score, this.scoreConfig);

        this.finaleText = this.add.text(game.config.width/2, game.config.height/2 + 64, "You have until the song ends, get as many points as you can!", this.warnConfig).setOrigin(0.5,0);
        this.finaleText.alpha = 0;

        this.currLoop = false;
        this.queuedTransition = [];

        this.musicConfig =  {
            mute: false,
            volume: 0.75,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        };
    }

    update(time, delta) {

        if(this.gameOver&& Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();   
        }

        if(this.gameOver&& Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.start("menuScene"); 
        }

        if (!this.gameOver){
            this.myFinger.update();
            this.note01.update();
            this.note02.update();
            this.note03.update();
            this.note04.update();

            if (this.inFinale){
                this.him.x += this.himSpeed;
                this.him.y += this.himWave;
                if (this.him.x < key*2.8 || this.him.x > game.config.width - key*2.8){
                    this.himSpeed *= -1;
                }
                if (this.him.y < game.config.height * 0.175 || this.him.y > game.config.height * 0.275){
                    this.himWave *= -1;
                }
            }  

            if (this.firedCooldown > 0){
                this.firedCooldown -= delta;
            }

            if (Phaser.Input.Keyboard.JustDown(keyF)){
                for (var i = 0; i<= 9; i++){
                    let myKey = this.keys["key"+i];
                    if(this.checkCollision(this.myFinger, myKey)) {
                        if (this.firedCooldown <= 0){
                            this.fired.push(this.add.rectangle(myKey.x + myKey.width/2, myKey.y, 15, 30,  0xCCA43B).setOrigin(0.5, 0));
                            this.firedCooldown = 500;
                            myKey.setFillStyle(0xDDDDDD, 1);
                            myKey.y += 15;
                            this.myFinger.y -= 10;
                            this.keyPress.play("key"+i);
                            this.time.delayedCall(250, () => {
                                myKey.y = game.config.height - (key*3 + key/12);
                                myKey.setFillStyle(0xFFFFFF, 1);
                            });
                            this.time.delayedCall(250, () => {
                                this.myFinger.y = game.config.height - (key*2);
                            });
                        }
                        
                        if (this.fired.length > 2){
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
                        this.noteExplode(this.note01);
                    }
                    if(this.checkCollision(bullet, this.note02)) {
                        this.incrementScore();
                        this.fired[i] = false;
                        bullet.destroy();
                        this.noteExplode(this.note02);
                    }
                    if(this.checkCollision(bullet, this.note03)) {
                        this.incrementScore();
                        this.fired[i] = false;
                        bullet.destroy();
                        this.noteExplode(this.note03);
                    }
                    if(this.checkCollision(bullet, this.note04)) {
                        this.incrementScore();
                        this.fired[i] = false;
                        bullet.destroy();
                        this.noteExplode(this.note04);
                    }
                    if (this.inFinale){
                        if (this.checkCollision(bullet, this.him)){ 
                            this.fired[i] = false;
                            bullet.destroy();
                            this.him.setTint("0x9DD1F1")
                            this.time.delayedCall(50, () => {
                                this.him.clearTint()
                            });
                            this.score += 5;
                            this.scoreLeft.text = this.score; 
                        }
                    }
                }
            }
        }
    }

    checkCollision(A, B) {
        // simple AABB checking
        if (A.x < B.x + B.width * B.scale && 
            A.x + A.width/2 > B.x && 
            A.y < B.y + B.height * B.scale &&
            A.height + A.y > B.y) {
                return true;
        } else {
            return false;
        }
    }

    incrementScore() {
        if(this.score <= 9){
            this.notes.addMarker({name: "notes" + this.score, start: 0, duration: this.noteDurations[this.score], config: this.musicConfig})

            if (!this.notes.isPlaying){
                this.notes.play("notes" + this.score);
            }
        } else if (this.score == 10){
            this.notes.addMarker({name: "notes" + this.score, start: 6, duration: 4.5, config: this.musicConfig});

            if (!this.notes.isPlaying){
                this.notes.play("notes" + this.score);
            }
            this.him.alpha = 0.02;
        } else if (this.score == 11){
            this.notes.addMarker({name: "notes" + this.score, start: 11.2, duration: 3.8, config: this.musicConfig});

            if (!this.notes.isPlaying){
                this.notes.play("notes" + this.score);
            }
        } else if (this.score == 12){
            this.notes.addMarker({name: "notes" + this.score, start: 16.5, duration: 4, config: this.musicConfig});

            this.notes.stop();
            this.notes.play("notes" + this.score);
        } else if (this.score == 15){
            this.music.addMarker({name: "Intro", start: 0, duration: 33.391, config: this.musicConfig});
            this.queuedTransition.push("Intro");
            this.music.addMarker({name: "loop", start: 16.696, duration: 16.65, config: this.musicConfig});
            this.currLoop = "loop";
            audioController(this, this.music);
            this.him.alpha = 0.05;
        } else if (this.score == 25){
            this.music.addMarker({name: "Transition1", start: 33.391, duration: 16.696, config: this.musicConfig});
            this.queuedTransition.push("Transition1");
            this.music.addMarker({name: "loopB", start: 50.087, duration: 16.696, config: this.musicConfig});
            this.queuedTransition.push("loopB");
            this.currLoop = "loopB";
            this.him.alpha = 0.15;
        } else if (this.score == 40){
            this.music.addMarker({name: "loopC", start: 83.478, duration: 16.696, config: this.musicConfig});
            this.currLoop = "loopC";
            this.queuedTransition.push("loopC");
            this.him.alpha = 0.3;
        } else if (this.score == 50){
            this.currLoop = false;
            this.music.addMarker({name: "Finale", start: 100.174, duration: 58.446, config: this.musicConfig});
            this.queuedTransition.push("Finale");
            this.inFinale = true;
            this.finaleText.alpha = 1;
            this.scoreInc = 2;
            this.him.alpha = 1;
        }
        this.score += this.scoreInc;
        this.scoreLeft.text = this.score; 
    }

    gameEnd(){
        this.scoreConfig.fixedWidth = 250;
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
        this.scoreConfig.fixedWidth = 400;
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', this.scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 96, 'Or (F) for Menu', this.scoreConfig).setOrigin(0.5);
        this.gameOver = true;
    }

    noteExplode(note) {

        // temporarily hide ship
        note.alpha = 0;
        note.moveSpeed = 0;
        
        let color = Phaser.Display.Color.RandomRGB();
        // create explosion sprite at ship's position
        let boom = this.add.sprite(note.x, note.y, 'notesDestroy').setOrigin(0, 0);
        note.x = game.config.width;
        let boomColor = Phaser.Display.Color.RGBToString(color.r, color.g, color.b, color.a);
        boomColor = "0x" + boomColor.slice(1);
        boom.setTint(boomColor);
        boom.anims.play('break');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          note.reset();                         // reset ship position
          note.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        })
      }
 }

 function audioController(scene, music){
    if (scene.queuedTransition.length > 0){
        if ( scene.queuedTransition[0] == "Finale"){
            music.play(scene.queuedTransition.shift());
            music.once('complete', function(){ scene.gameEnd()});
        } else{
            music.play(scene.queuedTransition.shift());
            music.once('complete', function(){ audioController(scene, music) });
        }
    } else if (scene.currLoop){
        music.play(scene.currLoop);
        music.once('complete', function(){ audioController(scene, music) });
    }
}