export default class ArrowPanel extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, text, direction="right", fontSize=16) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.text = text;
        this.direction = direction;
        this.fontSize = fontSize;
        this.inverted = false;

        this.init();
        if (text) this.addText();
        scene.add.existing(this);
    }
    init() {
        const addTile = (x, y, frame) => this.add(this.scene.add.image(x, y, "ui_atlas", frame).setOrigin(0));
        for (let i = 1; i < this.width - 2; i++) {
            const ix = this.direction==="right"?i:i+1;
            addTile(ix * 20, 0, `sm-t`);
            addTile(ix * 20,20, `sm-b`);
        }
        if (this.direction==="right") {
            addTile(0, 0, `sm-lt`);
            addTile(0,20, `sm-lb`);
            this.add(this.scene.add.image((this.width - 2) * 20, 0, "ui_atlas", "arrow").setOrigin(0));
        } else {
            addTile((this.width - 1) * 20, 0, `sm-rt`);
            addTile((this.width - 1) * 20,20, `sm-rb`);
            this.add(this.scene.add.image(0, 0, "ui_atlas", "arrow").setFlipX(true).setOrigin(0));
        }
    }

    addText() {
        this.add(this.scene.add.text(
            (this.width * 20) / 2,
            20,
            this.text,
            {
                fontSize: `${this.fontSize}px`,
                color: "#ffffff",
                align: "center",
            }
        ).setOrigin(0.5)); 
    }
    onClick(callback) {
        if (!callback) {
            this.disableInteractive();
            return
        }
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width * 20, 40), Phaser.Geom.Rectangle.Contains);
        this.on("pointerover", () => {
            this.scene.input.setDefaultCursor("pointer");
            this.setPosition(this.x, this.y - 2);
        });
        this.on("pointerout", () => {
            this.scene.input.setDefaultCursor("default"); 
            this.setPosition(this.x, this.y + 2);
        });
        this.on("pointerdown", () => {
            this.scene.sound.play("ui_click");
            this.scene.input.setDefaultCursor("default"); 
            callback();
        });
        return this
    }
    invertColors(mode='toggle') { // on / off / toggle
        if ((mode === 'on' && this.inverted) || (mode === 'off' && !this.inverted)) return;
        this.list.forEach(child => {
            if (child.preFX) {
                child.preFX.addColorMatrix().negative();           
            }
        });
        this.inverted = !this.inverted; 
    }
    

}
