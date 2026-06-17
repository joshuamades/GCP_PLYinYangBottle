import Phaser from "phaser";

import { LiquidStack } from "./LiquidStack.js";

const YIN_YANG_MAX_FILL_STAGE = 17;
const DEBUG_ONE_POUR_TO_STAGE_17 = false;
const YIN_YANG_LIQUID_SCALE = 1;
const YIN_YANG_STAGE_17_LIQUID_SCALE = 1;
const YIN_YANG_STAGE_17_OFFSET_X = 0;
const YIN_YANG_STAGE_17_OFFSET_Y = 0;
const YIN_YANG_RIGHT_DROPLET_COVERED_STAGE = 7;
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
    this.yinYangStacks = null;
    this.surroundingBottles = [];
    this.surroundingBottleLiquids = [];
    this.bottleCaps = [];
    this.sealedBottleIndexes = new Set();
    this.selectedSourceStack = null;
    this.selectedBottle = null;
    this.selectedBottleBaseY = 0;
    this.selectedBottleTween = null;
    this.bottleGlow = null;
    this.pouringSprite = null;
    this.pouringLine = null;
    this.pouringTween = null;
    this.isPouring = false;
    this.topDroplet = null;
    this.bottomDroplet = null;
    this.viewportLayoutTimeout = null;

    this.handleResize = this.handleResize.bind(this);
    this.handleViewportLayoutChange = this.handleViewportLayoutChange.bind(this);
  }

  create() {
    this.image = this.scene.add.image(0, 0, this.textureKey);
    this.image.setOrigin(0.5);
    this.image.setDepth(3);
    this.centerWhiteLiquid = this.scene.add.image(0, 0, "liquid-yang-white-3");
    this.centerWhiteLiquid.setOrigin(0.5);
    this.centerWhiteLiquid.setDepth(1);
    this.centerBlackLiquid = this.scene.add.image(0, 0, "liquid-yin-black-3");
    this.centerBlackLiquid.setOrigin(0.5);
    this.centerBlackLiquid.setDepth(1);
    this.yinYangStacks = {
      white: ["white", "white", "white"],
      black: ["black", "black", "black"],
    };
    const surroundingBottleContents = createSurroundingBottleContents();

    this.surroundingBottles = Array.from({ length: 16 }, () => {
      const bottle = this.scene.add.image(0, 0, "slide2");
      bottle.setOrigin(0.5);
      bottle.setDepth(3);
      bottle.setInteractive({ useHandCursor: true });
      return bottle;
    });
    this.surroundingBottleLiquids = this.surroundingBottles.map(
      (bottle, index) => {
        const liquidStack = new LiquidStack(this.scene, bottle, {
          depth: 1,
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
      cap.setDepth(4);
      cap.setVisible(false);
      return cap;
    });
    this.bottleGlow = this.scene.add.image(0, 0, "bottleGlow");
    this.bottleGlow.setOrigin(0.5);
    this.bottleGlow.setDepth(2);
    this.bottleGlow.setVisible(false);
    this.topDroplet = this.scene.add.image(0, 0, "yangEmptyDroplet");
    this.topDroplet.setOrigin(0.5);
    this.topDroplet.setDepth(4);
    this.bottomDroplet = this.scene.add.image(0, 0, "yangEmptyDroplet");
    this.bottomDroplet.setOrigin(0.5);
    this.bottomDroplet.setDepth(4);
    this.pouringSprite = this.scene.add.sprite(0, 0, "liquid-pouring-white-1");
    this.pouringSprite.setOrigin(0.5);
    this.pouringSprite.setDepth(5);
    this.pouringSprite.setVisible(false);
    this.pouringLine = this.scene.add.graphics();
    this.pouringLine.setDepth(6);
    this.createPouringAnimations();

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

    this.clearBottleSelection();
    this.pouringTween?.stop();
    this.image?.destroy();
    this.centerWhiteLiquid?.destroy();
    this.centerBlackLiquid?.destroy();
    this.surroundingBottleLiquids.forEach((liquidStack) =>
      liquidStack.destroy(),
    );
    this.surroundingBottles.forEach((bottle) => bottle.destroy());
    this.bottleCaps.forEach((cap) => cap.destroy());
    this.bottleGlow?.destroy();
    this.pouringSprite?.destroy();
    this.pouringLine?.destroy();
    this.topDroplet?.destroy();
    this.bottomDroplet?.destroy();
    this.image = null;
    this.centerWhiteLiquid = null;
    this.centerBlackLiquid = null;
    this.yinYangStacks = null;
    this.surroundingBottles = [];
    this.surroundingBottleLiquids = [];
    this.bottleCaps = [];
    this.sealedBottleIndexes.clear();
    this.selectedSourceStack = null;
    this.selectedBottle = null;
    this.selectedBottleBaseY = 0;
    this.selectedBottleTween = null;
    this.bottleGlow = null;
    this.pouringSprite = null;
    this.pouringLine = null;
    this.pouringTween = null;
    this.isPouring = false;
    this.topDroplet = null;
    this.bottomDroplet = null;
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
      !this.bottomDroplet
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
    this.updateCenterDropletTextures();
    this.applySurroundingBottleLayout(width, height);
    this.applyPouringSpriteLayout(centerX, centerY);

    this.applyDropletLayout(this.topDroplet, {
      x: centerX - this.image.displayWidth * 0.1,
      y: centerY - this.image.displayHeight * 0.14,
      targetWidth: this.image.displayWidth * 0.09,
    });
    this.applyDropletLayout(this.bottomDroplet, {
      x: centerX + this.image.displayWidth * 0.1,
      y: centerY + this.image.displayHeight * 0.2,
      targetWidth: this.image.displayWidth * 0.09,
    });
  }

  applyCenterLiquidLayout(centerX, centerY) {
    const whiteStage = this.getYinYangStage("white");
    const blackStage = this.getYinYangStage("black");

    this.centerWhiteLiquid.setTexture(
      `liquid-yang-white-${whiteStage}`,
    );
    this.applyCenterLiquid(
      this.centerWhiteLiquid,
      this.getCenterLiquidLayout(centerX, centerY, whiteStage),
    );
    this.centerBlackLiquid.setTexture(
      `liquid-yin-black-${blackStage}`,
    );
    this.applyCenterLiquid(
      this.centerBlackLiquid,
      this.getCenterLiquidLayout(centerX, centerY, blackStage),
    );
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

  applyPouringSpriteLayout(centerX, centerY) {
    if (!this.pouringSprite || this.isPouring) {
      return;
    }

    this.pouringSprite.setPosition(
      centerX + this.image.displayWidth * 0.35,
      centerY - this.image.displayHeight * 0.18,
    );
    this.pouringSprite.setDisplaySize(
      this.image.displayWidth * 0.42,
      this.image.displayHeight * 0.28,
    );
  }

  applyCenterLiquid(liquid, { x, y, targetWidth, targetHeight }) {
    liquid.setPosition(x, y);
    liquid.setDisplaySize(targetWidth, targetHeight);
  }

  applySurroundingBottleLayout(width, height) {
    const bottleSlots = [
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
    const targetWidth = Phaser.Math.Clamp(width * 0.12, 80, 150);

    this.surroundingBottles.forEach((bottle, index) => {
      const slot = bottleSlots[index];
      const sourceWidth = Math.max(bottle.width || 1, 1);
      const scale = Math.max(targetWidth, 1) / sourceWidth;

      bottle.setPosition(width * slot.x, height * slot.y);
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
        this.selectedBottleBaseY = bottle.y;
        this.applyBottleGlowLayout(bottle);
      }
    });
  }

  bindInput() {
    this.surroundingBottles.forEach((bottle, index) => {
      bottle.on("pointerdown", () => {
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

    this.image.on("pointerdown", () => {
      this.tryPourSelectedToYinYangBottle();
    });
  }

  selectBottle(bottle) {
    this.clearBottleSelection();

    this.selectedBottle = bottle;
    this.selectedBottleBaseY = bottle.y;
    this.applyBottleGlowLayout(bottle);
    this.bottleGlow.setVisible(true);

    this.selectedBottleTween = this.scene.tweens.add({
      targets: bottle,
      y: bottle.y - bottle.displayHeight * 0.06,
      duration: 320,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        this.applyBottleGlowLayout(bottle);
        this.surroundingBottleLiquids[
          this.surroundingBottles.indexOf(bottle)
        ]?.layout();
      },
    });
  }

  clearBottleSelection() {
    if (this.selectedBottleTween) {
      this.selectedBottleTween.stop();
      this.selectedBottleTween.remove();
      this.selectedBottleTween = null;
    }

    if (this.selectedBottle) {
      const selectedIndex = this.surroundingBottles.indexOf(this.selectedBottle);
      this.selectedBottle.y = this.selectedBottleBaseY;
      this.selectedBottle.setAngle(0);
      this.surroundingBottleLiquids[selectedIndex]?.layout();
      this.applyBottleCapLayout(selectedIndex);
    }

    this.bottleGlow?.setVisible(false);
    this.selectedBottle = null;
    this.selectedBottleBaseY = 0;
  }

  applyBottleGlowLayout(bottle) {
    if (!this.bottleGlow) {
      return;
    }

    this.bottleGlow.setPosition(bottle.x, bottle.y);
    this.bottleGlow.setAngle(bottle.angle || 0);
    this.bottleGlow.setDisplaySize(
      bottle.displayWidth * 1.15,
      bottle.displayHeight * 1.08,
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

  createPouringAnimations() {
    ["white", "black", "purple", "red", "yellow"].forEach((color) => {
      const animationKey = `pour-${color}`;

      if (this.scene.anims.exists(animationKey)) {
        return;
      }

      this.scene.anims.create({
        key: animationKey,
        frames: [1, 2, 3, 4].map((stage) => ({
          key: `liquid-pouring-${color}-${stage}`,
        })),
        frameRate: 14,
        repeat: -1,
      });
    });
  }

  tryPourSelectedToYinYangBottle() {
    if (this.isPouring) {
      return false;
    }

    const sourceStack = this.selectedSourceStack;
    const sourceBottle = this.selectedBottle;
    const color = sourceStack?.getTopColor();

    if (!sourceBottle || (color !== "white" && color !== "black")) {
      return false;
    }

    const targetSide = this.yinYangStacks[color];
    const targetTopColor = targetSide[targetSide.length - 1] || null;

    if (
      targetSide.length >= YIN_YANG_MAX_FILL_STAGE ||
      (targetTopColor && targetTopColor !== color)
    ) {
      return false;
    }

    const pourStage = sourceStack.getCount();

    sourceStack.popTop();
    this.playPouringAnimation(color, sourceBottle, pourStage, () => {
      this.addYinYangPour(color);
      this.updateYinYangLiquidTexture(color);
      this.selectedSourceStack = null;
      this.clearBottleSelection();
      this.isPouring = false;
    });
    return true;
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
      return false;
    }

    const pourStage = sourceStack.getCount();

    sourceStack.popTop();
    this.playBottlePourAnimation(color, sourceBottle, targetBottle, pourStage, () => {
      targetStack.pushColor(color);
      if (this.isBottleComplete(targetStack)) {
        this.sealBottle(targetIndex);
      }
      this.selectedSourceStack = null;
      this.clearBottleSelection();
      this.isPouring = false;
    });
    return true;
  }

  isBottleComplete(liquidStack) {
    const contents = liquidStack?.contents || [];

    return (
      contents.length === liquidStack.maxLayers &&
      contents.every((color) => color === contents[0])
    );
  }

  updateYinYangLiquidTexture(color) {
    this.applyCenterLiquidLayout(this.image.x, this.image.y);
    this.updateCenterDropletTextures();
  }

  updateCenterDropletTextures() {
    if (!this.topDroplet || !this.bottomDroplet || !this.yinYangStacks) {
      return;
    }

    const rightStage = this.getYinYangStage("black");

    this.topDroplet.setTexture("yangEmptyDroplet");
    this.topDroplet.setAlpha(1);
    this.bottomDroplet.setTexture(
      rightStage >= YIN_YANG_RIGHT_DROPLET_COVERED_STAGE
        ? "yingDroplet"
        : "yangEmptyDroplet",
    );
    this.bottomDroplet.setAngle(
      rightStage >= YIN_YANG_RIGHT_DROPLET_COVERED_STAGE ? 0 : 180,
    );
    this.bottomDroplet.setAlpha(1);
  }

  playPouringAnimation(color, sourceBottle, pourStage, onComplete) {
    if (!this.pouringSprite) {
      return;
    }

    this.isPouring = true;
    this.pouringTween?.stop();
    if (this.selectedBottleTween) {
      this.selectedBottleTween.stop();
      this.selectedBottleTween.remove();
      this.selectedBottleTween = null;
    }

    const sourceIndex = this.surroundingBottles.indexOf(sourceBottle);
    const sourceLiquidStack = this.surroundingBottleLiquids[sourceIndex];
    const originalX = sourceBottle.x;
    const originalY = this.selectedBottleBaseY || sourceBottle.y;
    const originalAngle = sourceBottle.angle || 0;
    const sideDirection = color === "white" ? 1 : -1;
    const endX =
      color === "white"
        ? this.image.x - this.image.displayWidth * 0.16
        : this.image.x + this.image.displayWidth * 0.16;
    const endY = this.getYinYangPourEndY(color);
    const pourX = endX + sideDirection * this.image.displayWidth * 0.22;
    const pourY = this.image.y - this.image.displayHeight * 0.46;
    const pourAngle = sideDirection < 0 ? 62 : -62;

    const updateSourceBottleAttachments = () => {
      sourceLiquidStack?.layout();
      if (sourceBottle === this.selectedBottle) {
        this.applyBottleGlowLayout(sourceBottle);
      }
    };

    this.scene.tweens.add({
      targets: sourceBottle,
      x: pourX,
      y: pourY,
      angle: pourAngle,
      duration: 260,
      ease: "Sine.easeInOut",
      onUpdate: updateSourceBottleAttachments,
      onComplete: () => {
        updateSourceBottleAttachments();
        this.playPouringStream(color, sourceBottle, endX, endY, pourStage, () => {
          this.scene.tweens.add({
            targets: sourceBottle,
            x: originalX,
            y: originalY,
            angle: originalAngle,
            duration: 260,
            ease: "Sine.easeInOut",
            onUpdate: updateSourceBottleAttachments,
            onComplete: () => {
              updateSourceBottleAttachments();
              onComplete?.();
            },
          });
        });
      },
    });
  }

  playBottlePourAnimation(color, sourceBottle, targetBottle, pourStage, onComplete) {
    if (!this.pouringSprite) {
      return;
    }

    this.isPouring = true;
    this.pouringTween?.stop();
    if (this.selectedBottleTween) {
      this.selectedBottleTween.stop();
      this.selectedBottleTween.remove();
      this.selectedBottleTween = null;
    }

    const sourceIndex = this.surroundingBottles.indexOf(sourceBottle);
    const sourceLiquidStack = this.surroundingBottleLiquids[sourceIndex];
    const originalX = sourceBottle.x;
    const originalY = this.selectedBottleBaseY || sourceBottle.y;
    const originalAngle = sourceBottle.angle || 0;
    const sideDirection = sourceBottle.x < targetBottle.x ? -1 : 1;
    const endX = targetBottle.x;
    const targetIndex = this.surroundingBottles.indexOf(targetBottle);
    const targetStack = this.surroundingBottleLiquids[targetIndex];
    const endY = this.getBottlePourEndY(targetBottle, targetStack);
    const pourX = endX + sideDirection * targetBottle.displayWidth * 0.95;
    const pourY = endY - targetBottle.displayHeight * 0.22;
    const pourAngle = sideDirection < 0 ? 62 : -62;

    const updateSourceBottleAttachments = () => {
      sourceLiquidStack?.layout();
      this.applyBottleCapLayout(sourceIndex);
      if (sourceBottle === this.selectedBottle) {
        this.applyBottleGlowLayout(sourceBottle);
      }
    };

    this.scene.tweens.add({
      targets: sourceBottle,
      x: pourX,
      y: pourY,
      angle: pourAngle,
      duration: 240,
      ease: "Sine.easeInOut",
      onUpdate: updateSourceBottleAttachments,
      onComplete: () => {
        updateSourceBottleAttachments();
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
              duration: 240,
              ease: "Sine.easeInOut",
              onUpdate: updateSourceBottleAttachments,
              onComplete: () => {
                updateSourceBottleAttachments();
                onComplete?.();
              },
            });
          },
          targetBottle,
        );
      },
    });
  }

  sealBottle(index) {
    const cap = this.bottleCaps[index];

    if (!cap || this.sealedBottleIndexes.has(index)) {
      return;
    }

    this.sealedBottleIndexes.add(index);
    this.applyBottleCapLayout(index);
    cap.setAlpha(0);
    cap.setVisible(true);
    this.scene.tweens.add({
      targets: cap,
      alpha: 1,
      duration: 180,
      ease: "Sine.easeOut",
    });
  }

  getYinYangPourEndY(color) {
    const nextStage = Phaser.Math.Clamp(
      this.yinYangStacks[color].length + 1,
      1,
      YIN_YANG_MAX_FILL_STAGE,
    );
    const progress = (nextStage - 1) / (YIN_YANG_MAX_FILL_STAGE - 1);
    const bottomY = this.image.y + this.image.displayHeight * 0.22;
    const topY = this.image.y - this.image.displayHeight * 0.2;

    return Phaser.Math.Linear(bottomY, topY, progress);
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

  playPouringStream(
    color,
    sourceBottle,
    endX,
    endY,
    pourStage,
    onComplete,
    targetBottle = null,
  ) {
    const mouth = this.getBottlePourMouth(sourceBottle);
    const startX = mouth.x;
    const startY = mouth.y;
    const controlX = (startX + endX) * 0.5;
    const targetWidth = targetBottle?.displayWidth || this.image.displayWidth;
    const targetHeight = targetBottle?.displayHeight || this.image.displayHeight;
    const controlY = Math.min(startY, endY) - targetHeight * 0.08;

    this.pouringSprite.stop();
    this.pouringSprite.setVisible(false);
    this.pouringLine.clear();

    this.pouringTween = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 1500,
      ease: "Sine.easeInOut",
      onUpdate: (tween) => {
        const t = tween.getValue();

        this.drawPouringLine({
          color,
          sourceBottle,
          pourStage,
          startX,
          startY,
          controlX,
          controlY,
          endX,
          endY,
          progress: t,
          lineWidth: Phaser.Math.Clamp(sourceBottle.displayWidth * 0.08, 4, 10),
        });
      },
      onComplete: () => {
        this.pouringLine.clear();
        this.pouringTween = null;
        onComplete?.();
      },
    });
  }

  drawPouringLine({
    color,
    sourceBottle,
    pourStage,
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    progress,
    lineWidth,
  }) {
    if (!this.pouringLine) {
      return;
    }

    const lineColor = this.getPouringColor(color);
    const points = 18;

    this.pouringLine.clear();
    this.drawPouringBottleFill(sourceBottle, lineColor, lineWidth, pourStage);
    this.pouringLine.lineStyle(lineWidth, lineColor, 0.95);
    this.pouringLine.beginPath();

    for (let index = 0; index <= points; index += 1) {
      const t = progress * (index / points);
      const inv = 1 - t;
      const x = inv * inv * startX + 2 * inv * t * controlX + t * t * endX;
      const y = inv * inv * startY + 2 * inv * t * controlY + t * t * endY;

      if (index === 0) {
        this.pouringLine.moveTo(x, y);
      } else {
        this.pouringLine.lineTo(x, y);
      }
    }

    this.pouringLine.strokePath();
  }

  drawPouringBottleFill(sourceBottle, lineColor, lineWidth, pourStage) {
    const angle = Phaser.Math.DegToRad(sourceBottle.angle || 0);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const stageProgress = Phaser.Math.Clamp(pourStage, 1, 4) / 4;
    const halfWidth = sourceBottle.displayWidth * 0.16;
    const bottomY = sourceBottle.displayHeight * 0.28;
    const topY = Phaser.Math.Linear(
      sourceBottle.displayHeight * 0.18,
      -sourceBottle.displayHeight * 0.28,
      stageProgress,
    );
    const leftX = -halfWidth;
    const rightX = halfWidth;
    const points = [
      this.localToWorld(sourceBottle, leftX, bottomY, sin, cos),
      this.localToWorld(sourceBottle, rightX, bottomY, sin, cos),
      this.localToWorld(sourceBottle, rightX * 0.82, topY, sin, cos),
      this.localToWorld(sourceBottle, leftX * 0.82, topY, sin, cos),
    ];

    this.pouringLine.fillStyle(lineColor, 0.78);
    this.pouringLine.beginPath();
    this.pouringLine.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index += 1) {
      this.pouringLine.lineTo(points[index].x, points[index].y);
    }
    this.pouringLine.closePath();
    this.pouringLine.fillPath();

    const highlightStart = this.localToWorld(
      sourceBottle,
      leftX * 0.38,
      bottomY - sourceBottle.displayHeight * 0.02,
      sin,
      cos,
    );
    const highlightEnd = this.localToWorld(
      sourceBottle,
      leftX * 0.14,
      topY + sourceBottle.displayHeight * 0.04,
      sin,
      cos,
    );

    this.pouringLine.lineStyle(Math.max(lineWidth * 0.35, 2), 0xffffff, 0.65);
    this.pouringLine.beginPath();
    this.pouringLine.moveTo(highlightStart.x, highlightStart.y);
    this.pouringLine.lineTo(highlightEnd.x, highlightEnd.y);
    this.pouringLine.strokePath();
  }

  localToWorld(sourceBottle, localX, localY, sin, cos) {
    return {
      x: sourceBottle.x + localX * cos - localY * sin,
      y: sourceBottle.y + localX * sin + localY * cos,
    };
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

  getBottlePourMouth(bottle) {
    const angle = Phaser.Math.DegToRad(bottle.angle || 0);
    const localX = 0;
    const localY = -bottle.displayHeight * 0.42;

    return {
      x: bottle.x + localX * Math.cos(angle) - localY * Math.sin(angle),
      y: bottle.y + localX * Math.sin(angle) + localY * Math.cos(angle),
    };
  }

  applyDropletLayout(droplet, { x, y, targetWidth, angle = 0 }) {
    const sourceWidth = Math.max(droplet.width || 1, 1);
    const scale = Math.max(targetWidth, 1) / sourceWidth;

    droplet.setPosition(x, y);
    droplet.setScale(scale);
    droplet.setAngle(angle);
  }
}
