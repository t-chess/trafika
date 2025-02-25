import CashRegister from "../components/CashRegister";

export default class Main extends Phaser.Scene {
    constructor() {
      super("Main");
      this.gameState = {};
    }
    create() {
        this.counter = this.add.rectangle(0,480,640,100,0xfdc175).setOrigin(0,1)
        this.cashRegister = new CashRegister(this);
        this.speechbox = this.add.speechbox();


        this.speechbox.disableOverlay()
        // this.speechbox.run("testik")
    }
}