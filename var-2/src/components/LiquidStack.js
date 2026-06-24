const DEFAULT_MAX_LAYERS = 4;
const DEFAULT_DEPTH = 4;
const POUR_TEXTURE_PREFIX = "liquid-pouring";
const POUR_LIQUID_WIDTH_SCALE = 1.85;
const POUR_LIQUID_HEIGHT_TO_WIDTH = 0.774;
const POUR_LIQUID_OFFSET_X = 0;
const POUR_LIQUID_OFFSET_Y = .1;
const POUR_LIQUID_ROTATION_OFFSET = -60;
const STAGE_REVEAL_DURATION = 320;
const STAGE_REVEAL_RISE = 0.06;
const STAGE_FILL_START_PROGRESS = 0.78;
const STAGE_FILL_EASE_POWER = 1.8;
const STAGE_DRAIN_END_PROGRESS = 1;
const STAGE_DRAIN_EASE_POWER = 2.2;
const STAGE_BATCH_BLEND_OVERLAP = 0.28;

export class LiquidStack {
  constructor(scene, bottle, options = {}) {
    this.scene = scene;
    this.bottle = bottle;
    this.maxLayers = options.maxLayers || DEFAULT_MAX_LAYERS;
    this.texturePrefix = options.texturePrefix || "liquid";
    this.depth = clampDepth(options.depth ?? DEFAULT_DEPTH);
    this.offsetX = options.offsetX || 0;
    this.offsetY = options.offsetY || 0;
    this.liquidWidth = options.liquidWidth || 62;
    this.liquidHeight = options.liquidHeight || 118;
    this.contents = [];
    this.layers = [];
    this.isPouring = false;

    this.createLayerPool();
  }

  createLayerPool() {
    for (let index = 0; index < this.maxLayers; index += 1) {
      const stage = index + 1;
      const layer = this.scene.add.image(
        0,
        0,
        `${this.texturePrefix}-white-${stage}`,
      );

      layer.setOrigin(0.5);
      layer.setDepth(this.depth);
      layer.setVisible(false);
      this.layers.push(layer);
    }
  }

  setBottle(bottle) {
    this.bottle = bottle;
    return this;
  }

  setContents(contents) {
    const safeContents = Array.isArray(contents)
      ? contents.slice(0, this.maxLayers)
      : [];
    this.contents.length = 0;

    for (let index = 0; index < this.maxLayers; index += 1) {
      const color = safeContents[index];
      const layer = this.layers[index];

      if (!color) {
        layer.setAlpha(1);
        layer.setCrop();
        layer.setVisible(false);
        continue;
      }

      this.contents.push(color);
      const stage = index + 1;
      layer.setTexture(this.getTextureKey(color, stage));
      layer.setAlpha(1);
      layer.setCrop();
      layer.setVisible(true);
    }

    this.layout();
    return this;
  }

  getTopColor() {
    return this.contents[this.contents.length - 1] || null;
  }

  getCount() {
    return this.contents.length;
  }

  hasSpace() {
    return this.contents.length < this.maxLayers;
  }

  canAccept(color) {
    const topColor = this.getTopColor();

    return this.hasSpace() && (!topColor || topColor === color);
  }

  popTop() {
    if (!this.contents.length) {
      return null;
    }

    const color = this.contents.pop();
    this.renderContents();
    return color;
  }

  pushColor(color, options = {}) {
    if (!this.canAccept(color)) {
      return false;
    }

    const newLayerIndex = this.contents.length;
    this.contents.push(color);
    this.renderContents();
    if (options.animate) {
      this.animateStageReveal(newLayerIndex);
    }
    return true;
  }

  pushColorForStreamFill(color) {
    if (!this.canAccept(color)) {
      return null;
    }

    const newLayerIndex = this.contents.length;
    this.contents.push(color);
    this.renderContents();

    const layer = this.layers[newLayerIndex];
    if (!layer) {
      return null;
    }

    layer.setAlpha(0);
    layer.setCrop(0, layer.height, layer.width, 0);

    return {
      layer,
      index: newLayerIndex,
      update: (progress) => {
        this.updateStreamFillReveal(newLayerIndex, progress);
      },
      complete: () => {
        this.completeStreamFillReveal(newLayerIndex);
      },
    };
  }

