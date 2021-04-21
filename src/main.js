/* 
----------------------------------------------------------
Colin O'Rourke
csorourk@ucsc.edu
Piano Patrol Project (Rocket Patrol Mod)
  This took me about 15 hours to complete.

Points:
  60 Points for Full Aesthetic Redesign (Now Piano Themed with a twist)
  30 Points for Dynamic Soundtrack (Facade Tier)
    - the soundtrack progresses / loops at certain points depending on the player's score.
    - This also serves as a new timing/scoring mechanism
      - Once the player hits 50 points, the final portion of the song is added to the queue, and the game ends when this final portion finished playing.
  20 Points for new Spaceship type.
    - Doen't exactly match specifications, but implemented a new target with different behavior from regular 'rockets'
    - Appears as part of the 'finale' after 50 points.

  Composition is not original, downloaded from: https://www.midiworld.com/files/2862/ 
  One character sprite borrowed from: https://www.ssbwiki.com/Sans 
----------------------------------------------------------
*/ 


let config = {
    type: Phaser.WEBGL,
    width: 960,
    height: 960,
    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config);

// set UI constant
let key = game.config.width / 16;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE;