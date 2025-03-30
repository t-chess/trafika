export default class SpeechBox extends Phaser.GameObjects.Container {
    constructor(scene, typingSpeed=15, maxOptions=3) {
        super(scene, 20, 460);
        this.scene = scene;
        this.typingSpeed = typingSpeed;
        this.maxOptions = maxOptions;
        this.withOverlay = true;
        this.options = [];

        this.currentLines = 2;

        this.init();
        this.setVisible(false);
        scene.add.existing(this);
    }
    init() {
        this.overlay = this.scene.add.rectangle(0, 0, 640, 480, 0x000000, 0).setOrigin(0, 0).setInteractive();
        this.overlay.setVisible(false);
        this.scene.add.existing(this.overlay);

        this.box = this.scene.add.image(0, -this.currentLines * 20, "ui_atlas", `speechbox${this.currentLines}`).setOrigin(0);
        this.add(this.box);
        
        this.textline = this.scene.add.text(20, -this.currentLines * 20 + 12, "", {
            font: "16px",
            color: "#ffffff",
            wordWrap: { width: 560 },
            lineSpacing: 2,
        }).setOrigin(0,0);
        this.add(this.textline);

        this.nextBtn = this.scene.add.text(580, -20, "▶", {
            font: "16px",
            color: "#ffffff",
        })
        .setOrigin(1,0.5)
        .setVisible(false);
        this.add(this.nextBtn);

        for (let i = 0; i < this.maxOptions; i++) {
            let optionPanel = this.scene.add.panel(600, -40, "sm").setSize(5, 2).setText("").setDirection('x');
            optionPanel.setVisible(false);
            this.options.push(optionPanel);
            this.add(optionPanel);
        }

        this.setDepth(10);
    }
    setName(name) {
        if (this.character === name) return
        this.character = name;
        if (this.nameBox) {
            this.nameBox.destroy();
        }
        if (name) {
            const w = Math.max(4, this.character.length) * 10;
            this.nameBox = this.scene.add.panel(0, -this.currentLines * 20-40, "sm").setSize(Math.ceil(w / 20) + 2, 2).setText(this.character);
            this.add(this.nameBox);
        }
    }
    updateBoxSize(text) {
        // const lines = Math.ceil(text.length / this.maxCharsPerLine) + 1;
        const wrapLimit = 58;
        const words = text.split(/\s+/);
        let lines = 1;
        let currentLine = "";
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (currentLine.length === 0) {
                currentLine = word;
            } else if ((currentLine.length + 1 + word.length) <= wrapLimit) {
                currentLine += " " + word;
            } else {
                lines++;
                currentLine = word;
            }
        }
        if (currentLine.length > 0) {
            lines++;
        }
        lines = Math.max(2, lines);
        if (lines !== this.currentLines) {
            this.currentLines = lines;
            this.box.setFrame(`speechbox${this.currentLines}`).setPosition(0, -this.currentLines * 20);
            this.textline.setY(-this.currentLines * 20  + 12);
            if (this.nameBox) {
                this.nameBox.setY(-this.currentLines * 20-40);
            }
            this.bringToTop(this.textline);
            this.bringToTop(this.nextBtn);
        }
    }
    playDialogSequence(dialogArray, onCompleteGlobal=()=>{}) {
        let index = 0;
        const playNext = () => {
            if (index < dialogArray.length) {
                const { character, text, options,callback,onComplete } = dialogArray[index];
                index++;
                if (character!==this.character) {
                    this.setName(character);
                }
                if (callback) {
                    callback();
                }
                this.run(text, options, (selectedOption)=>{
                    if (onComplete) onComplete();
                    this.handleOption(selectedOption, playNext)
                });
            } else {
                onCompleteGlobal();
            }
        };
        playNext();
    }
    handleOption(selectedOption, playNext) {
        if (!selectedOption){
            playNext();
            return
        }
        switch (selectedOption.after) {
            case "continue":
                playNext();
                break;
            case "break":
                this.scene.scene.start(selectedOption.next);
                break;
            case "response-continue":
                this.playDialogSequence(selectedOption.response, playNext);
                break;
            case "response-break":
                this.playDialogSequence(selectedOption.response, ()=>{
                    this.scene.scene.start(selectedOption.next);
                });
                break;
            default:
                if (selectedOption.response) {
                    this.playDialogSequence(selectedOption.response, playNext);
                } else {
                    playNext();
                }
                break;
        }
    }
    run(text, options=[], onComplete){
        this.hideOptions();
        this.setVisible(true);
        if (this.withOverlay) this.overlay.setVisible(true);
        this.box.disableInteractive();
        this.textline.setText(""); 
        this.nextBtn.setVisible(false);
        this.updateBoxSize(text);
        let index = 0;
        let currentText = "";
        if (this.typewriterTimer) {
            this.typewriterTimer.remove(false);
        }
        this.typewriterTimer = this.scene.time.addEvent({
            delay: this.typingSpeed,
            loop: true, 
            callback: () => {
                if (index < text.length) {
                    currentText += text[index];
                    index++;
                    this.textline.setText(currentText);
                } else {
                    this.typewriterTimer.remove(false);
                    if (options.length > 0) {
                        this.showOptions(options, onComplete);
                    } else {
                        this.nextBtn.setVisible(true);
                        this.box.removeAllListeners("pointerdown");
                        this.box.setInteractive({ cursor: "pointer" }).once("pointerdown", () => {
                            this.scene.sound.play("ui_click");
                            this.overlay.setVisible(false);
                            this.setVisible(false);
                            if (onComplete) onComplete();
                        });
                    }
                }
            }    
        })
    }
    showOptions(options,optCallback) {
        let yOffset = this.currentLines * 20;
        if (options.length>this.maxOptions) {
            console.error("!!! options.length > this.maxOptions !!!")
        }
        [...options].reverse().forEach(({ text, callback, ...rest }, index) => {
            const w = Math.max(3, Math.ceil(text.length/2)+2);
            this.options[index].setSize(w, 2).setPosition(600 - w * 20, -40 - yOffset).setText(text).setVisible(true).onClick(() => {
                this.scene.sound.play("ui_click");
                this.hideOptions(); 
                this.overlay.setVisible(false);
                this.setVisible(false);
                if (callback) callback();
                if (optCallback) optCallback({text,...rest})
            }, true);
            yOffset += 40;
        });
    }
    hideOptions(){
        this.options.forEach(option => {
            option.setVisible(false);
            option.onClick(null);
        });
    }
    setOverlay(v=true) {
        this.withOverlay = v;
        return this;
    }

}