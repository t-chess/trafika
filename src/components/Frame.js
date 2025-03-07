export default class Frame {
    constructor(scene) {
        this.scene = scene;
        // this.bg = this.scene.add.image()
        this.characters = {}; 
        this.charsLayer = this.scene.add.container(0, 0);
    }
    setup(chars){
        this.charsLayer.removeAll(true); 
        this.characters = {};
        chars.forEach(char => { 
            let c = this.scene.add.image(0, 0, char.key).setOrigin(0);
            this.charsLayer.add(c);
            this.characters[char.key] = c;
            // if (char.timeout) {} 
        });
    }
    startDialogue(data) {
        this.scene.speechbox.playDialogSequence(data, (selectedOption) => {
            if (selectedOption?.event) {
                this.scene.handlePlayerEvent(selectedOption.event);
            }
        });
    }
}