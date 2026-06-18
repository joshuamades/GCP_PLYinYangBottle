import Phaser from "phaser";

import { Base64Manager } from "../utils/Base64Manager.js";
import { LoadBase64Audio } from "../utils/LoadBase64Audio.js";
import { adReady } from "../networkPlugin";

// Images
import { AppIconPNG } from "../../media/images_AppIcon.png.js";
import { BgVar1Var2PNG } from "../../media/images_BgVar1Var2.png.js";
import { BgVar3PNG } from "../../media/images_BgVar3.png.js";
import { BottleGlowPNG } from "../../media/images_BottleGlow.png.js";
import { BottlePNG } from "../../media/images_Bottle.png.js";
import { CapPNG } from "../../media/images_Cap.png.js";
import { CirclePNG } from "../../media/images_Circle.png.js";
import { ctaPNG } from "../../media/images_cta.png.js";
import { DownloadButtonPNG } from "../../media/images_DownloadButton.png.js";
import { logoPNG } from "../../media/images_logo.png.js";
import { Variation1TextPNG } from "../../media/images_Variation1Text.png.js";
import { YangDropletPNG } from "../../media/images_YangDroplet.png.js";
import { YangEmptyDropletPNG } from "../../media/images_YangEmptyDroplet.png.js";
import { YingDropletPNG } from "../../media/images_YingDroplet.png.js";
import { YingEmptyDropletPNG } from "../../media/images_YingEmptyDroplet.png.js";
import { YingYangBottlePNG } from "../../media/images_YingYangBottle.png.js";

// Liquid fill images
import { black1PNG } from "../../media/images_Liquids_black-1.png.js";
import { black2PNG } from "../../media/images_Liquids_black-2.png.js";
import { black3PNG } from "../../media/images_Liquids_black-3.png.js";
import { black4PNG } from "../../media/images_Liquids_black-4.png.js";
import { purple1PNG } from "../../media/images_Liquids_purple-1.png.js";
import { purple2PNG } from "../../media/images_Liquids_purple-2.png.js";
import { purple3PNG } from "../../media/images_Liquids_purple-3.png.js";
import { purple4PNG } from "../../media/images_Liquids_purple-4.png.js";
import { red1PNG } from "../../media/images_Liquids_red-1.png.js";
import { red2PNG } from "../../media/images_Liquids_red-2.png.js";
import { red3PNG } from "../../media/images_Liquids_red-3.png.js";
import { red4PNG } from "../../media/images_Liquids_red-4.png.js";
import { white1PNG } from "../../media/images_Liquids_white-1.png.js";
import { white2PNG } from "../../media/images_Liquids_white-2.png.js";
import { white3PNG } from "../../media/images_Liquids_white-3.png.js";
import { white4PNG } from "../../media/images_Liquids_white-4.png.js";
import { yellow1PNG } from "../../media/images_Liquids_yellow-1.png.js";
import { yellow2PNG } from "../../media/images_Liquids_yellow-2.png.js";
import { yellow3PNG } from "../../media/images_Liquids_yellow-3.png.js";
import { yellow4PNG } from "../../media/images_Liquids_yellow-4.png.js";

