import { audio , dialogVoice, playDialogVoice, playOverlap } from "../audio.js";
import { Input } from "../engine/event.js";
import { NodeGroup, NodeObject } from "../engine/node.js";
import { Rect } from "../engine/rect.js";
import { Scene } from "../engine/scene.js";
import { UIObject, UITextView } from "../engine/ui.js";
import { bgmButton, display, displayRect, nextSceneButton } from "../root.js";
import { Sprites } from "../sprites.js";
import { cuttingScene } from "./cut.js";


const bakeSceneDisplay = new NodeObject(Sprites.bg.baking.oven[0],displayRect.copy())
const mold = new UIObject(Sprites.item.mold.side,new Rect(0,0,500,500))
const readyView = new NodeObject(Sprites.bg.baking.ready,displayRect.copy())
mold.rect.midbottom = [340,displayRect.centery - 150]
readyView.rect.top = displayRect.bottom
readyView.scale.enable = true
readyView.spawn = false

const moldStats = {
    grabbed:false,
}

mold.event.mousedown = () => {
    moldStats.grabbed = true
}

// oven
const oven = {
    rect:new Rect(0,0,850,750),
    moldDetectRect:new Rect(0,0,50,50),

    finish:false,
    doorOpened:false,
    moldPlaced:false,

    cookProcess:false,
    alreadyCook:false,
    cookDuration:5,
    cookCurrentDuration:5,

    clicked : false,
    scene : 0,

    timerStarted : false,
    timerMinutes : 0,
    timerSeconds : 0,
    timer : function() {setInterval(function() {
        oven.cookCurrentDuration -= 1
        if (oven.cookCurrentDuration > 0) {
            textGuide.scale.value.w = 1.5
            textGuide.scale.value.h = 1.5
        }
        if (oven.cookCurrentDuration <= 0) {
            clearInterval(oven.timer)
        }
    },1000)},
}
oven.rect.bottomright = displayRect.bottomright
oven.moldDetectRect.center = oven.rect.center

const bakeButton = new NodeObject(Sprites.ui.bakeButton,new Rect(0,0,400,400))
bakeButton.rect.centerx = displayRect.centerx
bakeButton.rect.top = displayRect.bottom
bakeButton.spawn = false
bakeButton.spawnSpeed = 60

// guide
const textGuideText = [
    "buka oven",
    "masukan adonan bolu kemojo kedalam oven",
    "tutup oven",
    `ayo lanjut memanggang bolu kemojo, saat oven di nyalakan, mari kita hitung ${oven.cookDuration} detik`,
]
const textGuide = new UITextView(new Rect(0,0,displayRect.width - 500,500),textGuideText[0],"55px Arial","white",80,0,10,"#0a0a0a",[0,0],["center","center"],"middle")
textGuide.rect.y = -100
textGuide.rect.centerx = displayRect.centerx
textGuide.scale.enable = true

const bakeSceneGroup = new NodeGroup([bakeSceneDisplay,mold,readyView,bakeButton,textGuide,nextSceneButton,bgmButton])
export const bakeScene = new Scene([bakeSceneGroup])

let sceneStart = 0

