import Phaser from "phaser";

import { LiquidStack } from "./LiquidStack.js";

const SURROUNDING_BOTTLE_CONTENTS = [
  ["red", "white", "black", "yellow"],
  ["white", "purple", "yellow"],
  ["yellow", "white"],
  ["white", "red"],
  ["black", "purple"],
  ["yellow", "red", "black"],
  ["white", "red", "yellow"],
  ["black", "yellow", "white"],
  ["purple", "white", "black"],
  ["red", "yellow"],
  ["black", "white", "red"],
  ["white", "black", "purple"],
  ["red", "white"],
  ["white", "red", "black", "purple"],
  ["red", "yellow"],
  ["purple", "white"],
];

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
    this.selectedSourceStack = null;
    this.selectedBottle = null;
    this.selectedBottleBaseY = 0;
    this.selectedBottleTween = null;
    this.bottleGlow = null;
    this.pouringSprite = null;
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

        liquidStack.setContents(SURROUNDING_BOTTLE_CONTENTS[index]);
        return liquidStack;
      },
    );
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
    this.bottleGlow?.destroy();
    this.pouringSprite?.destroy();
    this.topDroplet?.destroy();
    this.bottomDroplet?.destroy();
    this.image = null;
    this.centerWhiteLiquid = null;
    this.centerBlackLiquid = null;
    this.yinYangStacks = null;
    this.surroundingBottles = [];
    this.surroundingBottleLiquids = [];
    this.selectedSourceStack = null;
    this.selectedBottle = null;
    this.selectedBottleBaseY = 0;
    this.selectedBottleTween = null;
    this.bottleGlow = null;
    this.pouringSprite = null;
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
      angle: 180,
    });
  }

  applyCenterLiquidLayout(centerX, centerY) {
    this.centerWhiteLiquid.setTexture(
      `liquid-yang-white-${this.yinYangStacks.white.length || 1}`,
    );
    this.applyCenterLiquid(this.centerWhiteLiquid, {
      x: centerX - this.image.displayWidth * 0,
      y: centerY + this.image.displayHeight * 0,
      targetWidth: this.image.displayWidth * 1,
      targetHeight: this.image.displayHeight * 1,
    });
    this.centerBlackLiquid.setTexture(
      `liquid-yin-black-${this.yinYangStacks.black.length || 1}`,
    );
    this.applyCenterLiquid(this.centerBlackLiquid, {
      x: centerX + this.image.displayWidth * 0.01,
      y: centerY + this.image.displayHeight * 0,
      targetWidth: this.image.displayWidth * 1,
      targetHeight: this.image.displayHeight * 1,
    });
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

      if (bottle === this.selectedBottle) {
        this.selectedBottleBaseY = bottle.y;
        this.applyBottleGlowLayout(bottle);
      }
    });
  }

  bindInput() {
    this.surroundingBottles.forEach((bottle, index) => {
      bottle.on("pointerdown", () => {
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
      this.selectedBottle.y = this.selectedBottleBaseY;
      this.selectedBottle.setAngle(0);
      this.surroundingBottleLiquids[
        this.surroundingBottles.indexOf(this.selectedBottle)
      ]?.layout();
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

  createPouringAnimations() {
    ["white", "black"].forEach((color) => {
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
      targetSide.length >= 4 ||
      (targetTopColor && targetTopColor !== color)
    ) {
      return false;
    }

    sourceStack.popTop();
    this.playPouringAnimation(color, sourceBottle, () => {
      targetSide.push(color);
      this.updateYinYangLiquidTexture(color);
      this.selectedSourceStack = null;
      this.clearBottleSelection();
      this.isPouring = false;
    });
    return true;
  }

  updateYinYangLiquidTexture(color) {
    const sideStack = this.yinYangStacks[color];
    const stage = Phaser.Math.Clamp(sideStack.length, 1, 4);
    const textureKey =
      color === "white" ? `liquid-yang-white-${stage}` : `liquid-yin-black-${stage}`;
    const liquid = color === "white" ? this.centerWhiteLiquid : this.centerBlackLiquid;

    liquid.setTexture(textureKey);
  }

  playPouringAnimation(color, sourceBottle, onComplete) {
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
    const sideDirection = sourceBottle.x < this.image.x ? -1 : 1;
    const endX =
      color === "white"
        ? this.image.x - this.image.displayWidth * 0.16
        : this.image.x + this.image.displayWidth * 0.16;
    const endY = this.image.y - this.image.displayHeight * 0.24;
    const pourX = endX + sideDirection * this.image.displayWidth * 0.22;
    const pourY = endY - this.image.displayHeight * 0.08;
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
        this.playPouringStream(color, sourceBottle, endX, endY, () => {
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

  playPouringStream(color, sourceBottle, endX, endY, onComplete) {
    const mouth = this.getBottlePourMouth(sourceBottle);
    const startX = mouth.x;
    const startY = mouth.y;
    const controlX = (startX + endX) * 0.5;
    const controlY = Math.min(startY, endY) - this.image.displayHeight * 0.08;

    this.pouringSprite.setPosition(startX, startY);
    this.pouringSprite.setDisplaySize(
      sourceBottle.displayWidth * 0.95,
      sourceBottle.displayHeight * 0.62,
    );
    this.pouringSprite.setAngle(sourceBottle.angle > 0 ? 24 : -24);
    this.pouringSprite.setAlpha(0.95);
    this.pouringSprite.setVisible(true);
    this.pouringSprite.play(`pour-${color}`);

    this.pouringTween = this.scene.tweens.addCounter({
      from: 0,
      to: 1,
      duration: 560,
      ease: "Sine.easeInOut",
      onUpdate: (tween) => {
        const t = tween.getValue();
        const inv = 1 - t;
        const x = inv * inv * startX + 2 * inv * t * controlX + t * t * endX;
        const y = inv * inv * startY + 2 * inv * t * controlY + t * t * endY;
        const width = Phaser.Math.Linear(
          sourceBottle.displayWidth * 0.95,
          this.image.displayWidth * 0.2,
          t,
        );
        const height = Phaser.Math.Linear(
          sourceBottle.displayHeight * 0.62,
          this.image.displayHeight * 0.2,
          t,
        );

        this.pouringSprite.setPosition(x, y);
        this.pouringSprite.setDisplaySize(width, height);
        this.pouringSprite.setAlpha(Phaser.Math.Linear(0.95, 0.76, t));
      },
      onComplete: () => {
        this.pouringSprite.stop();
        this.pouringSprite.setVisible(false);
        this.pouringSprite.setAlpha(1);
        this.pouringSprite.setAngle(0);
        this.pouringTween = null;
        onComplete?.();
      },
    });
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
