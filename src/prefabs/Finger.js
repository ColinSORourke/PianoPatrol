// Finger prefab
class Finger extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.moveSpeed = 6;
    }

    update() {
        if(keyLEFT.isDown && this.x >= key*2.8 + this.width){
            this.x -= this.moveSpeed;
        }
        else if (keyRIGHT.isDown && this.x <= game.config.width - key*2.8 - this.width) {
            this.x += this.moveSpeed;
         }
    }
}