export default class Frame {
    constructor(scene) {
        this.scene = scene;
        // this.bg = this.scene.add.image()
        this.characters = {}; 
        this.charsLayer = this.scene.add.container(0, 0);
        this.smooth = true;
        this.askBtn = this.scene.add.panel(300,200,'sm',18).setSize(2,2).setText("?").setVisible(false).onClick(()=>{
            this.askBtnTouched = true;
            this.askBtnTw(false);
            this.startDialogue("click");
        });
        this.askBtnTouched = false;
    }
    hideCharacters(){
        Object.entries(this.characters).forEach(([key, char]) => {
            this.scene.tweens.add({
                targets: char,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    char.setVisible(false);
                }
            });
            if (char.face) {
                this.scene.tweens.add({
                    targets: char.face,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => {
                        char.face.setVisible(false);
                    }
                });
            }
        });    
        return this
    }
    addCharacters(chars=[]) {
        chars.forEach(({key,x,y}) => {
            const data = charsData[key];
            let ch = this.characters[key];
            if (!ch) {
                ch = this.scene.add.image(data.x, data.y, "characters", key).setOrigin(0).setAlpha(0);
                this.charsLayer.add(ch);
                if (data.faces) {
                    let f = this.scene.add.image(data.x+data.faces,data.y,"characters",key).setOrigin(0).setVisible(false);
                    this.charsLayer.add(f);
                    ch.face = f;
                }
                this.characters[key] = ch;
            } else {
                ch.setPosition(x||data.x,y||data.y).setFrame(key).setVisible(true);
                if (ch.face) {
                    ch.face.setPosition(data.x + data.faces, data.y).setVisible(false);
                }
            }
            this.scene.tweens.add({
                targets: ch,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        });
        return this
    }
    getFlaggedDialogue(dk) {
        if (dk.includes('wrong_change_')&&!this.scene.loopdata.dialogues[dk]&&this.scene.loopdata.dialogues.wrong_change) return this.scene.loopdata.dialogues.wrong_change
        const keys = Object.keys(this.scene.loopdata.dialogues).filter(k=> k.startsWith(dk));
        if (keys.length===1) return this.scene.loopdata.dialogues[dk];
        for (const k of keys) {
            if (this.scene.registry.get('flags').has(k.slice(dk.length+1))) return this.scene.loopdata.dialogues[k];
        }
        return this.scene.loopdata.dialogues[dk];
    }
    startDialogue(key) {
        this.currentDialogue = key;
        const data = this.getFlaggedDialogue(key);
        if (!data) return this;
        const newdata = this.prepareDialogue(data);
        this.scene.speechbox.playDialogSequence(newdata, ()=>{
            if (key?.includes("entry")){
                if (this.scene.loopdata.dialogues.click?.length&&!this.clickText) {
                    this.showAskButton();
                }
            }
            if (key?.includes('checkout')&&!newdata[newdata.length-1]?.onComplete) {
                this.scene.trigger('loop_end');
            }
        });
        return this
    }
    prepareDialogue(data) {
        return data.map(line => {
            const processed = {
                ...line,
                callback: () => {
                    if (line.flag) {
                        this.scene.registry.get("flags").add(line.flag);
                    }
                    const em = line.faces || {};
                    Object.keys(this.characters).forEach(char => {
                        const ch = this.characters[char];
                        if (ch?.face) {
                            if (em[char]) {
                                ch.face.setFrame(char + "_" + em[char]).setVisible(true).setAlpha(1);
                            } else {
                                ch.face.setVisible(false);
                            }
                        }
                    });
                }
            };
            if (line.options) {
                processed.options = line.options.map((option,i) => {
                    const path = `${this.currentDialogue}.${data.indexOf(line)}.${i}`;
                    if (option.once && this.scene.onceClicked.has(path)) return null;
                    let newOpt = { ...option };
                    if (option.response) {
                        newOpt.response = this.prepareDialogue(option.response);
                    }
                    if (option.flag || option.event||option.once) {
                        newOpt.callback = () => {
                            if (option.flag) {
                                this.scene.registry.get("flags").add(option.flag);
                            }
                            if (option.event) {
                                this.scene.trigger(option.event);
                                if (option.once) {
                                    this.scene.onceClicked.add(path);
                                }
                            }
                        };
                    }
                    return newOpt;
                }).filter(Boolean);
            }
            if (line.onComplete) {
                processed.onComplete = () => this.scene.trigger(line.onComplete);
            }
            return processed;
        });
    }    
    showAskButton(v=true){
        this.askBtn.setVisible(v);
        this.askBtnTw(v&&!this.askBtnTouched);
    }
    askBtnTw(v) {
        if (v) {
            if (this.askBtnTimer || this.askBtnTouched) return;
            this.askBtnTimer = this.scene.time.addEvent({
                delay: 3000,
                loop: true,
                callback: () => {
                    this.scene.tweens.add({
                        targets: this.askBtn,
                        y: this.askBtn.y - 10,
                        duration: 150,
                        yoyo: true,
                        ease: 'Quad.easeOut'
                    });
                }
            });
        } else if (this.askBtnTimer) {
            this.askBtnTimer.remove();
            this.askBtnTimer = null;
        }
    } 
}


const charsData = {
    felix: {
        x: 135, y: 40,
        faces: 69
    },
    fisherman: {
        x: 120, y: 39
    },
    lucie: {
        x: 60, y: 36
    },
    babette: {
        x: 220, y: 68
    },
    pierrick: {
        x: 110, y: 73
    },
    raphael: {
        x: 130, y: 80
    },
    mado: {
        x: 150, y: 113
    },
    mado_nurse: {
        x: 150, y: 113
    },
    yves: {
        x: 160, y: 74
    },
    sylvie: {
        x: 140, y: 90
    }
}