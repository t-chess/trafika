export default class CashRegister {
    constructor(scene, x = 450, y = 270) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = 160;
        this.height = 180;

        this.total = 0;
        this.pressed = {1:null,10:null,100:null};

        this.body = this.scene.add.graphics().fillStyle(0x8B4513, 1).fillRect(this.x, this.y, this.width,this.height); 
        this.lever = this.scene.add.graphics().fillStyle(0x4b47a0, 1).fillRect(this.x+this.width, this.y, 10,this.height/2); 

        this.display = this.scene.add.text(this.x+this.width-5, this.y-5, '0', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor:"black",
        }).setOrigin(1);
        this.createButtons();

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
                this.scene.add.ellipse(x, y, (cell-2)*2, (cell-6)*2, 0x000000,0.25)
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
        }
        let btn = this.buttons.find(({ value: v }) => v === num);
        btn.button.setScale(0.8).setY(btn.button.y+5);
        btn.text.setScale(0.8).setY(btn.text.y+5);
        this.pressed[radix] = btn;
    }
    resetInput() {
        this.total = 0;
        this.display.setText('0');
        Object.values(this.pressed).forEach(button => {
            if (button) {
                button.button.setScale(1).setY(button.button.y-5);
                button.text.setScale(1).setY(button.text.y-5);
            }
        });
        this.pressed = { 1: null, 10: null, 100: null };
    }

}