import Bag from "../components/Bag";
import CashRegister from "../components/CashRegister";
import SpeechBox from "../UI/SpeechBox";
import products from "../products.json";
import Frame from "../components/Frame";

export default class Main extends Phaser.Scene {
    constructor(scenes=[]) {
      super("Main");
      this.gameState = {};
    }
    preload() {
        this.load.setPath("assets");
        const atlasik = {frames:[
        { filename: "register_body", frame: { x: 0, y: 0, w: 176, h: 225 } },
        { filename: "register_suplik", frame: { x: 0, y: 225, w: 170, h: 29 } },
        { filename: "register_push", frame: { x: 611, y: 92, w: 20, h: 66 } },
        { filename: "shelf", frame: { x: 0, y: 254, w: 583, h: 75 } },
        { filename: "counter", frame: { x: 0, y: 254+75, w: 640, h: 79 } },
        { filename: "news", frame: { x: 176, y: 0, w: 359, h: 81 } },
        { filename: "bag", frame: { x: 640-105, y: 0, w: 105, h: 92 } },
        { filename: "lightersl", frame: { x: 232-56, y: 81, w: 97-40, h: 111 } },
        { filename: "lightersr", frame: { x: 232-56+97-40, y: 81, w: 40, h: 111 } },
        { filename: "larissa", frame: { x: 329-56, y: 81, w: 50, h: 62 } },
        { filename: "matches", frame: { x: 232-56+97, y: 81+62, w: 48, h: 111-62 } },
        { filename: "nicot", frame: { x: 379-56, y: 81, w: 64, h: 87 } },
        { filename: "jct", frame: { x: 443-56, y: 81, w: 53, h: 74 } },
        { filename: "morleyt", frame: { x: 443-56+53, y: 81, w: 45, h: 35 } },
        { filename: "bruyere", frame: { x: 443-56+53, y: 81+35, w: 49, h: 40 } },
        { filename: "pipes", frame: { x: 443-56+53+49, y: 92, w: 122, h: 104 } },
        { filename: "cigars", frame: { x: 583, y: 254, w: 640-583, h: 75 } },
        { filename: "papirky", frame: { x: 488, y: 196, w: 65, h: 50 } },
        { filename: "ashtray", frame: { x: 488+65, y: 196, w: 74, h: 52 } },
        { filename: "papers", frame: { x: 401, y: 156, w: 88, h: 40 } },
        ...products.filter(p=>p.cigs===true).map((c,i)=>({ filename: c.key, frame: { x: 176+39*i, y: 196, w: 39, h: 58 } }))
        ]}
        this.load.atlas('atlasik', 'trafika_atlas.png', atlasik);
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
        this.counter = this.add.image(0, 480-79, "atlasik", "counter").setOrigin(0);
        this.initShelf();
        this.cashRegister = new CashRegister(this).onCheckout((total,success,error)=>{
            if (total===500) { // this will be a real check later 
                console.log("OK");
                success();
            } else {
                console.log("No");
                error();
            }
        });
        this.initCounterItems();
        this.bag = new Bag(this);
        this.speechbox = new SpeechBox(this).disableOverlay();
    }
    initNewspapers(){
        this.initProduct(this.add.image(81, 50, "atlasik", "news").setAngle(90).setFlipY(true).setOrigin(0));
        let price = products.find(p=>p.key==='news').price;
        this.add.text(10, 190, price, { fontSize: "12px", backgroundColor: "#fff", color: "#000" });
    }
    initShelf(){
        this.add.image(30, 0, "atlasik", "shelf").setOrigin(0);
        products.filter(p=>p.cigs===true).map((e,i)=>{
            e.obj = this.add.image(60+39*i, 0, "atlasik",e.key).setOrigin(0);
            this.add.text(67+39*i, 54, e.price, {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
            this.initProduct(e.obj,3);
            return e;
        })
        const rest = Object.fromEntries(products.filter(p=>p.shelf===true).map(p=>[p.key,p.price]));
        this.initProduct(this.add.image(430, -2, "atlasik", "larissa").setOrigin(0),5);
        this.add.text(444, 54, rest.larissa, {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.initProduct(this.add.image(525, -20, "atlasik", "nicot").setOrigin(0),12);
        this.add.text(540, 54, rest.nicot, {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.initProduct(this.add.image(484, -13, "atlasik", "jct").setOrigin(0),5);
        this.add.text(503, 54, rest.jct, {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.initProduct(this.add.image(387, 20, "atlasik", "bruyere").setOrigin(0),5);
        this.add.text(400, 63, rest.bruyere, {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.initProduct(this.add.image(390, -7, "atlasik", "morleyt").setOrigin(0));
        this.add.text(400, 52, rest.morleyt, {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
    }
    initCounterItems(){
        const rest = Object.fromEntries(products.filter(p=>p.counter===true).map(p=>[p.key,p.price]));
        const items = [
            { key: "pipes", x: 0, y: 333, priceX: 50, priceY: 440 },
            { key: "papirky", x: 0, y: 295, priceX: 15, priceY: 310 },
            { key: "cigars", x: 55, y: 268, priceX: 75, priceY: 330 },
            { key: "ashtray", x: 111, y: 388, priceX: 140, priceY: 444 },
            { key: "lightersl", x: 505, y: 135, priceX: 525, priceY: 225 },
            { key: "lightersr", x: 562, y: 135, priceX: 570, priceY: 225 },
            { key: "matches", x: 458, y: 195, priceX: 475, priceY: 230 },
        ];
        items.forEach(({ key, x, y, priceX, priceY }) => {
            this.initProduct(this.add.image(x, y, "atlasik", key).setOrigin(0));
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
                        {text:"Read news"},
                        {text:"Return"}
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
            isDragging = true;
            copy = el.scene.add.image(el.x, el.y, "atlasik", el.frame.name==="news"?"papers":el.frame.name).setOrigin(0.5).setAlpha(0.3).setVisible(false);
            if (edits) copy.setCrop(...edits[0]).setOrigin(...edits[1]);
        });
        el.on("drag", (pointer, dragX, dragY) => {
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