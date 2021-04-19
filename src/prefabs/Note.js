class Note extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, speed) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this);
        this.points = pointValue;
        this.baseSpeed = speed;
        this.moveSpeed = speed;

        this.anims.create({
            key: 'notesAnim',
            frames: this.anims.generateFrameNumbers('notes', { start: 0, end: 14 }),
            frameRate: 14,
            repeat: -1
        });

        this.anims.play('notesAnim', true);
    }

    update() {
        this.x -= this.moveSpeed;

        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }    

    reset(){
        this.x = game.config.width;
        this.moveSpeed = this.baseSpeed + (Math.random() * -3) + 0.5;
        this.anims.play('notesAnim', true);
    }
}