export default class Panel extends Phaser.GameObjects.Container {
    constructor(scene, x, y, type='md', fontSize=16) {
        super(scene, x, y);
        this.scene = scene;
        this.type = type;
        this.tileSize = type==="sm"?20:40;
        
        this.fontSize = fontSize;
        this.inverted = false;
        this.static = false;
        this.clickable = false;

        scene.add.existing(this);
    }
    setSize(width, height) {
        if (this.width===width&&this.height===height) return this
        this.width = width;
        this.height = height;

        this.list.filter(child => child !== this.textObject).forEach(child => child.destroy());
        const addTile = (x, y, frame) => this.add(this.scene.add.image(x, y, "ui_atlas", frame).setOrigin(0));

        let bg = this.scene.add.rectangle(
            this.tileSize, this.tileSize, 
            (this.width - 2) * this.tileSize, (this.height - 2) * this.tileSize, 
            0x000000
        ).setOrigin(0);
        this.background = bg;
        this.add(bg)

        // Top 
        addTile(0, 0, `${this.type}-lt`);
        for (let i = 1; i < this.width - 1; i++) {
            addTile(i * this.tileSize, 0, `${this.type}-t`);
        }
        addTile((this.width - 1) * this.tileSize, 0, `${this.type}-rt`);

        // Middle 
        for (let j = 1; j < this.height - 1; j++) {
            addTile(0, j * this.tileSize, `${this.type}-l`);
            addTile((this.width - 1) * this.tileSize, j * this.tileSize, `${this.type}-r`);
        }

        // Bottom
        addTile(0, (this.height - 1) * this.tileSize, `${this.type}-lb`);
        for (let i = 1; i < this.width - 1; i++) {
            addTile(i * this.tileSize, (this.height - 1) * this.tileSize, `${this.type}-b`);
        }
        addTile((this.width - 1) * this.tileSize, (this.height - 1) * this.tileSize, `${this.type}-rb`);

        if (this.textObject) {
            this.textObject.setWordWrapWidth((this.width - 1) * this.tileSize);
            this.centerText();
            this.bringToTop(this.textObject);
        }
        if (this.clickable) {
            this.updateClickArea();
        }

        return this
    }

    setText(text) {
        if (!this.textObject) {
            this.textObject = this.scene.add.text(
                0,0,
                text,
                {
                    font: `${this.fontSize}px`,
                    color: "#ffffff",
                    align:'center',
                    lineSpacing: 2,
                    wordWrap: { width: (this.width - 1) * this.tileSize, useAdvancedWrap: true },
                }
            );
            this.add(this.textObject);
        } else {
            this.textObject.setText(text);
        }
        this.centerText();
        return this
    }
    centerText(){
        if (this.textObject) {
            let centerX = Math.round((this.width * this.tileSize - this.textObject.width) / 2);
            let centerY = Math.round((this.height * this.tileSize - this.textObject.height) / 2);
            this.textObject.setPosition(centerX, centerY);
        }
        return this
    }
    onClick(callback, once) {
        if (!callback) {
            this.clickable = false;
            this.disableInteractive();
            return
        }

        this.off("pointerdown");
        this.clickable = true;
        this.updateClickArea();
        
        this.on("pointerover", () => {
            this.scene.input.setDefaultCursor("pointer");
            if (!this.static) this.setPosition(this.x, this.y - 1);
        });
        this.on("pointerout", () => {
            this.scene.input.setDefaultCursor("default"); 
            if (!this.static) this.setPosition(this.x, this.y + 1);
        });
        const f = () => {
            this.scene.sound.play("ui_click");
            this.scene.input.setDefaultCursor("default"); 
            callback();
        }
        once ? this.once("pointerdown", f) : this.on("pointerdown", f);
        return this
    }
    invertColors(mode='toggle') {
        if ((mode === 'on' && this.inverted) || (mode === 'off' && !this.inverted)) return;
        if (!this.colorMatrixEffects) {
            this.colorMatrixEffects = this.list
                .filter(child => child.preFX)
                .map(child => {
                    return { child, effect: child.preFX.addColorMatrix() };
                });
        }
        this.colorMatrixEffects.forEach(({ effect }) => {
            if (this.inverted) {
                effect.saturate();
            } else {
                effect.negative();
            }
        });

        this.background.setFillStyle(this.background.fillColor === 0x000000 ? 0xffffff : 0x000000);
        this.inverted = !this.inverted; 
        return this
    }
    setStatic(v) {
        this.static = v;
        return this;
    }
    updateClickArea() {
        const hit = new Phaser.Geom.Rectangle(0, 0, this.width * this.tileSize, this.height * this.tileSize);
        const hitCb = Phaser.Geom.Rectangle.Contains;
        if (this.input) {
            this.input.hitArea = hit;
            this.input.hitAreaCallback = hitCb; 
        }
        this.setInteractive(hit, hitCb);
    }
}
