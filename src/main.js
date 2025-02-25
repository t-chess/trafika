import Phaser from "phaser";
import Main from "./scenes/Main";
import BootScene from "./UI/BootScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: "container",
  backgroundColor: "0x000",
  powerPreference:"high-performance",
  scene: [new BootScene(undefined,"Main"), Main]
});
