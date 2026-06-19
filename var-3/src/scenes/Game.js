import Phaser from "phaser";

import { GameLayout } from "../components/GameLayout.js";
import { YingYangBottle } from "../components/YingYangBottle.js";
import { adStart, onCtaPressed, onAudioVolumeChange } from "../networkPlugin";

const END_SCENE_FIRST_TOUCH_DELAY = 60000;

export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  init() {
    console.log("%cSCENE::Game", "color: #fff; background: #f0f;");
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
    this.startBackgroundMusic();

    this.background = this.add.image(0, 0, "bgLandscape").setOrigin(0.5);
    this.logo = this.add.image(0, 0, "logo");
    this.topText = this.add.image(0, 0, "topTextEndcard");
    this.downloadButton = this.add
      .image(0, 0, "downloadButton")
      .setInteractive({ useHandCursor: true });

    this.downloadButton.on("pointerdown", onCtaPressed);
    this.startEndSceneTimerAfterFirstTouch();

    this.layout = new GameLayout(this, {
      background: this.background,
      logo: this.logo,
      topText: this.topText,
      downloadButton: this.downloadButton,
    });
    this.layout.start();

    this.yingYangBottle = new YingYangBottle(this);
    this.yingYangBottle.create();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.downloadButton.off("pointerdown", onCtaPressed);
      this.endSceneTimerEvent?.remove(false);
      this.endSceneTimerEvent = null;
      this.backgroundMusic?.stop();
      this.backgroundMusic?.destroy();
      this.layout.destroy();
      this.yingYangBottle.destroy();
    });
  }

  startEndSceneTimerAfterFirstTouch() {
    if (this.hasStartedEndSceneTimer) {
      return;
    }

    this.input.once("pointerdown", () => {
      if (this.hasStartedEndSceneTimer) {
        return;
      }

      this.hasStartedEndSceneTimer = true;
      this.endSceneTimerEvent = this.time.delayedCall(
        END_SCENE_FIRST_TOUCH_DELAY,
        () => {
          this.endSceneTimerEvent = null;
          this.scene.launch("EndScene");
          this.scene.bringToTop("EndScene");
        },
      );
    });
  }

  startBackgroundMusic() {
    if (this.backgroundMusic || !this.cache.audio.exists("bgm")) {
      return;
    }

    this.backgroundMusic = this.sound.add("bgm", {
      loop: true,
      volume: 0.35,
    });

    const playMusic = () => {
      if (!this.backgroundMusic?.isPlaying) {
        this.backgroundMusic.play();
      }
    };

    this.input.once("pointerdown", () => {
      if (this.sound.locked) {
        this.sound.once(Phaser.Sound.Events.UNLOCKED, playMusic);
        return;
      }

      playMusic();
    });
  }
}
