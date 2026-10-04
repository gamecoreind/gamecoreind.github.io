
export const audio = {
    transition : new Audio("/static/res/sfx/transition.mp3"),
    correct : new Audio("/static/res/sfx/correct.mp3"),
    wrong : new Audio("/static/res/sfx/wrong.mp3"),
    ovenReady : new Audio("/static/res/sfx/ovenReady.mp3"),
    ovenClick : new Audio("/static/res/sfx/ovenClick.mp3"),
    ovenStart : new Audio("/static/res/sfx/ovenStart.mp3"),
    correctItem : new Audio("/static/res/sfx/correctItem.mp3"),
    dialogueButton : new Audio("/static/res/sfx/dialogueButton.mp3"),
    tada : new Audio("/static/res/sfx/tada.mp3"),
}

const dialogPath = "/static/res/dialog"
export const dialogVoice = {
    opening : [
        new Audio(`${dialogPath}/opening/v0.mp3`),
        new Audio(`${dialogPath}/opening/v1.mp3`),
        new Audio(`${dialogPath}/opening/v2.mp3`)
    ],
    dough : [
        new Audio(`${dialogPath}/dough/v0.mp3`),
        new Audio(`${dialogPath}/dough/v1.mp3`),
        new Audio(`${dialogPath}/dough/v2.mp3`),
        new Audio(`${dialogPath}/dough/v3.mp3`),
        new Audio(`${dialogPath}/dough/v4.mp3`),
        new Audio(`${dialogPath}/dough/v5_stir.mp3`),
        new Audio(`${dialogPath}/dough/v6_next.mp3`),
    ],
    mold:[
        new Audio(`${dialogPath}/mold/v0.mp3`),
        new Audio(`${dialogPath}/mold/v1.mp3`),
    ],
    bake:{
        open_oven:new Audio(`${dialogPath}/bake/open_oven.mp3`),
        put_dough:new Audio(`${dialogPath}/bake/put_dough.mp3`),
        close_oven:new Audio(`${dialogPath}/bake/close_oven.mp3`),
        lets_bake:new Audio(`${dialogPath}/bake/lets_bake.mp3`),
        lets_cut:new Audio(`${dialogPath}/bake/lets_cut.mp3`),
    },
    cut:[
        new Audio(`${dialogPath}/cut/cut_2.mp3`),
        new Audio(`${dialogPath}/cut/cut_4.mp3`),
        new Audio(`${dialogPath}/cut/cut_8.mp3`),
        new Audio(`${dialogPath}/cut/finish.mp3`),
        new Audio(`${dialogPath}/cut/false.aac`),
    ],
    ending:[
        new Audio(`${dialogPath}/ending/v0.aac`),
        new Audio(`${dialogPath}/ending/v1.aac`),
    ]
}

export function playOverlap(audio) {
    audio.cloneNode(true).play()
}

let dialogVoiceSet = null
export function playDialogVoice(sceneKeyDialog,index) {
    if (dialogVoiceSet instanceof Audio) {
        dialogVoiceSet.currentTime = 0;
        dialogVoiceSet.pause()
    }
    dialogVoiceSet = dialogVoice[sceneKeyDialog][index]
    dialogVoiceSet.play()
}