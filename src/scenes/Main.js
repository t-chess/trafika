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
      this.loopdata = null;
    }
    preload() {
        this.load.setPath("assets");
        this.load.atlas('items', 'items.png', {frames:[
            ...atlases.products,
            ...products.filter(p=>p.cigs).map((c,i)=>({ filename: c.key, frame: { x: 176+39*i, y: 196, w: 39, h: 58 } }))
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
                coins:{start:4.725,end:5.153},
                register_close:{start:5.153,end:6.371}
            }
        })
        // this.load.audio("music", "music.mp3");
    }
    create() {
        this.registry.set({ day: 1, loop: null, flags: new Set(), ashtray:null });
        // this.music = this.sound.add("music",{volume: 0.5});
        // this.music.loop = true;
        // this.music.play();
        this.frame = new Frame(this);
        this.initNewspapers();
        this.add.image(0, 480-49, "items", "counter").setOrigin(0);
        this.initShelf();
        this.cashRegister = new CashRegister(this);
        this.initCounterItems();
        this.money = this.add.image(360, 435, "items", "money").setOrigin(0).setVisible(false);
        this.moneyText = this.add.text(390,414,"200",{fontSize:"18px",backgroundColor:"black"}).setOrigin(0.5);
        this.bag = new Bag(this);

        this.speechbox = new SpeechBox(this, undefined, 4);
        new SoundButton(this);
        setTimeout(()=>this.startNextLoop('isaac'),500);
    }
    startNextLoop(key){
        this.registry.set('loop',key);
        this.loopdata = data[key];
        this.cashRegister.setOrder(this.loopdata.order,this.loopdata.money);
        this.bag.setVisible(true);
        this.frame.addCharacters(this.loopdata.characters);
        this.trigger("entry");
    }
    
    trigger(eventKey) {
        console.log(eventKey,this.registry.get('flags'));
        this.frame.startDialogue(eventKey);
        if (eventKey === "paying") {
            this.frame.showAskButton(false);
            this.bag.setVisible(false);
            this.money.setVisible(true);
            this.moneyText.setText(this.loopdata.money).setVisible(true);
        }
        if (eventKey === "checkout") {
            this.money.setVisible(false);
            this.moneyText.setVisible(false);
        }
        if (eventKey === "loop_end") {
            if (this.registry.get('loop')!=='st1') {
                this.frame.hideCharacters();
                this.startNextLoop(this.loopdata.next)
            } else {
                this.time.delayedCall(3000,()=>this.startNextLoop(this.loopdata.next))
            }
        }
    }
    initNewspapers(){
        this.initProduct(this.add.image(81, 80, "items", "news").setAngle(90).setFlipY(true).setOrigin(0));
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
        this.add.image(111, 408, "items", "ashtray").setOrigin(0);
        const rest = Object.fromEntries(products.filter(p=>p.counter===true).map(p=>[p.key,p.price]));
        const is = [
            { key: "pipes", x: 0, y: 353, priceX: 50, priceY: 450 },
            { key: "papirky", x: 0, y: 315, priceX: 15, priceY: 330 },
            { key: "cigars", x: 55, y: 288, priceX: 75, priceY: 350 },
            { key: "ashtray", x: 111, y: 395, priceX: 140, priceY: 460 },
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
                    this.speechbox.setOverlay(false);
                    this.speechbox.setName(el.frame.name==='news'?null:"Gail");
                    this.speechbox.run(desc,el.frame.name==='news'?[
                        {text:"Take a look", callback: ()=>this.readNews()},
                        {text:"Nevermind"}
                    ]:undefined,()=>{this.speechbox.setOverlay(true)});
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
            if (this.bag.visible&&Phaser.Geom.Intersects.RectangleToRectangle(itemBounds, bagBounds)) {
                this.bag.addToBag(el.frame.name)
            }
            copy.destroy();
            copy = null;
            setTimeout(() => { isDragging = false }, 50);
        });
        return el
    }
    readNews() {
        const categories = Object.keys(data.news);
        const previous = [];
        const openCategoryList = () => {
            const options = categories.map(cat => ({
                text: cat,
                callback: () => {
                    previous.push(openCategoryList);
                    openArticleList(cat);
                }
            }));
            options.push({ text: "Back", callback: () => this.speechbox.setOverlay(true) });
            this.speechbox.run("...", options);
        };
        const openArticleList = (category) => {
            const articles = data.news[category];
            const headlines = Object.keys(articles);
            const options = headlines.map(title => ({
                text: title,
                callback: () => {
                    previous.push(() => openArticleList(category));
                    openArticleContent(category, title);
                }
            }));
            options.push({ text: "Back", callback: () => previous.pop()() });
            this.speechbox.run(category, options);
        };
        const openArticleContent = (category, title) => {
            const dialog = data.news[category][title].map(text => ({ character: null, text }));
            this.speechbox.playDialogSequence(dialog, () => {
                previous.pop()();
            });
        };

        openCategoryList();
    }    
}