import Phaser from "phaser";

export class GameLayout {
  constructor(scene, elements) {
    this.scene = scene;
    this.background = elements.background;
    this.logo = elements.logo;
    this.topText = elements.topText;
    this.downloadButton = elements.downloadButton;
    this.downloadButtonTween = null;
    this.viewportLayoutTimeout = null;

    this.handleResize = this.handleResize.bind(this);
    this.handleViewportLayoutChange = this.handleViewportLayoutChange.bind(this);
  }

  start() {
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

    if (this.downloadButtonTween) {
      this.downloadButtonTween.stop();
      this.downloadButtonTween.remove();
      this.downloadButtonTween = null;
    }
  }

  handleResize(gameSize) {
    const width = Math.max(gameSize.width || this.scene.scale.width, 1);
    const height = Math.max(gameSize.height || this.scene.scale.height, 1);
    this.scene.cameras.main.setSize(width, height);
    this.apply({ width, height });
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
    const width = Math.max(gameSize?.width || this.scene.scale.width, 1);
    const height = Math.max(gameSize?.height || this.scene.scale.height, 1);
    const viewportWidth = Math.max(
      Math.round(window.visualViewport?.width || window.innerWidth || width),
      1,
    );
    const viewportHeight = Math.max(
      Math.round(window.visualViewport?.height || window.innerHeight || height),
      1,
    );
    const centerX = width * 0.5;
    const isLandscape = viewportWidth > viewportHeight;
    const leftPanelWidth = isLandscape ? width * 0.5 : width;
    const rightPanelWidth = isLandscape ? width * 0.475 : width;
    const leftPanelCenterX = isLandscape ? leftPanelWidth * 0.5 : centerX;
    const rightPanelCenterX = isLandscape
      ? leftPanelWidth + rightPanelWidth * 0.5
      : centerX;

    this.currentLayout = {
      isLandscape,
      leftPanelCenterX,
      rightPanelCenterX,
      leftPanelWidth,
      rightPanelWidth,
      missingY: isLandscape ? height * 0.515 : height * 0.22,
    };

    this.applyBackgroundLayout(width, height, centerX);

    if (isLandscape) {
      this.applyLandscapeLayout(width, height);
      return;
    }

    this.applyPortraitLayout(width, height, centerX);
  }

  applyBackgroundLayout(width, height, centerX) {
    if (!this.background) {
      return;
    }

    const sourceWidth = Math.max(this.background.width || 1, 1);
    const sourceHeight = Math.max(this.background.height || 1, 1);
    const coverScale = Math.max(width / sourceWidth, height / sourceHeight);

    this.background
      .setPosition(centerX, height * 0.5)
      .setScale(coverScale)
      .setDepth(-10);
  }

  applyLandscapeLayout(width, height) {
    const horizontalPadding = Math.max(width * 0.035, 24);
    const topY = Math.max(height * 0.08, 42);

    if (this.logo) {
      this.logo.setOrigin(0, 0.5);
      this.logo.setPosition(horizontalPadding, topY);
      this.logo.setScale(1.2);
    }

    if (this.downloadButton) {
      const targetWidth = Phaser.Math.Clamp(width * 0.075, 90, 160);
      this.downloadButton.setOrigin(1, 0.5);
      this.applyDownloadButtonLayout(
        width - horizontalPadding,
        topY,
        targetWidth,
        0.04,
      );
    }

    if (this.topText) {
      const targetWidth = Phaser.Math.Clamp(width * 1, 420, 980);
      this.applyTopTextLayout(
        width * 0.5,
        topY + height * 0.1,
        targetWidth,
        0.5,
      );
    }

  }

  applyPortraitLayout(width, height, centerX) {
    if (this.logo) {
      this.logo.setOrigin(0.5);
      this.logo.setPosition(width * 0.15, height * 0.05);
      this.logo.setScale(.9);
    }

    if (this.downloadButton) {
      const targetWidth = Phaser.Math.Clamp(width * 0.08, 90, 170);
      this.downloadButton.setOrigin(0.5);
      this.applyDownloadButtonLayout(
        width * 0.92,
        height * 0.05,
        targetWidth,
        0.05,
      );
    }

    if (this.topText) {
      const targetWidth = Phaser.Math.Clamp(width * 1.0, 420, 1000);
      this.applyTopTextLayout(centerX, height * 0.15, targetWidth, 0.5);
    }

  }

  applyTopTextLayout(x, y, targetWidth, originX) {
    const sourceWidth = Math.max(this.topText.width || 1, 1);
    const baseScale = Math.max(targetWidth, 1) / sourceWidth;

    this.topText.setOrigin(originX, 0.5);
    this.topText.setPosition(x, y);
    this.topText.setScale(baseScale);
    this.topText.setDepth(2);
  }

  applyDownloadButtonLayout(x, y, targetWidth, pulseAmount) {
    const sourceWidth = Math.max(
      this.downloadButton.width || this.downloadButton.displayWidth || 1,
      1,
    );
    const baseScale = Math.max(targetWidth, 1) / sourceWidth;
    const fromScale = Math.max(baseScale * (1 - pulseAmount), 0.01);
    const toScale = Math.max(baseScale * (1 + pulseAmount), 0.01);

    this.downloadButton.setPosition(x, y);
    this.downloadButton.setScale(baseScale);

    if (this.downloadButtonTween) {
      this.downloadButtonTween.stop();
      this.downloadButtonTween.remove();
    }

    this.downloadButtonTween = this.scene.tweens.add({
      targets: this.downloadButton,
      scale: {
        from: fromScale,
        to: toScale,
      },
      duration: 600,
      ease: "Quad.easeOut",
      repeat: -1,
      yoyo: true,
    });
  }
}
