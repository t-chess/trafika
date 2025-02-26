export default class CashRegister {
    constructor(scene, x = 450, y = 270) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = 160;
        this.height = 180;

        this.total = 0;
        this.pressed = {1:null,10:null,100:null};

        this.body = this.scene.add.image(this.x-6, this.y-37, "atlasik", "register_body").setOrigin(0);

        this.suplik = this.scene.add.image(this.x, this.y+this.height+2, "atlasik", "register_suplik").setOrigin(0,1);

        this.display = this.scene.add.text(this.x+this.width-25, this.y, '0', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(1);
        this.createButtons();
        this.createLever();
        this.checkoutCallback = ()=>{};

    }
    createButtons() {
        this.buttons = [];
        const cell = 15;
        [["C",1,2,3,4],[5,6,7,8,9],[10,20,30,40,50],[60,70,80,90,100],[200,300,400,500,600]].forEach((col, colIndex) => {
            col.forEach((value, rowIndex) => {
                let x = (this.x+this.width-cell)-(cell*2*colIndex)-5;
                let y = (this.y+this.height-cell)-(cell*2*rowIndex)-5-20;
                let fillColor = 0x000000; // black
                let textColor = "#ffffff"; // white
                let strokeColor = 0x393939;
                if (value === "C") {
                    fillColor = 0xff0000; // red
                    textColor = "#000000";
                    strokeColor = 0xb00000;
                } else if (value >= 10 && value <= 90) {
                    fillColor = 0xffffff;
                    textColor = "#000000";
                    strokeColor = 0x686868;
                }
                this.scene.add.ellipse(x, y, (cell-2)*2, (cell-6)*2, 0x445a7e,0.4).setBlendMode('MULTIPLY')
                let button = this.scene.add.ellipse(x, y, (cell-2)*2, (cell-6)*2, fillColor).setStrokeStyle(2,strokeColor,0.7);
                button.setInteractive();

                let text = this.scene.add.text(x,y, `${value}`, {
                    fontSize: value >= 100?'12px':'15px',
                    color: textColor,
                }).setOrigin(0.5);
                button.on('pointerdown', () => {
                    if (value === "C") {
                        this.resetInput();
                    } else {
                        this.inputDigit(value);
                    }
                });
                this.buttons.push({ button, value, text });

            });
        });
    }
    inputDigit(num) {
        if(this.display.style.color==='#ff0000') {
            this.display.setColor("#ffffff");
        }
        let radix = num >= 100 ? 100 : num >= 10 ? 10 : 1;
        let totalStr = this.total.toString().padStart(3, '0');
        const str = num.toString()[0]; 
        totalStr = radix === 100 ? (str+totalStr.slice(1)) : radix=== 10 ? (totalStr[0]+str+totalStr[2]) : totalStr.slice(0, 2)+str;
        this.total = parseInt(totalStr, 10);
        this.display.setText(this.total);

        let current = this.pressed[radix];
        if (current) {
            current.button.setScale(1).setY(current.button.y-5);
            current.text.setScale(1).setY(current.text.y-5);
            this.scene.sound.playAudioSprite('audios','button_up',{delay:0.01})
        }
        let btn = this.buttons.find(({ value: v }) => v === num);
        btn.button.setScale(0.8).setY(btn.button.y+5);
        btn.text.setScale(0.8).setY(btn.text.y+5);
        this.pressed[radix] = btn;
        this.scene.sound.playAudioSprite('audios','button_down');
    }
    resetInput() {
        if(this.display.style.color==='#ff0000') {
            this.display.setColor("#ffffff");
        }
        this.total = 0;
        this.display.setText('0');
        Object.values(this.pressed).forEach((button,i) => {
            if (button) {
                button.button.setScale(1).setY(button.button.y-5);
                button.text.setScale(1).setY(button.text.y-5);
                this.scene.sound.playAudioSprite('audios','button_up',{delay:i*0.01})
            }
        });
        this.pressed = { 1: null, 10: null, 100: null };
    }
    createLever() {
        this.lever = this.scene.add.image(this.x+this.width-5, this.y, "atlasik", "register_push").setOrigin(0).setInteractive();
        this.lever.on('pointerdown', (pointer) => {
            this.isDragging = true;
            this.startY = pointer.y;
        });
        this.scene.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                this.hasDragged = true;
                let deltaY = pointer.y - this.startY;
                this.lever.y = Math.min(this.y + this.height / 3, Math.max(this.y, this.lever.y + deltaY));
                this.startY = pointer.y;
            }
        });
        this.scene.input.on('pointerup', () => {
            if (this.isDragging && !this.hasDragged) {
                this.scene.tweens.add({
                    targets: this.lever,
                    y: this.y + 7,
                    duration: 150,
                    yoyo: true,
                    ease: 'Power1'
                });
            }
            if (this.isDragging) {
                if (this.lever.y > this.y + 30) {
                    this.checkoutCallback(this.total, () => {
                        this.scene.sound.playAudioSprite('audios','purchase');
                        this.resetInput();
                    }, ()=>{
                        this.display.setColor('#ff0000');
                    })
                }
                this.lever.y = this.y;
                this.isDragging = false;
                this.hasDragged = false;
            }
        });
    }
    onCheckout(cb){
        this.checkoutCallback = cb;
    }
}