// Pouring liquid images
import { pouringBlack1PNG } from "../../media/images_Liquids_pouring-black-1.png.js";
import { pouringBlack2PNG } from "../../media/images_Liquids_pouring-black-2.png.js";
import { pouringBlack3PNG } from "../../media/images_Liquids_pouring-black-3.png.js";
import { pouringBlack4PNG } from "../../media/images_Liquids_pouring-black-4.png.js";
import { pouringPurple1PNG } from "../../media/images_Liquids_pouring-purple-1.png.js";
import { pouringPurple2PNG } from "../../media/images_Liquids_pouring-purple-2.png.js";
import { pouringPurple3PNG } from "../../media/images_Liquids_pouring-purple-3.png.js";
import { pouringPurple4PNG } from "../../media/images_Liquids_pouring-purple-4.png.js";
import { pouringRed1PNG } from "../../media/images_Liquids_pouring-red-1.png.js";
import { pouringRed2PNG } from "../../media/images_Liquids_pouring-red-2.png.js";
import { pouringRed3PNG } from "../../media/images_Liquids_pouring-red-3.png.js";
import { pouringRed4PNG } from "../../media/images_Liquids_pouring-red-4.png.js";
import { pouringWhite1PNG } from "../../media/images_Liquids_pouring-white-1.png.js";
import { pouringWhite2PNG } from "../../media/images_Liquids_pouring-white-2.png.js";
import { pouringWhite3PNG } from "../../media/images_Liquids_pouring-white-3.png.js";
import { pouringWhite4PNG } from "../../media/images_Liquids_pouring-white-4.png.js";
import { pouringYellow1PNG } from "../../media/images_Liquids_pouring-yellow-1.png.js";
import { pouringYellow2PNG } from "../../media/images_Liquids_pouring-yellow-2.png.js";
import { pouringYellow3PNG } from "../../media/images_Liquids_pouring-yellow-3.png.js";
import { pouringYellow4PNG } from "../../media/images_Liquids_pouring-yellow-4.png.js";

// Yin and yang liquid images
import { yangWhite1PNG } from "../../media/images_Liquids_yang-white-1.png.js";
import { yangWhite2PNG } from "../../media/images_Liquids_yang-white-2.png.js";
import { yangWhite3PNG } from "../../media/images_Liquids_yang-white-3.png.js";
import { yangWhite4PNG } from "../../media/images_Liquids_yang-white-4.png.js";
import { yangWhite5PNG } from "../../media/images_Liquids_yang-white-5.png.js";
import { yangWhite6PNG } from "../../media/images_Liquids_yang-white-6.png.js";
import { yangWhite7PNG } from "../../media/images_Liquids_yang-white-7.png.js";
import { yangWhite8PNG } from "../../media/images_Liquids_yang-white-8.png.js";
import { yangWhite9PNG } from "../../media/images_Liquids_yang-white-9.png.js";
import { yangWhite10PNG } from "../../media/images_Liquids_yang-white-10.png.js";
import { yangWhite11PNG } from "../../media/images_Liquids_yang-white-11.png.js";
import { yangWhite12PNG } from "../../media/images_Liquids_yang-white-12.png.js";
import { yangWhite13PNG } from "../../media/images_Liquids_yang-white-13.png.js";
import { yangWhite14PNG } from "../../media/images_Liquids_yang-white-14.png.js";
import { yangWhite15PNG } from "../../media/images_Liquids_yang-white-15.png.js";
import { yangWhite16PNG } from "../../media/images_Liquids_yang-white-16.png.js";
import { yangWhite17PNG } from "../../media/images_Liquids_yang-white-17.png.js";
import { yinBlack1PNG } from "../../media/images_Liquids_yin-black-1.png.js";
import { yinBlack2PNG } from "../../media/images_Liquids_yin-black-2.png.js";
import { yinBlack3PNG } from "../../media/images_Liquids_yin-black-3.png.js";
import { yinBlack4PNG } from "../../media/images_Liquids_yin-black-4.png.js";
import { yinBlack5PNG } from "../../media/images_Liquids_yin-black-5.png.js";
import { yinBlack6PNG } from "../../media/images_Liquids_yin-black-6.png.js";
import { yinBlack7PNG } from "../../media/images_Liquids_yin-black-7.png.js";
import { yinBlack8PNG } from "../../media/images_Liquids_yin-black-8.png.js";
import { yinBlack9PNG } from "../../media/images_Liquids_yin-black-9.png.js";
import { yinBlack10PNG } from "../../media/images_Liquids_yin-black-10.png.js";
import { yinBlack11PNG } from "../../media/images_Liquids_yin-black-11.png.js";
import { yinBlack12PNG } from "../../media/images_Liquids_yin-black-12.png.js";
import { yinBlack13PNG } from "../../media/images_Liquids_yin-black-13.png.js";
import { yinBlack14PNG } from "../../media/images_Liquids_yin-black-14.png.js";
import { yinBlack15PNG } from "../../media/images_Liquids_yin-black-15.png.js";
import { yinBlack16PNG } from "../../media/images_Liquids_yin-black-16.png.js";
import { yinBlack17PNG } from "../../media/images_Liquids_yin-black-17.png.js";

