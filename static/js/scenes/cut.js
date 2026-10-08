import { audio, dialogVoice, playDialogVoice, playOverlap } from "../audio.js";
import { Random } from "../engine/math.js";
import { NodeGroup, NodeObject } from "../engine/node.js";
import { Rect } from "../engine/rect.js";
import { Scene } from "../engine/scene.js";
import { UIButton, UITextView } from "../engine/ui.js";
import { bgmButton, display, displayRect, homeButton, nextSceneButton } from "../root.js";
import { Sprites } from "../sprites.js";
import { endingScene } from "./ending.js";

const falseOptions = [1,3,5,6,7,9]
const correctOptionSequence = [2,4,8,"finish"]
let optionRequestIndex = 0
function getOptionRequest() {
    return correctOptionSequence[optionRequestIndex]
}
function textGuideTextOptionRequest() {
    const value = getOptionRequest()
    switch (value) {
        case 2:
            return `yuk kita potong bolu kemojonya menjadi ${value} potong, yang mana angka ${value}?`
        case 4:
            return `sekarang mari potong lagi menjadi ${value} potong, yang mana angka ${value}?`
        case 8:
            return `terakhir mari potong menjadi ${value} potong, yang mana angka ${value}?`
        case "finish":
            return "luar biasa, sekarang kita punya 8 potong bolu kemojo."
    }
}

const textGuide = new UITextView(new Rect(displayRect.centerx + 50,0,displayRect.w / 2 - 100,displayRect.h / 2),textGuideTextOptionRequest(),"70px Arial","white",80,0,10,"#6f3b00",[0,0],["center","center"],"middle","none","3px")
textGuide.scale.enable = true
textGuide.refresh = () => {
    textGuide.scale.value.w = 0.8
    textGuide.scale.value.h = 0.8
    kemojo.rect.y -= 60
    textGuide.rewrite(textGuideTextOptionRequest())
}
textGuide.falseOption = (value) => {
    textGuide.scale.value.w = 0.8
    textGuide.scale.value.h = 0.8
    textGuide.rewrite(`itu angka ${value}, bukan angka ${getOptionRequest()}, ayo coba lagi!`)
}

display.addProcess("uiResponse",() => {
    if (textGuide.scale.value.w < 1) {
        textGuide.scale.value.w += 0.02
        textGuide.scale.value.h += 0.02
    }
    if (kemojo.rect.y < 0) {
        kemojo.rect.y += 10
    }
})

const kemojo = new NodeObject(Sprites.item.kemojo.full,displayRect.copy())
const cuttingSceneGroups = new NodeGroup([kemojo,textGuide,nextSceneButton,bgmButton,homeButton])

// button Options
const buttonSize = 200
const gap = 1.4
const buttonOptions = new NodeGroup([])

for (let i=0;i<3;i++) {
    const btn = new UIButton(Sprites.numbers[0], new Rect(displayRect.centerx + 100,displayRect.centery,buttonSize,buttonSize))
    btn.rect.x += (btn.rect.w * gap) * buttonOptions.nodes.length
    btn.event.hover = () => {
        if (btn.rect.y > displayRect.centery + 20) {btn.rect.y -= 10}
    }
    btn.event.noevent = () => {
        if (btn.rect.y < displayRect.centery + 40) {btn.rect.y += 10}
    }
    btn.event.mouseup = () => {
        if (btn.value === getOptionRequest()) {
            playOverlap(audio.correct)
            
            kemojo.sprite = Sprites.item.kemojo[`opt_${getOptionRequest()}`]
            optionRequestIndex++
            playDialogVoice("cut",optionRequestIndex)
            if (optionRequestIndex < 3) {
                textGuide.refresh()
                optionsReshuffle()
                
            } else {
                buttonOptions.nodes.length = 0
                nextSceneButton.spawn()
                textGuide.refresh()

            }
        } else {
            playOverlap(audio.wrong)
            playDialogVoice("cut",dialogVoice.cut.length - 1)
            textGuide.falseOption(btn.value)
        }
    }
    buttonOptions.add(btn)
}

function optionsReshuffle() {
    const correct = getOptionRequest()
    let falseOpt = Array.from(falseOptions)
    let r
    let falseValue1 = Random.choice(falseOpt)
    r = falseOpt.indexOf(falseValue1)
    falseOpt.splice(r,1)
    let falseValue2 = Random.choice(falseOpt)
    r = falseOpt.indexOf(falseValue2)
    falseOpt.splice(r,1)
    
    let i = 0
    const values = Random.shuffle([correct,falseValue1,falseValue2])
    for (const btn of buttonOptions.nodes) {
        btn.sprite = Sprites.numbers[values[i]]
        btn.value = values[i]
        i++
    }
}
optionsReshuffle()

loadingText.classList.add("hidden")
    display.deleteProcess("loadingAnimation")
    document.getElementById("canvas").classList.remove("hidden")
export const cuttingScene = new Scene([cuttingSceneGroups,buttonOptions],Sprites.bg.tablecloth)
cuttingScene.startEvent = () => {
    playDialogVoice("cut",0)
    nextSceneButton.nextScene = endingScene
}
