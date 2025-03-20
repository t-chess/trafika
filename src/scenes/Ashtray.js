import atlases from "../data/atlases.json";
import SoundButton from "../UI/SoundButton";
import SpeechBox from "../UI/SpeechBox";

const names = [
    {key:"me",text:"This is me"},
    {key:"tooth",text:"Tooth"},
    {key:"seal",text:"Gray seal"}
]

export default class Ashtray extends Phaser.Scene {
    constructor() {
      super("Ashtray");
      this.i = 0;
      this.touched = false;
    }
    preload(){
        this.load.setPath("assets");
        this.load.atlas('items', 'items.png', {frames:[
            ...atlases.products
        ]});
        this.load.image('ashtray', 'cuts/ashtray.png');
    }
    create(){
        this.add.image(0,0,'ashtray').setOrigin(0);
        this.rt = this.add.renderTexture(0, 0, 640, 480).setOrigin(0);
        let points = [
        { x: 250, y: 140 }, // Top 
        { x: 200, y: 120 }, { x: 120, y: 120 }, { x: 50, y: 170 }, { x: 40, y: 220 }, { x: 60, y: 270 }, { x: 120, y: 330 },{ x: 190, y: 370 }, 
        { x: 390, y: 420 }, // Bottom 
        { x: 430, y: 350 }, { x: 460, y: 270 }, { x: 480, y: 150 }, { x: 470, y: 100 }, { x: 430, y: 50 }, { x: 370, y: 20 }, { x: 300, y: 50 },  
        { x: 250, y: 140 }  // Top
        ];
        this.heartPolygon = new Phaser.Geom.Polygon(points);

        this.copy = null;
        this.isDragging = false;
        this.things = this.add.group();
        [
            {frame:"cig1",x:535,y:80},
            {frame:"cig4",x:590,y:130},
            {frame:"cig5",x:530,y:180},
            {frame:"cig3",x:590,y:220},
            {frame:"cig2",x:530,y:280},
            {frame:"match1",x:520,y:370,rotation: 0.7},
            {frame:"match2",x:610,y:340}
        ].forEach(i => {
            let sprite = this.add.image(i.x, i.y, "items", i.frame).setInteractive({ cursor:"pointer",draggable: true }).setOrigin(0.5).setRotation(i.rotation);
            sprite.on("dragstart", () => {
                this.copy = this.add.image(i.x, i.y, "items", i.frame).setOrigin(0.5).setAngle(sprite.angle).setVisible(false);
            });
            sprite.on("drag", (pointer) => {
                if (window.innerWidth<1000&&Phaser.Math.Distance.Between(i.x, i.y, pointer.x, pointer.y)<25) return
                this.isDragging = true;
                if (this.copy) {
                    if (!this.copy.visible) this.copy.setVisible(true);
                    this.copy.setPosition(pointer.x, pointer.y);
                }
            });
            sprite.on("dragend", (pointer) => {
                if (this.contains(pointer.x, pointer.y)) {
                    this.rt.draw(this.copy, pointer.x, pointer.y);
                    if (!this.touched) this.touched=true;
                } 
                this.copy.destroy();
                this.copy=null;
                setTimeout(() => { this.isDragging = false }, 50);
            });
            sprite.on('pointerdown', () => {
                this.isDragging = false;
            });
            sprite.on("pointerup", () => {
                if (!this.isDragging) {
                    sprite.setAngle(sprite.angle+45);
                }
            });

            this.things.add(sprite);
        });
        
        this.add.panel(20,420,"sm",20).setSize(2,2).setText("\u27F2").onClick(()=>{
            this.i = this.i+1===names.length?0:this.i+1;
            this.titlePanel.setText(names[this.i].text);
        });
        this.titlePanel = this.add.panel(60,420,"sm").setSize(10,2).setText(names[this.i].text);
        this.add.panel(460,420,"sm").setSize(4,2).setText("Clear").onClick(()=>{
            this.rt.clear();
            this.touched = false;
        });
        this.add.panel(540,420,"sm").setSize(4,2).setText("Done").onClick(()=>{
            this.registry.set('ashtray',this.touched ? names[this.i] : null);
            this.scene.start("Main");
        });

        this.input.on("pointermove", (pointer) => {
            if (pointer.isDown&&!this.isDragging&&this.contains(pointer.x, pointer.y)) {
                if (!this.lastX || Phaser.Math.Distance.Between(this.lastX, this.lastY, pointer.x, pointer.y) > 15) {
                    this.lastX = pointer.x;
                    this.lastY = pointer.y;
                    this.rt.drawFrame("items", "ash", pointer.x - Phaser.Math.Between(20, 30), pointer.y - Phaser.Math.Between(20, 30));
                    if (!this.touched) this.touched=true;
                }
            }
        }, this);      

        new SoundButton(this);
        this.speechbox = new SpeechBox(this);
    }
    contains(x,y){
        return Phaser.Geom.Polygon.Contains(this.heartPolygon, x, y);
    }
}