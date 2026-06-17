import Phaser from "phaser";

import { adStart, onCtaPressed, onAudioVolumeChange } from "../networkPlugin";
import { isIpadScreen } from "../utils/isIpadScreen.js";

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

  /**
   * This is required specially for Mintegral & MRAID networks.
   * Do not remove if you are using those networks.
   */
  adNetworkSetup() {
    adStart();

    // This is required for MRAID networks, you can remove if you are not using MRAID
    onAudioVolumeChange(this.scene);
  }

  create() {
    this.adNetworkSetup();
    const { height, centerX } = this.cameras.main;

    this.endcardSfx = this.sound.add("endcard", { volume: 0.3 });
    this.playEndcardSound();

    this.carouselSlides = [
      { key: "slide1" },
      { key: "slide2" },
      { key: "slide3" },
      { key: "slide4" },
    ];
    this.carousel = null;
    this.ctaTween = null;
    this.viewportLayoutTimeout = null;

    this.logo = this.add
      .image(centerX, height * 0.06, "logo")
      .setScale(0.2)
    this.collection = this.add
      .image(centerX, height * 0.13, "gemsCollection")
      .setScale(0.6)
    this.topText = this.add
      .image(centerX, height * 0.25, "topTextEndcard")
    this.cta = this.add
      .image(centerX, height * 0.915, "cta")
      .setInteractive({ useHandCursor: true });
    this.rightBg = this.add
      .image(centerX, height * 0.5, "bgLandscape")
      .setVisible(false)
      .setDepth(1);

    this.onScenePointerDown = () => onCtaPressed();
    this.input.on("pointerdown", this.onScenePointerDown);

    this.applyResponsiveLayout(this.scale.gameSize, {
      animateCarouselEntry: true,
    });
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
      this.scale.off("resize", this.handleResize, this);
      if (this.onViewportLayoutChange) {
        window.removeEventListener("resize", this.onViewportLayoutChange);
        window.removeEventListener(
          "orientationchange",
          this.onViewportLayoutChange,
        );
        if (window.visualViewport) {
          window.visualViewport.removeEventListener(
            "resize",
            this.onViewportLayoutChange,
          );
        }
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
      if (this.carousel) {
        this.carousel.destroy();
        this.carousel = null;
      }
      if (this.rightBg) {
        this.rightBg.destroy();
        this.rightBg = null;
      }
      if (this.onScenePointerDown) {
        this.input.off("pointerdown", this.onScenePointerDown);
      }
    });
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

  playEndcardSound() {
    if (!this.sound || !this.sound.get("endcard")) {
      return;
    }

    this.sound.stopByKey("bgm");
    this.sound.play("endcard", { volume: 0.3 });
  }

  applyCtaLayout(x, y, targetWidth, pulseAmount = 0.05) {
    if (!this.cta) {
      return;
    }

    const sourceWidth = Math.max(this.cta.width || this.cta.displayWidth || 1, 1);
    const clampedTargetWidth = Math.max(targetWidth, 1);
    const baseScale = clampedTargetWidth / sourceWidth;
    const fromScale = Math.max(baseScale * (1 - pulseAmount), 0.01);
    const toScale = Math.max(baseScale * (1 + pulseAmount), 0.01);

    this.cta.setPosition(x, y);
    this.cta.setScale(baseScale);
    this.cta.setDepth(5);

    if (this.ctaTween) {
      this.ctaTween.stop();
      this.ctaTween.remove();
      this.ctaTween = null;
    }

    this.ctaTween = this.tweens.add({
      targets: this.cta,
      scale: {
        from: fromScale,
        to: toScale,
      },
      duration: 600,
      ease: "Quadratic.InOut",
      repeat: -1,
      yoyo: true,
    });
  }

  rebuildCarousel(animateEntry = false) {
    let previousCarouselState = null;
    if (this.carousel && typeof this.carousel.getState === "function") {
      previousCarouselState = this.carousel.getState();
    }

    if (this.carousel) {
      this.carousel.destroy();
      this.carousel = null;
    }

    if (!this.currentLayout) {
      return;
    }

    const { width, height, isLandscape, leftPanelWidth, leftPanelCenterX } =
      this.currentLayout;
    const maskViewportWidth = isLandscape ? leftPanelWidth : width;
    const visibleCount = 3;
    const spacing = 24;
    const slideWidth = isLandscape ? 1300 : 900;
    const carouselX = isLandscape ? leftPanelCenterX : width * 0.5;
    const carouselY = isLandscape ? height * 0.51 : height * 0.592;

    this.carousel = this.createAutoCarousel(this, {
      x: carouselX,
      y: carouselY,
      slides: this.carouselSlides,
      visibleCount,
      viewportWidth: maskViewportWidth,
      slideWidth,
      spacing,
      marqueeSpeed: 350,
      entryFromY: 0,
      playEntryAnimation: animateEntry,
    });

    if (
      previousCarouselState &&
      this.carousel &&
      typeof this.carousel.setState === "function"
    ) {
      this.carousel.setState(previousCarouselState);
    }
  }

  applyResponsiveLayout(gameSize, options = {}) {
    const { animateCarouselEntry = false } = options;
    const width = Math.max(gameSize?.width || this.scale.width, 1);
    const height = Math.max(gameSize?.height || this.scale.height, 1);
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
    const rightPanelWidth = isLandscape ? width * 0.5 : width;
    const leftPanelCenterX = isLandscape ? leftPanelWidth * 0.5 : centerX;
    const rightPanelCenterX = isLandscape
      ? leftPanelWidth + rightPanelWidth * 0.5
      : centerX;

    this.currentLayout = {
      width,
      height,
      isLandscape,
      leftPanelWidth,
      rightPanelWidth,
      leftPanelCenterX,
      rightPanelCenterX,
    };

    this.rebuildCarousel(animateCarouselEntry);

    if (isLandscape) {
      const isIpad = isIpadScreen(viewportWidth, viewportHeight);      
      if (this.rightBg) {
        this.rightBg
          .setPosition(rightPanelCenterX, height * 0.5)
          .setDisplaySize(rightPanelWidth + 100, height)
          .setVisible(true)
          .setDepth(1);
      }
      if (this.logo) {
        this.logo.setPosition(rightPanelCenterX, height * (isIpad ? 0.32 : 0.26));
        this.logo.setScale(0.35);
        this.logo.setDepth(5);
      }
      if (this.collection) {
        this.collection.setPosition(rightPanelCenterX, height * (isIpad ? 0.41 : 0.37));
        this.collection.setScale(rightPanelWidth * 0.7 / (this.collection.width || this.collection.displayWidth || 1));
        this.collection.setDepth(5);
      }
      if (this.topText) {
        this.topText.setPosition(rightPanelCenterX, height * 0.55);
        this.topText.setScale(rightPanelWidth * 0.9 / (this.topText.width || this.topText.displayWidth || 1));
        this.topText.setDepth(5);
      }
      if (this.cta) {
        const landscapeTargetWidth = Phaser.Math.Clamp(
          rightPanelWidth * 0.84,
          280,
          960,
        );
        this.applyCtaLayout(
          rightPanelCenterX,
          height * (isIpad ? 0.72 : 0.75),
          landscapeTargetWidth,
          0.04,
        );
      }
      return;
    }

    if (this.logo) {
      this.logo.setPosition(centerX, height * 0.06);
      this.logo.setScale(0.2);
    }
    if (this.collection) {
      this.collection.setPosition(centerX, height * 0.13);
      this.collection.setScale(0.6);
    }
    if (this.topText) {
      this.topText.setPosition(centerX, height * 0.25);
      this.topText.setScale(1);
    }
    if (this.cta) {
      const portraitTargetWidth = Phaser.Math.Clamp(width * 0.62, 320, 760);
      this.applyCtaLayout(centerX, height * 0.915, portraitTargetWidth, 0.05);
    }
    if (this.rightBg) {
      this.rightBg.setVisible(false);
    }
  }

  handleResize(gameSize) {
    const width = Math.max(gameSize?.width || this.scale.width, 1);
    const height = Math.max(gameSize?.height || this.scale.height, 1);
    this.cameras.main.setSize(width, height);
    this.applyResponsiveLayout({ width, height });
  }

  createAutoCarousel(scene, config) {
    const {
      x,
      y,
      slides,

      visibleCount = 3,
      viewportWidth = null,
      spacing = 24,

      slideWidth = 260,
      height = null,
      textSlideHeight = 180,

      marqueeSpeed = 180,

      enableDrag = true,
      pauseOnDrag = true,

      entryFadeDuration = 1500,
      entryFromY = 50,
      entryStagger = 60,
      playEntryAnimation = true,
    } = config;

    if (!slides || slides.length === 0) {
      throw new Error("createAutoCarousel: slides[] is required.");
    }

    const resolvedViewportWidth = Math.max(
      Math.round(
        viewportWidth ??
          slideWidth * visibleCount + spacing * (visibleCount - 1),
      ),
      1,
    );

    let computedHeight = height;
    if (computedHeight == null) {
      let maxH = 0;
      for (const s of slides) {
        if (s.key) {
          const tex = scene.textures.get(s.key);
          const src = tex?.getSourceImage?.();
          const w = src?.width || tex?.get(0)?.width;
          const h = src?.height || tex?.get(0)?.height;
          if (w && h) maxH = Math.max(maxH, slideWidth * (h / w));
        } else if (s.text) {
          maxH = Math.max(maxH, textSlideHeight);
        }
      }
      computedHeight = Math.ceil(maxH || textSlideHeight);
    }

    const viewportX = x - resolvedViewportWidth / 2;
    const viewportY = y - computedHeight / 2;

    const viewport = scene.add.container(viewportX, viewportY);
    viewport.setSize(resolvedViewportWidth, computedHeight);

    const [mask] = Phaser.Actions.AddMaskShape(viewport, {
      shape: "rectangle",
      aspectRatio: resolvedViewportWidth / computedHeight,
      region: new Phaser.Geom.Rectangle(
        viewportX,
        viewportY,
        resolvedViewportWidth,
        computedHeight,
      ),
    });

    const track = scene.add.container(0, 0);
    viewport.add(track);

    const step = slideWidth + spacing;
    const slideCount = slides.length;
    const wrapDistance = step * slideCount;
    const minCoveredWidth = resolvedViewportWidth + step * 2;
    const copyCount = Math.max(2, Math.ceil(minCoveredWidth / wrapDistance) + 1);

    const slideNodes = [];

    for (let copy = 0; copy < copyCount; copy++) {
      slides.forEach((s, i) => {
        const slide = scene.add.container((copy * slideCount + i) * step, 0);

        const hit = scene.add.rectangle(
          slideWidth / 2,
          computedHeight / 2,
          slideWidth,
          computedHeight,
          0x000000,
          0.001,
        );
        hit.setOrigin(0.5);
        slide.add(hit);

        const cx = slideWidth / 2;
        const cy = computedHeight / 2;

        if (s.key) {
          const img = scene.add.image(cx, cy, s.key).setOrigin(0.5);

          const tex = scene.textures.get(s.key);
          const src = tex?.getSourceImage?.();
          const w = src?.width || tex?.get(0)?.width;
          const h = src?.height || tex?.get(0)?.height;

          if (w && h) img.setDisplaySize(slideWidth, slideWidth * (h / w));
          else img.setDisplaySize(slideWidth, computedHeight);

          slide.add(img);
        }

        if (s.text) {
          const txt = scene.add
            .text(cx, cy, s.text, s.style || {})
            .setOrigin(0.5);
          slide.add(txt);
        }

        track.add(slide);
        slideNodes.push(slide);
      });
    }

    const normalizeTrack = () => {
      while (track.x <= -wrapDistance) track.x += wrapDistance;
      while (track.x > 0) track.x -= wrapDistance;
    };

    const marqueeVelocity = -Math.abs(marqueeSpeed);
    let isAutoRunning = true;

    const next = () => {
      track.x -= step;
      normalizeTrack();
    };

    const getProgress = () => {
      if (wrapDistance <= 0) {
        return 0;
      }
      const wrappedOffset = (((-track.x % wrapDistance) + wrapDistance) % wrapDistance);
      return wrappedOffset / wrapDistance;
    };

    const setProgress = (progress) => {
      if (wrapDistance <= 0) {
        track.x = 0;
        return;
      }
      const normalizedProgress = Phaser.Math.Clamp(Number(progress) || 0, 0, 0.999999);
      track.x = -normalizedProgress * wrapDistance;
      normalizeTrack();
    };

    const startAuto = () => {
      isAutoRunning = true;
    };

    const stopAuto = () => {
      isAutoRunning = false;
    };

    let isDragging = false;
    const handleUpdate = (_time, delta) => {
      if (!isAutoRunning || isDragging) return;
      track.x += marqueeVelocity * (delta / 1000);
      normalizeTrack();
    };

    scene.events.on("update", handleUpdate);

    // Drag zone
    let startX = 0;
    let trackStartX = 0;

    const zone = scene.add
      .zone(
        viewportX + resolvedViewportWidth / 2,
        viewportY + computedHeight / 2,
        resolvedViewportWidth,
        computedHeight,
      )
      .setInteractive();

    if (enableDrag) {
      zone.on("pointerdown", (p) => {
        isDragging = true;
        startX = p.x;
        trackStartX = track.x;
        if (pauseOnDrag) stopAuto();
      });

      zone.on("pointermove", (p) => {
        if (!isDragging) return;
        track.x = trackStartX + (p.x - startX);
        normalizeTrack();
      });

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        normalizeTrack();
        if (pauseOnDrag) startAuto();
      };

      zone.on("pointerup", endDrag);
      zone.on("pointerupoutside", endDrag);
    }

    const playEntry = () => {
      viewport.alpha = 0;
      viewport.y = viewportY + entryFromY;

      const visibleSlides = slideNodes.slice(0, visibleCount);

      visibleSlides.forEach((s) => {
        s.alpha = 0;
        s.y = entryFromY; 
      });

      scene.tweens.add({
        targets: viewport,
        alpha: 1,
        y: viewportY,
        duration: entryFadeDuration,
        ease: "Cubic.Out",
      });

      if (visibleSlides.length) {
        scene.tweens.add({
          targets: visibleSlides,
          alpha: 1,
          y: 0,
          duration: entryFadeDuration,
          ease: "Cubic.Out",
          delay: scene.tweens.stagger(entryStagger),
        });
      }
    };

    startAuto();
    if (playEntryAnimation) {
      playEntry();
    }

    return {
      viewport,
      track,
      playEntry,
      next,
      getState: () => ({
        progress: getProgress(),
        isAutoRunning,
      }),
      setState: (state) => {
        if (!state || typeof state !== "object") {
          return;
        }
        if (typeof state.progress === "number") {
          setProgress(state.progress);
        }
        if (typeof state.isAutoRunning === "boolean") {
          isAutoRunning = state.isAutoRunning;
        }
      },
      startAuto,
      stopAuto,
      destroy: () => {
        stopAuto();
        scene.events.off("update", handleUpdate);
        zone.destroy();
        mask.destroy();
        viewport.destroy(true);
      },
    };
  }
}
