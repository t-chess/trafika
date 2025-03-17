import Bag from "../components/Bag";
import CashRegister from "../components/CashRegister";
import SpeechBox from "../UI/SpeechBox";
import products from "../data/products.json";
import atlases from "../data/atlases.json";
import data from "../data/day1.json";
import Frame from "../components/Frame";
import SoundButton from "../UI/SoundButton";

export default class Main extends Phaser.Scene {
    constructor(scenes=[]) {
      super("Main");
      this.gameState = {
        loop:-1,
        loopdata:null,
        flags:{}
      };
    }
    preload() {
        this.load.setPath("assets");
        this.load.atlas('items', 'items.png', {frames:[
            ...atlases.products,
            ...products.filter(p=>p.cigs===true).map((c,i)=>({ filename: c.key, frame: { x: 176+39*i, y: 196, w: 39, h: 58 } }))
        ]});
        this.load.atlas('characters', 'characters.png', {frames:atlases.characters});
        this.load.audioSprite("audios",{
            resources: ["audios.mp3"],
            spritemap: {
                button_down: {start:0,end:0.482},
                button_up: {start:0.482,end:0.903},
                purchase: {start:0.903,end:3.78},
                purchase_fail: {start:3.78,end:3.879},
                bag: {start:3.879,end:4.725},
            }
        })
        // this.load.audio("music", "music.mp3");
    }
    create() {
        // this.music = this.sound.add("music",{volume: 0.5});
        // this.music.loop = true;
        // this.music.play();
        this.frame = new Frame(this);
        this.initNewspapers();
        this.add.image(0, 480-49, "items", "counter").setOrigin(0);
        this.initShelf();
        this.cashRegister = new CashRegister(this);
        this.initCounterItems();
        this.bag = new Bag(this);
        this.speechbox = new SpeechBox(this);
        new SoundButton(this);
        setTimeout(()=>this.startNextLoop(),500);
    }
    startNextLoop(){
        this.gameState.loop++;
        this.loopdata = data[this.gameState.loop];
        this.cashRegister.setOrder(this.loopdata.order);
        this.frame.resetCharacters(this.loopdata.characters);
        let dk = "entry";
        console.log(this.gameState.flags)
        Object.keys(this.gameState.flags).forEach(ek => {
            if (this.gameState.flags[ek] && this.loopdata.dialogues[`entry_${ek}`]) {
                dk = `entry_${ek}`;
            }
        });
        this.trigger(dk);

    }
    trigger(eventKey) {
        console.log(eventKey);
        if (this.loopdata.dialogues[eventKey]) {
            this.frame.startDialogue(this.loopdata.dialogues[eventKey],eventKey)
        }
        if (eventKey === "checkout") {
            this.frame.showAskButton(false);
        }
        if (eventKey === "loop_end") {
            this.startNextLoop();
        }
    }
    initNewspapers(){
        this.initProduct(this.add.image(81, 50, "items", "news").setAngle(90).setFlipY(true).setOrigin(0));
        let price = products.find(p=>p.key==='news').price;
        this.add.text(10, 190, price, { fontSize: "12px", backgroundColor: "#fff", color: "#000" });
    }
    initShelf(){
        this.shelfCont = this.add.container(0,0);
        this.shelfShow = true;
        let shelf = this.add.image(30, 0, "items", "shelf").setOrigin(0).setInteractive({cursor:"pointer"});
        shelf.on("pointerdown", () => {
            this.tweens.add({
              targets: this.shelfCont,
              y: this.shelfShow ? -50 : 0,
              duration: 300,
              ease: "Power2"
            });
            this.shelfShow = !this.shelfShow;
          });
          this.shelfCont.add(shelf);

        const ts = {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"}
        products.filter(p=>p.cigs===true).map((e,i)=>{
            e.obj = this.add.image(60+39*i, 0, "items",e.key).setOrigin(0);
            this.shelfCont.add(e.obj);
            this.shelfCont.add(this.add.text(67+39*i, 54, e.price, ts));
            this.initProduct(e.obj,3);
            return e;
        })
        const rest = Object.fromEntries(products.filter(p=>p.shelf===true).map(p=>[p.key,p.price]));
        this.shelfCont.add(this.initProduct(this.add.image(430, -2, "items", "larissa").setOrigin(0),5));
        this.shelfCont.add(this.add.text(444, 54, rest.larissa, ts));
        this.shelfCont.add(this.initProduct(this.add.image(525, -20, "items", "nicot").setOrigin(0),12));
        this.shelfCont.add(this.add.text(540, 54, rest.nicot, ts));
        this.shelfCont.add(this.initProduct(this.add.image(484, -13, "items", "jct").setOrigin(0),5));
        this.shelfCont.add(this.add.text(503, 54, rest.jct, ts));
        this.shelfCont.add(this.initProduct(this.add.image(387, 20, "items", "bruyere").setOrigin(0),5));
        this.shelfCont.add(this.add.text(400, 63, rest.bruyere, ts));
        this.shelfCont.add(this.initProduct(this.add.image(390, -7, "items", "morleyt").setOrigin(0)));
        this.shelfCont.add(this.add.text(400, 52, rest.morleyt, ts));
    }
    initCounterItems(){
        const rest = Object.fromEntries(products.filter(p=>p.counter===true).map(p=>[p.key,p.price]));
        const is = [
            { key: "pipes", x: 0, y: 353, priceX: 50, priceY: 450 },
            { key: "papirky", x: 0, y: 315, priceX: 15, priceY: 330 },
            { key: "cigars", x: 55, y: 288, priceX: 75, priceY: 350 },
            { key: "ashtray", x: 111, y: 408, priceX: 140, priceY: 454 },
            { key: "lightersl", x: 505, y: 135, priceX: 525, priceY: 225 },
            { key: "lightersr", x: 562, y: 135, priceX: 570, priceY: 225 },
            { key: "matches", x: 458, y: 195, priceX: 475, priceY: 230 },
        ];
        is.forEach(({ key, x, y, priceX, priceY }) => {
            this.initProduct(this.add.image(x, y, "items", key).setOrigin(0));
            this.add.text(priceX, priceY, rest[key], { fontSize: "12px", backgroundColor: "#fff", color: "#000" });
        });
    }
    initProduct(el,crop){
        el.setInteractive({ draggable: true });
        let isDragging,copy;
        if (crop) el.setCrop(0,0,el.width,el.height-crop-5);
        el.on("pointerover", () => {
            el.setPosition(el.x, el.y - 5);
            if (crop) el.setCrop(0,0,el.width,el.height-crop);
        });
        el.on("pointerout", () => {
            el.setPosition(el.x, el.y + 5);
            if (crop) el.setCrop(0,0,el.width,el.height-crop-5);
        });
        el.on('pointerdown', () => {
            isDragging = false;
        })
        el.on("pointerup", () => {
            const desc = products.find(p=>p.key===el.frame.name)?.desc;
            if (!isDragging&&desc) {
                if (desc) {
                    this.speechbox.run(desc,el.frame.name==='news'&&[
                        {text:"Read latest news"},
                        {text:"Nevermind"}
                    ]);
                }
            }
        });

        const edits = {
            pipes:[[88,17,122,104],[0.75,0.5]],
            papirky:[[30,30,65,50],[0.75,1]],
            matches:[[0,0,25,30],[0.5]],
            lightersl:[[7,10,30,40],[0.5,0.25]],
            lightersr:[[15,50,40,30],[0.75]]
        }[el.frame.name];

        el.on("dragstart", () => {
            copy = el.scene.add.image(el.x, el.y, "items", el.frame.name==="news"?"papers":el.frame.name).setOrigin(0.5).setAlpha(0.3).setVisible(false);
            if (edits) copy.setCrop(...edits[0]).setOrigin(...edits[1]);
        });
        el.on("drag", (pointer) => {
            isDragging = true;
            if (copy) {
                if (!copy.visible) copy.setVisible(true);
                copy.setPosition(pointer.x, pointer.y);
            }
        });
        
        el.on("dragend", (pointer) => {
            el.setAlpha(1); 
            let bagBounds = this.bag.getBounds();
            let itemBounds = copy.getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(itemBounds, bagBounds)) {
                this.bag.addToBag(el.frame.name)
            }
            copy.destroy();
            copy = null;
            setTimeout(() => { isDragging = false }, 50);
        });
        return el
    }
}