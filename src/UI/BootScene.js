import Panel from "./Panel";
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
        Phaser.GameObjects.GameObjectFactory.register('arrowpanel', function (...args){
            const obj = new ArrowPanel(this.scene, ...args)
            this.displayList.add(obj);
            return obj;
        });
    }
    preload() {
        this.load.atlas("ui_atlas","assets/interface/ui.png",{
            "frames": [
              { "filename": "speechbox2", "frame": { "x": 0, "y": 0, "w": 600, "h": 40 } },
              { "filename": "md-lb", "frame": { "x": 0, "y": 40, "w": 40, "h": 40 } },
              { "filename": "md-b", "frame": { "x": 40, "y": 40, "w": 40, "h": 40 } },
              { "filename": "md-rb", "frame": { "x": 80, "y": 40, "w": 40, "h": 40 } },
              { "filename": "md-l", "frame": { "x": 120, "y": 40, "w": 40, "h": 40 } },
              { "filename": "md-r", "frame": { "x": 160, "y": 40, "w": 40, "h": 40 } },
              { "filename": "md-lt", "frame": { "x": 200, "y": 40, "w": 40, "h": 40 } },
              { "filename": "md-t", "frame": { "x": 240, "y": 40, "w": 40, "h": 40 } },
              { "filename": "md-rt", "frame": { "x": 280, "y": 40, "w": 40, "h": 40 } },
              { "filename": "arrow-solo", "frame": { "x": 320, "y": 40, "w": 40, "h": 40 } },
              { "filename": "arrow", "frame": { "x": 360, "y": 40, "w": 40, "h": 40 } },
              { "filename": "sound-on", "frame": { "x": 400, "y": 40, "w": 40, "h": 40 } },
              { "filename": "sound-off", "frame": { "x": 440, "y": 40, "w": 40, "h": 40 } },
              { "filename": "circle", "frame": { "x": 480, "y": 40, "w": 40, "h": 40 } },
              { "filename": "sm-lt", "frame": { "x": 520, "y": 40, "w": 20, "h": 20 } },
              { "filename": "sm-rt", "frame": { "x": 540, "y": 40, "w": 20, "h": 20 } },
              { "filename": "sm-l", "frame": { "x": 560, "y": 40, "w": 20, "h": 20 } },
              { "filename": "sm-t", "frame": { "x": 580, "y": 40, "w": 20, "h": 20 } },
              { "filename": "sm-lb", "frame": { "x": 520, "y": 60, "w": 20, "h": 20 } },
              { "filename": "sm-rb", "frame": { "x": 540, "y": 60, "w": 20, "h": 20 } },
              { "filename": "sm-b", "frame": { "x": 560, "y": 60, "w": 20, "h": 20 } },
              { "filename": "sm-r", "frame": { "x": 580, "y": 60, "w": 20, "h": 20 } },
              { "filename": "speechbox3", "frame": { "x": 0, "y": 80, "w": 600, "h": 60 } },
              { "filename": "speechbox4", "frame": { "x": 0, "y": 140, "w": 600, "h": 80 } }
            ]
          }
        );
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
