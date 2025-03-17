/*
scenesArray = [sceneType];
sceneType = {
    bgKey: "key of preloaded image",
    dialog: [dialogType]
}
dialogType = {
    character: "Name",
    text: string,
    options: [text,callback, after='continue']
    typingSpeed
}

TODO : dialog with options 

*/

import SoundButton from "./SoundButton";
import SpeechBox from "./SpeechBox";

export default class CutScene extends Phaser.Scene {
    constructor(key="CutScene",smooth=true) {
      super({key});
      this.scenesArray = [];
      this.smooth = smooth;
    }
    setScenes(arr) {
        this.sound.pauseOnBlur = false;
        this.scenesArray = arr;
        this.nextIndex = 0;
        this.scenesArray.forEach(scene => {
            this[scene.bgKey] = this.add
              .sprite(640, 480, scene.bgKey)
              .setVisible(false)
              .setPosition(320, 240);
        });
        this.nextArrow = this.add.image(620, 460, "ui_atlas", "arrow-solo").setOrigin(1).setVisible(false).setInteractive({cursor:"pointer"});
        this.speechbox = new SpeechBox(this);
        new SoundButton(this);

        this.continue();
    }
    onEnd(callback) {
        this.endCallback = callback;
    }
    continue() {
        if (this.nextIndex===this.scenesArray.length&&this.endCallback) {
            this.endCallback();
            return
        }
        this.nextArrow.setVisible(false);
        const currentScene = this.scenesArray[this.nextIndex];
        const newBg = this[currentScene.bgKey];
        if (this.smooth) {
            newBg.setAlpha(0);
            newBg.setVisible(true);
            newBg.setDepth(1);
            if (this.currentBg && this.currentBg !== newBg) {
                this.currentBg.setDepth(0);
            }
            this.tweens.add({
                targets: newBg,
                alpha: 1,
                duration: 500,
                ease: "Power2",
                onComplete: () => {
                    if (this.currentBg && this.currentBg !== newBg) {
                        this.currentBg.setVisible(false);
                    }
                    this.currentBg = newBg;
                }
            });
        } else {
            this.scenesArray.forEach((scene, i) => {
                this[scene.bgKey].setVisible(i === this.nextIndex);
            });
        }

        this.time.delayedCall(currentScene.delay||1000, ()=>{
            if (!currentScene.dialog||!currentScene.dialog.length) {
                this.nextArrow.setVisible(true);
                this.nextArrow.once("pointerdown", () => {
                    this.sound.play("ui_click");
                    this.continue();
                });
            } else {
                this.speechbox.playDialogSequence(currentScene.dialog, () => {
                    this.time.delayedCall(500, () => {
                        this.continue();
                    });
                });
            }
        })
        this[currentScene.bgKey].setVisible(true);
        this.nextIndex++;

    }
}