  pushBatchForStreamFill(color, count = 1) {
    if (!this.canAccept(color)) {
      return null;
    }

    const availableSpace = this.maxLayers - this.contents.length;
    const safeCount = clamp(Math.round(count), 1, availableSpace);
    const startIndex = this.contents.length;
    const endIndex = startIndex + safeCount - 1;
    const fillLayers = [];

    for (let index = 0; index < safeCount; index += 1) {
      this.contents.push(color);
    }

    this.renderContents();

    for (let index = startIndex; index <= endIndex; index += 1) {
      const layer = this.layers[index];
      if (!layer) {
        continue;
      }

      this.scene.tweens.killTweensOf(layer);
      layer.setAlpha(0);
      layer.setVisible(true);
      layer.setCrop(0, layer.height, layer.width, 0);
      fillLayers.push(layer);
    }

    return {
      layers: fillLayers,
      count: safeCount,
      update: (progress) => {
        this.updateStreamBatchFillReveal(fillLayers, progress);
      },
      complete: () => {
        this.completeStreamBatchFillReveal();
      },
    };
  }

  popTopForStreamDrain() {
    if (!this.contents.length) {
      return null;
    }

    const layerIndex = this.contents.length - 1;
    const color = this.contents[layerIndex];
    const layer = this.layers[layerIndex];

    if (!layer) {
      return null;
    }

    this.scene.tweens.killTweensOf(layer);
    layer.setAlpha(1);
    layer.setVisible(true);
    layer.setCrop();

    return {
      layer,
      index: layerIndex,
      color,
      update: (progress) => {
        this.updateStreamDrainReveal(layerIndex, progress);
      },
      getRemainingProgress: (progress) => this.getStreamDrainRemainingProgress(progress),
      complete: () => {
        this.completeStreamDrainReveal(layerIndex);
      },
    };
  }

  popTopBatchForStreamDrain(count = 1, options = {}) {
    if (!this.contents.length) {
      return null;
    }

    const safeCount = clamp(Math.round(count), 1, this.contents.length);
    const endIndex = this.contents.length - 1;
    const startIndex = endIndex - safeCount + 1;
    const drainLayers = [];
    let currentProgress = 0;
    let isComplete = false;

    const applyBatchVisual = () => {
      if (isComplete) {
        return;
      }

      for (let index = startIndex; index <= endIndex; index += 1) {
        const layer = this.layers[index];
        if (!layer) {
          continue;
        }

        this.scene.tweens.killTweensOf(layer);
        layer.setTexture(this.getTextureKey(this.contents[index], index + 1));
        layer.setAlpha(1);
        layer.setVisible(true);
        if (!drainLayers.includes(layer)) {
          drainLayers.push(layer);
        }
        layer.setCrop();
      }
    };

    applyBatchVisual();

    return {
      layers: drainLayers,
      count: safeCount,
      refresh: () => {
        if (isComplete) {
          return;
        }

        applyBatchVisual();
        if (options.fadeOnly) {
          this.updateStreamBatchFadeDrainReveal(drainLayers, currentProgress);
        } else {
          this.updateStreamBatchDrainReveal(drainLayers, currentProgress);
        }
      },
      update: (progress) => {
        if (isComplete) {
          return;
        }

        currentProgress = progress;
        if (options.fadeOnly) {
          this.updateStreamBatchFadeDrainReveal(drainLayers, progress);
        } else {
          this.updateStreamBatchDrainReveal(drainLayers, progress);
        }
      },
      getRemainingProgress: (progress) => this.getStreamDrainRemainingProgress(progress),
      complete: () => {
        if (isComplete) {
          return;
        }

        isComplete = true;
        this.completeStreamBatchDrainReveal(safeCount);
      },
    };
  }

  renderContents() {
    for (let index = 0; index < this.maxLayers; index += 1) {
      const color = this.contents[index];
      const layer = this.layers[index];

      if (!color) {
        layer.setAlpha(1);
        layer.setCrop();
        layer.setVisible(false);
        continue;
      }

      const stage = index + 1;
      layer.setTexture(this.getTextureKey(color, stage));
      layer.setAlpha(1);
      layer.setCrop();
      layer.setVisible(true);
    }

    this.layout();
  }

  animateStageReveal(index) {
    const layer = this.layers[index];

    if (!layer?.visible) {
      return;
    }

    const finalY = layer.y;
    const riseDistance = (this.bottle?.displayHeight || this.sd(this.liquidHeight)) *
      STAGE_REVEAL_RISE;

    this.scene.tweens.killTweensOf(layer);
    layer.setAlpha(0);
    layer.setY(finalY + riseDistance);

    this.scene.tweens.add({
      targets: layer,
      alpha: 1,
      y: finalY,
      duration: STAGE_REVEAL_DURATION,
      ease: "Sine.easeOut",
    });
  }

