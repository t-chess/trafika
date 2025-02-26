export default class Loading extends Phaser.Scene {
  constructor() {
    super("Loading");
  }
  preload() {
    this.load.setPath("assets");
    
    const bodiesAtlas = {frames:[
      { filename: "mother", frame: { x: 0, y: 0, w: 187, h: 463 } },
      { filename: "abigail", frame: { x: 187, y: 0, w: 224, h: 424 } },
      { filename: "hand", frame: { x: 187, y: 424, w: 87, h: 39 } },
      { filename: "eyes", frame: { x: 274, y: 424, w: 59, h: 39 } },
    ]}
    this.load.atlas('bodies', 'bodies.png', bodiesAtlas);

    this.add.progressbar(undefined, 320, undefined, () => this.scene.start("Main"));
    this.add.soundbutton();
  }
}