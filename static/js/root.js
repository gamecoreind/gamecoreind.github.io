import { audio , playOverlap} from "./audio.js"
import { Display } from "./engine/display.js"
import { Vector2 } from "./engine/math.js"
import { NodeObject } from "./engine/node.js"
import { Rect } from "./engine/rect.js"
import { UIButton, UIObject } from "./engine/ui.js"
import { Sprites } from "./sprites.js"

export const display = new Display(document.getElementById("canvas"))
export const displayRect = display.getRect()

class NextSceneButton extends UIButton {
    constructor() {
        super(Sprites.ui.nextButton.default)
        this.animationPos = {
            from:new Vector2(...[1920, 810]),
            to:new Vector2(...[1610, 810]),
            speed:50
        }
        this.rect = new Rect(...this.animationPos.from.pos,200,200)

        this.spriteHovered = Sprites.ui.nextButton.hover
        this.spritePressed = Sprites.ui.nextButton.press
        this.resetWhenClicked = true
        this.nextScene = null
        this.spawned = false
        display.addProcess("spawnNextSceneButtonAnimation",() => {
            if (this.rect.x > this.animationPos.to.x) {
                this.rect.x -= this.animationPos.speed
            } else {
                this.rect.x = this.animationPos.to.x
            }
        })

        this.event.mouseup = () => {
            this.nextSceneFunction()
        }
        this.hide()
    }
    nextSceneFunction() {
        playOverlap(audio.transition)
        display.scene = this.nextScene
        if (this.resetWhenClicked) {
            this.hide()
        }
    }
    setNextScene(scene) {
        display.scene = scene
        
    }
    hide() {
        super.hide()
        this.spawned = false
        this.allow.update = false
    }
    show() {
        super.show()
        this.allow.update = true
    }
    spawn() {
        if (!this.spawned) {
            this.rect.topleft = this.animationPos.from.pos
            this.show()
            this.spawned = true
        }
    }
    
}
export const nextSceneButton = new NextSceneButton()

class BGMButton extends UIObject {
    constructor() {
        super(Sprites.ui.bgm.pause,new Rect(20,20,100,100))
        this.bgm = new Audio("/static/res/bgm/bgm_0.mp3")
        this.bgm.loop = true
        this.event.mouseup = () => {
            if (this.bgm.paused) {
                this.play()
            } else {
                this.pause()
            }
        }
    }
    play() {
        this.bgm.play()
        this.sprite = Sprites.ui.bgm.play
    }
    pause() {
        this.bgm.pause()
        this.sprite = Sprites.ui.bgm.pause
    }
}

export const bgmButton = new BGMButton()

export const homeButton = new UIButton(Sprites.ui.homeButton,new Rect(0,0,...bgmButton.rect.size),() => {window.location.href = "https://app.lumi.education/run/pfNGU3"})
homeButton.rect.midtop = [bgmButton.rect.centerx,bgmButton.rect.bottom + 20]
