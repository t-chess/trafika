import CashRegister from "../components/CashRegister";

export default class Main extends Phaser.Scene {
    constructor() {
      super("Main");
      this.gameState = {};
    }
    preload() {
        this.load.setPath("assets");
        const atlasik = {frames:[
        { filename: "register_body", frame: { x: 0, y: 0, w: 176, h: 225 } },
        { filename: "register_suplik", frame: { x: 0, y: 225, w: 170, h: 29 } },
        { filename: "register_push", frame: { x: 176, y: 0, w: 20, h: 66 } },
        ]}
        this.load.atlas('atlasik', 'atlas.png', atlasik);
        this.load.audioSprite("audios",{
            resources: ["audios.mp3"],
            spritemap: {
                button_down: {start:0,end:0.482},
                button_up: {start:0.482,end:0.903},
                purchase: {start:0.903,end:3.78},
            }
        })
    }
    create() {
        this.counter = this.add.rectangle(0,480,640,100,0xfdc175).setOrigin(0,1)
        this.cashRegister = new CashRegister(this).onCheckout((total,success,error)=>{
            if (total===500) { // this will be a real check later 
                console.log("OK");
                success();
            } else {
                console.log("Player made a mistake");
                error();
            }
        });
        this.speechbox = this.add.speechbox();


        this.speechbox.disableOverlay()
        // this.speechbox.run("testik")
    }
}