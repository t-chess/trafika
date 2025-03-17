export default class Bag extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene,340, 370, "items", "bag");
        this.scene = scene;
        this.items = [];
        this.scene.add.existing(this);
        this.setOrigin(0).setInteractive({ cursor:"pointer" });
        this.on('pointerdown', () => {
            if (this.items.length) {
                const q = this.items.reduce((acc, item) => acc + (item.quantity || 1), 0);
                const textik = q+(q===1?" item ":" items ")+"in the bag. Empty the bag?"
                this.scene.speechbox.playDialogSequence([{text:textik,options:[{text:"Yes",callback:()=>this.empty()},{text:"No"}]}])
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
        let exist = this.items.find(i => i.key === itemKey);
        if (exist) {
            exist.quantity++;
        } else {
            this.items.push({ key: itemKey, quantity: 1 });
        }
        // console.log(this.items);
    }
    getAll(){
        return this.items
    }
    empty(){
        this.items.length = 0;
    }
}