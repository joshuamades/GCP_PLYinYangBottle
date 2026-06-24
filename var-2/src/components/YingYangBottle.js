import Phaser from "phaser";

import { LiquidStack } from "./LiquidStack.js";

const YIN_YANG_MAX_FILL_STAGE = 17;
const DEBUG_ONE_POUR_TO_STAGE_17 = false;
const DEBUG_END_SCENE_AFTER_ONE_POUR = false;
const END_SCENE_AFTER_INTERACTION_LIMIT = 5;
const END_SCENE_AFTER_ONE_POUR_DELAY = 250;
const YIN_YANG_LIQUID_SCALE = 1;
const YIN_YANG_STAGE_17_LIQUID_SCALE = 1;
const YIN_YANG_STAGE_17_OFFSET_X = 0;
const YIN_YANG_STAGE_17_OFFSET_Y = 0;
const YIN_YANG_INITIAL_WHITE_STAGE = 3;
const YIN_YANG_INITIAL_BLACK_STAGE = 3;
const YIN_YANG_LEFT_DROPLET_START_STAGE = 4;
const YIN_YANG_LEFT_DROPLET_COVERED_STAGE = 6;
const YIN_YANG_RIGHT_DROPLET_START_STAGE = 11;
const YIN_YANG_RIGHT_DROPLET_COVERED_STAGE = 14;
const DROPLET_FILL_ANIMATION_DURATION = 1000;
const HOLD_POURING_POSE_FOR_TUNING = false;
const POUR_TILT_ANGLE = 110;
const POUR_TILT_BY_STAGE = {
  1: 132,
  2: 122,
  3: 114,
  4: 106,
};
const POUR_STREAM_REFERENCE_STAGE = 3;
const POUR_STREAM_DURATION = 1800;
const BOTTLE_TO_BOTTLE_MOVE_DURATION = 240;
const BOTTLE_TO_BOTTLE_RETURN_DURATION = 240;
const POUR_STREAM_PROGRESS_BOOST = 0.14;
const YIN_YANG_STREAM_PROGRESS_BOOST = 0.45;
const POUR_STREAM_VERTICAL_BEND = 0.08;
const POUR_STREAM_WOBBLE_AMOUNT = 0.04;
const YIN_YANG_STREAM_EXTRA_LENGTH = 0.08;
const BOTTLE_STREAM_EXTRA_LENGTH = 0.08;
const REFERENCE_CENTER_STREAM_HEIGHT = 687;
const CENTER_LIQUID_ANIMATION_DELAY = 50;
const CENTER_LIQUID_WAVE_SPEED = 0.004;
const CENTER_LIQUID_SWAY_Y = 0.004;
const CENTER_LIQUID_HEIGHT_PULSE = 0.006;
const CENTER_LIQUID_ALPHA_PULSE = 0.05;
const CENTER_LIQUID_POUR_WAVE_MULTIPLIER = 3.2;
const CENTER_LIQUID_POUR_WAVE_SPEED_MULTIPLIER = 1.65;
const CENTER_LIQUID_POUR_WAVE_X = 0.006;
const CENTER_LIQUID_POUR_WAVE_ANGLE = 1.6;
const CENTER_LIQUID_REVEAL_DURATION = 2200;
const CENTER_LIQUID_REVEAL_RISE = 0.025;
const CENTER_LIQUID_REVEAL_START_DELAY = 0;
const CENTER_LIQUID_REVEAL_HOLD_PROGRESS = 0;
const CENTER_LIQUID_REVEAL_CROP_OVERLAP = 28;
const CENTER_LIQUID_REVEAL_CROP_OVERLAP_BELOW = 52;
const CENTER_LIQUID_REVEAL_MIN_OVERLAP = 18;
const CENTER_LIQUID_REVEAL_MIN_OVERLAP_BELOW = 24;
const CENTER_LIQUID_STAGE_TOP_Y = {
  white: {
    1: 667, 2: 633, 3: 598, 4: 562, 5: 527, 6: 493, 7: 459, 8: 425,
    9: 387, 10: 354, 11: 320, 12: 286, 13: 252, 14: 218, 15: 185, 16: 152,
    17: 121,
  },
  black: {
    1: 665, 2: 631, 3: 597, 4: 562, 5: 528, 6: 494, 7: 460, 8: 425,
    9: 390, 10: 357, 11: 322, 12: 288, 13: 254, 14: 220, 15: 186, 16: 153,
    17: 121,
  },
};
const CENTER_LIQUID_IDLE_STOP_DELAY = 2000;
const IDLE_BOTTLE_LIQUID_DEPTH = -3;
const IDLE_BOTTLE_DEPTH = -2;
const IDLE_BOTTLE_CAP_DEPTH = -1;
const BOTTLE_GLOW_DEPTH = 2;
const BOTTLE_GLOW_WIDTH_SCALE = 1.04;
const BOTTLE_GLOW_HEIGHT_SCALE = 1.02;
const CENTER_LIQUID_DEPTH = 10;
const CENTER_BOTTLE_DEPTH = 11;
const CENTER_DROPLET_DEPTH = 12;
const CENTER_CAP_DEPTH = 13;
const POURING_BOTTLE_LIQUID_DEPTH = 18;
const POURING_BOTTLE_GLOW_DEPTH = 19;
const POURING_BOTTLE_DEPTH = 20;
const POURING_BOTTLE_CAP_DEPTH = 21;
const RECEIVING_BOTTLE_LIQUID_DEPTH = 14;
const RECEIVING_BOTTLE_DEPTH = 15;
const RECEIVING_BOTTLE_CAP_DEPTH = 16;
const CENTER_LIQUID_REVEAL_DEPTH = CENTER_LIQUID_DEPTH + 0.75;
const HAND_GUIDE_DEPTH = 40;
const HAND_GUIDE_SCALE = 1;
const HAND_GUIDE_TARGET_OFFSET_X = 0.08;
const HAND_GUIDE_TARGET_OFFSET_Y = -0.08;
const HAND_GUIDE_BOTTLE_OFFSET_X = 0.16;
const HAND_GUIDE_BOTTLE_OFFSET_Y = -0.14;
const HAND_GUIDE_IDLE_DELAY = 2000;
const HAND_GUIDE_MOVE_DURATION = 520;
const HAND_GUIDE_LOOP_DELAY = 420;
const POURING_STREAM_DEPTH = 0;
const POURING_BOTTLE_START_OFFSET_X = 0;
const POURING_BOTTLE_START_OFFSET_Y = 0.32;
const POURING_BOTTLE_STAGE_EDGE_OFFSET_X = 0.24;
const POURING_BOTTLE_INTERNAL_EDGE_OFFSET_X = 0.2;
const POURING_BOTTLE_INTERNAL_EDGE_OFFSET_Y = -0.22;
const POUR_STREAM_VISIBLE_START_FROM_MOUTH = false;
const WRONG_YIN_YANG_SHAKE_DISTANCE = 0.045;
const WRONG_YIN_YANG_SHAKE_REPEATS = 5;
const YIN_YANG_BUBBLE_TEXTURE = "circle";
const YIN_YANG_BUBBLE_DEPTH = 12.5;
const YIN_YANG_BUBBLE_START_DELAY = 1500;
const YIN_YANG_BUBBLE_INTERVAL = 90;
const YIN_YANG_BUBBLE_RISE = 0.1;
const YIN_YANG_BUBBLE_STAGE_OFFSET_Y = -0.09;
const YIN_YANG_BUBBLE_SPREAD_X = 0.075;
const YIN_YANG_BUBBLE_SPREAD_Y = 0.055;
const YIN_YANG_BUBBLE_MIN_SIZE = 0.012;
const YIN_YANG_BUBBLE_MAX_SIZE = 0.024;
const YIN_YANG_CAP_LEFT_OFFSET_X = -0.1;
const YIN_YANG_CAP_RIGHT_OFFSET_X = 0.1;
const YIN_YANG_CAP_OFFSET_Y = -0.44;
const YIN_YANG_CAP_WIDTH = 0.15;
const YIN_YANG_CAP_HEIGHT = 0.105;
const SHOW_YIN_YANG_CAPS_FOR_TUNING = false;
const YIN_YANG_CAP_SPIN_DEGREES = 360;
const YIN_YANG_CAP_SPIN_DURATION = 420;
const END_SCENE_DELAY = YIN_YANG_CAP_SPIN_DURATION + 250;
const BOTTLE_CAP_DROP_OFFSET_Y = -0.34;
const BOTTLE_CAP_SPIN_DEGREES = 220;
const BOTTLE_CAP_DROP_DURATION = 360;
const BOTTLE_CAP_SETTLE_DURATION = 130;
const POUR_MOUTH_OFFSET_X = 0;
const POUR_MOUTH_OFFSET_Y = -0.5;
const POUR_MOUTH_GRAVITY_DROP = 0.035;
const YIN_YANG_POUR_ENTRY_OFFSET_X = 0.1;
const YIN_YANG_POUR_ENTRY_OFFSET_Y = -0.39;
const SFX_SELECT_KEY = "switch";
const SFX_POUR_KEY = "switchCombo1";
const SFX_POUR_DELAY = 500;
const SFX_WRONG_KEY = "switchCombo2";
const SFX_COMPLETE_KEY = "endcard";
const FILLER_COLORS = ["purple", "red", "yellow"];

function createSurroundingBottleContents() {
  return [
    ["red", "white", "white", "yellow"],
    ["purple", "white", "white", "white"],
    ["yellow", "white", "white", "red"],
    ["red", "white", "white", "white"],
    ["yellow", "white", "white", "purple"],
    ["purple", "black", "black", "red"],
    ["yellow", "black", "black", "black"],
    ["purple", "black", "black", "yellow"],
    ["red", "black", "black", "black"],
    ["yellow", "black", "black", "purple"],
    ["white", "white"],
    ["black", "black"],
    ["red"],
    ["yellow"],
    ["purple"],
    createFillerLayers(2),
  ];
}

function createFillerLayers(count) {
  const layers = [];
  for (let index = 0; index < count; index += 1) {
    layers.push(createFillerColor(layers[index - 1]));
  }
  return layers;
}

function createFillerColor(previousColor = null) {
  const options = previousColor
    ? FILLER_COLORS.filter((color) => color !== previousColor)
    : FILLER_COLORS;
  const index = Phaser.Math.Between(0, options.length - 1);
  return options[index];
}

export class YingYangBottle {
  constructor(scene, textureKey = "gemsCollection") {
    this.scene = scene;
    this.textureKey = textureKey;
    this.image = null;
    this.centerWhiteLiquid = null;
    this.centerBlackLiquid = null;
    this.centerWhiteLiquidReveal = null;
    this.centerBlackLiquidReveal = null;
    this.centerCaps = { white: null, black: null };
    this.sealedYinYangSides = { white: false, black: false };
    this.yinYangStacks = null;
    this.surroundingBottles = [];
    this.surroundingBottleLiquids = [];
    this.bottleCaps = [];
    this.sealedBottleIndexes = new Set();
    this.selectedSourceStack = null;
    this.selectedBottle = null;
    this.selectedBottleBaseX = 0;
    this.selectedBottleBaseY = 0;
    this.selectedBottleTween = null;
    this.bottleGlow = null;
    this.handGuide = null;
    this.handGuideTween = null;
    this.handGuideTapEvent = null;
    this.handGuideIdleEvent = null;
    this.pouringLine = null;
    this.pouringTween = null;
    this.pourSfxDelayEvent = null;
    this.activePourSfx = null;
    this.endSceneEvent = null;
    this.hasShownEndScene = false;
    this.completedInteractionCount = 0;
    this.isPouring = false;
    this.topDroplet = null;
    this.topDropletFill = null;
    this.bottomDroplet = null;
    this.bottomDropletFill = null;
    this.dropletFillPercent = { top: 0, bottom: 0 };
    this.dropletFillTarget = { top: null, bottom: null };
    this.dropletFillTweens = { top: null, bottom: null };
    this.viewportLayoutTimeout = null;
    this.centerLiquidAnimationEvent = null;
    this.centerLiquidIdleEvent = null;
    this.isCenterLiquidAnimationPaused = false;
    this.centerLiquidReveal = { white: 1, black: 1 };
    this.centerLiquidRevealStart = { white: 0, black: 0 };
    this.centerLiquidRevealProgress = { white: 1, black: 1 };
    this.centerLiquidRevealTweens = { white: null, black: null };
    this.centerLiquidBaseStageOverride = { white: null, black: null };
    this.centerLiquidRevealStage = { white: null, black: null };
    this.centerLiquidSingleLayerReveal = { white: false, black: false };
    this.activeYinYangPourColor = null;
    this.yinYangBubbleDelayEvent = null;
    this.yinYangBubbleEvent = null;
    this.yinYangBubbles = [];

    this.handleResize = this.handleResize.bind(this);
    this.handleViewportLayoutChange = this.handleViewportLayoutChange.bind(this);
  }

