import Phaser from "phaser";

import { GameLayout } from "../components/GameLayout.js";
import { YingYangBottle } from "../components/YingYangBottle.js";
import { adStart, onCtaPressed, onAudioVolumeChange } from "../networkPlugin";

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

    this.background = this.add.image(0, 0, "bgLandscape").setOrigin(0.5);
    this.logo = this.add.image(0, 0, "logo");
    this.topText = this.add.image(0, 0, "topTextEndcard");
    this.downloadButton = this.add
      .image(0, 0, "downloadButton")
      .setInteractive({ useHandCursor: true });

    this.downloadButton.on("pointerdown", onCtaPressed);

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
      this.layout.destroy();
      this.yingYangBottle.destroy();
    });
  }
}