// SFX
import { CompleteMP3 } from "../../media/audio_Complete.mp3.js";
import { MusicMP3 } from "../../media/audio_Music.mp3.js";
import { PourMP3 } from "../../media/audio_Pour.mp3.js";
import { SelectMP3 } from "../../media/audio_Select.mp3.js";
import { ShakeMP3 } from "../../media/audio_Shake.mp3.js";

const LIQUID_FILL_IMAGES = [
  { key: "liquid-black-1", data: black1PNG },
  { key: "liquid-black-2", data: black2PNG },
  { key: "liquid-black-3", data: black3PNG },
  { key: "liquid-black-4", data: black4PNG },
  { key: "liquid-purple-1", data: purple1PNG },
  { key: "liquid-purple-2", data: purple2PNG },
  { key: "liquid-purple-3", data: purple3PNG },
  { key: "liquid-purple-4", data: purple4PNG },
  { key: "liquid-red-1", data: red1PNG },
  { key: "liquid-red-2", data: red2PNG },
  { key: "liquid-red-3", data: red3PNG },
  { key: "liquid-red-4", data: red4PNG },
  { key: "liquid-white-1", data: white1PNG },
  { key: "liquid-white-2", data: white2PNG },
  { key: "liquid-white-3", data: white3PNG },
  { key: "liquid-white-4", data: white4PNG },
  { key: "liquid-yellow-1", data: yellow1PNG },
  { key: "liquid-yellow-2", data: yellow2PNG },
  { key: "liquid-yellow-3", data: yellow3PNG },
  { key: "liquid-yellow-4", data: yellow4PNG },
];

const POURING_LIQUID_IMAGES = [
  { key: "liquid-pouring-black-1", data: pouringBlack1PNG },
  { key: "liquid-pouring-black-2", data: pouringBlack2PNG },
  { key: "liquid-pouring-black-3", data: pouringBlack3PNG },
  { key: "liquid-pouring-black-4", data: pouringBlack4PNG },
  { key: "liquid-pouring-purple-1", data: pouringPurple1PNG },
  { key: "liquid-pouring-purple-2", data: pouringPurple2PNG },
  { key: "liquid-pouring-purple-3", data: pouringPurple3PNG },
  { key: "liquid-pouring-purple-4", data: pouringPurple4PNG },
  { key: "liquid-pouring-red-1", data: pouringRed1PNG },
  { key: "liquid-pouring-red-2", data: pouringRed2PNG },
  { key: "liquid-pouring-red-3", data: pouringRed3PNG },
  { key: "liquid-pouring-red-4", data: pouringRed4PNG },
  { key: "liquid-pouring-white-1", data: pouringWhite1PNG },
  { key: "liquid-pouring-white-2", data: pouringWhite2PNG },
  { key: "liquid-pouring-white-3", data: pouringWhite3PNG },
  { key: "liquid-pouring-white-4", data: pouringWhite4PNG },
  { key: "liquid-pouring-yellow-1", data: pouringYellow1PNG },
  { key: "liquid-pouring-yellow-2", data: pouringYellow2PNG },
  { key: "liquid-pouring-yellow-3", data: pouringYellow3PNG },
  { key: "liquid-pouring-yellow-4", data: pouringYellow4PNG },
];

