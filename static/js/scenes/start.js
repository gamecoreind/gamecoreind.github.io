import { NodeGroup, NodeObject } from "../engine/node.js"
import { Scene } from "../engine/scene.js"
import { UIButton, UITextView } from "../engine/ui.js"
import { Sprites } from "../sprites.js"
import { bgmButton, display , displayRect } from "../root.js"
import { Rect } from "../engine/rect.js"
import { openingScene, showDialogueButton, textDialogue } from "./opening.js"
import { GridTransition } from "../engine/transition.js"
import { playDialogVoice } from "../audio.js"

export const transitiongrid = new GridTransition()

display.sceneTransition = transitiongrid
const startButton = new UIButton(
    Sprites.ui.startButton.default,
    new Rect(0,500,700,300),
    () => {
        //playOverlap(audio.transition)
        openingScene.startEvent = () => {
            display.addProcess("toOpening",() => {
                if (transitiongrid.finish) {
                    display.sceneTransition = null
                    textDialogue.startWrite()
                    playDialogVoice("opening",0)
                    showDialogueButton()
                    display.deleteProcess("toOpening")
                }
            })
        }
        display.scene = openingScene
        startButton.allow.update = false
    }
)

startButton.spriteHovered = Sprites.ui.startButton.hover
startButton.spritePressed = Sprites.ui.startButton.press
startButton.rect.centerx = displayRect.centerx
startButton.scale.enable = true
startButton.event.hover = () => {
    startButton.setSprite("hovered")
    if (startButton.scale.value.w < 1.1) {
        startButton.scale.value.w += 0.01
        startButton.scale.value.h += 0.01
    }
}
startButton.event.noevent = () => {
    startButton.setSprite("default")
    if (startButton.scale.value.w > 1) {
        startButton.scale.value.w -= 0.01
        startButton.scale.value.h -= 0.01
    }
}

class LeafDeco extends NodeObject {
    constructor(rect,range,startDirection = 1) {
        super(Sprites.bg.leaf,rect)
        this.rotation.enable = true
        this.animation = {
            speed : 0.005,
            currentSpeed : 0.005,
            range : range,
            direction : startDirection
        }
        this.rotation.value = this.animation.range[0]
    }
    update() {
        if (this.animation.direction > 0) {
            if (this.rotation.value < this.animation.range[1]) {
                this.rotation.value += this.animation.currentSpeed
                this.animation.currentSpeed *= 0.99
            } else {
                this.animation.direction = -1
                this.animation.currentSpeed = this.animation.speed
            }
        } else if (this.animation.direction < 0) {
            if (this.rotation.value > this.animation.range[0]) {
                this.rotation.value -= this.animation.currentSpeed
                this.animation.currentSpeed *= 0.99
            } else {
                this.animation.direction = 1
                this.animation.currentSpeed = this.animation.speed
            }
        }
    }
}

const leaf_1 = new LeafDeco(new Rect(-390,-250,700,700),[1.2,1.6])
const leaf_2 = new LeafDeco(new Rect(0,0,700,700),[-1.6,-1.2])
leaf_2.rect.center = displayRect.bottomright
leaf_2.rect.y -= 100
leaf_2.rect.x += 80

/*
const credit = new NodeObject(new Surface(650,100),new Rect(0,0,650,100))
credit.sprite.context2D.fillStyle = "white"
credit.sprite.context2D.fillRect(0,0,credit.rect.w,credit.rect.h)

credit.rect.bottomleft = displayRect.bottomleft
const logo = new NodeObject(Sprites.ui.logo,new Rect(...credit.rect.topleft,credit.rect.h,credit.rect.h))

const creditText = new UITextView(new Rect(logo.rect.right + 20,credit.rect.y + 28,credit.rect.w,logo.rect.h),"© TKIT IBU HARAPAN BENGKALIS","bold 30px Arial","black",30,0,0,"black",[10,10],"left","top")
*/

//const startSceneNodes = new NodeGroup([startButton,credit,logo,creditText])
const startSceneNodes = new NodeGroup([startButton,leaf_1,leaf_2,bgmButton])
export const startScene = new Scene([startSceneNodes],Sprites.bg.start)

document.getElementById("loadingText").classList.add("hidden")
document.getElementById("canvas").classList.remove("hidden")

bgmButton.bgm.volume = 0.5
bgmButton.pause()
document.addEventListener("pointerdown",() => {
    bgmButton.init = true
    bgmButton.play()
},{ once: true })