  create() {
    this.image = this.scene.add.image(0, 0, this.textureKey);
    this.image.setOrigin(0.5);
    this.image.setDepth(CENTER_BOTTLE_DEPTH);
    this.centerWhiteLiquid = this.scene.add.image(0, 0, "liquid-yang-white-3");
    this.centerWhiteLiquid.setOrigin(0.5);
    this.centerWhiteLiquid.setDepth(CENTER_LIQUID_DEPTH);
    this.centerBlackLiquid = this.scene.add.image(0, 0, "liquid-yin-black-3");
    this.centerBlackLiquid.setOrigin(0.5);
    this.centerBlackLiquid.setDepth(CENTER_LIQUID_DEPTH);
    
    // Performance Refactor: Removed manual WebGL graphics overlays & masks completely
    this.centerWhiteLiquidReveal = this.scene.add.image(0, 0, "liquid-yang-white-3");
    this.centerWhiteLiquidReveal.setOrigin(0.5);
    this.centerWhiteLiquidReveal.setDepth(CENTER_LIQUID_REVEAL_DEPTH);
    this.centerWhiteLiquidReveal.setVisible(false);
    
    this.centerBlackLiquidReveal = this.scene.add.image(0, 0, "liquid-yin-black-3");
    this.centerBlackLiquidReveal.setOrigin(0.5);
    this.centerBlackLiquidReveal.setDepth(CENTER_LIQUID_REVEAL_DEPTH);
    this.centerBlackLiquidReveal.setVisible(false);
    
    this.centerCaps = {
      white: this.scene.add.image(0, 0, "bottleCap"),
      black: this.scene.add.image(0, 0, "bottleCap"),
    };
    Object.values(this.centerCaps).forEach((cap) => {
      cap.setOrigin(0.5);
      cap.setDepth(CENTER_CAP_DEPTH);
      cap.setAlpha(1);
      cap.setVisible(SHOW_YIN_YANG_CAPS_FOR_TUNING);
    });
    this.yinYangStacks = {
      white: Array.from({ length: YIN_YANG_INITIAL_WHITE_STAGE }, () => "white"),
      black: Array.from({ length: YIN_YANG_INITIAL_BLACK_STAGE }, () => "black"),
    };
    const surroundingBottleContents = createSurroundingBottleContents();

    this.surroundingBottles = Array.from({ length: 16 }, () => {
      const bottle = this.scene.add.image(0, 0, "slide2");
      bottle.setOrigin(0.5);
      bottle.setDepth(IDLE_BOTTLE_DEPTH);
      bottle.setInteractive({ useHandCursor: true });
      return bottle;
    });
    this.surroundingBottleLiquids = this.surroundingBottles.map(
      (bottle, index) => {
        const liquidStack = new LiquidStack(this.scene, bottle, {
          depth: IDLE_BOTTLE_LIQUID_DEPTH,
          liquidWidth: 68,
          liquidHeight: 130,
        });

        liquidStack.setContents(surroundingBottleContents[index]);
        return liquidStack;
      },
    );
    this.bottleCaps = this.surroundingBottles.map(() => {
      const cap = this.scene.add.image(0, 0, "bottleCap");
      cap.setOrigin(0.5);
      cap.setDepth(IDLE_BOTTLE_CAP_DEPTH);
      cap.setVisible(false);
      return cap;
    });
    this.bottleGlow = this.scene.add.image(0, 0, "bottleGlow");
    this.bottleGlow.setOrigin(0.5);
    this.bottleGlow.setDepth(BOTTLE_GLOW_DEPTH);
    this.bottleGlow.setVisible(false);
    this.handGuide = this.scene.add.image(0, 0, "hand");
    this.handGuide.setOrigin(0.2, 0.2);
    this.handGuide.setDepth(HAND_GUIDE_DEPTH);
    this.handGuide.setVisible(false);
    
    this.topDroplet = this.scene.add.image(0, 0, "yangEmptyDroplet");
    this.topDroplet.setOrigin(0.5);
    this.topDroplet.setDepth(CENTER_DROPLET_DEPTH);
    this.topDropletFill = this.scene.add.image(0, 0, "yangDroplet");
    this.topDropletFill.setOrigin(0.5);
    this.topDropletFill.setDepth(CENTER_DROPLET_DEPTH + 0.1);
    
    this.bottomDroplet = this.scene.add.image(0, 0, "yingEmptyDroplet");
    this.bottomDroplet.setOrigin(0.5);
    this.bottomDroplet.setDepth(CENTER_DROPLET_DEPTH);
    this.bottomDropletFill = this.scene.add.image(0, 0, "yingDroplet");
    this.bottomDropletFill.setOrigin(0.5);
    this.bottomDropletFill.setDepth(CENTER_DROPLET_DEPTH + 0.1);
    
    this.pouringLine = this.scene.add.graphics();
    this.pouringLine.setDepth(POURING_STREAM_DEPTH);

    this.createCenterLiquidAnimation();
    this.image.setInteractive({ useHandCursor: true });
    this.bindInput();

    window.addEventListener("resize", this.handleViewportLayoutChange);
    window.addEventListener("orientationchange", this.handleViewportLayoutChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        this.handleViewportLayoutChange,
      );
    }

