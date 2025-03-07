import CutScene from "../UI/CutScene";

export class Intro extends CutScene {
    constructor() {
        super("Intro");
    }
    preload(){
        this.load.image('padik1',"assets/cuts/padik1.png");
        this.load.image('padik2',"assets/cuts/padik2.png");
        this.load.image('padik3',"assets/cuts/padik3.png");
    }
    create() {
        this.setScenes([
            {
                bgKey: "padik1", 
                dialog: [
                    { text: "When I was little, the fishmonger was downstairs." },
                    { text: "The whole building smelled like salt and guts, but after a while, I stopped noticing. Mom never did."}
                ]
            },
            {
                bgKey: "padik2", 
                dialog: [
                    { text: "Then it became a photo studio." },
                    { text:"No more fish, just chemicals, paper and whatever cologne that prickish photographer marinated in daily."}
                ]
            },
            {
                bgKey: "padik3", 
                dialog: [
                    { text: "Then I was gone for a while. Now it's a tobacco shop." },
                    { text:"Out of everything, this smell makes the most sense. Ashes to ashes, you know?"},
                    { text:"Also it looks like Felix, the owner, isn't gonna let me just sit here.", options: [
                        {text: "Хули вылупился?"},
                        {text:"Grrr >:C"}
                    ]}
                ]
            },
            // {
            //     bgKey: "cut3", 
            //     dialog: [
            //         { character: "Gail", text: "Oh, fucking wonderful." },
            //         {
            //             text: "See if someone on the ferry has a lighter?",
            //             options: [
            //                 { text: "Ask a nearby smoker", after: "response-continue", response: [{text:"Gail approaches a smoker."},{text:"The lighter is in her hand before she can ask."}] },
            //                 { text: "Avoid unnecessary interaction", after: "response-continue", response: [{text:"Gail stays quiet and avoids eye contact."},{text:"A smoker nearby sighs and passes her his lighter."}] }
            //             ]
            //         },
            //     ]
            // },
            // {
            //     bgKey: "cut4", 
            //     dialog: [
            //         {
            //             character: "Gail",
            //             text: "...",
            //             options: [{text: "Thanks."},{text: "..."}],
            //             callback: ()=>this.zippo.play(), after: "continue",
            //         },
            //         {
            //             character: "Smoker",
            //             text: "...",
            //         },
            //         {
            //             character: "Smoker",
            //             text: "Huh... You look really familiar. Do I know you?",
            //             options: [
            //                 { text: "...", after: "response-continue", response: [{character: "Smoker",text:"Ah yes, Viviane's kiddie, right?"}] },
            //                 { text: "I don't think so.", after: "response-continue", response: [{character: "Smoker",text:"Nah, I recognize that face. Viviane's kiddie, right?"}] },
            //                 { text: "Maybe. I grew up here.", after: "response-continue", response: [{character: "Smoker",text:"Thought so. You look just like her."}] }
            //             ]
            //         },
            //     ]
            // },
            // {
            //     bgKey: "cut5",
            //     dialog: [
            //         {
            //             character: "Gail",
            //             text: "..."
            //         },
            //         {
            //             character: "Smoker",
            //             text: "Damn. Bet she's just dying to see you."
            //         },
            //         {
            //             character: "Gail",
            //             text: "...",
            //             options: [
            //                 {text: "..."}, 
            //                 {text: "Yeah, she'd love that."},
            //                 {text: "Mhm. She'll be speechless."},
            //             ]
            //         },
            //         {text: "..."}
            //     ]
            // },
            // {
            //     delay: 2000,
            //     dialog: [
            //         {text:"Fifteen minutes from the dock, and here she is."},
            //         {character: "Gail", text: "Alright, I'm here! God, that was a long trip."},
            //         {character: "Gail", text: "Just need a minute to rest."},
            //         {text: "No resting, Gail. We need to get ready!", options: [ 
            //             {text: "Alright, let's begin."}, 
            //             {text: 'Ugh. Fine.'} 
            //         ]}
            //     ]
            // }
        ])
        // this.onEnd(()=>{
        //     this.cameras.main.fadeOut(500, 0, 0, 0);
        //     this.time.delayedCall(500, () => {
        //         this.scene.start("Main");
        //     });
        // })
        // this.events.on("shutdown", () => this.sea.stop() );
    }
}
