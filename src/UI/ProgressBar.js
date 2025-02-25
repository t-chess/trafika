export default class ProgressBar extends Phaser.GameObjects.Container {
    constructor(scene, x = 180, y = 400, width = 14, onComplete=()=>{}) {
        super(scene, x, y);
        this.scene = scene;
        this.width = width;
        this.onComplete = onComplete;

        this.init();
        this.scene.load.on("progress", (v) => this.updateProgress(v));
        this.scene.load.on("complete", (v) => this.completeLoad(v));
        scene.add.existing(this);
    }
    init() {
        this.progressBox = this.scene.add.panel(0, 0, 'sm').setSize(this.width, 2);
        this.add(this.progressBox);

        this.progressBar = this.scene.add.graphics();
        this.add(this.progressBar);

        this.playButton = this.scene.add.panel((this.width-5)*10, 0, "sm").setSize(5, 2).setText("Play");
        this.playButton.onClick(this.onComplete)
        this.playButton.setVisible(false);
        this.add(this.playButton);
    }
    updateProgress(value) {
        if(!this.progressBar||!value) return
        this.progressBar.clear()
            .fillStyle(0xffffff, 1)
            .fillRect(13, 13, Math.max(0,(this.width*20*value)-26), 16);
    }
    completeLoad() {
        this.progressBox.destroy();
        this.progressBar.destroy();
        this.playButton.setVisible(true);
    }
}
