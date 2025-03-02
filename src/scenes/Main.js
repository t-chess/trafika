import CashRegister from "../components/CashRegister";

export default class Main extends Phaser.Scene {
    constructor() {
      super("Main");
      this.gameState = {};
    }
    preload() {
        this.load.setPath("assets");
        this.cigs = [
            {name:"morleyr",price:169,desc:"Red Morleys"},
            {name:"morleyb",price:169,desc:"Blue Morleys"},
            {name:"jcr",price:147,desc:"JC Classic"},
            {name:"jcb",price:147,desc:"JC Light"},
            {name:"jcm",price:147,desc:"JC Menthol"},
            {name:"ironlung",price:152,desc:"MY IIIIRON LUUUNG"},
            {name:"fleuriesp",price:154,desc:"Fleuries with lavender and rose uwu"},
            {name:"fleuriesy",price:154,desc:"Fleuries with chamomile and mugwort uwu"},
        ];
        const atlasik = {frames:[
        { filename: "register_body", frame: { x: 0, y: 0, w: 176, h: 225 } },
        { filename: "register_suplik", frame: { x: 0, y: 225, w: 170, h: 29 } },
        { filename: "register_push", frame: { x: 176, y: 0, w: 20, h: 66 } },
        { filename: "shelf", frame: { x: 0, y: 254, w: 583, h: 75 } },
        { filename: "counter", frame: { x: 0, y: 254+75, w: 640, h: 79 } },
        { filename: "newspaperstop", frame: { x: 196, y: 0, w: 388-270, h: 81 } },
        { filename: "newspapersmid", frame: { x: 196+388-270, y: 0, w: 388-330, h: 81 } },
        { filename: "newspapersbottom", frame: { x: 196+388-270+388-330, y: 0, w: 388-320, h: 81 } },
        { filename: "newspapers", frame: { x: 196+388-270+388-330+388-320, y: 0, w: 388-(388-320)-(388-330)-(388-270), h: 81 } },
        { filename: "lightersl", frame: { x: 232-56, y: 81, w: 97-40, h: 111 } },
        { filename: "lightersr", frame: { x: 232-56+97-40, y: 81, w: 40, h: 111 } },
        { filename: "larissa", frame: { x: 329-56, y: 81, w: 50, h: 62 } },
        { filename: "matches", frame: { x: 232-56+97, y: 81+62, w: 48, h: 111-62 } },
        { filename: "nicot", frame: { x: 379-56, y: 81, w: 64, h: 87 } },
        { filename: "jct", frame: { x: 443-56, y: 81, w: 53, h: 74 } },
        { filename: "morleyt", frame: { x: 443-56+53, y: 81, w: 45, h: 35 } },
        { filename: "bruyere", frame: { x: 443-56+53, y: 81+35, w: 49, h: 40 } },
        ...this.cigs.map((c,i)=>({ filename: c.name, frame: { x: 176+39*i, y: 196, w: 39, h: 58 } }))
        ]}
        this.load.atlas('atlasik', 'trafika_atlas.png', atlasik);
        this.load.audioSprite("audios",{
            resources: ["audios.mp3"],
            spritemap: {
                button_down: {start:0,end:0.482},
                button_up: {start:0.482,end:0.903},
                purchase: {start:0.903,end:3.78},
                purchase_fail: {start:3.78,end:3.879},
            }
        })
    }
    create() {
        this.newspaperstop = this.clickable(this.add.image(81, 75, "atlasik", "newspaperstop").setAngle(90).setFlipY(true).setOrigin(0),()=>{
            this.speechbox.run("Daily (inter)national news");
        });
        this.add.text(10, 170, '13', {fontSize:'12px',backgroundColor:'#ffffff',color:"#000000"});
        this.newspapersmid = this.clickable(this.add.image(81, 75+388-270, "atlasik", "newspapersmid").setAngle(90).setFlipY(true).setOrigin(0),()=>{
            this.speechbox.run("Weekly local news");
        });
        this.add.text(10, 220, '19', {fontSize:'12px',backgroundColor:'#ffffff',color:"#000000"});
        this.newspapersbottom = this.clickable(this.add.image(81, 75+388-270+388-330, "atlasik", "newspapersbottom").setAngle(90).setFlipY(true).setOrigin(0),()=>{
            this.speechbox.run("Idk cool magazine");
        });
        this.add.text(10, 270, '25', {fontSize:'12px',backgroundColor:'#ffffff',color:"#000000"});
        this.add.image(81, 75+388-270+388-330+388-320, "atlasik", "newspapers").setAngle(90).setFlipY(true).setOrigin(0);
        
        this.counter = this.add.image(0, 480-79, "atlasik", "counter").setOrigin(0);
        this.shelf = this.add.image(30, 0, "atlasik", "shelf").setOrigin(0);

        this.cigs.map((e,i)=>{
            e.obj = this.add.image(60+39*i, 0, "atlasik",e.name).setOrigin(0);
            this.add.text(67+39*i, 54, e.price, {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
            this.clickable(e.obj,()=>{
                this.speechbox.run(e.desc)
            },3);
            return e;
        })
        this.larissa =this.clickable(this.add.image(430, -2, "atlasik", "larissa").setOrigin(0),()=>{
            this.speechbox.run("Yummy chewy Larissa snusik")
        },5);
        this.add.text(444, 54, "181", {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.nicot = this.clickable(this.add.image(525, -20, "atlasik", "nicot").setOrigin(0),undefined,12);
        this.add.text(540, 54, "220", {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.jct = this.clickable(this.add.image(484, -13, "atlasik", "jct").setOrigin(0),undefined,5);
        this.add.text(503, 54, "202", {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.bruyere = this.clickable(this.add.image(387, 20, "atlasik", "bruyere").setOrigin(0),undefined,5);
        this.add.text(400, 63, "259", {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});
        this.morleyt = this.clickable(this.add.image(390, -7, "atlasik", "morleyt").setOrigin(0));
        this.add.text(400, 52, "250", {fontSize:'11px',backgroundColor:'#ffffff',color:"#000000"});

        this.cashRegister = new CashRegister(this).onCheckout((total,success,error)=>{
            if (total===500) { // this will be a real check later 
                console.log("OK");
                success();
            } else {
                console.log("No");
                error();
            }
        });
        this.lightersl = this.clickable(this.add.image(505, 135, "atlasik", "lightersl").setOrigin(0));
        this.add.text(525, 225, '399', {fontSize:'12px',backgroundColor:'#ffffff',color:"#000000"});
        this.lightersr = this.clickable(this.add.image(505+57, 135, "atlasik", "lightersr").setOrigin(0));
        this.add.text(570, 225, '649', {fontSize:'12px',backgroundColor:'#ffffff',color:"#000000"});
        this.matches = this.clickable(this.add.image(458, 195, "atlasik", "matches").setOrigin(0));
        this.add.text(475, 230, '11', {fontSize:'12px',backgroundColor:'#ffffff',color:"#000000"});

        // cigars, papirky, pipes, mundshtuky, ashtrays, 

        this.speechbox = this.add.speechbox();


        this.speechbox.disableOverlay()
    }
    clickable(el,fc=()=>{},crop){
        el.setInteractive();
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
            console.log('click');
            fc();
        })
        return el
    }
}