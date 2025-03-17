export default class Frame {
    constructor(scene) {
        this.scene = scene;
        // this.bg = this.scene.add.image()
        this.characters = {}; 
        this.charsLayer = this.scene.add.container(0, 0);
        this.smooth = true;
        this.clickText = null;
        this.askBtn = this.scene.add.panel(300,200,'sm',18).setSize(2,2).setText("?").setVisible(false).onClick(()=>{
            this.startDialogue(this.clickText,"click");
        });
    }
    resetCharacters(chars=[]){
        this.clickText = null;
        if (this.charsLayer.list.length) {
            this.scene.tweens.add({
                targets: this.charsLayer.list,
                alpha: 0,
                duration: this.smooth?500:0,
                ease: 'Power2',
                onComplete: () => {
                    this.charsLayer.removeAll(true);
                    this.characters = {};
                    this.addCharacters(chars);
                }
            });
        } else {
            this.addCharacters(chars);
        }
        return this
    }
    addCharacters(chars) {
        chars.forEach(char => {
            let c = this.scene.add.image(charsData[char.key].x, charsData[char.key].y, "characters", char.key).setOrigin(0).setAlpha(0);
            this.charsLayer.add(c);
            this.characters[char.key] = c;
            this.scene.tweens.add({
                targets: c,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        });
        return this
    }
    startDialogue(data,key) {
        const newdata = data.map(line=>{
            if (line.options) {
                return {
                    ...line,
                    options: line.options.map(option=> ({...option, callback: ()=>{
                        if (option.flag) {
                            this.scene.gameState.flags[option.flag] = true;
                        }
                        if (option.event) {
                            this.scene.trigger(option.event);
                        }
                    }}))
                }
            }
            return line
        })
        this.scene.speechbox.playDialogSequence(newdata, ()=>{
            if (key?.includes("entry")){
                if (this.scene.loopdata.dialogues.click?.length&&!this.clickText) {
                    this.setClickText(this.scene.loopdata.dialogues.click);
                    this.showAskButton();
                }
            }
            const afterevent = data.find(line=>line.onComplete);
            if (afterevent) {
                this.scene.trigger(afterevent);
            } else if (key==='checkout') {
                this.scene.trigger('loop_end');
            }
        });
        return this
    }
    setClickText(text){
        this.clickText=text;
    }
    showAskButton(v=true){
        this.askBtn.setVisible(v);
    }
}


const charsData = {
    felix: {
        x: 135, y: 40
    },
    pierrick: {
        x: 110, y: 73
    },
    raphael: {
        x: 130, y: 80
    },
    mado: {
        x: 150, y: 113
    }
}