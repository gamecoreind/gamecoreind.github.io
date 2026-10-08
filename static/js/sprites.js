import { loadImage } from "./engine/surface.js"
import { imagePath } from "./path.js"

const [
    bg__start,
    bg__leaf,
    bg__kitchen,
    bg__tableCloth,

    bg__baking__oven_1,
    bg__baking__oven_2,
    bg__baking__oven_3,
    bg__baking__oven_4,
    bg__baking__oven_5,
    bg__baking__ready,

    bg__doughing__bg,
    bg__doughing__table,

    ui__startButton__default,
    ui__startButton__hover,
    ui__startButton__press,

    ui__nextButton__default,
    ui__nextButton__hover,
    ui__nextButton__press,

    ui__bgm__play,
    ui__bgm__pause,

    ui__bakeButton,
    ui__back,
    ui__pointing,

    numbers__1,
    numbers__2,
    numbers__3,
    numbers__4,
    numbers__5,
    numbers__6,
    numbers__7,
    numbers__8,
    numbers__9,

    dialog__char_text,
    dialog__sign,

    item__bowl__stir_1,
    item__bowl__stir_2,
    item__bowl__stir_3,

    item__bowl__doughing_1,
    item__bowl__doughing_2,
    item__bowl__doughing_3,
    item__bowl__doughing_4,
    item__bowl__doughing_5,
    item__bowl__doughing_6,

    item__bowl__dough,

    item__mold__top__empty,
    item__mold__top__fill,
    item__mold__side,

    item__kemojo__full,
    item__kemojo__opt2,
    item__kemojo__opt4,
    item__kemojo__opt8,

    item__egg,
    item__flour,
    item__pandan,
    item__coconut__milk,
    item__sugar,
    item__wisk,

    ui__homeButton
] = await Promise.all([
    loadImage(imagePath("bg/start.png")),
    loadImage(imagePath("bg/leaf.png")),
    loadImage(imagePath("bg/kitchen.png")),
    loadImage(imagePath("bg/tablecloth.png")),
    loadImage(imagePath(`bg/baking/oven_0.png`)),
    loadImage(imagePath(`bg/baking/oven_1.png`)),
    loadImage(imagePath(`bg/baking/oven_2.png`)),
    loadImage(imagePath(`bg/baking/oven_3.png`)),
    loadImage(imagePath(`bg/baking/oven_4.png`)),
    loadImage(imagePath(`bg/baking/ready.png`)),
    loadImage(imagePath(`bg/doughing/bg.png`)),
    loadImage(imagePath(`bg/doughing/table.png`)),

    loadImage(imagePath("ui/start/default.png")),
    loadImage(imagePath("ui/start/hover.png")),
    loadImage(imagePath("ui/start/press.png")),
    loadImage(imagePath("ui/next/default.png")),
    loadImage(imagePath("ui/next/hover.png")),
    loadImage(imagePath("ui/next/press.png")),
    loadImage(imagePath("ui/bgm/play.png")),
    loadImage(imagePath("ui/bgm/pause.png")),
    loadImage(imagePath("ui/bake.png")),
    loadImage(imagePath("ui/back.png")),
    loadImage(imagePath("ui/pointing.png")),

    loadImage(imagePath('numbers/1.png')),
    loadImage(imagePath('numbers/2.png')),
    loadImage(imagePath('numbers/3.png')),
    loadImage(imagePath('numbers/4.png')),
    loadImage(imagePath('numbers/5.png')),
    loadImage(imagePath('numbers/6.png')),
    loadImage(imagePath('numbers/7.png')),
    loadImage(imagePath('numbers/8.png')),
    loadImage(imagePath('numbers/9.png')),

    loadImage(imagePath("dialog/char_text.png")),
    loadImage(imagePath("dialog/sign.png")),

    // items
    loadImage(imagePath(`item/bowl/stir/1.png`)),
    loadImage(imagePath(`item/bowl/stir/2.png`)),
    loadImage(imagePath(`item/bowl/stir/3.png`)),
    loadImage(imagePath(`item/bowl/1.png`)),
    loadImage(imagePath(`item/bowl/2.png`)),
    loadImage(imagePath(`item/bowl/3.png`)),
    loadImage(imagePath(`item/bowl/4.png`)),
    loadImage(imagePath(`item/bowl/5.png`)),
    loadImage(imagePath(`item/bowl/6.png`)),
    loadImage(imagePath(`item/bowl/dough.png`)),
    
    loadImage(imagePath(`item/mold/1.png`)),
    loadImage(imagePath(`item/mold/2.png`)),
    loadImage(imagePath(`item/mold/side.png`)),

    loadImage(imagePath(`item/kemojo/full.png`)),
    loadImage(imagePath(`item/kemojo/2.png`)),
    loadImage(imagePath(`item/kemojo/4.png`)),
    loadImage(imagePath(`item/kemojo/8.png`)),

    loadImage(imagePath(`item/egg.png`)),
    loadImage(imagePath(`item/flour.png`)),
    loadImage(imagePath(`item/pandan.png`)),
    loadImage(imagePath(`item/coconut_milk.png`)),
    loadImage(imagePath(`item/sugar.png`)),
    loadImage(imagePath(`item/wisk.png`)),
    loadImage(imagePath(`ui/home.png`)),
])

export const Sprites = {
    bg:{
        start: bg__start,
        leaf: bg__leaf,
        kitchen: bg__kitchen,
        tablecloth: bg__tableCloth,
        baking: {
            oven : [
                bg__baking__oven_1,
                bg__baking__oven_2,
                bg__baking__oven_3,
                bg__baking__oven_4,
                bg__baking__oven_5
            ],
            ready :bg__baking__ready
        },
        doughing: {
            bg:bg__doughing__bg,
            table:bg__doughing__table,
        }
    },
    ui:{
        startButton: {
            default: ui__startButton__default,
            hover: ui__startButton__hover,
            press: ui__startButton__press,
        },
        nextButton: {
            default:ui__nextButton__default,
            hover: ui__nextButton__hover,
            press: ui__nextButton__press,
        },
        bgm:{
            play: ui__bgm__play,
            pause: ui__bgm__pause
        },
        bakeButton: ui__bakeButton,
        back : ui__back,
        pointing : ui__pointing,
        homeButton :ui__homeButton,
    },
    numbers:{
        1:numbers__1,
        2:numbers__2,
        3:numbers__3,
        4:numbers__4,
        5:numbers__5,
        6:numbers__6,
        7:numbers__7,
        8:numbers__8,
        9:numbers__9,
    },
    dialog:{
        char_text: dialog__char_text,
        sign : dialog__sign,
    },
    item:{
        bowl:{
            stir:[
                item__bowl__stir_1,
                item__bowl__stir_2,
                item__bowl__stir_3,
            ],
            doughing:[
                item__bowl__doughing_1,
                item__bowl__doughing_2,
                item__bowl__doughing_3,
                item__bowl__doughing_4,
                item__bowl__doughing_5,
                item__bowl__doughing_6,
            ],
            dough:item__bowl__dough
        },
        mold:{
            top:{
                empty:item__mold__top__empty,
                fill:item__mold__top__fill,
            },
            side:item__mold__side,
        },
        kemojo:{
            full:item__kemojo__full,
            opt_2:item__kemojo__opt2,
            opt_4:item__kemojo__opt4,
            opt_8:item__kemojo__opt8,
        },
        egg:item__egg,
        flour:item__flour,
        pandan:item__pandan,
        coconut_milk:item__coconut__milk,
        sugar:item__sugar,
        wisk:item__wisk,
    }
}