const YIN_YANG_LIQUID_IMAGES = [
  { key: "liquid-yang-white-1", data: yangWhite1PNG },
  { key: "liquid-yang-white-2", data: yangWhite2PNG },
  { key: "liquid-yang-white-3", data: yangWhite3PNG },
  { key: "liquid-yang-white-4", data: yangWhite4PNG },
  { key: "liquid-yang-white-5", data: yangWhite5PNG },
  { key: "liquid-yang-white-6", data: yangWhite6PNG },
  { key: "liquid-yang-white-7", data: yangWhite7PNG },
  { key: "liquid-yang-white-8", data: yangWhite8PNG },
  { key: "liquid-yang-white-9", data: yangWhite9PNG },
  { key: "liquid-yang-white-10", data: yangWhite10PNG },
  { key: "liquid-yang-white-11", data: yangWhite11PNG },
  { key: "liquid-yang-white-12", data: yangWhite12PNG },
  { key: "liquid-yang-white-13", data: yangWhite13PNG },
  { key: "liquid-yang-white-14", data: yangWhite14PNG },
  { key: "liquid-yang-white-15", data: yangWhite15PNG },
  { key: "liquid-yang-white-16", data: yangWhite16PNG },
  { key: "liquid-yang-white-17", data: yangWhite17PNG },
  { key: "liquid-yin-black-1", data: yinBlack1PNG },
  { key: "liquid-yin-black-2", data: yinBlack2PNG },
  { key: "liquid-yin-black-3", data: yinBlack3PNG },
  { key: "liquid-yin-black-4", data: yinBlack4PNG },
  { key: "liquid-yin-black-5", data: yinBlack5PNG },
  { key: "liquid-yin-black-6", data: yinBlack6PNG },
  { key: "liquid-yin-black-7", data: yinBlack7PNG },
  { key: "liquid-yin-black-8", data: yinBlack8PNG },
  { key: "liquid-yin-black-9", data: yinBlack9PNG },
  { key: "liquid-yin-black-10", data: yinBlack10PNG },
  { key: "liquid-yin-black-11", data: yinBlack11PNG },
  { key: "liquid-yin-black-12", data: yinBlack12PNG },
  { key: "liquid-yin-black-13", data: yinBlack13PNG },
  { key: "liquid-yin-black-14", data: yinBlack14PNG },
  { key: "liquid-yin-black-15", data: yinBlack15PNG },
  { key: "liquid-yin-black-16", data: yinBlack16PNG },
  { key: "liquid-yin-black-17", data: yinBlack17PNG },
];

export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  init() {
    console.log("%cSCENE::Preloader", "color: #fff; background: #f00;");
  }

  preload() {
    //  Invoke the Base64Manager - pass in the current scene reference and a callback to invoke when it's done
    Base64Manager(this, () => this.base64LoaderComplete());

    //  Images load normally as base64 encoded strings
    this.load.image("logo", logoPNG);
    this.load.image("cta", ctaPNG);
    this.load.image("downloadButton", DownloadButtonPNG);
    this.load.image("bgLandscape", BgVar1Var2PNG);
    this.load.image("gemsCollection", YingYangBottlePNG);
    this.load.image("bottleGlow", BottleGlowPNG);
    this.load.image("bottleCap", CapPNG);
    this.load.image("yangDroplet", YangDropletPNG);
    this.load.image("yangEmptyDroplet", YangEmptyDropletPNG);
    this.load.image("yingDroplet", YingDropletPNG);
    this.load.image("yingEmptyDroplet", YingEmptyDropletPNG);
    this.load.image("topTextEndcard", Variation1TextPNG);
    this.load.image("slide1", AppIconPNG);
    this.load.image("slide2", BottlePNG);
    this.load.image("slide3", CirclePNG);
    this.load.image("circle", CirclePNG);
    this.load.image("slide4", BgVar3PNG);

    // Liquid fill images
    LIQUID_FILL_IMAGES.forEach(({ key, data }) => {
      this.load.image(key, data);
    });

    // Pouring liquid images
    POURING_LIQUID_IMAGES.forEach(({ key, data }) => {
      this.load.image(key, data);
    });

    // Yin and yang liquid images
    YIN_YANG_LIQUID_IMAGES.forEach(({ key, data }) => {
      this.load.image(key, data);
    });

    // Sfx
    LoadBase64Audio(this, [
      { key: "switch", data: SelectMP3 },
      { key: "bgm", data: MusicMP3 },
      { key: "endcard", data: CompleteMP3 },
      { key: "switchCombo1", data: PourMP3 },
      { key: "switchCombo2", data: ShakeMP3 },
      { key: "switchCombo3", data: SelectMP3 },
    ]);
  }

  create() {
    //  This may run before the Loader has completed, so don't use in-flight assets here
  }

  base64LoaderComplete() {
    adReady();

    this.scene.start("Game");
  }
}
