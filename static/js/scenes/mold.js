import { audio, playDialogVoice } from "../audio.js";
import { Input } from "../engine/event.js";
import { NodeGroup, NodeObject } from "../engine/node.js";
import { Rect } from "../engine/rect.js";
import { Scene } from "../engine/scene.js";
import { UIObject, UITextView } from "../engine/ui.js";
import { bgmButton, display, displayRect, homeButton, nextSceneButton } from "../root.js";
import { Sprites } from "../sprites.js";
import { bakeScene } from "./bake.js";

const mold = new NodeObject(Sprites.item.mold.top.empty,new Rect(0,0,displayRect.h * 0.7,displayRect.h * 0.7))
mold.rect.centerx = displayRect.centerx + 400
mold.rect.centery = displayRect.centery + 100

const bowl = new UIObject(Sprites.item.bowl.dough,new Rect(0,0,400,400))

bowl.rect.centerx = displayRect.centerx - 400
bowl.rect.centery = displayRect.centery + 100
bowl.rotation.enable = true

bowl.event.mousedown = () => {
    if (!finish) {
        bowl.rect.center = Input.mouse.getPos()
    }
}

let finish = false
const textGuideText = "tuangkan adonan kemojo kedalam cetakan bolu kemojo"
const textGuide = new UITextView(new Rect(0,0,displayRect.width - 800,200),textGuideText,"55px Arial","white",80,0,10,"#6f3b00",[0,0],["center","center"])
textGuide.rect.y = 60
textGuide.rect.centerx = displayRect.centerx
textGuide.scale.enable = true

const sign = new NodeObject(Sprites.dialog.sign,displayRect.copy())
sign.rect.w -= 400
sign.rect.centerx = displayRect.centerx

const moldSceneGroup = new NodeGroup([sign,textGuide,mold,bowl,textGuide,nextSceneButton,bgmButton,homeButton])
export const moldScene = new Scene([moldSceneGroup],Sprites.bg.tablecloth)

const speedAnim = {rotate:0.05,move:40}

const moldRect = mold.rect.copy()
moldRect.scale(0.5)
moldRect.center = mold.rect.center

let nextButtonSpawn = false

moldScene.startEvent = () => {
    playDialogVoice("mold",0)
    display.addProcess("bowlRotate",() => {
        if (finish) {
            if (bowl.rotation.value > 0) {
                bowl.rotation.value -= speedAnim.rotate
            } else {
                bowl.rotation.value = 0
                bowl.rect.x -= speedAnim.move + 10
                if (mold.rect.centerx > displayRect.centerx) {
                    mold.rect.x -= speedAnim.move
                }
                if (!nextButtonSpawn) {
                    nextButtonSpawn = true
                    nextSceneButton.nextScene = bakeScene
                    nextSceneButton.spawn()
                }
                
            }
        }
    })
    display.addProcess("putInMold",() => {
        if (moldRect.colliderect(bowl.rect) && !finish) {
            finish = true
            audio.correct.play()
            textGuide.rewrite("ayo lanjut memanggang bolu kemojo!")
            playDialogVoice("mold",1)

            bowl.rotation.value = 1
            bowl.rect.bottomright = mold.rect.center
            bowl.sprite = Sprites.item.bowl.doughing[0]
            mold.sprite = Sprites.item.mold.top.fill
        }
    })
}