    this.scene.scale.on("resize", this.handleResize);
    this.apply(this.scene.scale.gameSize);
    this.updateHandGuide();
    this.scheduleCenterLiquidIdleStop();
  }

  destroy() {
    this.scene.scale.off("resize", this.handleResize);
    window.removeEventListener("resize", this.handleViewportLayoutChange);
    window.removeEventListener(
      "orientationchange",
      this.handleViewportLayoutChange,
    );
    if (window.visualViewport) {
      window.visualViewport.removeEventListener(
        "resize",
        this.handleViewportLayoutChange,
      );
    }

    if (this.viewportLayoutTimeout) {
      window.clearTimeout(this.viewportLayoutTimeout);
      this.viewportLayoutTimeout = null;
    }
    this.handGuideIdleEvent?.remove(false);
    this.handGuideIdleEvent = null;

    this.clearBottleSelection();
    this.stopHandGuide();
    this.pouringTween?.stop();
    this.stopPourSfx();
    this.endSceneEvent?.remove(false);
    this.stopYinYangBubbles(true);
    this.centerLiquidRevealTweens.white?.stop();
    this.centerLiquidRevealTweens.black?.stop();
    this.image?.destroy();
    this.centerWhiteLiquid?.destroy();
    this.centerBlackLiquid?.destroy();
    this.centerWhiteLiquidReveal?.destroy();
    this.centerBlackLiquidReveal?.destroy();
    this.surroundingBottleLiquids.forEach((liquidStack) =>
      liquidStack.destroy(),
    );
    this.surroundingBottles.forEach((bottle) => bottle.destroy());
    this.bottleCaps.forEach((cap) => cap.destroy());
    this.bottleGlow?.destroy();
    this.handGuide?.destroy();
    this.pouringLine?.destroy();
    Object.values(this.centerCaps || {}).forEach((cap) => cap?.destroy());
    this.topDroplet?.destroy();
    this.topDropletFill?.destroy();
    this.bottomDroplet?.destroy();
    this.bottomDropletFill?.destroy();
    this.dropletFillTweens.top?.stop();
    this.dropletFillTweens.bottom?.stop();
    this.centerLiquidAnimationEvent?.remove(false);
    this.centerLiquidIdleEvent?.remove(false);
    this.image = null;
    this.centerWhiteLiquid = null;
    this.centerBlackLiquid = null;
    this.centerWhiteLiquidReveal = null;
    this.centerBlackLiquidReveal = null;
    this.centerCaps = { white: null, black: null };
    this.sealedYinYangSides = { white: false, black: false };
    this.yinYangStacks = null;
    this.surroundingBottles = [];
    this.surroundingBottleLiquids = [];
    this.bottleCaps = [];
    this.sealedBottleIndexes.clear();
    this.selectedSourceStack = null;
    this.selectedBottle = null;
    this.selectedBottleBaseX = 0;
    this.selectedBottleBaseY = 0;
    this.selectedBottleTween = null;
    this.bottleGlow = null;
    this.handGuide = null;
    this.handGuideTween = null;
    this.handGuideTapEvent = null;
    this.handGuideIdleEvent = null;
    this.pouringLine = null;
    this.pouringTween = null;
    this.pourSfxDelayEvent = null;
    this.activePourSfx = null;
    this.endSceneEvent = null;
    this.hasShownEndScene = false;
    this.isPouring = false;
    this.topDroplet = null;
    this.topDropletFill = null;
    this.bottomDroplet = null;
    this.bottomDropletFill = null;
    this.dropletFillPercent = { top: 0, bottom: 0 };
    this.dropletFillTarget = { top: null, bottom: null };
    this.dropletFillTweens = { top: null, bottom: null };
    this.centerLiquidAnimationEvent = null;
    this.centerLiquidIdleEvent = null;
    this.isCenterLiquidAnimationPaused = false;
    this.centerLiquidReveal = { white: 1, black: 1 };
    this.centerLiquidRevealStart = { white: 0, black: 0 };
    this.centerLiquidRevealProgress = { white: 1, black: 1 };
    this.centerLiquidRevealTweens = { white: null, black: null };
    this.centerLiquidBaseStageOverride = { white: null, black: null };
    this.centerLiquidRevealStage = { white: null, black: null };
    this.centerLiquidSingleLayerReveal = { white: false, black: false };
    this.activeYinYangPourColor = null;
    this.yinYangBubbleDelayEvent = null;
    this.yinYangBubbleEvent = null;
    this.yinYangBubbles = [];
  }

  createCenterLiquidAnimation() {
    this.centerLiquidAnimationEvent = this.scene.time.addEvent({
      delay: CENTER_LIQUID_ANIMATION_DELAY,
      loop: true,
      callback: () => {
        if (this.isCenterLiquidAnimationPaused) {
          return;
        }

        if (!this.image || !this.centerWhiteLiquid || !this.centerBlackLiquid) {
          return;
        }

        this.applyCenterLiquidLayout(this.image.x, this.image.y);
      },
    });
  }

  resumeCenterLiquidAnimation() {
    this.centerLiquidIdleEvent?.remove(false);
    this.centerLiquidIdleEvent = null;
    this.isCenterLiquidAnimationPaused = false;
    if (this.image) {
      this.applyCenterLiquidLayout(this.image.x, this.image.y);
    }
  }

  scheduleCenterLiquidIdleStop() {
    this.centerLiquidIdleEvent?.remove(false);
    this.centerLiquidIdleEvent = null;

    if (this.isPouring) {
      return;
    }

    this.centerLiquidIdleEvent = this.scene.time.delayedCall(
      CENTER_LIQUID_IDLE_STOP_DELAY,
      () => {
        if (this.isPouring) {
          return;
        }

        this.isCenterLiquidAnimationPaused = true;
        if (this.image) {
          this.applyCenterLiquidLayout(this.image.x, this.image.y);
        }
      },
    );
  }

  handleResize(gameSize) {
    this.apply(gameSize);
  }

  handleViewportLayoutChange() {
    this.apply(this.scene.scale.gameSize);

    if (this.viewportLayoutTimeout) {
      window.clearTimeout(this.viewportLayoutTimeout);
    }

    this.viewportLayoutTimeout = window.setTimeout(() => {
      this.apply(this.scene.scale.gameSize);
      this.viewportLayoutTimeout = null;
    }, 120);
  }

  apply(gameSize) {
    if (
      !this.image ||
      !this.centerWhiteLiquid ||
      !this.centerBlackLiquid ||
      !this.topDroplet ||
      !this.topDropletFill ||
      !this.bottomDroplet ||
      !this.bottomDropletFill
    ) {
      return;
    }

    const width = Math.max(gameSize?.width || this.scene.scale.width, 1);
    const height = Math.max(gameSize?.height || this.scene.scale.height, 1);
    const targetWidth = Phaser.Math.Clamp(width * 2, 400, 720);
    const sourceWidth = Math.max(this.image.width || 1, 1);
    const baseScale = Math.max(targetWidth, 1) / sourceWidth;
    const centerX = width * 0.5;
    const centerY = height * 0.6;

    this.image.setPosition(centerX, centerY);
    this.image.setScale(baseScale);
    this.applyCenterLiquidLayout(centerX, centerY);
    this.applyCenterCapLayout();
    this.applySurroundingBottleLayout(width, height);

    this.applyDropletLayout(this.topDroplet, {
      x: centerX - this.image.displayWidth * 0.1,
      y: centerY - this.image.displayHeight * 0.14,
      targetWidth: this.image.displayWidth * 0.09,
    });
    this.applyDropletLayout(this.topDropletFill, {
      x: centerX - this.image.displayWidth * 0.1,
      y: centerY - this.image.displayHeight * 0.14,
      targetWidth: this.image.displayWidth * 0.09,
    });
    this.applyDropletLayout(this.bottomDroplet, {
      x: centerX + this.image.displayWidth * 0.1,
      y: centerY + this.image.displayHeight * 0.2,
      targetWidth: this.image.displayWidth * 0.09,
    });
    this.applyDropletLayout(this.bottomDropletFill, {
      x: centerX + this.image.displayWidth * 0.1,
      y: centerY + this.image.displayHeight * 0.2,
      targetWidth: this.image.displayWidth * 0.09,
    });
    this.updateCenterDropletTextures();
    this.updateHandGuide();
  }

  applyCenterLiquidLayout(centerX, centerY) {
    const whiteStage =
      this.centerLiquidBaseStageOverride.white ?? this.getYinYangStage("white");
    const blackStage =
      this.centerLiquidBaseStageOverride.black ?? this.getYinYangStage("black");

    this.centerWhiteLiquid.setTexture(
      `liquid-yang-white-${whiteStage}`,
    );
    this.applyCenterLiquid(
      this.centerWhiteLiquid,
      this.getCenterLiquidLayout(centerX, centerY, whiteStage),
      0,
      "white",
      1,
    );
    this.centerBlackLiquid.setTexture(
      `liquid-yin-black-${blackStage}`,
    );
    this.applyCenterLiquid(
      this.centerBlackLiquid,
      this.getCenterLiquidLayout(centerX, centerY, blackStage),
      Math.PI,
      "black",
      1,
    );
    this.applyCenterLiquidRevealOverlay("white", centerX, centerY, 0);
    this.applyCenterLiquidRevealOverlay("black", centerX, centerY, Math.PI);
  }

  getYinYangStage(color) {
    return Phaser.Math.Clamp(
      this.yinYangStacks[color].length || 1,
      1,
      YIN_YANG_MAX_FILL_STAGE,
    );
  }

  getCenterLiquidLayout(centerX, centerY, stage) {
    const isFinalStage = stage === YIN_YANG_MAX_FILL_STAGE;
    const scale = isFinalStage
      ? YIN_YANG_STAGE_17_LIQUID_SCALE
      : YIN_YANG_LIQUID_SCALE;
    const offsetX = isFinalStage
      ? this.image.displayWidth * YIN_YANG_STAGE_17_OFFSET_X
      : 0;
    const offsetY = isFinalStage
      ? this.image.displayHeight * YIN_YANG_STAGE_17_OFFSET_Y
      : 0;

    return {
      x: centerX + offsetX,
      y: centerY + offsetY,
      targetWidth: this.image.displayWidth * scale,
      targetHeight: this.image.displayHeight * scale,
    };
  }

  applyCenterLiquid(
    liquid,
    { x, y, targetWidth, targetHeight },
    phaseOffset,
    color,
    revealOverride = null,
  ) {
    const isRevealOverlay =
      liquid === this.centerWhiteLiquidReveal ||
      liquid === this.centerBlackLiquidReveal;
    const motion =
      isRevealOverlay
        ? (() => {
            return {
            x: 0,
            y: 0,
            heightScale: 1,
            alpha: 1,
            angle: 0,
            };
          })()
        : this.getCenterLiquidMotion(
            targetHeight,
            phaseOffset,
            color,
            revealOverride,
          );

    liquid.setPosition(x + motion.x, y + motion.y);
    liquid.setDisplaySize(targetWidth, targetHeight * motion.heightScale);
    liquid.setAngle(motion.angle);
    this.applyCenterLiquidRevealCrop(liquid, color, revealOverride);
    liquid.setAlpha(motion.alpha);
  }

  applyCenterLiquidRevealCrop(liquid, color, revealOverride = null) {
    const isRevealOverlay =
      liquid === this.centerWhiteLiquidReveal ||
      liquid === this.centerBlackLiquidReveal;

    if (
      !isRevealOverlay &&
      this.centerLiquidRevealStage[color] &&
      this.centerLiquidSingleLayerReveal[color]
    ) {
      const frame = liquid.frame;
      const frameWidth = frame?.realWidth || liquid.width || 1;
      const frameHeight = frame?.realHeight || liquid.height || 1;
      const cropY = this.getCenterLiquidRevealCropY(color, frameHeight);
      liquid.setCrop(0, cropY, frameWidth, frameHeight - cropY);
      return;
    }

    if (!isRevealOverlay && this.centerLiquidRevealStage[color]) {
      const frame = liquid.frame;
      const frameWidth = frame?.realWidth || liquid.width || 1;
      const frameHeight = frame?.realHeight || liquid.height || 1;
      liquid.setCrop(0, 0, frameWidth, frameHeight);
      return;
    }

    const reveal = Phaser.Math.Clamp(
      revealOverride ?? this.centerLiquidReveal[color] ?? 1,
      0,
      1,
    );
    const revealStart = Phaser.Math.Clamp(
      isRevealOverlay ? this.centerLiquidRevealStart[color] ?? 0 : 0,
      0,
      reveal,
    );
    const frame = liquid.frame;
    const frameWidth = frame?.realWidth || liquid.width || 1;
    const frameHeight = frame?.realHeight || liquid.height || 1;

    if (!isRevealOverlay && reveal >= 0.995) {
      liquid.setCrop(0, 0, frameWidth, frameHeight);
      return;
    }

    if (isRevealOverlay && this.centerLiquidRevealStage[color]) {
      const currentStage = this.centerLiquidRevealStage[color];
      const previousStage = Math.round(
        (this.centerLiquidRevealStart[color] ?? 0) * YIN_YANG_MAX_FILL_STAGE,
      );
      const previousTop = this.getCenterLiquidStageTopY(
        color,
        previousStage,
        frameHeight,
      );
      const currentTop = this.getCenterLiquidStageTopY(
        color,
        currentStage,
        frameHeight,
      );
      const endReveal = Phaser.Math.Clamp(
        currentStage / YIN_YANG_MAX_FILL_STAGE,
        revealStart,
        1,
      );
      const range = Math.max(endReveal - revealStart, 0.001);
      const progress = Phaser.Math.Clamp((reveal - revealStart) / range, 0, 1);

      if (
        previousTop !== null &&
        currentTop !== null &&
        currentStage > previousStage &&
        progress > 0.001
      ) {
        const animatedTop = Phaser.Math.Linear(previousTop, currentTop, progress);
        const topOverlap = Phaser.Math.Linear(
          CENTER_LIQUID_REVEAL_MIN_OVERLAP,
          CENTER_LIQUID_REVEAL_CROP_OVERLAP,
          progress,
        );
        const cropY = Math.max(
          animatedTop - topOverlap,
          0,
        );
        liquid.setCrop(0, cropY, frameWidth, frameHeight - cropY);
        return;
      }
    }

    const rawCropHeight = frameHeight * Math.max(reveal - revealStart, 0);
    const rawCropY = frameHeight * (1 - reveal);
    if (rawCropHeight <= 0.001) {
      liquid.setCrop(0, frameHeight, frameWidth, 0);
      return;
    }
    const overlap = isRevealOverlay ? CENTER_LIQUID_REVEAL_CROP_OVERLAP : 0;
    const overlapBelow = isRevealOverlay
      ? CENTER_LIQUID_REVEAL_CROP_OVERLAP_BELOW
      : 0;
    const cropY = Math.max(rawCropY - overlap, 0);
    const cropHeight = Math.min(
      rawCropHeight + overlap + overlapBelow,
      frameHeight - cropY,
    );
    liquid.setCrop(0, cropY, frameWidth, cropHeight);
  }

  getCenterLiquidRevealCropY(color, frameHeight) {
    const currentStage = this.centerLiquidRevealStage[color];
    const previousStage = Math.round(
      (this.centerLiquidRevealStart[color] ?? 0) * YIN_YANG_MAX_FILL_STAGE,
    );
    const previousTop = this.getCenterLiquidStageTopY(
      color,
      previousStage,
      frameHeight,
    );
    const currentTop = this.getCenterLiquidStageTopY(
      color,
      currentStage,
      frameHeight,
    );
    if (
      previousTop === null ||
      currentTop === null ||
      currentStage <= previousStage
    ) {
      return 0;
    }

    const reveal = Phaser.Math.Clamp(this.centerLiquidReveal[color] ?? 1, 0, 1);
    const revealStart = Phaser.Math.Clamp(
      this.centerLiquidRevealStart[color] ?? 0,
      0,
      reveal,
    );
    const endReveal = Phaser.Math.Clamp(
      currentStage / YIN_YANG_MAX_FILL_STAGE,
      revealStart,
      1,
    );
    const range = Math.max(endReveal - revealStart, 0.001);
    const progress = Phaser.Math.Clamp((reveal - revealStart) / range, 0, 1);
    const animatedTop = Phaser.Math.Linear(previousTop, currentTop, progress);
    const topOverlap = Phaser.Math.Linear(
      CENTER_LIQUID_REVEAL_MIN_OVERLAP,
      CENTER_LIQUID_REVEAL_CROP_OVERLAP,
      progress,
    );
    return Math.max(animatedTop - topOverlap, 0);
  }

  getCenterLiquidStageTopY(color, stage, frameHeight) {
    const sourceTop = CENTER_LIQUID_STAGE_TOP_Y[color]?.[stage];
    if (sourceTop === undefined) {
      return null;
    }
    return sourceTop * (frameHeight / 796);
  }

  applyCenterLiquidRevealOverlay(color, centerX, centerY, phaseOffset) {
    const overlay =
      color === "white" ? this.centerWhiteLiquidReveal : this.centerBlackLiquidReveal;
    const stage = this.centerLiquidRevealStage[color];

    if (!overlay || !stage || this.centerLiquidSingleLayerReveal[color]) {
      overlay?.setVisible(false);
      return;
    }

    overlay.setVisible(true);
    overlay.setDepth(CENTER_LIQUID_REVEAL_DEPTH);
    overlay.setTexture(
      color === "white"
        ? `liquid-yang-white-${stage}`
        : `liquid-yin-black-${stage}`,
    );
    
    // Performance Optimization Fix: Passing the dynamic reveal multiplier directly into the overlay mapping bounds
    this.applyCenterLiquid(
      overlay,
      this.getCenterLiquidLayout(centerX, centerY, stage),
      phaseOffset,
      color,
      this.centerLiquidReveal[color],
    );
  }

  updateCenterLiquidRevealMask(overlay, maskGraphics, color) {
    // Obsolete: Bypassed entirely to achieve zero real-time memory stutters
  }

  getCenterLiquidMotion(targetHeight, phaseOffset, color, revealOverride = null) {
    if (this.centerLiquidRevealStage[color]) {
      return {
        x: 0,
        y: 0,
        heightScale: 1,
        alpha: 1,
        angle: 0,
      };
    }

    const isPouringSide = this.activeYinYangPourColor === color;
    const waveMultiplier = 1;
    const speedMultiplier = 1;
    const phase =
      this.scene.time.now *
        CENTER_LIQUID_WAVE_SPEED *
        speedMultiplier +
      phaseOffset;
    const reveal = revealOverride ?? this.centerLiquidReveal[color] ?? 1;

    return {
      x: 0,
      y:
        Math.sin(phase) * targetHeight * CENTER_LIQUID_SWAY_Y * waveMultiplier +
        (1 - reveal) * targetHeight * CENTER_LIQUID_REVEAL_RISE,
      heightScale:
        (1 +
          Math.cos(phase * 0.9) *
            CENTER_LIQUID_HEIGHT_PULSE *
            waveMultiplier) *
        (0.96 + reveal * 0.04),
      alpha:
        (1 -
          (0.5 + Math.sin(phase * 1.15) * 0.5) *
            CENTER_LIQUID_ALPHA_PULSE),
      angle: 0,
    };
  }

  applySurroundingBottleLayout(width, height) {
    const isLandscape = width > height * 1.25;
    const portraitBottleSlots = [
      // Top row
      { x: 0.1, y: 0.30 },
      { x: 0.25, y: 0.30 },
      { x: 0.4, y: 0.30 },
      { x: 0.6, y: 0.30 },
      { x: 0.75, y: 0.30 },
      { x: 0.9, y: 0.30 },

      // Side bottles
      { x: 0.1, y: 0.48 },
      { x: 0.9, y: 0.48 },
      { x: 0.1, y: 0.68 },
      { x: 0.9, y: 0.68 },

      // Bottom row
      { x: 0.1, y: 0.88 },
      { x: 0.25, y: 0.88 },
      { x: 0.4, y: 0.88 },
      { x: 0.6, y: 0.88 },
      { x: 0.75, y: 0.88 },
      { x: 0.9, y: 0.88 },
    ];
    const landscapeBottleSlots = [
      // Top row
      { x: 0.34, y: 0.30 },
      { x: 0.41, y: 0.30 },
      { x: 0.48, y: 0.30 },
      { x: 0.56, y: 0.30 },
      { x: 0.63, y: 0.30 },
      { x: 0.70, y: 0.30 },

      // Side bottles
      { x: 0.34, y: 0.54 },
      { x: 0.70, y: 0.54 },
      { x: 0.34, y: 0.72 },
      { x: 0.70, y: 0.72 },

      // Bottom row
      { x: 0.34, y: 0.92 },
      { x: 0.41, y: 0.92 },
      { x: 0.48, y: 0.92 },
      { x: 0.56, y: 0.92 },
      { x: 0.63, y: 0.92 },
      { x: 0.70, y: 0.92 },
    ];
    const bottleSlots = isLandscape ? landscapeBottleSlots : portraitBottleSlots;
    const targetWidth = isLandscape
      ? Phaser.Math.Clamp(height * 0.2, 76, 128)
      : Phaser.Math.Clamp(width * 0.12, 80, 150);
    const layoutWidth = isLandscape ? Math.min(width, height * 1.12) : width;
    const layoutLeft = (width - layoutWidth) * 0.5;

    this.surroundingBottles.forEach((bottle, index) => {
      const slot = bottleSlots[index];
      const sourceWidth = Math.max(bottle.width || 1, 1);
      const scale = Math.max(targetWidth, 1) / sourceWidth;

      bottle.setPosition(layoutLeft + layoutWidth * slot.x, height * slot.y);
      bottle.setScale(scale);

      const liquidStack = this.surroundingBottleLiquids[index];
      if (liquidStack) {
        liquidStack.liquidWidth = bottle.displayWidth * .9;
        liquidStack.liquidHeight = bottle.displayHeight * .9;
        liquidStack.offsetY = bottle.displayHeight * .06;
        liquidStack.layout();
      }

      this.applyBottleCapLayout(index);

      if (bottle === this.selectedBottle) {
        this.selectedBottleBaseX = bottle.x;
        this.selectedBottleBaseY = bottle.y;
        this.applyBottleGlowLayout(bottle);
      }
    });
  }

  bindInput() {
    this.surroundingBottles.forEach((bottle, index) => {
      bottle.on("pointerdown", () => {
        if (this.isPouring) {
          return;
        }

        this.scheduleHandGuideAfterIdle();

        if (this.sealedBottleIndexes.has(index)) {
          return;
        }

        if (
          this.selectedBottle &&
          this.selectedBottle !== bottle &&
          this.tryPourSelectedToBottle(index)
        ) {
          return;
        }

        this.selectedSourceStack = this.surroundingBottleLiquids[index];
        this.selectBottle(bottle);
      });
    });

    this.image.on("pointerdown", (pointer) => {
      if (!this.isPouring) {
        this.scheduleHandGuideAfterIdle();
      }

      this.tryPourSelectedToYinYangBottle(
        this.getYinYangClickTargetColor(pointer),
      );
    });
  }

  getYinYangClickTargetColor(pointer) {
    const pointerX = pointer?.worldX ?? pointer?.x ?? this.image.x;

    return pointerX >= this.image.x ? "black" : "white";
  }

  getYinYangPourPose(color, pourStage = 3) {
    const sideDirection = color === "white" ? 1 : -1;
    const tiltAngle = this.getPourTiltAngle(pourStage);
    const targetEntryX =
      this.image.x +
      this.image.displayWidth *
        (color === "white"
          ? -YIN_YANG_POUR_ENTRY_OFFSET_X
          : YIN_YANG_POUR_ENTRY_OFFSET_X);

    return {
      x: targetEntryX + sideDirection * this.image.displayWidth * 0.22,
      y: this.image.y - this.image.displayHeight * 0.66,
      angle: sideDirection < 0 ? tiltAngle : -tiltAngle,
    };
  }

  getPourTiltAngle(pourStage) {
    const stage = Phaser.Math.Clamp(Math.round(pourStage || 1), 1, 4);

    return POUR_TILT_BY_STAGE[stage] ?? POUR_TILT_ANGLE;
  }

  playSfx(key, config = {}) {
    if (!this.scene?.cache?.audio?.exists(key)) {
      return null;
    }

    return this.scene.sound.play(key, config);
  }

  startDelayedPourSfx() {
    this.stopPourSfx();

    if (!this.scene?.cache?.audio?.exists(SFX_POUR_KEY)) {
      return;
    }

    this.pourSfxDelayEvent = this.scene.time.delayedCall(SFX_POUR_DELAY, () => {
      this.pourSfxDelayEvent = null;
      this.activePourSfx = this.scene.sound.add(SFX_POUR_KEY, {
        volume: 0.5,
      });
      this.activePourSfx.play();
    });
  }

  stopPourSfx() {
    if (this.pourSfxDelayEvent) {
      this.pourSfxDelayEvent.remove(false);
      this.pourSfxDelayEvent = null;
    }

    if (this.activePourSfx) {
      this.activePourSfx.stop();
      this.activePourSfx.destroy();
      this.activePourSfx = null;
    }
  }

  selectBottle(bottle) {
    this.clearBottleSelection();
    this.playSfx(SFX_SELECT_KEY, { volume: 0.55 });

    this.selectedBottle = bottle;
    this.selectedBottleBaseX = bottle.x;
    this.selectedBottleBaseY = bottle.y;
    this.applyBottleGlowLayout(bottle);
    this.bottleGlow?.setAlpha(1);
    this.bottleGlow?.setVisible(true);
  }

  clearBottleSelection({ preserveTransform = false } = {}) {
    if (this.selectedBottleTween) {
      this.selectedBottleTween.stop();
      this.selectedBottleTween.remove();
      this.selectedBottleTween = null;
    }

    if (this.selectedBottle) {
      const selectedIndex = this.surroundingBottles.indexOf(this.selectedBottle);
      if (!preserveTransform) {
        this.selectedBottle.x = this.selectedBottleBaseX || this.selectedBottle.x;
        this.selectedBottle.y = this.selectedBottleBaseY;
        this.selectedBottle.setAngle(0);
      }
      this.setBottleGroupDepth(selectedIndex, false);
      this.surroundingBottleLiquids[selectedIndex]?.layout();
      this.applyBottleCapLayout(selectedIndex);
    }

    this.bottleGlow?.setVisible(false);
    this.selectedBottle = null;
    this.selectedBottleBaseX = 0;
    this.selectedBottleBaseY = 0;
  }

  applyBottleGlowLayout(bottle) {
    if (!this.bottleGlow) {
      return;
    }

    this.bottleGlow.setPosition(bottle.x, bottle.y);
    this.bottleGlow.setAngle(bottle.angle || 0);
    this.bottleGlow.setDisplaySize(
      bottle.displayWidth * BOTTLE_GLOW_WIDTH_SCALE,
      bottle.displayHeight * BOTTLE_GLOW_HEIGHT_SCALE,
    );
  }

  applyBottleCapLayout(index) {
    const bottle = this.surroundingBottles[index];
    const cap = this.bottleCaps[index];

    if (!bottle || !cap) {
      return;
    }

    cap.setPosition(
      bottle.x,
      bottle.y - bottle.displayHeight * 0.46,
    );
    cap.setAngle(bottle.angle || 0);
    cap.setDisplaySize(
      bottle.displayWidth * 0.52,
      bottle.displayHeight * 0.18,
    );
  }

  setBottleGroupDepth(index, isPouringSource = false) {
    const bottle = this.surroundingBottles[index];
    const liquidStack = this.surroundingBottleLiquids[index];
    const cap = this.bottleCaps[index];

    if (!bottle) {
      return;
    }

    const liquidDepth = isPouringSource
      ? POURING_BOTTLE_LIQUID_DEPTH
      : IDLE_BOTTLE_LIQUID_DEPTH;
    const bottleDepth = isPouringSource
      ? POURING_BOTTLE_DEPTH
      : IDLE_BOTTLE_DEPTH;
    const capDepth = isPouringSource
      ? POURING_BOTTLE_CAP_DEPTH
      : IDLE_BOTTLE_CAP_DEPTH;

    bottle.setDepth(bottleDepth);
    cap?.setDepth(capDepth);
    if (liquidStack) {
      liquidStack.depth = liquidDepth;
      liquidStack.layers.forEach((layer) => layer.setDepth(liquidDepth));
    }

    if (bottle === this.selectedBottle) {
      this.bottleGlow?.setDepth(
        isPouringSource ? POURING_BOTTLE_GLOW_DEPTH : BOTTLE_GLOW_DEPTH,
      );
    }
  }

  setReceivingBottleDepth(index) {
    const bottle = this.surroundingBottles[index];
    const liquidStack = this.surroundingBottleLiquids[index];
    const cap = this.bottleCaps[index];

    if (!bottle) {
      return;
    }

    bottle.setDepth(RECEIVING_BOTTLE_DEPTH);
    cap?.setDepth(RECEIVING_BOTTLE_CAP_DEPTH);
    if (liquidStack) {
      liquidStack.depth = RECEIVING_BOTTLE_LIQUID_DEPTH;
      liquidStack.layers.forEach((layer) =>
        layer.setDepth(RECEIVING_BOTTLE_LIQUID_DEPTH),
      );
    }
  }

  updateHandGuide() {
    if (this.handGuideIdleEvent) {
      return;
    }

    if (!this.handGuide || this.isPouring || !this.image) {
      this.stopHandGuide();
      return;
    }

    const guideTarget = this.getNextYinYangGuideTarget();

    if (!guideTarget) {
      this.stopHandGuide();
      return;
    }

    this.playHandGuide(guideTarget);
  }

  scheduleHandGuideAfterIdle() {
    this.stopHandGuide();

    if (this.handGuideIdleEvent) {
      this.handGuideIdleEvent.remove(false);
    }

    this.handGuideIdleEvent = this.scene.time.delayedCall(
      HAND_GUIDE_IDLE_DELAY,
      () => {
        this.handGuideIdleEvent = null;
        this.updateHandGuide();
      },
    );
  }

  getNextYinYangGuideTarget() {
    for (let index = 0; index < this.surroundingBottleLiquids.length; index += 1) {
      if (this.sealedBottleIndexes.has(index)) {
        continue;
      }

      const liquidStack = this.surroundingBottleLiquids[index];
      const color = liquidStack?.getTopColor();

      if (
        (color === "white" || color === "black") &&
        this.yinYangStacks[color]?.length < YIN_YANG_MAX_FILL_STAGE
      ) {
        return {
          bottle: this.surroundingBottles[index],
          color,
        };
      }
    }

    return null;
  }

  playHandGuide({ bottle, color }) {
    if (!bottle || !this.handGuide || !this.image) {
      this.stopHandGuide();
      return;
    }

    this.stopHandGuide(false);

    const sourcePoint = {
      x: bottle.x + bottle.displayWidth * HAND_GUIDE_BOTTLE_OFFSET_X,
      y: bottle.y + bottle.displayHeight * HAND_GUIDE_BOTTLE_OFFSET_Y,
    };
    const targetDroplet = color === "white" ? this.topDroplet : this.bottomDroplet;
    const targetPoint = targetDroplet
      ? {
          x: targetDroplet.x,
          y: targetDroplet.y,
        }
      : {
          x:
            this.image.x +
            this.image.displayWidth *
              (color === "white"
                ? -HAND_GUIDE_TARGET_OFFSET_X
                : HAND_GUIDE_TARGET_OFFSET_X),
          y: this.image.y + this.image.displayHeight * HAND_GUIDE_TARGET_OFFSET_Y,
        };
    const sourceWidth = Math.max(this.handGuide.width || 1, 1);
    const handWidth = bottle.displayWidth * HAND_GUIDE_SCALE;
    const baseScale = handWidth / sourceWidth;

    const setHandVisible = () => {
      this.handGuide.setScale(baseScale);
      this.handGuide.setAlpha(1);
      this.handGuide.setVisible(true);
    };

    const moveHandTo = (point, onComplete) => {
      setHandVisible();
      this.handGuideTween = this.scene.tweens.add({
        targets: this.handGuide,
        x: point.x,
        y: point.y,
        duration: HAND_GUIDE_MOVE_DURATION,
        ease: "Sine.easeInOut",
        onComplete,
      });
    };

    const playTap = (onComplete) => {
      setHandVisible();
      this.handGuideTween = this.scene.tweens.add({
        targets: this.handGuide,
        scaleX: baseScale * 0.82,
        scaleY: baseScale * 0.82,
        alpha: 0.82,
        duration: 240,
        hold: 100,
        yoyo: true,
        ease: "Quad.easeInOut",
        onComplete,
      });
    };
    const queueNextTap = (delay, callback) => {
      this.handGuideTapEvent = this.scene.time.delayedCall(delay, () => {
        this.handGuideTapEvent = null;
        callback();
      });
    };
    const playSequence = () => {
      this.handGuide.setPosition(sourcePoint.x, sourcePoint.y);
      playTap(() => {
        moveHandTo(targetPoint, () => {
          playTap(() => {
            queueNextTap(HAND_GUIDE_LOOP_DELAY, () => {
              moveHandTo(sourcePoint, playSequence);
            });
          });
        });
      });
    };

    playSequence();
  }

  stopHandGuide(hide = true) {
    if (this.handGuideTapEvent) {
      this.handGuideTapEvent.remove(false);
      this.handGuideTapEvent = null;
    }

    if (this.handGuideTween) {
      this.handGuideTween.stop();
      this.handGuideTween.remove();
      this.handGuideTween = null;
    }

    if (hide) {
      this.handGuide?.setVisible(false);
    }
  }

  tryPourSelectedToYinYangBottle(targetColor = null) {
    if (this.isPouring) {
      return false;
    }

    const sourceStack = this.selectedSourceStack;
    const sourceBottle = this.selectedBottle;
    const color = sourceStack?.getTopColor();

    if (!sourceBottle) {
      return false;
    }

    if (color !== "white" && color !== "black") {
      this.playWrongYinYangFeedback(sourceBottle, targetColor);
      this.scheduleEndSceneAfterOnePour();
      return true;
    }

    if (targetColor && color !== targetColor) {
      this.playWrongYinYangFeedback(sourceBottle, targetColor);
      this.scheduleEndSceneAfterOnePour();
      return true;
    }

    const targetSide = this.yinYangStacks[color];
    const targetTopColor = targetSide[targetSide.length - 1] || null;

    if (
      targetSide.length >= YIN_YANG_MAX_FILL_STAGE ||
      (targetTopColor && targetTopColor !== color)
    ) {
      this.playSfx(SFX_WRONG_KEY, { volume: 0.55 });
      return false;
    }

    this.stopHandGuide();
    this.resumeCenterLiquidAnimation();
    this.playYinYangPourSequence(color, sourceStack, sourceBottle, () => {
      this.selectedSourceStack = null;
      this.clearBottleSelection({ preserveTransform: true });
      this.isPouring = false;
      this.scheduleCenterLiquidIdleStop();
      this.scheduleHandGuideAfterIdle();
      this.scheduleEndSceneAfterOnePour();
    });
    return true;
  }

  playYinYangPourSequence(color, sourceStack, sourceBottle, onComplete) {
    const targetSide = this.yinYangStacks[color];

    if (
      sourceStack?.getTopColor() !== color ||
      !targetSide ||
      targetSide.length >= YIN_YANG_MAX_FILL_STAGE
    ) {
      onComplete?.();
      return;
    }

    const totalBatchCount = this.getPourBatchCount(
      sourceStack,
      color,
      YIN_YANG_MAX_FILL_STAGE - targetSide.length,
    );
    const pourStage = sourceStack.getCount();
    const sourceStreamDrain =
      sourceStack.popTopBatchForStreamDrain(totalBatchCount, {
        fadeOnly: true,
      });

    const streamOptions = {
      keepExistingLine: false,
      keepLineOnComplete: false,
      duration: POUR_STREAM_DURATION,
      syncSourceDrainToStream: true,
      progressBoost: YIN_YANG_STREAM_PROGRESS_BOOST,
    };

    streamOptions.targetYinYangFill = this.startYinYangStageFill(
      color,
      totalBatchCount,
    );

    this.playPouringAnimation(color, sourceBottle, pourStage, sourceStreamDrain, true, streamOptions, () => {
      onComplete?.();
    });
  }

  createBatchDrainSegment(batchDrain, batchIndex, batchTotal, shouldComplete) {
    if (!batchDrain) {
      return null;
    }

    const safeTotal = Math.max(batchTotal, 1);
    const mapProgress = (progress) =>
      Phaser.Math.Clamp((batchIndex + progress) / safeTotal, 0, 1);

    return {
      update: (progress) => {
        batchDrain.update(mapProgress(progress));
      },
      getRemainingProgress: (progress) =>
        batchDrain.getRemainingProgress(mapProgress(progress)),
      complete: () => {
        if (shouldComplete) {
          batchDrain.complete();
        }
      },
    };
  }

  getPourBatchCount(sourceStack, color, maxCount) {
    const contents = sourceStack?.contents || [];
    let count = 0;

    for (let index = contents.length - 1; index >= 0; index -= 1) {
      if (contents[index] !== color || count >= maxCount) {
        break;
      }

      count += 1;
    }

    return Math.max(count, 1);
  }

  addYinYangPour(color) {
    const targetSide = this.yinYangStacks[color];

    if (DEBUG_ONE_POUR_TO_STAGE_17) {
      targetSide.length = 0;
      for (let index = 0; index < YIN_YANG_MAX_FILL_STAGE; index += 1) {
        targetSide.push(color);
      }
      return;
    }

    targetSide.push(color);
  }

  tryPourSelectedToBottle(targetIndex) {
    if (this.isPouring) {
      return false;
    }

    const sourceStack = this.selectedSourceStack;
    const sourceBottle = this.selectedBottle;
    const targetStack = this.surroundingBottleLiquids[targetIndex];
    const targetBottle = this.surroundingBottles[targetIndex];
    const color = sourceStack?.getTopColor();

    if (
      !sourceBottle ||
      !targetBottle ||
      !sourceStack ||
      !targetStack ||
      this.sealedBottleIndexes.has(targetIndex) ||
      sourceStack === targetStack ||
      !color ||
      !targetStack.canAccept(color)
    ) {
      if (sourceBottle && targetBottle) {
        this.playSfx(SFX_WRONG_KEY, { volume: 0.55 });
        this.scheduleEndSceneAfterOnePour();
      }
      return false;
    }

    this.stopHandGuide();
    this.resumeCenterLiquidAnimation();
    this.playBottlePourSequence(color, sourceStack, sourceBottle, targetStack, targetBottle, () => {
      if (this.isBottleComplete(targetStack)) {
        this.sealBottle(targetIndex);
      }
      this.selectedSourceStack = null;
      this.clearBottleSelection();
      this.isPouring = false;
      this.scheduleCenterLiquidIdleStop();
      this.scheduleHandGuideAfterIdle();
      this.scheduleEndSceneAfterOnePour();
    });
    return true;
  }

  playBottlePourSequence(color, sourceStack, sourceBottle, targetStack, targetBottle, onComplete) {
    if (
      sourceStack?.getTopColor() !== color ||
      !targetStack?.canAccept(color)
    ) {
      onComplete?.();
      return;
    }

    const totalBatchCount = this.getPourBatchCount(
      sourceStack,
      color,
      targetStack.maxLayers - targetStack.contents.length,
    );
    const pourStage = sourceStack.getCount();
    const sourceStreamDrain =
      sourceStack.popTopBatchForStreamDrain(totalBatchCount, {
        fadeOnly: true,
      });

    const streamOptions = {
      keepExistingLine: false,
      keepLineOnComplete: false,
      useActualBottleAngle: true,
      startFromStageOnly: true,
      duration:
        (POUR_STREAM_DURATION -
          BOTTLE_TO_BOTTLE_MOVE_DURATION -
          BOTTLE_TO_BOTTLE_RETURN_DURATION),
      moveDuration: BOTTLE_TO_BOTTLE_MOVE_DURATION,
      returnDuration: BOTTLE_TO_BOTTLE_RETURN_DURATION,
      batchCount: totalBatchCount,
    };

    this.playBottlePourAnimation(
      color,
      sourceBottle,
      targetBottle,
      pourStage,
      sourceStreamDrain,
      true,
      streamOptions,
      onComplete,
    );
  }

  isBottleComplete(liquidStack) {
    const contents = liquidStack?.contents || [];
    const color = contents[0];

    return (
      contents.length === liquidStack.maxLayers &&
      color !== "black" &&
      color !== "white" &&
      contents.every((contentColor) => contentColor === color)
    );
  }

  updateYinYangLiquidTexture(color, animateReveal = true) {
    if (animateReveal) {
      this.playYinYangStageReveal(color);
    } else {
      this.centerLiquidRevealTweens[color]?.stop();
      this.centerLiquidRevealTweens[color] = null;
      this.centerLiquidReveal[color] = 1;
      this.centerLiquidRevealStart[color] = 0;
      this.centerLiquidRevealProgress[color] = 1;
      this.centerLiquidBaseStageOverride[color] = null;
      this.centerLiquidRevealStage[color] = null;
    }
    this.applyCenterLiquidLayout(this.image.x, this.image.y);
    this.updateCenterDropletTextures();
    this.checkSealYinYangBottle(color);
  }

  checkSealYinYangBottle(color) {
    if (
      this.sealedYinYangSides[color] ||
      this.getYinYangStage(color) < YIN_YANG_MAX_FILL_STAGE
    ) {
      return;
    }

    this.sealYinYangBottle(color);
  }

  sealYinYangBottle(color) {
    const cap = this.centerCaps?.[color];

    if (!cap || !this.image) {
      return;
    }

    this.sealedYinYangSides[color] = true;
    this.playSfx(SFX_COMPLETE_KEY, { volume: 0.45 });
    this.applyCenterCapLayout(color);

    this.playYinYangCapCoverAnimation(cap);
    if (this.areBothYinYangSidesSealed()) {
      this.scheduleEndScene();
    }
  }

  areBothYinYangSidesSealed() {
    return this.sealedYinYangSides.white && this.sealedYinYangSides.black;
  }

  scheduleEndSceneAfterOnePour() {
    if (!DEBUG_END_SCENE_AFTER_ONE_POUR) {
      this.completedInteractionCount += 1;

      if (this.completedInteractionCount < END_SCENE_AFTER_INTERACTION_LIMIT) {
        return;
      }
    }

    this.scheduleEndScene(END_SCENE_AFTER_ONE_POUR_DELAY);
  }

  scheduleEndScene(delay = END_SCENE_DELAY) {
    if (this.hasShownEndScene) {
      return;
    }

    this.hasShownEndScene = true;
    this.endSceneEvent = this.scene.time.delayedCall(delay, () => {
      this.endSceneEvent = null;
      this.scene.scene.launch("EndScene");
      this.scene.scene.bringToTop("EndScene");
    });
  }

  playYinYangCapCoverAnimation(cap) {
    const finalX = cap.x;
    const finalY = cap.y;
    const finalAngle = cap.angle || 0;
    const finalScaleX = cap.scaleX;
    const finalScaleY = cap.scaleY;

    this.scene.tweens.killTweensOf(cap);
    cap.setPosition(
      finalX,
      finalY + this.image.displayHeight * BOTTLE_CAP_DROP_OFFSET_Y,
    );
    cap.setAlpha(0);
    cap.setVisible(true);
    cap.setAngle(finalAngle - BOTTLE_CAP_SPIN_DEGREES);
    cap.setScale(finalScaleX * 0.72, finalScaleY * 0.72);

    this.scene.tweens.add({
      targets: cap,
      alpha: 1,
      x: finalX,
      y: finalY,
      angle: finalAngle + 8,
      scaleX: finalScaleX * 1.08,
      scaleY: finalScaleY * 0.92,
      duration: BOTTLE_CAP_DROP_DURATION,
      ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: cap,
          angle: finalAngle,
          scaleX: finalScaleX,
          scaleY: finalScaleY,
          duration: BOTTLE_CAP_SETTLE_DURATION,
          ease: "Sine.easeOut",
        });
      },
    });
  }

  playYinYangStageReveal(color) {
    if (!this.centerLiquidReveal || !(color in this.centerLiquidReveal)) {
      return;
    }

    this.centerLiquidRevealTweens[color]?.stop();
    this.centerLiquidReveal[color] = 0;
    this.centerLiquidRevealStart[color] = 0;
    this.centerLiquidRevealProgress[color] = 0;
    this.centerLiquidRevealTweens[color] = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: CENTER_LIQUID_REVEAL_DURATION,
      ease: "Sine.easeOut",
      onUpdate: (tween) => {
        this.centerLiquidReveal[color] = tween.getValue();
        this.centerLiquidRevealProgress[color] = tween.getValue();
        this.applyCenterLiquidLayout(this.image.x, this.image.y);
      },
      onComplete: () => {
        this.centerLiquidReveal[color] = 1;
        this.centerLiquidRevealStart[color] = 0;
        this.centerLiquidRevealProgress[color] = 1;
        this.centerLiquidRevealTweens[color] = null;
        this.applyCenterLiquidLayout(this.image.x, this.image.y);
      },
    });
  }

  startYinYangStageFill(color, count = 1) {
    if (!this.centerLiquidReveal || !(color in this.centerLiquidReveal)) {
      return null;
    }

    this.centerLiquidRevealTweens[color]?.stop();
    this.centerLiquidRevealTweens[color] = null;
    this.centerLiquidReveal[color] = 1;
    this.centerLiquidRevealStart[color] = 0;
    this.centerLiquidRevealProgress[color] = 1;
    this.centerLiquidBaseStageOverride[color] = null;
    this.centerLiquidRevealStage[color] = null;
    this.centerLiquidSingleLayerReveal[color] = false;
    this.applyCenterLiquidLayout(this.image.x, this.image.y);

    let hasAddedStage = false;
    let hasStartedReveal = false;
    let hasCompletedReveal = false;
    let startReveal = 1;
    let endReveal = 1;
    let revealStartStage = 1;
    let revealEndStage = 1;
    const ensureStageAdded = () => {
      if (hasAddedStage) {
        return;
      }

      hasAddedStage = true;
      const previousStage = this.getYinYangStage(color);
      const safeCount = Math.max(Math.round(count), 1);
      for (let index = 0; index < safeCount; index += 1) {
        this.addYinYangPour(color);
      }
      const currentStage = this.getYinYangStage(color);
      revealStartStage = previousStage;
      revealEndStage = currentStage;
      const useSingleLayerReveal = currentStage >= 11;
      this.centerLiquidSingleLayerReveal[color] = useSingleLayerReveal;
      this.centerLiquidBaseStageOverride[color] = useSingleLayerReveal
        ? currentStage
        : previousStage;
      this.centerLiquidRevealStage[color] = currentStage;
      startReveal = Phaser.Math.Clamp(
        previousStage / YIN_YANG_MAX_FILL_STAGE,
        0,
        0.99,
      );
      endReveal = Phaser.Math.Clamp(
        currentStage / YIN_YANG_MAX_FILL_STAGE,
        startReveal,
        1,
      );
      this.centerLiquidRevealStart[color] = startReveal;
      this.centerLiquidRevealProgress[color] = 0;
      this.centerLiquidReveal[color] = startReveal;
      this.applyCenterLiquidLayout(this.image.x, this.image.y);
    };

    const startRevealTween = () => {
      if (hasStartedReveal) {
        return;
      }

      hasStartedReveal = true;
      this.centerLiquidRevealTweens[color]?.stop();
      this.centerLiquidRevealTweens[color] = this.scene.tweens.addCounter({
        from: 0,
        to: 1,
        delay: CENTER_LIQUID_REVEAL_START_DELAY,
        duration: CENTER_LIQUID_REVEAL_DURATION,
        ease: "Sine.easeInOut",
        onStart: () => {
          ensureStageAdded();
        },
        onUpdate: (tween) => {
          ensureStageAdded();
          const rawProgress = tween.getValue();
          const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
          const reveal = Phaser.Math.Linear(startReveal, endReveal, progress);
          this.centerLiquidRevealProgress[color] = progress;
          this.centerLiquidReveal[color] = reveal;
          this.applyCenterLiquidLayout(this.image.x, this.image.y);
          this.updateCenterDropletTextures(
            {
              [color]: Phaser.Math.Linear(
                revealStartStage,
                revealEndStage,
                progress,
              ),
            },
            false,
          );
        },
        onComplete: () => {
          hasCompletedReveal = true;
          this.centerLiquidReveal[color] = 1;
          this.centerLiquidRevealStart[color] = 0;
          this.centerLiquidRevealProgress[color] = 1;
          this.centerLiquidRevealTweens[color] = null;
          this.centerLiquidBaseStageOverride[color] = null;
          this.centerLiquidRevealStage[color] = null;
          this.centerLiquidSingleLayerReveal[color] = false;
          this.applyCenterLiquidLayout(this.image.x, this.image.y);
          this.updateCenterDropletTextures();
          this.checkSealYinYangBottle(color);
        },
      });
    };

    return {
      update: () => {
        startRevealTween();
      },
      complete: () => {
        if (hasCompletedReveal) {
          this.centerLiquidBaseStageOverride[color] = null;
          this.centerLiquidRevealStage[color] = null;
          this.centerLiquidSingleLayerReveal[color] = false;
          this.applyCenterLiquidLayout(this.image.x, this.image.y);
          return;
        }

        ensureStageAdded();
        startRevealTween();
      },
    };
  }

  updateCenterDropletTextures(stageOverrides = {}, animate = true) {
    if (
      !this.topDroplet ||
      !this.topDropletFill ||
      !this.bottomDroplet ||
      !this.bottomDropletFill ||
      !this.yinYangStacks
    ) {
      return;
    }

    const leftPercent = this.getDropletFillPercent(
      "black",
      YIN_YANG_RIGHT_DROPLET_START_STAGE,
      YIN_YANG_RIGHT_DROPLET_COVERED_STAGE,
      stageOverrides.black,
    );
    const rightPercent = this.getDropletFillPercent(
      "white",
      YIN_YANG_LEFT_DROPLET_START_STAGE,
      YIN_YANG_LEFT_DROPLET_COVERED_STAGE,
      stageOverrides.white,
    );

    this.topDroplet.setTexture("yangEmptyDroplet");
    this.topDroplet.setAngle(0);
    this.topDroplet.setAlpha(1);
    this.topDropletFill.setTexture("yangDroplet");
    this.topDropletFill.setAngle(0);
    this.setDropletFill("top", this.topDropletFill, leftPercent, animate);

    this.bottomDroplet.setTexture("yingEmptyDroplet");
    this.bottomDroplet.setAngle(0);
    this.bottomDroplet.setAlpha(1);
    this.bottomDropletFill.setTexture("yingDroplet");
    this.bottomDropletFill.setAngle(0);
    this.setDropletFill("bottom", this.bottomDropletFill, rightPercent, animate);
  }

  applyCenterCapLayout(color = null) {
    if (!this.centerCaps || !this.image) {
      return;
    }

    const colors = color ? [color] : ["white", "black"];

    colors.forEach((sideColor) => {
      const cap = this.centerCaps[sideColor];

      if (!cap) {
        return;
      }

      const offsetX =
        sideColor === "white"
          ? YIN_YANG_CAP_LEFT_OFFSET_X
          : YIN_YANG_CAP_RIGHT_OFFSET_X;

      cap.setPosition(
        this.image.x + this.image.displayWidth * offsetX,
        this.image.y + this.image.displayHeight * YIN_YANG_CAP_OFFSET_Y,
      );
      cap.setAngle(0);
      cap.setDisplaySize(
        this.image.displayWidth * YIN_YANG_CAP_WIDTH,
        this.image.displayHeight * YIN_YANG_CAP_HEIGHT,
      );
    });
  }

  getDropletFillPercent(color, startStage, coveredStage, stageOverride = null) {
    const fillCount = stageOverride ?? this.getYinYangStage(color);

    if (fillCount < startStage) {
      return 0;
    }

    const progressCount = fillCount - startStage + 1;
    const progressTarget = Math.max(coveredStage - startStage + 1, 1);

    return Phaser.Math.Clamp(progressCount / progressTarget, 0, 1);
  }

  setDropletFill(side, droplet, targetPercent, animate = true) {
    if (animate) {
      this.animateDropletFill(side, droplet, targetPercent);
      return;
    }

    const target = Phaser.Math.Clamp(targetPercent, 0, 1);
    this.dropletFillTweens[side]?.stop();
    this.dropletFillTweens[side] = null;
    this.dropletFillTarget[side] = target;
    this.dropletFillPercent[side] = target;
    droplet.setAlpha(target > 0.001 ? 1 : 0);
    this.updateDropletFillMask(null, droplet, target);
  }

  animateDropletFill(side, droplet, targetPercent) {
    const target = Phaser.Math.Clamp(targetPercent, 0, 1);

    if (this.dropletFillTarget[side] === null) {
      this.dropletFillTarget[side] = target;
      this.dropletFillPercent[side] = target;
      droplet.setAlpha(target > 0 ? 1 : 0);
      this.updateDropletFillMask(null, droplet, target);
      return;
    }

    if (Math.abs(this.dropletFillTarget[side] - target) < 0.001) {
      droplet.setAlpha((this.dropletFillPercent[side] ?? target) > 0 ? 1 : 0);
      this.updateDropletFillMask(
        null,
        droplet,
        this.dropletFillPercent[side] ?? target,
      );
      return;
    }

    this.dropletFillTarget[side] = target;
    this.dropletFillTweens[side]?.stop();
    this.dropletFillTweens[side] = this.scene.tweens.addCounter({
      from: this.dropletFillPercent[side] ?? 0,
      to: target,
      duration: DROPLET_FILL_ANIMATION_DURATION,
      ease: "Sine.easeInOut",
      onUpdate: (tween) => {
        const value = tween.getValue();
        this.dropletFillPercent[side] = value;
        droplet.setAlpha(value > 0.001 ? 1 : 0);
        this.updateDropletFillMask(null, droplet, value);
      },
      onComplete: () => {
        this.dropletFillPercent[side] = target;
        this.dropletFillTweens[side] = null;
        droplet.setAlpha(target > 0 ? 1 : 0);
        this.updateDropletFillMask(null, droplet, target);
      },
    });
  }

  updateDropletFillMask(maskGraphics, droplet, percent) {
    if (!droplet?.frame) {
      return;
    }

    const clampedPercent = Phaser.Math.Clamp(percent, 0, 1);
    const frameWidth = droplet.frame.width;
    const frameHeight = droplet.frame.height;
    const cropHeight = frameHeight * clampedPercent;
    const cropY = frameHeight - cropHeight;

    if (cropHeight <= 0) {
      droplet.setCrop(0, frameHeight, frameWidth, 0);
      return;
    }
    droplet.setCrop(0, cropY, frameWidth, cropHeight);
  }

  playWrongYinYangFeedback(sourceBottle, targetColor) {
    this.isPouring = true;
    this.resumeCenterLiquidAnimation();
    this.playSfx(SFX_WRONG_KEY, { volume: 0.55 });
    if (this.selectedBottleTween) {
      this.selectedBottleTween.stop();
      this.selectedBottleTween.remove();
      this.selectedBottleTween = null;
    }

    const sourceIndex = this.surroundingBottles.indexOf(sourceBottle);
    const sourceLiquidStack = this.surroundingBottleLiquids[sourceIndex];
    const originalX = this.selectedBottleBaseX || sourceBottle.x;
    const originalY = this.selectedBottleBaseY || sourceBottle.y;
    const originalAngle = sourceBottle.angle || 0;
    const sideDirection = targetColor === "black" ? -1 : 1;
    const feedbackPose = this.getYinYangPourPose(targetColor);
    const shakeDistance = sourceBottle.displayWidth * WRONG_YIN_YANG_SHAKE_DISTANCE;

    this.setBottleGroupDepth(sourceIndex, true);

    const updateSourceBottleAttachments = () => {
      sourceLiquidStack?.layout();
      this.applyBottleCapLayout(sourceIndex);
      if (sourceBottle === this.selectedBottle) {
        this.applyBottleGlowLayout(sourceBottle);
      }
    };

    sourceLiquidStack?.setPouring(true);
    this.scene.tweens.add({
      targets: sourceBottle,
      x: feedbackPose.x,
      y: feedbackPose.y,
      angle: feedbackPose.angle,
      duration: 220,
      ease: "Sine.easeInOut",
      onUpdate: updateSourceBottleAttachments,
      onComplete: () => {
        updateSourceBottleAttachments();
        this.scene.tweens.add({
          targets: sourceBottle,
          x: feedbackPose.x + shakeDistance * sideDirection,
          duration: 45,
          ease: "Sine.easeInOut",
          yoyo: true,
          repeat: WRONG_YIN_YANG_SHAKE_REPEATS,
          onUpdate: updateSourceBottleAttachments,
          onComplete: () => {
            this.scene.tweens.add({
              targets: sourceBottle,
              x: originalX,
              y: originalY,
              angle: originalAngle,
              duration: 220,
              ease: "Sine.easeInOut",
              onUpdate: updateSourceBottleAttachments,
              onComplete: () => {
                sourceBottle.setPosition(originalX, originalY);
                sourceBottle.setAngle(originalAngle);
                sourceLiquidStack?.setPouring(false);
                this.setBottleGroupDepth(sourceIndex, false);
                updateSourceBottleAttachments();
                this.isPouring = false;
                this.scheduleCenterLiquidIdleStop();
                this.selectBottle(sourceBottle);
              },
            });
          },
        });
      },
    });
  }

  playPouringAnimation(color, sourceBottle, pourStage, sourceStreamDrain, returnToOriginal, streamOptions, onComplete) {
    this.isPouring = true;
    this.resumeCenterLiquidAnimation();
    this.pouringTween?.stop();
    if (!streamOptions?.keepExistingLine) {
      this.stopPourSfx();
    }
    if (this.selectedBottleTween) {
      this.selectedBottleTween.stop();
      this.selectedBottleTween.remove();
      this.selectedBottleTween = null;
    }

    const sourceIndex = this.surroundingBottles.indexOf(sourceBottle);
    const sourceLiquidStack = this.surroundingBottleLiquids[sourceIndex];
    this.setBottleGroupDepth(sourceIndex, true);
    const originalX = this.selectedBottleBaseX || sourceBottle.x;
    const originalY = this.selectedBottleBaseY || sourceBottle.y;
    const originalAngle = 0;
    const currentStage = this.getYinYangStage(color);
    const previousStage = Math.max(currentStage - 1, 0);
    const previousFillProgress = previousStage / YIN_YANG_MAX_FILL_STAGE;
    const fillTopY = this.image.y - this.image.displayHeight * 0.38;
    const fillBottomY = this.image.y + this.image.displayHeight * 0.32;
    const pourPose = this.getYinYangPourPose(color, pourStage);
    const endX =
      this.image.x +
      this.image.displayWidth *
        (color === "white"
          ? -YIN_YANG_POUR_ENTRY_OFFSET_X
          : YIN_YANG_POUR_ENTRY_OFFSET_X);
    const endY =
      Phaser.Math.Linear(fillBottomY, fillTopY, previousFillProgress) +
      this.image.displayHeight * YIN_YANG_STREAM_EXTRA_LENGTH;

    const updateSourceBottleAttachments = () => {
      sourceLiquidStack?.layout();
      sourceStreamDrain?.refresh?.();
      this.applyBottleCapLayout(sourceIndex);
      if (sourceBottle === this.selectedBottle) {
        this.applyBottleGlowLayout(sourceBottle);
      }
    };

    sourceLiquidStack?.setPouring(true);
    sourceStreamDrain?.refresh?.();
    this.scene.tweens.add({
      targets: sourceBottle,
      x: pourPose.x,
      y: pourPose.y,
      angle: pourPose.angle,
      duration: 260,
      ease: "Sine.easeInOut",
      onUpdate: updateSourceBottleAttachments,
      onComplete: () => {
        updateSourceBottleAttachments();
        if (HOLD_POURING_POSE_FOR_TUNING) {
          this.startYinYangBubbles(color, endX, endY);
          this.playPouringStream(color, sourceBottle, endX, endY, pourStage, () => {
            this.stopYinYangBubbles();
            this.scene.tweens.add({
              targets: sourceBottle,
              x: originalX,
              y: originalY,
              angle: originalAngle,
              duration: 240,
              ease: "Sine.easeInOut",
              onUpdate: updateSourceBottleAttachments,
              onComplete: () => {
                sourceLiquidStack?.setPouring(false);
                updateSourceBottleAttachments();
                this.clearBottleSelection({ preserveTransform: true });
                this.isPouring = false;
                this.scheduleCenterLiquidIdleStop();
              },
            });
          }, null, null, sourceStreamDrain, streamOptions);
          return;
        }
        this.startYinYangBubbles(color, endX, endY);
        this.startYinYangPourWave(color);
        this.playPouringStream(color, sourceBottle, endX, endY, pourStage, () => {
          this.stopYinYangBubbles();
          this.stopYinYangPourWave();
          if (!returnToOriginal) {
            updateSourceBottleAttachments();
            onComplete?.();
            return;
          }
          this.scene.tweens.add({
            targets: sourceBottle,
            x: originalX,
            y: originalY,
            angle: originalAngle,
            duration: 240,
            ease: "Sine.easeInOut",
            onUpdate: updateSourceBottleAttachments,
            onComplete: () => {
              sourceLiquidStack?.setPouring(false);
              updateSourceBottleAttachments();
              onComplete?.();
            },
          });
        }, null, null, sourceStreamDrain, streamOptions);
      },
    });
  }

  playBottlePourAnimation(color, sourceBottle, targetBottle, pourStage, sourceStreamDrain, returnToOriginal, streamOptions, onComplete) {
    this.isPouring = true;
    this.resumeCenterLiquidAnimation();
    this.pouringTween?.stop();
    if (!streamOptions?.keepExistingLine) {
      this.stopPourSfx();
      this.pouringLine?.clear();
    }
    if (this.selectedBottleTween) {
      this.selectedBottleTween.stop();
      this.selectedBottleTween.remove();
      this.selectedBottleTween = null;
    }

    const sourceIndex = this.surroundingBottles.indexOf(sourceBottle);
    const sourceLiquidStack = this.surroundingBottleLiquids[sourceIndex];
    const originalX = this.selectedBottleBaseX || sourceBottle.x;
    const originalY = this.selectedBottleBaseY || sourceBottle.y;
    const originalAngle = sourceBottle.angle || 0;
    const sideDirection = sourceBottle.x < targetBottle.x ? -1 : 1;
    const targetEntryPoint = this.getBottlePourEntryPoint(targetBottle);
    const targetIndex = this.surroundingBottles.indexOf(targetBottle);
    const targetStack = this.surroundingBottleLiquids[targetIndex];
    this.setBottleGroupDepth(sourceIndex, true);
    this.setReceivingBottleDepth(targetIndex);
    this.setBottleGroupDepth(sourceIndex, true);
    const endX = targetEntryPoint.x;
    const endY =
      this.getBottlePreviousStageBottomY(targetBottle, targetStack) +
      targetBottle.displayHeight * BOTTLE_STREAM_EXTRA_LENGTH;
    const pourX = endX + sideDirection * targetBottle.displayWidth * 0.95;
    const pourY = targetEntryPoint.y - targetBottle.displayHeight * 0.62;
    const tiltAngle = this.getPourTiltAngle(pourStage);
    const pourAngle = sideDirection < 0 ? tiltAngle : -tiltAngle;

    const updateSourceBottleAttachments = () => {
      sourceLiquidStack?.layout();
      sourceStreamDrain?.refresh?.();
      this.applyBottleCapLayout(sourceIndex);
      if (sourceBottle === this.selectedBottle) {
        this.applyBottleGlowLayout(sourceBottle);
      }
    };
    const updateTargetBottleAttachments = () => {
      targetStack?.layout();
      this.applyBottleCapLayout(targetIndex);
    };

    sourceLiquidStack?.setPouring(true);
    sourceStreamDrain?.refresh?.();
    this.scene.tweens.add({
      targets: sourceBottle,
      x: pourX,
      y: pourY,
      angle: pourAngle,
      duration: streamOptions.moveDuration ?? 240,
      ease: "Sine.easeInOut",
      onUpdate: updateSourceBottleAttachments,
      onComplete: () => {
        updateSourceBottleAttachments();
        updateTargetBottleAttachments();
        const targetStreamFill = targetStack?.pushBatchForStreamFill(
          color,
          streamOptions.batchCount ?? 1,
        );
        if (HOLD_POURING_POSE_FOR_TUNING) {
          this.playPouringStream(
            color,
            sourceBottle,
            endX,
            endY,
            pourStage,
            () => {
              this.scene.tweens.add({
                targets: sourceBottle,
                x: originalX,
                y: originalY,
                angle: originalAngle,
                duration: streamOptions.returnDuration ?? 240,
                ease: "Sine.easeInOut",
                onUpdate: updateSourceBottleAttachments,
                onComplete: () => {
                  sourceLiquidStack?.setPouring(false);
                  this.setBottleGroupDepth(targetIndex, false);
                  updateSourceBottleAttachments();
                  updateTargetBottleAttachments();
                  this.clearBottleSelection();
                  this.isPouring = false;
                  this.scheduleCenterLiquidIdleStop();
                },
              });
            },
            targetBottle,
            targetStreamFill,
            sourceStreamDrain,
            streamOptions,
          );
          return;
        }
        this.playPouringStream(
          color,
          sourceBottle,
          endX,
          endY,
          pourStage,
          () => {
            if (!returnToOriginal) {
              updateSourceBottleAttachments();
              updateTargetBottleAttachments();
              onComplete?.(true);
              return;
            }
            this.scene.tweens.add({
              targets: sourceBottle,
              x: originalX,
              y: originalY,
              angle: originalAngle,
              duration: streamOptions.returnDuration ?? 240,
              ease: "Sine.easeInOut",
              onUpdate: updateSourceBottleAttachments,
              onComplete: () => {
                sourceLiquidStack?.setPouring(false);
                this.setBottleGroupDepth(targetIndex, false);
                updateSourceBottleAttachments();
                updateTargetBottleAttachments();
                onComplete?.(true);
              },
            });
          },
          targetBottle,
          targetStreamFill,
          sourceStreamDrain,
          streamOptions,
        );
      },
    });
  }

  startYinYangBoxes(color, x, y) {
    this.startYinYangBubbles(color, x, y);
  }

  startYinYangBubbles(color, x, y) {
    this.stopYinYangBubbles();

    this.yinYangBubbleDelayEvent = this.scene.time.delayedCall(
      YIN_YANG_BUBBLE_START_DELAY,
      () => {
        this.emitYinYangBubble(color, x, y);
        this.emitYinYangBubble(color, x, y);
        this.yinYangBubbleEvent = this.scene.time.addEvent({
          delay: YIN_YANG_BUBBLE_INTERVAL,
          loop: true,
          callback: () => {
            this.emitYinYangBubble(color, x, y);
          },
        });
      },
    );
  }

  startYinYangPourWave(color) {
    this.activeYinYangPourColor = color;
    this.applyCenterLiquidLayout(this.image.x, this.image.y);
  }

  stopYinYangPourWave() {
    this.activeYinYangPourColor = null;
    if (this.image) {
      this.applyCenterLiquidLayout(this.image.x, this.image.y);
    }
  }

  stopYinYangBubbles(destroyActive = false) {
    this.yinYangBubbleDelayEvent?.remove(false);
    this.yinYangBubbleDelayEvent = null;
    this.yinYangBubbleEvent?.remove(false);
    this.yinYangBubbleEvent = null;

    if (!destroyActive) {
      return;
    }

    this.yinYangBubbles.forEach((bubble) => bubble.destroy());
    this.yinYangBubbles.length = 0;
  }

  emitYinYangBubble(color, x, y) {
    const sideDirection = color === "black" ? 1 : -1;
    const bubbleOriginY =
      y + this.image.displayHeight * YIN_YANG_BUBBLE_STAGE_OFFSET_Y;
    const bubble = this.scene.add.image(
      x +
        sideDirection * this.image.displayWidth * 0.01 +
        Phaser.Math.FloatBetween(
          -this.image.displayWidth * YIN_YANG_BUBBLE_SPREAD_X,
          this.image.displayWidth * YIN_YANG_BUBBLE_SPREAD_X,
        ),
      bubbleOriginY +
        Phaser.Math.FloatBetween(
          -this.image.displayHeight * YIN_YANG_BUBBLE_SPREAD_Y,
          this.image.displayHeight * YIN_YANG_BUBBLE_SPREAD_Y,
        ),
      YIN_YANG_BUBBLE_TEXTURE,
    );
    const size =
      this.image.displayWidth *
      Phaser.Math.FloatBetween(
        YIN_YANG_BUBBLE_MIN_SIZE,
        YIN_YANG_BUBBLE_MAX_SIZE,
      );

    bubble.setDepth(YIN_YANG_BUBBLE_DEPTH);
    bubble.setDisplaySize(size, size);
    bubble.setAlpha(Phaser.Math.FloatBetween(0.45, 0.75));
    this.yinYangBubbles.push(bubble);

    this.scene.tweens.add({
      targets: bubble,
      x: bubble.x + Phaser.Math.FloatBetween(-size * 1.5, size * 1.5),
      y: bubble.y - this.image.displayHeight * YIN_YANG_BUBBLE_RISE,
      alpha: 0,
      scaleX: bubble.scaleX * 1.35,
      scaleY: bubble.scaleY * 1.35,
      duration: Phaser.Math.Between(520, 780),
      ease: "Sine.easeOut",
      onComplete: () => {
        Phaser.Utils.Array.Remove(this.yinYangBubbles, bubble);
        bubble.destroy();
      },
    });
  }

  sealBottle(index) {
    const cap = this.bottleCaps[index];

    if (!cap || this.sealedBottleIndexes.has(index)) {
      return;
    }

    this.sealedBottleIndexes.add(index);
    this.playSfx(SFX_COMPLETE_KEY, { volume: 0.45 });
    this.applyBottleCapLayout(index);
    const finalX = cap.x;
    const finalY = cap.y;
    const finalAngle = cap.angle || 0;
    const finalScaleX = cap.scaleX;
    const finalScaleY = cap.scaleY;
    const bottle = this.surroundingBottles[index];

    this.scene.tweens.killTweensOf(cap);
    cap.setPosition(
      finalX,
      finalY + (bottle?.displayHeight || cap.displayHeight) * BOTTLE_CAP_DROP_OFFSET_Y,
    );
    cap.setAngle(finalAngle - BOTTLE_CAP_SPIN_DEGREES);
    cap.setScale(finalScaleX * 0.72, finalScaleY * 0.72);
    cap.setAlpha(0);
    cap.setVisible(true);
    this.scene.tweens.add({
      targets: cap,
      alpha: 1,
      x: finalX,
      y: finalY,
      angle: finalAngle + 8,
      scaleX: finalScaleX * 1.08,
      scaleY: finalScaleY * 0.92,
      duration: BOTTLE_CAP_DROP_DURATION,
      ease: "Back.easeOut",
      onComplete: () => {
        this.scene.tweens.add({
          targets: cap,
          angle: finalAngle,
          scaleX: finalScaleX,
          scaleY: finalScaleY,
          duration: BOTTLE_CAP_SETTLE_DURATION,
          ease: "Sine.easeOut",
        });
      },
    });
  }

  getBottlePourEndY(targetBottle, targetStack) {
    const nextStage = Phaser.Math.Clamp(
      (targetStack?.getCount() || 0) + 1,
      1,
      4,
    );
    const progress = (nextStage - 1) / 3;
    const bottomY = targetBottle.y + targetBottle.displayHeight * 0.32;
    const topY = targetBottle.y - targetBottle.displayHeight * 0.18;

    return Phaser.Math.Linear(bottomY, topY, progress);
  }

  getBottlePreviousStageBottomY(targetBottle, targetStack) {
    const currentStage = Phaser.Math.Clamp(
      targetStack?.getCount() || 1,
      1,
      4,
    );
    const previousStage = Math.max(currentStage - 1, 0);
    const progress = previousStage / 4;
    const bottomY = targetBottle.y + targetBottle.displayHeight * 0.32;
    const topY = targetBottle.y - targetBottle.displayHeight * 0.18;

    return Phaser.Math.Linear(bottomY, topY, progress);
  }

  getBottlePourEntryPoint(targetBottle) {
    return {
      x: targetBottle.x,
      y: targetBottle.y - targetBottle.displayHeight * 0.46,
    };
  }

  playPouringStream(
    color,
    sourceBottle,
    endX,
    endY,
    pourStage,
    onComplete,
    targetBottle = null,
    targetStreamFill = null,
    sourceStreamDrain = null,
    streamOptions = {},
  ) {
    const streamAngle = streamOptions.useActualBottleAngle
      ? null
      : this.getReferenceStreamAngle(sourceBottle);
    const stageBottomPoint = this.getBottleCurrentStageBottomPoint(
      sourceBottle,
      pourStage,
      streamAngle,
    );
    const mouthPoint = this.getBottlePourMouth(sourceBottle, streamAngle);
    const startPoint = streamOptions.startFromStageOnly
      ? stageBottomPoint
      : this.getVisiblePourStartPoint(stageBottomPoint, mouthPoint);
    const startX = startPoint.x;
    const startY = startPoint.y;
    const lineWidth = Phaser.Math.Clamp(sourceBottle.displayWidth * 0.14, 6, 16);

    if (!streamOptions.keepExistingLine) {
      this.pouringLine.clear();
      this.startDelayedPourSfx();
    }

    this.pouringTween = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: streamOptions.duration ?? POUR_STREAM_DURATION,
      ease: "Sine.easeInOut",
      onUpdate: (tween) => {
        const t = tween.getValue();
        const progressBoost =
          streamOptions.progressBoost ?? POUR_STREAM_PROGRESS_BOOST;
        const streamProgress = Phaser.Math.Clamp(
          t + progressBoost,
          0,
          1,
        );
        const visibleStreamProgress = streamOptions.keepExistingLine
          ? 1
          : streamProgress;
        const shouldRetractStream =
          !streamOptions.keepLineOnComplete &&
          Boolean(sourceStreamDrain?.getRemainingProgress);
        const revealCompleteAt = 1 - progressBoost;
        const targetRetractProgress = Phaser.Math.Clamp(
          (t - revealCompleteAt) / Math.max(1 - revealCompleteAt, 0.001),
          0,
          1,
        );
        const sourceDrainProgress = streamOptions.syncSourceDrainToStream
          ? targetBottle
            ? streamProgress
            : targetRetractProgress
          : t;
        const sourceRemainingProgress =
          sourceStreamDrain?.getRemainingProgress?.(sourceDrainProgress);
        const shouldRetractYinYangFromSource =
          !targetBottle &&
          streamOptions.syncSourceDrainToStream &&
          visibleStreamProgress >= 1 &&
          sourceRemainingProgress < 1;
        const syncedStreamProgress =
          targetBottle && shouldRetractStream
            ? targetRetractProgress > 0
              ? 1 - targetRetractProgress
              : visibleStreamProgress
            : streamOptions.keepLineOnComplete ||
                !sourceStreamDrain?.getRemainingProgress
              ? visibleStreamProgress
              : shouldRetractYinYangFromSource
                ? sourceRemainingProgress
              : streamOptions.syncSourceDrainToStream
                ? visibleStreamProgress
              : Math.min(
                  visibleStreamProgress,
                  sourceRemainingProgress,
                );
        const retractFromSource =
          targetBottle
            ? shouldRetractStream && targetRetractProgress > 0
            : shouldRetractYinYangFromSource;

        this.drawPouringLine({
          color,
          sourceBottle,
          startX,
          startY,
          mouthX: mouthPoint.x,
          mouthY: mouthPoint.y,
          endX,
          endY,
          progress: syncedStreamProgress,
          lineWidth,
          targetBottle,
          retractFromSource,
          streamAngle,
        });
        targetStreamFill?.update(t);
        streamOptions.targetYinYangFill?.update(t);
        sourceStreamDrain?.update(sourceDrainProgress);
      },
      onComplete: () => {
        sourceStreamDrain?.update(1);
        if (!streamOptions.keepLineOnComplete) {
          this.pouringLine.clear();
          this.stopPourSfx();
        }
        sourceStreamDrain?.complete();
        targetStreamFill?.complete();
        streamOptions.targetYinYangFill?.complete();
        this.pouringTween = null;
        onComplete?.();
      },
    });
  }

  showStaticPouringStream(
    color,
    sourceBottle,
    endX,
    endY,
    pourStage,
    targetBottle = null,
  ) {
    const streamAngle = this.getReferenceStreamAngle(sourceBottle);
    const stageBottomPoint = this.getBottleCurrentStageBottomPoint(
      sourceBottle,
      pourStage,
      streamAngle,
    );
    const mouthPoint = this.getBottlePourMouth(sourceBottle, streamAngle);
    const startPoint = this.getVisiblePourStartPoint(stageBottomPoint, mouthPoint);
    const startX = startPoint.x;
    const startY = startPoint.y;

    this.pouringTween?.stop();
    this.stopPourSfx();
    this.pouringTween = null;
    this.drawPouringLine({
      color,
      sourceBottle,
      startX,
      startY,
      mouthX: mouthPoint.x,
      mouthY: mouthPoint.y,
      endX,
      endY,
      progress: 1,
      lineWidth: Phaser.Math.Clamp(sourceBottle.displayWidth * 0.14, 6, 16),
      targetBottle,
      streamAngle,
    });
  }

  drawPouringLine({
    color,
    sourceBottle = null,
    startX,
    startY,
    mouthX,
    mouthY,
    endX,
    endY,
    progress,
    lineWidth,
    targetBottle = null,
    retractFromSource = false,
    streamAngle = null,
  }) {
    if (!this.pouringLine) {
      return;
    }

    this.pouringLine.clear();

    if (progress <= 0.01) {
      return;
    }

    const lineColor = this.getPouringColor(color);
    const exitX = mouthX ?? startX;
    const exitY = mouthY ?? startY;
    const points = targetBottle
      ? this.getBottleToBottleStreamPoints(exitX, exitY, endX, endY)
      : this.getYinYangStreamPoints(color, exitX, exitY, endX, endY);
    const streamPoints =
      exitX === startX && exitY === startY
        ? points
        : [
            ...this.getBottleInternalStreamPoints(
              sourceBottle,
              startX,
              startY,
              exitX,
              exitY,
              streamAngle,
            ),
            ...points.slice(1),
          ];

    const animatedPoints = this.getAnimatedStreamPoints(streamPoints, lineWidth);

    this.pouringLine.lineStyle(lineWidth, lineColor, 0.95);
    this.drawProgressiveLine(animatedPoints, progress, retractFromSource);
  }

  getVisiblePourStartPoint(stageBottomPoint, mouthPoint) {
    if (
      POUR_STREAM_VISIBLE_START_FROM_MOUTH ||
      !stageBottomPoint ||
      !mouthPoint ||
      stageBottomPoint.y > mouthPoint.y
    ) {
      return mouthPoint;
    }

    return stageBottomPoint;
  }

  getBottleToBottleStreamPoints(startX, startY, endX, endY) {
    const bendY = Phaser.Math.Linear(startY, endY, POUR_STREAM_VERTICAL_BEND);
    const gravityY = startY + this.image.displayHeight * POUR_MOUTH_GRAVITY_DROP;

    return [
      { x: startX, y: startY },
      { x: startX, y: gravityY },
      { x: endX, y: bendY },
      { x: endX, y: endY },
    ];
  }

  getBottleInternalStreamPoints(sourceBottle, startX, startY, exitX, exitY, streamAngle = null) {
    if (!sourceBottle) {
      return [{ x: startX, y: startY }, { x: exitX, y: exitY }];
    }

    const lowerSide = this.getBottleLowerSideDirection(sourceBottle, streamAngle);
    const edgePoint = this.getBottleLocalPoint(
      sourceBottle,
      sourceBottle.displayWidth * POURING_BOTTLE_INTERNAL_EDGE_OFFSET_X * lowerSide,
      sourceBottle.displayHeight * POURING_BOTTLE_INTERNAL_EDGE_OFFSET_Y,
      streamAngle,
    );

    return [
      { x: startX, y: startY },
      edgePoint,
      { x: exitX, y: exitY },
    ];
  }

  getYinYangStreamPoints(color, startX, startY, endX, endY) {
    const direction = color === "black" ? -1 : 1;
    const gravityY = startY + this.image.displayHeight * POUR_MOUTH_GRAVITY_DROP;
    let points;

    if (color === "black") {
      points = this.getBlackCenterStreamPoints(startX, gravityY, direction);
    } else if (color === "white") {
      points = this.getWhiteCenterStreamPoints(startX, gravityY, direction);
    } else {
      points = this.getColoredCenterStreamPoints(startX, gravityY, direction);
    }

    return this.clipStreamToEndY(
      [{ x: startX, y: startY }, { x: startX, y: gravityY }, ...points.slice(1)],
      endY,
    );
  }

  getBlackCenterStreamPoints(startX, startY, direction) {
    const firstDrop = this.refCenterStreamDistance(150);
    const finalDrop = this.refCenterStreamDistance(250);
    const finalSideOffset = direction * this.refCenterStreamDistance(-80);
    const firstBendDrop = this.refCenterStreamDistance(120);
    const firstBendSideOffset = direction * this.refCenterStreamDistance(-20);
    const points = [{ x: startX, y: startY }];
    const firstBendEnd = {
      x: startX,
      y: startY + firstBendDrop,
    };

    this.pushQuadraticStreamPoints(
      points,
      { x: startX, y: startY },
      {
        x: startX + firstBendSideOffset,
        y: startY + firstBendDrop * 0.5,
      },
      firstBendEnd,
      8,
      0.5,
    );

    const verticalEnd = {
      x: startX,
      y: startY + firstDrop,
    };
    points.push(verticalEnd);
    this.pushCubicStreamPoints(
      points,
      verticalEnd,
      {
        x: startX + finalSideOffset,
        y: verticalEnd.y + finalDrop * 0.35,
      },
      {
        x: startX + finalSideOffset,
        y: verticalEnd.y + finalDrop * 0.65,
      },
      {
        x: startX,
        y: verticalEnd.y + finalDrop,
      },
      16,
    );
    points.push({
      x: startX,
      y: verticalEnd.y + finalDrop + this.refCenterStreamDistance(1000),
    });

    return points;
  }

  getWhiteCenterStreamPoints(startX, startY, direction) {
    const firstDrop = this.refCenterStreamDistance(400);
    const finalDrop = this.refCenterStreamDistance(220);
    const finalSideOffset = direction * this.refCenterStreamDistance(-80);
    const firstBendDrop = this.refCenterStreamDistance(20);
    const firstBendSideOffset = direction * this.refCenterStreamDistance(-20);
    const points = [{ x: startX, y: startY }];
    const firstBendEnd = {
      x: startX,
      y: startY + firstBendDrop,
    };

    this.pushQuadraticStreamPoints(
      points,
      { x: startX, y: startY },
      {
        x: startX + firstBendSideOffset,
        y: startY + firstBendDrop * 0.5,
      },
      firstBendEnd,
      8,
      0.5,
    );

    const verticalEnd = {
      x: startX,
      y: startY + firstDrop,
    };
    points.push(verticalEnd);
    this.pushCubicStreamPoints(
      points,
      verticalEnd,
      {
        x: startX + finalSideOffset,
        y: verticalEnd.y + finalDrop * 0.35,
      },
      {
        x: startX + finalSideOffset,
        y: verticalEnd.y + finalDrop * 0.65,
      },
      {
        x: startX,
        y: verticalEnd.y + finalDrop,
      },
      16,
    );
    points.push({
      x: startX,
      y: verticalEnd.y + finalDrop + this.refCenterStreamDistance(1000),
    });

    return points;
  }

  getColoredCenterStreamPoints(startX, startY, direction) {
    const sideOffset = direction * this.refCenterStreamDistance(60);
    const drop = this.refCenterStreamDistance(170 + 200);
    const points = [
      { x: startX, y: startY },
    ];

    this.pushQuadraticStreamPoints(
      points,
      { x: startX, y: startY },
      {
        x: startX,
        y: startY + drop * 0.45,
      },
      {
        x: startX + sideOffset,
        y: startY + drop,
      },
      20,
      1,
    );
    points.push({
      x: startX + sideOffset,
      y: startY + drop + this.refCenterStreamDistance(1000),
    });

    return points;
  }

  pushQuadraticStreamPoints(points, start, control, end, samples, maxT = 1) {
    for (let index = 1; index <= samples; index += 1) {
      const t = (index / samples) * maxT;
      const inv = 1 - t;

      points.push({
        x: inv * inv * start.x + 2 * inv * t * control.x + t * t * end.x,
        y: inv * inv * start.y + 2 * inv * t * control.y + t * t * end.y,
      });
    }
  }

  pushCubicStreamPoints(points, start, controlA, controlB, end, samples) {
    for (let index = 1; index <= samples; index += 1) {
      const t = index / samples;
      const inv = 1 - t;

      points.push({
        x:
          inv ** 3 * start.x +
          3 * inv ** 2 * t * controlA.x +
          3 * inv * t ** 2 * controlB.x +
          t ** 3 * end.x,
        y:
          inv ** 3 * start.y +
          3 * inv ** 2 * t * controlA.y +
          3 * inv * t ** 2 * controlB.y +
          t ** 3 * end.y,
      });
    }
  }

  clipStreamToEndY(points, endY) {
    const clippedPoints = [];

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];

      if (point.y <= endY) {
        clippedPoints.push(point);
        continue;
      }

      const previous = clippedPoints[clippedPoints.length - 1] || point;
      const deltaY = point.y - previous.y;

      if (deltaY > 0) {
        const progress = (endY - previous.y) / deltaY;
        clippedPoints.push({
          x: Phaser.Math.Linear(previous.x, point.x, progress),
          y: endY,
        });
      }
      break;
    }

    return clippedPoints.length ? clippedPoints : points;
  }

  refCenterStreamDistance(value) {
    return (this.image.displayHeight / REFERENCE_CENTER_STREAM_HEIGHT) * value;
  }

  drawProgressiveLine(points, progress, retractFromSource = false) {
    const segmentLengths = [];
    let totalLength = 0;
    const visiblePoints = [];

    if (retractFromSource) {
      const retainedPoints = this.slicePolylineByProgress(
        points,
        1 - Phaser.Math.Clamp(progress, 0, 1),
        1,
      );

      if (retainedPoints.length < 2) {
        return visiblePoints;
      }

      this.pouringLine.beginPath();
      this.pouringLine.moveTo(retainedPoints[0].x, retainedPoints[0].y);
      visiblePoints.push(retainedPoints[0]);
      for (let index = 1; index < retainedPoints.length; index += 1) {
        this.pouringLine.lineTo(retainedPoints[index].x, retainedPoints[index].y);
        visiblePoints.push(retainedPoints[index]);
      }
      this.pouringLine.strokePath();
      return visiblePoints;
    }

    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const length = Phaser.Math.Distance.Between(
        previous.x,
        previous.y,
        current.x,
        current.y,
      );

      segmentLengths.push(length);
      totalLength += length;
    }

    let remainingLength = totalLength * Phaser.Math.Clamp(progress, 0, 1);

    this.pouringLine.beginPath();
    this.pouringLine.moveTo(points[0].x, points[0].y);
    visiblePoints.push(points[0]);

    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const segmentLength = segmentLengths[index - 1];

      if (remainingLength >= segmentLength) {
        this.pouringLine.lineTo(current.x, current.y);
        visiblePoints.push(current);
        remainingLength -= segmentLength;
        continue;
      }

      if (remainingLength > 0) {
        const segmentProgress = remainingLength / segmentLength;
        const endPoint = {
          x: Phaser.Math.Linear(previous.x, current.x, segmentProgress),
          y: Phaser.Math.Linear(previous.y, current.y, segmentProgress),
        };

        this.pouringLine.lineTo(endPoint.x, endPoint.y);
        visiblePoints.push(endPoint);
      }

      break;
    }

    this.pouringLine.strokePath();
    return visiblePoints;
  }

  getAnimatedStreamPoints(points, lineWidth) {
    if (points.length <= 2) {
      return points;
    }

    const wobbleAmount = Math.min(lineWidth * POUR_STREAM_WOBBLE_AMOUNT, 0.6);
    const time = (this.scene.time.now || 0) * 0.009;

    return points.map((point, index) => {
      if (index === 0 || index === points.length - 1) {
        return point;
      }

      const previous = points[index - 1];
      const next = points[index + 1];
      const dx = next.x - previous.x;
      const dy = next.y - previous.y;
      const length = Math.max(Math.hypot(dx, dy), 1);
      const pathProgress = index / (points.length - 1);
      const strength = Math.sin(pathProgress * Math.PI);
      const offset =
        Math.sin(pathProgress * Math.PI * 2 + time) * wobbleAmount * strength;

      return {
        x: point.x + (-dy / length) * offset,
        y: point.y + (dx / length) * offset,
      };
    });
  }

  slicePolylineByProgress(points, startProgress, endProgress) {
    const segmentLengths = [];
    let totalLength = 0;

    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const length = Phaser.Math.Distance.Between(
        previous.x,
        previous.y,
        current.x,
        current.y,
      );

      segmentLengths.push(length);
      totalLength += length;
    }

    const startLength = totalLength * startProgress;
    const endLength = totalLength * endProgress;
    const result = [];
    let traveled = 0;

    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const segmentLength = segmentLengths[index - 1];
      const segmentStart = traveled;
      const segmentEnd = traveled + segmentLength;

      if (segmentLength <= 0) {
        traveled = segmentEnd;
        continue;
      }

      if (segmentEnd >= startLength && segmentStart <= endLength) {
        const localStart = Phaser.Math.Clamp(
          (startLength - segmentStart) / segmentLength,
          0,
          1,
        );
        const localEnd = Phaser.Math.Clamp(
          (endLength - segmentStart) / segmentLength,
          0,
          1,
        );

        if (!result.length) {
          result.push({
            x: Phaser.Math.Linear(previous.x, current.x, localStart),
            y: Phaser.Math.Linear(previous.y, current.y, localStart),
          });
        }
        result.push({
          x: Phaser.Math.Linear(previous.x, current.x, localEnd),
          y: Phaser.Math.Linear(previous.y, current.y, localEnd),
        });
      }

      traveled = segmentEnd;
    }

    return result;
  }

  getPouringColor(color) {
    const lineColors = {
      black: 0x111111,
      purple: 0xb517ff,
      red: 0xff3030,
      white: 0xffffff,
      yellow: 0xffd21f,
    };

    return lineColors[color] || 0xffffff;
  }

  getBottlePourMouth(bottle, streamAngle = null) {
    const localX = bottle.displayWidth * POUR_MOUTH_OFFSET_X;
    const localY = bottle.displayHeight * POUR_MOUTH_OFFSET_Y;

    return this.getBottleLocalPoint(bottle, localX, localY, streamAngle);
  }

  getBottleCurrentStageBottomPoint(bottle, pourStage, streamAngle = null) {
    const lowerSide = this.getBottleLowerSideDirection(bottle, streamAngle);
    const localX =
      bottle.displayWidth *
      (POURING_BOTTLE_START_OFFSET_X +
        POURING_BOTTLE_STAGE_EDGE_OFFSET_X * lowerSide);
    const localY = bottle.displayHeight * POURING_BOTTLE_START_OFFSET_Y;

    return this.getBottleLocalPoint(bottle, localX, localY, streamAngle);
  }

  getBottleLowerSideDirection(bottle, streamAngle = null) {
    const angle = streamAngle ?? bottle.angle ?? 0;

    return angle >= 0 ? 1 : -1;
  }

  getBottleLocalPoint(bottle, localX, localY, streamAngle = null) {
    const angle = Phaser.Math.DegToRad(streamAngle ?? bottle.angle ?? 0);

    return {
      x: bottle.x + localX * Math.cos(angle) - localY * Math.sin(angle),
      y: bottle.y + localX * Math.sin(angle) + localY * Math.cos(angle),
    };
  }

  getReferenceStreamAngle(bottle) {
    const direction = (bottle?.angle || 0) >= 0 ? 1 : -1;

    return this.getPourTiltAngle(POUR_STREAM_REFERENCE_STAGE) * direction;
  }

  applyDropletLayout(droplet, { x, y, targetWidth, angle = null }) {
    const sourceWidth = Math.max(droplet.width || 1, 1);
    const scale = Math.max(targetWidth, 1) / sourceWidth;

    droplet.setPosition(x, y);
    droplet.setScale(scale);
    if (angle !== null) {
      droplet.setAngle(angle);
    }
  }
}
