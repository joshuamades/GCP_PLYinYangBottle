import Phaser from "phaser";

import { adStart, onCtaPressed, onAudioVolumeChange } from "../networkPlugin";

export class EndScene extends Phaser.Scene {
  constructor() {
    super("EndScene");
  }

  init() {
    console.log(
      "%cSCENE::EndScene",
      "color: #fff; background: rgb(255, 106, 0);",
    );
  }

  adNetworkSetup() {
    adStart();
    onAudioVolumeChange(this.scene);
  }

  create() {
    this.adNetworkSetup();
    this.disableGameInput();
    this.redirectToStoreBeforeEndScene();

    this.overlay = this.add.rectangle(0, 0, 1, 1, 0x000000, 0.75);
    this.overlay.setOrigin(0);
    this.overlay.setDepth(1);
    this.overlay.setInteractive({ useHandCursor: true });

    this.appIcon = this.add.image(0, 0, "slide1");
    this.cta = this.add
      .image(0, 0, "cta")
      .setInteractive({ useHandCursor: true });

    this.onScenePointerDown = () => onCtaPressed();
    this.input.on("pointerdown", this.onScenePointerDown);

    this.applyResponsiveLayout(this.scale.gameSize);
    this.playSceneFadeIn();

    this.onViewportLayoutChange = () => {
      this.applyResponsiveLayout(this.scale.gameSize);
      if (this.viewportLayoutTimeout) {
        window.clearTimeout(this.viewportLayoutTimeout);
      }
      this.viewportLayoutTimeout = window.setTimeout(() => {
        this.applyResponsiveLayout(this.scale.gameSize);
        this.viewportLayoutTimeout = null;
      }, 120);
    };

    window.addEventListener("resize", this.onViewportLayoutChange);
    window.addEventListener("orientationchange", this.onViewportLayoutChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        this.onViewportLayoutChange,
      );
    }

    this.scale.on("resize", this.handleResize, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.restoreGameInput();
      this.scale.off("resize", this.handleResize, this);
      window.removeEventListener("resize", this.onViewportLayoutChange);
      window.removeEventListener("orientationchange", this.onViewportLayoutChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          this.onViewportLayoutChange,
        );
      }
      if (this.viewportLayoutTimeout) {
        window.clearTimeout(this.viewportLayoutTimeout);
        this.viewportLayoutTimeout = null;
      }
      if (this.ctaTween) {
        this.ctaTween.stop();
        this.ctaTween.remove();
        this.ctaTween = null;
      }
      if (this.onScenePointerDown) {
        this.input.off("pointerdown", this.onScenePointerDown);
      }
    });
  }

  disableGameInput() {
    const gameScene = this.scene.get("Game");

    if (!gameScene?.input) {
      return;
    }

    this.previousGameInputEnabled = gameScene.input.enabled;
    gameScene.input.enabled = false;
  }

  restoreGameInput() {
    const gameScene = this.scene.get("Game");

    if (!gameScene?.input || this.previousGameInputEnabled === undefined) {
      return;
    }

    gameScene.input.enabled = this.previousGameInputEnabled;
    this.previousGameInputEnabled = undefined;
  }

  redirectToStoreBeforeEndScene() {
    if (this.hasRedirectedToStore) {
      return;
    }

    this.hasRedirectedToStore = true;
    onCtaPressed();
  }

  playSceneFadeIn(duration = 420) {
    const camera = this.cameras?.main;
    if (!camera) {
      return;
    }

    if (camera.fadeEffect?.isRunning) {
      camera.fadeEffect.reset();
    }
    camera.fadeIn(duration, 0, 0, 0);
  }

  applyResponsiveLayout(gameSize) {
    const width = Math.max(gameSize?.width || this.scale.width, 1);
    const height = Math.max(gameSize?.height || this.scale.height, 1);
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const isLandscape = width > height;

    this.overlay.setPosition(0, 0);
    this.overlay.setSize(width, height);

    const iconTargetWidth = isLandscape
      ? Phaser.Math.Clamp(height * 1, 370, 560)
      : Phaser.Math.Clamp(width * 1, 380, 600);
    const ctaTargetWidth = isLandscape
      ? Phaser.Math.Clamp(height * 0.7, 310, 560)
      : Phaser.Math.Clamp(width * 0.82, 320, 580);
    const ctaSourceHeight = Math.max(this.cta.height || 1, 1);
    const ctaSourceWidth = Math.max(this.cta.width || 1, 1);
    const ctaTargetHeight = ctaTargetWidth * (ctaSourceHeight / ctaSourceWidth);
    const gap = Phaser.Math.Clamp(height * 0.12, 56, 96);
    const groupHeight = iconTargetWidth + gap + ctaTargetHeight;
    const groupTop = centerY - groupHeight * 0.5;
    const iconY = groupTop + iconTargetWidth * 0.5;
    const ctaY = iconY + iconTargetWidth * 0.5 + gap + ctaTargetHeight * 0.5;

    this.appIcon.setPosition(centerX, iconY);
    this.appIcon.setDisplaySize(
      iconTargetWidth,
      iconTargetWidth,
    );
    this.appIcon.setDepth(2);

    this.applyCtaLayout(centerX, ctaY, ctaTargetWidth);
  }

  applyCtaLayout(x, y, targetWidth) {
    const sourceWidth = Math.max(this.cta.width || this.cta.displayWidth || 1, 1);
    const baseScale = Math.max(targetWidth, 1) / sourceWidth;

    this.cta.setPosition(x, y);
    this.cta.setScale(baseScale);
    this.cta.setDepth(3);

    if (this.ctaTween) {
      this.ctaTween.stop();
      this.ctaTween.remove();
      this.ctaTween = null;
    }

    this.ctaTween = this.tweens.add({
      targets: this.cta,
      scale: {
        from: baseScale * 0.96,
        to: baseScale * 1.04,
      },
      duration: 620,
      ease: "Quadratic.InOut",
      repeat: -1,
      yoyo: true,
    });
  }

  handleResize(gameSize) {
    const width = Math.max(gameSize?.width || this.scale.width, 1);
    const height = Math.max(gameSize?.height || this.scale.height, 1);

    this.cameras.main.setSize(width, height);
    this.applyResponsiveLayout({ width, height });
  }
}
