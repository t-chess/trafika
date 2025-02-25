export default class SoundButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x = 600, y = 40, defaultState = true) {
        super(scene, x, y, "ui_atlas", defaultState ? "sound-on" : "sound-off");
        this.scene = scene;
        this.setInteractive({ cursor: "pointer" });
        if (typeof SoundButton.isSoundOn === "undefined") {
            SoundButton.isSoundOn = defaultState;
        }
        this.updateTexture();
        this.on("pointerdown", this.toggleSound, this);
        this.scene.add.existing(this);
    }
    toggleSound() {
        SoundButton.isSoundOn = !SoundButton.isSoundOn;
        this.updateTexture();
        this.scene.sound.setMute(SoundButton.isSoundOn ? false : true);
    }
    updateTexture() {
        this.setTexture("ui_atlas", SoundButton.isSoundOn ? "sound-on" : "sound-off");
    }
}
