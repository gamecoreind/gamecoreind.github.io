import { NodeGroup, NodeObject } from "../engine/node.js"
import { Scene } from "../engine/scene.js"
import { UITextView } from "../engine/ui.js"
import { Sprites } from "../sprites.js"
import { bgmButton, displayRect , homeButton, nextSceneButton } from "../root.js"
import { Rect } from "../engine/rect.js"
import { doughScene } from "./dough.js"
import { audio, playOverlap , playDialogVoice } from "../audio.js"

export const kitchenBG = new NodeObject(Sprites.bg.kitchen,displayRect)

const char = new NodeObject(Sprites.dialog.char_text,displayRect)

const dialog = [
    "bolu kemojo adalah makanan khas melayu riau.",
    "nama 'kemojo' atau sering disebut bolu kojo berasal dari cetakan tradisional yang bentuknya menyerupai bunga kamboja.",
    "yuk kita belajar cara memasak bolu kemojo."
]
let dialogIndex = 0

const textcolor = "#151515"
export const textDialogue = new UITextView(new Rect(700,180,1050,400),dialog[dialogIndex],"40px Arial",textcolor,75,5,2,textcolor,[10,10],["left","top"])
textDialogue.stopWrite()

let dialogueButtonVisibility = false
const prevButton = new UITextView(new Rect(0,0,230,100),"< sebelumnya","bold 30px Arial","black",100,0)

prevButton.event.hover = () => {
    prevButton.color = "#b17623"
}
prevButton.event.noevent = () => {
    prevButton.color = textcolor
}

export const nextButton = new UITextView(new Rect(0,0,230,100),"selanjutnya >","bold 30px Arial","black",100,0)
nextButton.hide()

nextButton.event.hover = () => {
    nextButton.color = "#b17623"
}
nextButton.event.noevent = () => {
    nextButton.color = textcolor
}
export function showDialogueButton() {
    if (!dialogueButtonVisibility) {
        nextButton.show()
        dialogueButtonVisibility = true
    }
}

const dialogButtonY = textDialogue.rect.bottom - 70
prevButton.rect.left = textDialogue.rect.left
prevButton.rect.centery = dialogButtonY

nextButton.rect.right = textDialogue.rect.right
nextButton.rect.centery = dialogButtonY

prevButton.event.mouseup = () => {
    if (dialogIndex <= 0) {
        prevButton.hide()
        return
    }
    dialogIndex -= 1
    playDialogVoice("opening",dialogIndex)
    playOverlap(audio.dialogueButton)
    textDialogue.rewrite(dialog[dialogIndex])
    nextButton.show()
    if (dialogIndex <= 0) {
        prevButton.hide()
    }
}

nextButton.event.mouseup = () => {
    if (dialogIndex >= dialog.length - 1) {
        nextButton.hide()
        return
    }
    dialogIndex += 1
    playDialogVoice("opening",dialogIndex)
    playOverlap(audio.dialogueButton)
    textDialogue.rewrite(dialog[dialogIndex])
    prevButton.show()
    if (dialogIndex >= dialog.length - 1) {
        nextButton.hide()
        nextSceneButton.spawn()
    }
    
}

prevButton.event.mouseup()

const fakeStartButton = new NodeObject(
    Sprites.ui.startButton.press,
    new Rect(0,500,700,300)
)
fakeStartButton.rect.centerx = displayRect.centerx

// next scene button
nextSceneButton.hide()
nextSceneButton.nextScene = doughScene

// place order
const openingSceneNodes = new NodeGroup([fakeStartButton,kitchenBG,char,textDialogue,nextButton,prevButton,nextSceneButton,bgmButton,homeButton])
export const openingScene = new Scene([openingSceneNodes],Sprites.bg.start)
