import Panel from "./Panel";
import ProgressBar from "./ProgressBar";
import SoundButton from "./SoundButton";
import SpeechBox from "./SpeechBox";
import ArrowPanel from "./ArrowPanel";

export default class BootScene extends Phaser.Scene {
    constructor(bg, next="Loading" ) {
        super({ key:"Boot" });
        this.loadingBg = bg;
        this.afterBootScene = next;
    }
    init() {
        Phaser.GameObjects.GameObjectFactory.register('panel', function (...args){
            const obj = new Panel(this.scene, ...args)
            this.displayList.add(obj);
            return obj;
        });
        Phaser.GameObjects.GameObjectFactory.register('progressbar', function (...args){
            const obj = new ProgressBar(this.scene, ...args)
            this.displayList.add(obj);
            return obj;
        });
        Phaser.GameObjects.GameObjectFactory.register('speechbox', function (...args){
            const obj = new SpeechBox(this.scene, ...args)
            this.displayList.add(obj);
            return obj;
        });
        Phaser.GameObjects.GameObjectFactory.register('soundbutton', function (...args){
            const obj = new SoundButton(this.scene, ...args)
            this.displayList.add(obj);
            return obj;
        });
        Phaser.GameObjects.GameObjectFactory.register('arrowpanel', function (...args){
            const obj = new ArrowPanel(this.scene, ...args)
            this.displayList.add(obj);
            return obj;
        });
    }
    preload() {
        this.load.atlas("ui_atlas","assets/interface/ui.png","assets/interface/ui.json");
        this.load.audio("ui_click", "assets/interface/lighter.mp3");
        
        if (this.loadingBg) {
            this.load.image("loadingBg", this.loadingBg);
        }
    }
    create() {
        this.time.delayedCall(100, () => {
            this.scene.start(this.afterBootScene);
        });

    }
}
