import products from "../data/products.json";
export default class CashRegister {
    constructor(scene, x = 450, y = 270) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.width = 160;
        this.height = 180;

        this.total = 0;
        this.pressed = {1:null,10:null,100:null};

        this.body = this.scene.add.image(this.x-6, this.y-37, "items", "register_body").setOrigin(0).setInteractive();

        this.suplik = this.scene.add.image(this.x, this.y+this.height+2, "items", "register_suplik").setOrigin(0,1);

        this.display = this.scene.add.text(this.x+this.width-25, this.y, '0', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(1);
        this.createButtons();
        this.createLever();

        this.order = [];
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
                button.setInteractive({cursor:"pointer"});

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
            }
        });
        this.scene.sound.playAudioSprite('audios','button_up');
        this.pressed = { 1: null, 10: null, 100: null };
    }
    createLever() {
        this.lever = this.scene.add.image(this.x+this.width-5, this.y, "items", "register_push").setOrigin(0).setInteractive({cursor:"pointer"});
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
                    this.checkout();
                }
                this.lever.y = this.y;
                this.isDragging = false;
                this.hasDragged = false;
            }
        });
    }
    setOrder(orderArr){
        this.order = orderArr.map(i=>{
            let [key,q] = i.includes('X')?i.split("X"):[i,1];
            return {key,quantity:parseInt(q,10)}
        })
        this.price = this.order.reduce((sum, item) => sum + products.find(p => p.key === item.key).price * item.quantity, 0);
    }
    checkout(){
        if (!this.order.length) return
        if (!this.compare()) {
            this.onError("wrong_items");
            return
        }
        if (this.price!==this.total) {
            this.onError("wrong_price",this.total);
            return
        }
        this.scene.sound.playAudioSprite('audios','purchase');
        this.scene.trigger("checkout");
        this.resetInput(); 
        this.order.length = 0;
        this.scene.bag.empty();
    }
    compare(){
        const bag = this.scene.bag.getAll();
        if (this.order.length!==bag.length) return false
        let expectedMap = Object.fromEntries(this.order.map(item => [item.key, item.quantity]));
        let actualMap = Object.fromEntries(bag.map(item => [item.key, item.quantity]));
        for (let key in expectedMap) {
            if (actualMap[key] !== expectedMap[key]) return false;
        }
        return true;
    }
    onError(e){
        this.display.setColor('#ff0000');
        this.scene.sound.playAudioSprite('audios','purchase_fail');
        this.scene.trigger(e);
    }
}