function bakeProcessScene() {
    display.addProcess("readyViewShowUp", () => {
        if (readyView.scale.value.w > 1) {
            readyView.scale.value.w -= 0.01
            readyView.scale.value.h -= 0.01
        } else {
            readyView.scale.value.w = 1
            readyView.scale.value.h = 1
        }
    })
    display.addProcess("timerSize", () => {
        if (oven.cookCurrentDuration > 0) {
            if (textGuide.scale.value.w > 1) {
                textGuide.scale.value.w -= 0.008
                textGuide.scale.value.h -= 0.008
            } else {
                textGuide.scale.value.w = 1
                textGuide.scale.value.h = 1
            }
        } else {
            textGuide.scale.value.w = 1
            textGuide.scale.value.h = 1
        }
    })

    display.addProcess("bakeButtonSpawn", () => {
        if (oven.cookProcess || oven.alreadyCook) {
            return
        }
        if (bakeButton.spawn && bakeButton.rect.centery > displayRect.centery + 100) {
            bakeButton.rect.y -= bakeButton.spawnSpeed
            bakeButton.spawnSpeed *= 0.9
        } else if (bakeButton.spawn) {
            bakeButton.rect.centery = displayRect.centery + 100
            bakeButton.spawn = false
        }
    })

    display.addProcess("ovenProcess",() => {
        if (sceneStart < 11) {sceneStart++}
        // event stats
        if (moldStats.grabbed) {
            mold.rect.center = Input.mouse.getPos()
        }
        oven.clicked = oven.rect.collidepoint(...Input.mouse.getPos()) && Input.mouse.released()
        bakeButton.clicked = bakeButton.rect.collidepoint(...Input.mouse.getPos()) && Input.mouse.released()

        // finish
        if (oven.finish) {
            if (!oven.doorOpened && oven.clicked) {
                playDialogVoice("bake","lets_cut")
                audio.tada.play()
                oven.doorOpened = true
            } else if (oven.doorOpened) {
                if (!readyView.spawn) {
                    readyView.scale.value.w = 1.2
                    readyView.scale.value.h = 1.2
                    readyView.spawn = true
                }
                bakeSceneDisplay.sprite = Sprites.bg.baking.oven[1]
                readyView.rect.center = displayRect.center
                textGuide.rewrite("Bolu Kemojo nya sudah matang mari kita lanjut potong!")
                nextSceneButton.spawn()
                display.deleteProcess("ovenProcess")
            }
            return
        }

        // cooking process
        if (oven.cookProcess && oven.alreadyCook) {
            // cooked
            if (oven.cookCurrentDuration <= 0) {
                audio.ovenReady.play()
                oven.cookCurrentDuration = 0
                oven.cookProcess = false 
                oven.finish = true
                playDialogVoice("bake","open_oven")

                textGuide.rect.y = -100
                textGuide.rect.centerx = displayRect.centerx
                textGuide.font = "55px Arial"
                textGuide.rewrite(textGuideText[0])
                bakeSceneDisplay.sprite = Sprites.bg.baking.oven[oven.scene - 1]
                

            // cooking
            } else if (oven.cookCurrentDuration) {
                textGuide.font = "bold 300px Arial"
                textGuide.rect.center = displayRect.center
                let showDuration = Math.max(0,Math.min(oven.cookCurrentDuration,oven.cookDuration))
                textGuide.rewrite(`${showDuration}`)
                if (!oven.timerStarted) {
                    oven.timer()
                    textGuide.scale.value.w = 1.5
                    textGuide.scale.value.h = 1.5
                    oven.timerStarted = true
                }
            }

        // put mold

        // open the door
        } else if (!oven.doorOpened && !oven.moldPlaced && oven.clicked && !moldStats.grabbed && sceneStart > 10) {
            playOverlap(audio.ovenClick)
            playDialogVoice("bake","put_dough")
            oven.doorOpened = true

            oven.scene++
            textGuide.rewrite(textGuideText[oven.scene])

        // put the mold
        } else if (oven.doorOpened && !oven.moldPlaced && oven.moldDetectRect.colliderect(mold.rect) && oven.clicked) {
            playOverlap(audio.ovenClick)
            playDialogVoice("bake","close_oven")
            oven.moldPlaced = true
            const i = bakeSceneGroup.nodes.indexOf(mold)
            bakeSceneGroup.nodes.splice(i,1)
            
            oven.scene++
            textGuide.rewrite(textGuideText[oven.scene])
        
        // close the door
        } else if (oven.doorOpened && oven.moldPlaced && oven.clicked && !mold.grabbed) {
            playOverlap(audio.ovenClick)
            playDialogVoice("bake","lets_bake")
            bakeButton.spawn = true
            oven.doorOpened = false
            oven.scene++
            textGuide.rewrite(textGuideText[oven.scene])

        // turn on the oven
        } else if (!oven.doorOpened && oven.moldPlaced && bakeButton.clicked) {
            audio.ovenStart.play()
            
            bakeButton.rect.top = displayRect.bottom
            oven.cookCurrentDuration = oven.cookDuration
            oven.alreadyCook = true
            oven.cookProcess = true
            
            oven.scene++
            textGuide.rewrite(textGuideText[oven.scene])
        }
        if (!oven.finish) {
            bakeSceneDisplay.sprite = Sprites.bg.baking.oven[oven.scene]
        }
        if (Input.mouse.released() && moldStats.grabbed) {
            moldStats.grabbed = false
            mold.rect.midbottom = [340,displayRect.centery - 150]
        }
        
    })
}

bakeScene.startEvent = () => {
    bakeProcessScene()
    playDialogVoice("bake","open_oven")
    nextSceneButton.nextScene = cuttingScene
}