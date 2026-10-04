import { audio, dialogVoice, playDialogVoice, playOverlap } from "../audio.js";
import { Input } from "../engine/event.js";
import { Random } from "../engine/math.js";
import { NodeGroup, NodeObject } from "../engine/node.js";
import { Rect } from "../engine/rect.js";
import { Scene } from "../engine/scene.js";
import { UIObject, UITextView } from "../engine/ui.js";
import { bgmButton, display, displayRect, nextSceneButton } from "../root.js";
import { Sprites } from "../sprites.js";
import { moldScene } from "./mold.js";
import { transitiongrid } from "./start.js";

export const table = new NodeObject(Sprites.bg.doughing.table,displayRect.copy())

const textGuideIngredients = [
    // put all ingredients            step , length
    "pertama masukkan tepung terigu", // 0 , 1
    "masukkan telur",           // 1 , 2
    "lalu masukkan gula pasir",       // 2 , 3
    "setelah itu masukkan santan kelapa",    // 3 , 4
    "dan lalu tambahkan pandan",      // 4 , 5
    "mari kita aduk hingga merata"    // 5 , 6
]
const textGuideStir = "tekan untuk mengaduk"
const textGuideDoughReady = "selesai pembuatan adonan mari kita pindahkan ke cetakan"

class Bowl extends UIObject {
    constructor(sprite,rect) {
        super(sprite,rect)
        this.scale.enable = true
        this.stir = {
            to : "right",
            mode : false,
            roundMax : 3,
            currentRound : 0,
        }
        this.finish = false
        this.event.mouseup = () => {
            if (this.stir.mode) {
                this.nextStep()
            }
        }
    }
    nextStep() {
        if (this.finish) {
            
            return
        }
        // dough
        if (this.stir.currentRound >= this.stir.roundMax) {
            playOverlap(audio.correctItem)
            playDialogVoice("dough",dialogVoice.dough.length - 1)
            this.sprite = Sprites.item.bowl.dough
            textGuideSpawnAnimation()
            textGuide.rect.y -= 20
            textGuide.rewrite(textGuideDoughReady)
            this.finish = true

            nextSceneButton.nextScene = moldScene
            display.sceneTransition = transitiongrid
            nextSceneButton.spawn()
            return
        }

        // scaling bowl when do act
        this.scale.value.w += 0.1
        this.scale.value.h += 0.1
        if (this.stir.mode) {
            if (this.stir.to === "left") {
                if (step <= 0) {
                    this.stir.to = "right"
                    this.stir.currentRound++
                    step++
                } else {
                    step--
                }
            } else if (this.stir.to === "right") {
                if (step >= 2) {
                    this.stir.to = "left"
                    this.stir.currentRound++
                    step--
                } else {
                    step++
                }
            }
            this.sprite = Sprites.item.bowl.stir[step]
            textGuide.rewrite(textGuideStir)
        } else {
            step++
            playOverlap(audio.correctItem)
            
            if (step > textGuideIngredients.length - 1) {
                this.stir.mode = true
                step = 0
                this.nextStep()
                return
            } 
            playDialogVoice("dough",step)
            this.sprite = Sprites.item.bowl.doughing[step]
            textGuideSpawnAnimation()
            textGuide.rewrite(textGuideIngredients[step])
        }
    }
}

class Item extends UIObject {
    constructor(sprite,rect,step,group) {
        super(sprite,rect)
        this.originPos = undefined
        this.step = step
        this.group = group
        this.event.mousedown = () => {
            if (!selected) {selected = this}
        }
        this.event.mouseup = () => {
            if (selected === this) {
                selected = null
                return
            }
        }
    }
}

const bowl = new Bowl(Sprites.item.bowl.doughing[0],new Rect(0,0,400,400))

const pointingClick2Stir = new NodeObject(Sprites.ui.pointing,new Rect(0,0,100,100))
pointingClick2Stir.rect.right = displayRect.centerx 
pointingClick2Stir.rect.top = displayRect.centery + 200
pointingClick2Stir.scale.enable = true

