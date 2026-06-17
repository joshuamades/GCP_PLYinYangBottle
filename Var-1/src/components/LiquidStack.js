const DEFAULT_MAX_LAYERS = 4;
const DEFAULT_DEPTH = 4;

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
        layer.setVisible(false);
        continue;
      }

      this.contents.push(color);
      const stage = index + 1;
      layer.setTexture(`${this.texturePrefix}-${color}-${stage}`);
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

  pushColor(color) {
    if (!this.canAccept(color)) {
      return false;
    }

    this.contents.push(color);
    this.renderContents();
    return true;
  }

  renderContents() {
    for (let index = 0; index < this.maxLayers; index += 1) {
      const color = this.contents[index];
      const layer = this.layers[index];

      if (!color) {
        layer.setVisible(false);
        continue;
      }

      const stage = index + 1;
      layer.setTexture(`${this.texturePrefix}-${color}-${stage}`);
      layer.setVisible(true);
    }

    this.layout();
  }

  layout() {
    const bottleBounds = getBottleBounds(this.bottle);
    const x = bottleBounds.centerX + this.sd(this.offsetX);
    const y = bottleBounds.centerY + this.sd(this.offsetY);
    const liquidWidth = this.sd(this.liquidWidth);
    const liquidHeight = this.sd(this.liquidHeight);

    for (let index = 0; index < this.maxLayers; index += 1) {
      const layer = this.layers[index];

      layer.setPosition(x, y);
      layer.setDisplaySize(liquidWidth, liquidHeight);
      layer.setAngle(this.bottle?.angle || 0);
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
  return Math.min(Math.max(depth, 1), 10);
}
