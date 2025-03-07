export default class Bag extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene,340, 370, "atlasik", "bag");
        this.scene = scene;
        this.items = [];
        this.scene.add.existing(this);
        this.setOrigin(0).setInteractive({ cursor:"pointer" });
        this.on('pointerdown', () => {
            if (this.items.length) {
                const textik = this.items.length+(this.items.length===1?" item ":" items ")+"in the bag. Empty the bag?"
                this.scene.speechbox.playDialogSequence([{text:textik,options:[{text:"Yes",callback:()=>{
                    this.items.length = 0;
                }},{text:"No"}]}])
            } else {
                this.scene.speechbox.run("Nothing in the bag.")
            }
        })
        this.on("pointerover", () => {
            this.setPosition(this.x, this.y - 5);
        });
        this.on("pointerout", () => {
            this.setPosition(this.x, this.y + 5);
        });
    }
    addToBag(itemKey){
        this.scene.sound.playAudioSprite('audios','bag');
        // for (let i = 0; i < this.items.length; i++) {
        //     if (this.items[i].includes(itemKey)) {
        //       const qua = parseInt(this.items[i].split("X")[1],10)||1;
        //       this.items[i] = `${itemKey}X${qua+1}`;
        //       return
        //     }
        // }
        this.items.push(itemKey);
        // console.log(this.items);
    }
}