  updateStreamFillReveal(index, progress) {
    const layer = this.layers[index];

    if (!layer?.visible) {
      return;
    }

    const linearFillProgress = clamp(
      (progress - STAGE_FILL_START_PROGRESS) / (1 - STAGE_FILL_START_PROGRESS),
      0,
      1,
    );
    const fillProgress = Math.pow(linearFillProgress, STAGE_FILL_EASE_POWER);
    const cropHeight = Math.max(layer.height * fillProgress, 1);
    const cropY = layer.height - cropHeight;

    layer.setAlpha(fillProgress > 0 ? 1 : 0);
    layer.setCrop(0, cropY, layer.width, cropHeight);
  }

  updateStreamBatchFillReveal(layers, progress) {
    if (!Array.isArray(layers) || !layers.length) {
      return;
    }

    const easedProgress = Math.pow(clamp(progress, 0, 1), STAGE_FILL_EASE_POWER);
    const stepSpan = 1 - STAGE_BATCH_BLEND_OVERLAP;
    const totalSpan =
      layers.length <= 1 ? 1 : (layers.length - 1) * stepSpan + 1;
    const fillPosition = easedProgress * totalSpan;

    layers.forEach((layer, index) => {
      if (!layer?.visible) {
        return;
      }

      const fillProgress = smoothstep(clamp(fillPosition - index * stepSpan, 0, 1));
      const cropHeight = Math.max(layer.height * fillProgress, 1);
      const cropY = layer.height - cropHeight;

      layer.setAlpha(fillProgress > 0 ? 1 : 0);
      layer.setCrop(0, cropY, layer.width, cropHeight);
    });
  }

  completeStreamFillReveal(index) {
    const layer = this.layers[index];

    if (!layer) {
      return;
    }

    layer.setAlpha(1);
    layer.setCrop();
  }

  completeStreamBatchFillReveal() {
    this.renderContents();
  }

  updateStreamDrainReveal(index, progress) {
    const layer = this.layers[index];

    if (!layer?.visible) {
      return;
    }

    const remainingProgress = this.getStreamDrainRemainingProgress(progress);
    const cropHeight = Math.max(layer.height * remainingProgress, 1);
    const cropY = layer.height - cropHeight;

    layer.setAlpha(remainingProgress > 0.01 ? 1 : 0);
    layer.setCrop(0, cropY, layer.width, cropHeight);
  }

  updateStreamBatchDrainReveal(layers, progress) {
    if (!Array.isArray(layers) || !layers.length) {
      return;
    }

    const drainProgress = Math.pow(
      clamp(progress / STAGE_DRAIN_END_PROGRESS, 0, 1),
      STAGE_DRAIN_EASE_POWER,
    );
    const stepSpan = 1 - STAGE_BATCH_BLEND_OVERLAP;
    const totalSpan =
      layers.length <= 1 ? 1 : (layers.length - 1) * stepSpan + 1;
    const drainPosition = drainProgress * totalSpan;

    layers.forEach((layer, index) => {
      if (!layer?.visible) {
        return;
      }

      const reverseIndex = layers.length - 1 - index;
      const localDrainProgress = smoothstep(
        clamp(drainPosition - reverseIndex * stepSpan, 0, 1),
      );
      const remainingProgress = 1 - localDrainProgress;
      const cropHeight = Math.max(layer.height * remainingProgress, 1);
      const cropY = layer.height - cropHeight;

      layer.setAlpha(remainingProgress > 0.01 ? 1 : 0);
      layer.setCrop(0, cropY, layer.width, cropHeight);
    });
  }

  updateStreamBatchFadeDrainReveal(layers, progress) {
    if (!Array.isArray(layers) || !layers.length) {
      return;
    }

    const remainingProgress = this.getStreamDrainRemainingProgress(progress);

    layers.forEach((layer) => {
      if (!layer?.visible) {
        return;
      }

      const cropHeight = Math.max(layer.height * remainingProgress, 1);
      const cropY = layer.height - cropHeight;

      layer.setCrop(0, cropY, layer.width, cropHeight);
      layer.setAlpha(remainingProgress > 0.01 ? 1 : 0);
    });
  }

  getStreamDrainRemainingProgress(progress) {
    const drainProgress = Math.pow(
      clamp(progress / STAGE_DRAIN_END_PROGRESS, 0, 1),
      STAGE_DRAIN_EASE_POWER,
    );

    return 1 - drainProgress;
  }