display.addProcess("pointingAnimation",() => {
    if (bowl.stir.mode && !bowl.finish) {
        pointingClick2Stir.show()
    } else {
        pointingClick2Stir.hide()
    }
    if (pointingClick2Stir.scale.value.w > 1) {
        pointingClick2Stir.scale.value.w -= 0.07
        pointingClick2Stir.scale.value.h -= 0.07
    } else {
        pointingClick2Stir.scale.value.h = 2.5
        pointingClick2Stir.scale.value.w = 2.5
    }
})

display.addProcess("stir",() => {
    if (bowl.scale.value.w > 1) {
        bowl.scale.value.w -= 0.01
        bowl.scale.value.h -= 0.01
    } else {
        bowl.scale.value.w = 1
        bowl.scale.value.h = 1
    }
})

const itemPlacer = bowl.rect.copy()
itemPlacer.inflate(-250,-250)

bowl.rect.centerx = table.rect.centerx,
display.addProcess("bowlOnTable",() => {
    bowl.rect.centery = table.rect.centery + 200
    itemPlacer.center = bowl.rect.center
})
display.addProcess("textGuideInflate",() => {
    textGuide.rect.centerx = displayRect.centerx
    if (textGuide.scale.value.w < 1) {
        textGuide.scale.value.w += 0.04
        textGuide.scale.value.h += 0.04

    } else {
        textGuide.scale.value.w = 1
        textGuide.scale.value.h = 1

    }
})
function textGuideSpawnAnimation() {
    textGuide.scale.value.w = 0.8
    textGuide.scale.value.h = 0.8
}


const itemData = [
    {sprite:Sprites.item.flour,size:[400,400],step:0},
    {sprite:Sprites.item.egg,size:[100,100],step:1},
    {sprite:Sprites.item.sugar,size:[200,200],step:2},
    {sprite:Sprites.item.coconut_milk,size:[250,250],step:3},
    {sprite:Sprites.item.pandan,size:[200,200],step:4},
    {sprite:Sprites.item.wisk,size:[200,200],step:5}
]
Random.shuffle(itemData)

let step = 0
let selected = null
const items = new NodeGroup([])
items.ySort = true
const itemPosition = [
    [200, 900],[570, 900],[350, 1000],
    [1334, 900],[1794, 900],[1538, 1000]
]
for (const [index , item] of itemData.entries()) {
    const itemObject = new Item(item.sprite,new Rect(0,0,...item.size),item.step,items)
    itemObject.rect.midbottom = itemPosition[index]
    itemObject.originPos = itemPosition[index]
    items.add(itemObject)
}

function putIngredients() {
    for (const item of items.nodes) {
        if (item === selected) {
            item.rect.center = [Input.mouse.x,Input.mouse.y]
            if (item.step === step && itemPlacer.colliderect(item.rect)) {
                let index = items.nodes.indexOf(item) 
                if (index !== -1) {
                    items.nodes.splice(index,1)
                    selected = null
                }
                bowl.nextStep()
                
            }
        } else {
            item.rect.midbottom = item.originPos
        }
    }
}
display.addProcess("putIngredients",putIngredients)

const textGuide = new UITextView(new Rect(0,0,displayRect.width - 800,200),textGuideIngredients[0],"55px Arial","white",80,0,10,"#6f3b00",[0,0],["center","center"])
textGuide.rect.y = 80
textGuide.scale.enable = true

const sign = new NodeObject(Sprites.dialog.sign,displayRect.copy())
sign.rect.w -= 400
sign.rect.centerx = displayRect.centerx

const doughSceneNodes = new NodeGroup([table,bowl,sign,textGuide,nextSceneButton,bgmButton,pointingClick2Stir])
export const doughScene = new Scene([doughSceneNodes,items],Sprites.bg.doughing.bg)

doughScene.startEvent = () => {
    let signSpawnSpeed = 20
    playDialogVoice("dough",step)

    const subY = -300
    textGuide.rect.y += subY
    sign.rect.y += subY
    display.addProcess("signSpawn",() => {
        if (textGuide.rect.y < 80) {
            textGuide.rect.y += signSpawnSpeed
            sign.rect.y += signSpawnSpeed
            signSpawnSpeed *= 0.929
        } else {
            textGuide.rect.y = 80
            sign.rect.y = 0
            display.deleteProcess("signSpawn")
        }
        
    })
}