  completeStreamDrainReveal(index) {
    const layer = this.layers[index];

    if (layer) {
      layer.setAlpha(1);
      layer.setCrop();
    }

    this.popTop();
  }

  completeStreamBatchDrainReveal(count) {
    const safeCount = clamp(Math.round(count), 1, this.contents.length);

    this.contents.splice(this.contents.length - safeCount, safeCount);
    this.renderContents();
  }

  setPouring(isPouring) {
    this.isPouring = Boolean(isPouring);
    this.renderContents();
    return this;
  }

  getTextureKey(color, stage) {
    const prefix = this.isPouring ? POUR_TEXTURE_PREFIX : this.texturePrefix;

    return `${prefix}-${color}-${stage}`;
  }

  layout() {
    const bottleBounds = getBottleBounds(this.bottle);
    const bottleAngle = this.bottle?.angle || 0;
    const angle = (bottleAngle * Math.PI) / 180;
    const pourOffsetX = this.isPouring
      ? (this.bottle?.displayWidth || this.sd(this.liquidWidth)) *
        POUR_LIQUID_OFFSET_X
      : 0;
    const pourOffsetY = this.isPouring
      ? (this.bottle?.displayHeight || this.sd(this.liquidHeight)) *
        POUR_LIQUID_OFFSET_Y
      : 0;
    const x =
      bottleBounds.centerX +
      this.sd(this.offsetX) +
      pourOffsetX * Math.cos(angle) -
      pourOffsetY * Math.sin(angle);
    const y =
      bottleBounds.centerY +
      this.sd(this.offsetY) +
      pourOffsetX * Math.sin(angle) +
      pourOffsetY * Math.cos(angle);
    const liquidWidth = this.isPouring
      ? (this.bottle?.displayWidth || this.sd(this.liquidWidth)) *
        POUR_LIQUID_WIDTH_SCALE
      : this.sd(this.liquidWidth);
    const liquidHeight = this.isPouring
      ? liquidWidth * POUR_LIQUID_HEIGHT_TO_WIDTH
      : this.sd(this.liquidHeight);

    for (let index = 0; index < this.maxLayers; index += 1) {
      const layer = this.layers[index];

      layer.setPosition(x, y);
      layer.setDisplaySize(liquidWidth, liquidHeight);
      const pouringRotationOffset =
        this.isPouring && bottleAngle < 0
          ? -POUR_LIQUID_ROTATION_OFFSET
          : POUR_LIQUID_ROTATION_OFFSET;

      layer.setAngle(bottleAngle + (this.isPouring ? pouringRotationOffset : 0));
      layer.setFlipX(this.isPouring && bottleAngle < 0);
    }

    return this;
  }

  setVisible(visible) {
    this.layers.forEach((layer) => {
      layer.setVisible(visible && layer.texture.key !== "__MISSING");
    });
    return this;
  }

  destroy() {
    this.layers.forEach((layer) => layer.destroy());
    this.layers.length = 0;
    this.bottle = null;
  }

  sd(value) {
    return typeof this.scene.sd === "function" ? this.scene.sd(value) : value;
  }
}

export function createLiquidStacks(scene, bottles, options = {}) {
  return bottles.map((bottle) => new LiquidStack(scene, bottle, options));
}

function getBottleBounds(bottle) {
  if (typeof bottle.centerX === "number" && typeof bottle.bottom === "number") {
    return {
      centerX: bottle.centerX,
      centerY: bottle.centerY ?? bottle.bottom,
      bottom: bottle.bottom,
    };
  }

  if (typeof bottle.getBounds === "function") {
    const bounds = bottle.getBounds();

    return {
      centerX: bounds.centerX,
      centerY: bounds.centerY,
      bottom: bounds.bottom,
    };
  }

  const width = bottle.displayWidth || bottle.width || 0;
  const height = bottle.displayHeight || bottle.height || 0;
  const originX = bottle.originX ?? 0.5;
  const originY = bottle.originY ?? 0.5;

  return {
    centerX: bottle.x + width * (0.5 - originX),
    centerY: bottle.y + height * (0.5 - originY),
    bottom: bottle.y + height * (1 - originY),
  };
}

function clampDepth(depth) {
  return Math.min(Math.max(depth, -10), 30);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value) {
  const t = clamp(value, 0, 1);

  return t * t * (3 - 2 * t);
}
