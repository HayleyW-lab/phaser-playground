import * as Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#2d87e8",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 400 }, debug: false },
  },
  scene: [
    GameScene,
    Stage2Scene,
    Stage3Scene,
    LevelCompleteScene,
    Stage2CompleteScene,
    Stage3CompleteScene,
    GameOverScene,
  ],
};

const game = new Phaser.Game(config);

// ========== STAGE 1 ==========
function GameScene() {
  Phaser.Scene.call(this, { key: "GameScene" });
}
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;

GameScene.prototype.create = function () {
  let self = this;

  this.platforms = this.physics.add.staticGroup();
  let ground = this.add.rectangle(400, 590, 800, 20, 0x00aa00);
  this.physics.add.existing(ground, true);
  this.platforms.add(ground);
  let platform1 = this.add.rectangle(200, 400, 200, 20, 0x00aa00);
  this.physics.add.existing(platform1, true);
  this.platforms.add(platform1);
  let platform2 = this.add.rectangle(600, 300, 200, 20, 0x00aa00);
  this.physics.add.existing(platform2, true);
  this.platforms.add(platform2);
  let platform3 = this.add.rectangle(400, 200, 200, 20, 0x00aa00);
  this.physics.add.existing(platform3, true);
  this.platforms.add(platform3);

  this.ball = this.add.circle(100, 500, 20, 0xff0000);
  this.physics.add.existing(this.ball);
  this.ball.body.setBounce(0.2);
  this.ball.body.setCollideWorldBounds(true);
  this.physics.add.collider(this.ball, this.platforms);

  this.hoopCount = 0;
  this.score = 0;

  this.scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "24px",
    color: "#ffffff",
  });
  this.hoopText = this.add.text(16, 50, "Hoops: 0/10", {
    fontSize: "24px",
    color: "#ffff00",
  });
  this.add
    .text(400, 16, "STAGE 1", { fontSize: "24px", color: "#00ffff" })
    .setOrigin(0.5);

  this.hoops = this.physics.add.staticGroup();
  this.spawnHoop();

  this.physics.add.overlap(this.ball, this.hoops, function (ball, hoop) {
    if (self.currentArrow) self.currentArrow.destroy();
    if (self.currentHoopVisual) self.currentHoopVisual.destroy();
    hoop.destroy();
    self.score += 10;
    self.hoopCount++;
    self.scoreText.setText("Score: " + self.score);
    self.hoopText.setText("Hoops: " + self.hoopCount + "/10");
    if (self.hoopCount >= 10) {
      self.scene.start("LevelCompleteScene", { score: self.score });
    } else {
      self.spawnHoop();
    }
  });

  this.cursors = this.input.keyboard.createCursorKeys();
};

GameScene.prototype.spawnHoop = function () {
  this.hoops.clear(true, true);
  if (this.currentArrow) this.currentArrow.destroy();
  if (this.currentHoopVisual) this.currentHoopVisual.destroy();
  let x = Phaser.Math.Between(150, 650);
  let y = Phaser.Math.Between(150, 450);
  this.currentHoopVisual = this.add.graphics();
  this.currentHoopVisual.lineStyle(6, 0xff6600, 1);
  this.currentHoopVisual.strokeRect(x - 30, y - 5, 60, 10);
  let hoopTrigger = this.add.zone(x, y + 20, 50, 30);
  this.physics.add.existing(hoopTrigger, true);
  this.hoops.add(hoopTrigger);
  this.currentArrow = this.add
    .text(x, y - 40, "⬇️ AIM HERE", { fontSize: "18px", color: "#ffff00" })
    .setOrigin(0.5);
};

GameScene.prototype.update = function () {
  if (this.cursors.left.isDown) {
    this.ball.body.setVelocityX(-250);
  } else if (this.cursors.right.isDown) {
    this.ball.body.setVelocityX(250);
  } else {
    this.ball.body.setVelocityX(0);
  }
  if (this.cursors.up.isDown && this.ball.body.blocked.down) {
    this.ball.body.setVelocityY(-500);
  }
  // Ball respawns if it falls off instead of dying
  if (this.ball.y > 620) {
    this.ball.x = 100;
    this.ball.y = 500;
    this.ball.body.setVelocity(0, 0);
  }
};

// ========== STAGE 2 ==========
function Stage2Scene() {
  Phaser.Scene.call(this, { key: "Stage2Scene" });
}
Stage2Scene.prototype = Object.create(Phaser.Scene.prototype);
Stage2Scene.prototype.constructor = Stage2Scene;

Stage2Scene.prototype.create = function () {
  let self = this;
  this.cameras.main.setBackgroundColor("#1a1a3e");

  this.platforms = this.physics.add.staticGroup();
  let ground = this.add.rectangle(400, 590, 800, 20, 0x005500);
  this.physics.add.existing(ground, true);
  this.platforms.add(ground);
  let platform1 = this.add.rectangle(200, 400, 200, 20, 0x005500);
  this.physics.add.existing(platform1, true);
  this.platforms.add(platform1);
  let platform2 = this.add.rectangle(600, 300, 200, 20, 0x005500);
  this.physics.add.existing(platform2, true);
  this.platforms.add(platform2);
  let platform3 = this.add.rectangle(400, 200, 200, 20, 0x005500);
  this.physics.add.existing(platform3, true);
  this.platforms.add(platform3);

  this.ball = this.add.circle(100, 500, 20, 0xff0000);
  this.physics.add.existing(this.ball);
  this.ball.body.setBounce(0.2);
  this.ball.body.setCollideWorldBounds(true);
  this.physics.add.collider(this.ball, this.platforms);

  this.hoopCount = 0;
  this.score = 0;
  this.lives = 3;
  this.isDead = false;
  this.isHit = false;

  this.scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "24px",
    color: "#ffffff",
  });
  this.hoopText = this.add.text(16, 50, "Hoops: 0/10", {
    fontSize: "24px",
    color: "#ffff00",
  });
  this.livesText = this.add.text(650, 16, "❤️❤️❤️", { fontSize: "28px" });
  this.add
    .text(400, 16, "STAGE 2 ⚡", { fontSize: "24px", color: "#ffff00" })
    .setOrigin(0.5);

  this.hoops = this.physics.add.staticGroup();
  this.spawnHoop();

  this.physics.add.overlap(this.ball, this.hoops, function (ball, hoop) {
    if (self.currentArrow) self.currentArrow.destroy();
    if (self.currentHoopVisual) self.currentHoopVisual.destroy();
    hoop.destroy();
    self.score += 10;
    self.hoopCount++;
    self.scoreText.setText("Score: " + self.score);
    self.hoopText.setText("Hoops: " + self.hoopCount + "/10");
    if (self.hoopCount >= 10) {
      self.scene.start("Stage2CompleteScene", { score: self.score });
    } else {
      self.spawnHoop();
    }
  });

  this.lightningBolts = this.physics.add.group();
  this.lightningTimer = this.time.addEvent({
    delay: 2000,
    callback: this.spawnLightning,
    callbackScope: this,
    loop: true,
  });

  this.cursors = this.input.keyboard.createCursorKeys();
};

Stage2Scene.prototype.spawnHoop = function () {
  this.hoops.clear(true, true);
  if (this.currentArrow) this.currentArrow.destroy();
  if (this.currentHoopVisual) this.currentHoopVisual.destroy();
  let x = Phaser.Math.Between(150, 650);
  let y = Phaser.Math.Between(150, 450);
  this.currentHoopVisual = this.add.graphics();
  this.currentHoopVisual.lineStyle(6, 0xff6600, 1);
  this.currentHoopVisual.strokeRect(x - 30, y - 5, 60, 10);
  let hoopTrigger = this.add.zone(x, y + 20, 50, 30);
  this.physics.add.existing(hoopTrigger, true);
  this.hoops.add(hoopTrigger);
  this.currentArrow = this.add
    .text(x, y - 40, "⬇️ AIM HERE", { fontSize: "18px", color: "#ffff00" })
    .setOrigin(0.5);
};

Stage2Scene.prototype.spawnLightning = function () {
  if (this.isDead || this.isHit) return;
  let x = Phaser.Math.Between(50, 750);
  let bolt = this.add.text(x, -30, "⚡", { fontSize: "36px" });
  this.physics.add.existing(bolt);
  let dirX = (this.ball.x - x) * 0.3;
  bolt.body.setVelocity(dirX, 300);
  bolt.body.setGravityY(-400);
  this.lightningBolts.add(bolt);
  this.physics.add.overlap(this.ball, bolt, () => {
    if (this.isHit) return;
    this.isHit = true;
    bolt.destroy();
    this.explode();
  });
};

Stage2Scene.prototype.explode = function () {
  let self = this;
  let explosion = this.add
    .text(this.ball.x, this.ball.y, "💥", { fontSize: "64px" })
    .setOrigin(0.5);
  this.ball.setVisible(false);
  this.ball.body.setVelocity(0, 0);
  this.lives--;
  let heartsMap = { 2: "❤️❤️", 1: "❤️", 0: "💀" };
  this.livesText.setText(heartsMap[this.lives] || "💀");
  this.time.delayedCall(1000, function () {
    explosion.destroy();
    if (self.lives <= 0) {
      self.scene.start("GameOverScene", { score: self.score, stage: 2 });
    } else {
      self.ball.x = 100;
      self.ball.y = 500;
      self.ball.body.setVelocity(0, 0);
      self.ball.setVisible(true);
      self.isHit = false;
    }
  });
};

Stage2Scene.prototype.update = function () {
  if (this.isDead || this.isHit) return;
  if (this.cursors.left.isDown) {
    this.ball.body.setVelocityX(-250);
  } else if (this.cursors.right.isDown) {
    this.ball.body.setVelocityX(250);
  } else {
    this.ball.body.setVelocityX(0);
  }
  if (this.cursors.up.isDown && this.ball.body.blocked.down) {
    this.ball.body.setVelocityY(-500);
  }
  this.lightningBolts.getChildren().forEach((bolt) => {
    if (bolt.y > 650) bolt.destroy();
  });
};

// ========== STAGE 3 ==========
function Stage3Scene() {
  Phaser.Scene.call(this, { key: "Stage3Scene" });
}
Stage3Scene.prototype = Object.create(Phaser.Scene.prototype);
Stage3Scene.prototype.constructor = Stage3Scene;

Stage3Scene.prototype.create = function () {
  let self = this;
  this.cameras.main.setBackgroundColor("#2d0000");

  this.platforms = this.physics.add.staticGroup();
  let ground = this.add.rectangle(400, 590, 800, 20, 0x880000);
  this.physics.add.existing(ground, true);
  this.platforms.add(ground);
  let platform1 = this.add.rectangle(200, 400, 200, 20, 0x880000);
  this.physics.add.existing(platform1, true);
  this.platforms.add(platform1);
  let platform2 = this.add.rectangle(600, 300, 200, 20, 0x880000);
  this.physics.add.existing(platform2, true);
  this.platforms.add(platform2);
  let platform3 = this.add.rectangle(400, 200, 200, 20, 0x880000);
  this.physics.add.existing(platform3, true);
  this.platforms.add(platform3);

  this.ball = this.add.circle(100, 500, 20, 0xff0000);
  this.physics.add.existing(this.ball);
  this.ball.body.setBounce(0.2);
  this.ball.body.setCollideWorldBounds(true);
  this.physics.add.collider(this.ball, this.platforms);

  this.hoopCount = 0;
  this.score = 0;
  this.lives = 3;
  this.isDead = false;
  this.isHit = false;
  this.timeLeft = 60;
  this.ballSpeed = 250;
  this.lightningDelay = 1800;

  this.scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "24px",
    color: "#ffffff",
  });
  this.hoopText = this.add.text(16, 50, "Hoops: 0/10", {
    fontSize: "24px",
    color: "#ffff00",
  });
  this.livesText = this.add.text(630, 16, "❤️❤️❤️", { fontSize: "28px" });
  this.timerText = this.add
    .text(400, 16, "⏱️ 60", { fontSize: "28px", color: "#ff4444" })
    .setOrigin(0.5);
  this.add
    .text(400, 50, "STAGE 3 ⏱️⚡", { fontSize: "22px", color: "#ff4444" })
    .setOrigin(0.5);

  this.hoops = this.physics.add.staticGroup();
  this.spawnHoop();

  this.physics.add.overlap(this.ball, this.hoops, function (ball, hoop) {
    if (self.currentArrow) self.currentArrow.destroy();
    if (self.currentHoopVisual) self.currentHoopVisual.destroy();
    hoop.destroy();
    self.score += 10;
    self.hoopCount++;
    self.scoreText.setText("Score: " + self.score);
    self.hoopText.setText("Hoops: " + self.hoopCount + "/10");

    if (self.hoopCount % 3 === 0) {
      self.ballSpeed += 50;
      self.lightningDelay = Math.max(800, self.lightningDelay - 200);
      self.lightningTimer.delay = self.lightningDelay;
      let speedUp = self.add
        .text(400, 300, "🔥 SPEEDING UP!!", {
          fontSize: "36px",
          color: "#ff4400",
        })
        .setOrigin(0.5);
      self.time.delayedCall(1000, () => speedUp.destroy());
    }

    if (self.hoopCount >= 10) {
      self.scene.start("Stage3CompleteScene", { score: self.score });
    } else {
      self.spawnHoop();
    }
  });

  this.countdownTimer = this.time.addEvent({
    delay: 1000,
    callback: function () {
      self.timeLeft--;
      self.timerText.setText("⏱️ " + self.timeLeft);
      if (self.timeLeft <= 10) self.timerText.setColor("#ff0000");
      if (self.timeLeft <= 0) {
        self.isDead = true;
        self.scene.start("GameOverScene", {
          score: self.score,
          stage: 3,
          reason: "time",
        });
      }
    },
    loop: true,
  });

  this.lightningBolts = this.physics.add.group();
  this.lightningTimer = this.time.addEvent({
    delay: this.lightningDelay,
    callback: this.spawnLightning,
    callbackScope: this,
    loop: true,
  });

  this.cursors = this.input.keyboard.createCursorKeys();
};

Stage3Scene.prototype.spawnHoop = function () {
  this.hoops.clear(true, true);
  if (this.currentArrow) this.currentArrow.destroy();
  if (this.currentHoopVisual) this.currentHoopVisual.destroy();
  let x = Phaser.Math.Between(150, 650);
  let y = Phaser.Math.Between(150, 450);
  this.currentHoopVisual = this.add.graphics();
  this.currentHoopVisual.lineStyle(6, 0xff6600, 1);
  this.currentHoopVisual.strokeRect(x - 30, y - 5, 60, 10);
  let hoopTrigger = this.add.zone(x, y + 20, 50, 30);
  this.physics.add.existing(hoopTrigger, true);
  this.hoops.add(hoopTrigger);
  this.currentArrow = this.add
    .text(x, y - 40, "⬇️ AIM HERE", { fontSize: "18px", color: "#ffff00" })
    .setOrigin(0.5);
};

Stage3Scene.prototype.spawnLightning = function () {
  if (this.isDead || this.isHit) return;
  let x = Phaser.Math.Between(50, 750);
  let bolt = this.add.text(x, -30, "⚡", { fontSize: "36px" });
  this.physics.add.existing(bolt);
  let dirX = (this.ball.x - x) * 0.4;
  bolt.body.setVelocity(dirX, 350);
  bolt.body.setGravityY(-400);
  this.lightningBolts.add(bolt);
  this.physics.add.overlap(this.ball, bolt, () => {
    if (this.isHit) return;
    this.isHit = true;
    bolt.destroy();
    this.explode();
  });
};

Stage3Scene.prototype.explode = function () {
  let self = this;
  let explosion = this.add
    .text(this.ball.x, this.ball.y, "💥", { fontSize: "64px" })
    .setOrigin(0.5);
  this.ball.setVisible(false);
  this.ball.body.setVelocity(0, 0);
  this.lives--;
  let heartsMap = { 2: "❤️❤️", 1: "❤️", 0: "💀" };
  this.livesText.setText(heartsMap[this.lives] || "💀");
  this.time.delayedCall(1000, function () {
    explosion.destroy();
    if (self.lives <= 0) {
      self.scene.start("GameOverScene", { score: self.score, stage: 3 });
    } else {
      self.ball.x = 100;
      self.ball.y = 500;
      self.ball.body.setVelocity(0, 0);
      self.ball.setVisible(true);
      self.isHit = false;
    }
  });
};

Stage3Scene.prototype.update = function () {
  if (this.isDead || this.isHit) return;
  if (this.cursors.left.isDown) {
    this.ball.body.setVelocityX(-this.ballSpeed);
  } else if (this.cursors.right.isDown) {
    this.ball.body.setVelocityX(this.ballSpeed);
  } else {
    this.ball.body.setVelocityX(0);
  }
  if (this.cursors.up.isDown && this.ball.body.blocked.down) {
    this.ball.body.setVelocityY(-550);
  }
  this.lightningBolts.getChildren().forEach((bolt) => {
    if (bolt.y > 650) bolt.destroy();
  });
};

// ========== LEVEL COMPLETE ==========
function LevelCompleteScene() {
  Phaser.Scene.call(this, { key: "LevelCompleteScene" });
}
LevelCompleteScene.prototype = Object.create(Phaser.Scene.prototype);
LevelCompleteScene.prototype.constructor = LevelCompleteScene;
LevelCompleteScene.prototype.init = function (data) {
  this.finalScore = data.score;
};
LevelCompleteScene.prototype.create = function () {
  let self = this;
  this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
  this.add
    .text(400, 100, "🏀 STAGE 1 COMPLETE!! 🏀", {
      fontSize: "40px",
      color: "#ffff00",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 180, "You nailed all 10 hoops!!", {
      fontSize: "26px",
      color: "#ffffff",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 240, "Score: " + this.finalScore, {
      fontSize: "30px",
      color: "#00ff00",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 320, "⚡ Stage 2 incoming... ⚡", {
      fontSize: "28px",
      color: "#ff6600",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 380, "Lightning is coming for you!!", {
      fontSize: "22px",
      color: "#aaaaaa",
      fontStyle: "italic",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 460, "Press SPACE to face the storm!!", {
      fontSize: "26px",
      color: "#ffff00",
    })
    .setOrigin(0.5);
  this.input.keyboard.once("keydown-SPACE", function () {
    self.scene.start("Stage2Scene");
  });
};
LevelCompleteScene.prototype.update = function () {};

// ========== STAGE 2 COMPLETE ==========
function Stage2CompleteScene() {
  Phaser.Scene.call(this, { key: "Stage2CompleteScene" });
}
Stage2CompleteScene.prototype = Object.create(Phaser.Scene.prototype);
Stage2CompleteScene.prototype.constructor = Stage2CompleteScene;
Stage2CompleteScene.prototype.init = function (data) {
  this.finalScore = data.score;
};
Stage2CompleteScene.prototype.create = function () {
  let self = this;
  this.add.rectangle(400, 300, 800, 600, 0x1a1a2e);
  this.add
    .text(400, 100, "⚡ STAGE 2 COMPLETE!! ⚡", {
      fontSize: "40px",
      color: "#ffff00",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 180, "You survived the lightning!!", {
      fontSize: "26px",
      color: "#ffffff",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 240, "Score: " + this.finalScore, {
      fontSize: "30px",
      color: "#00ff00",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 320, "⏱️ Stage 3 incoming... ⏱️", {
      fontSize: "28px",
      color: "#ff6600",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 380, "Now it's a race against the clock!!", {
      fontSize: "22px",
      color: "#aaaaaa",
      fontStyle: "italic",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 460, "Press SPACE to continue!!", {
      fontSize: "26px",
      color: "#ffff00",
    })
    .setOrigin(0.5);
  this.input.keyboard.once("keydown-SPACE", function () {
    self.scene.start("Stage3Scene");
  });
};
Stage2CompleteScene.prototype.update = function () {};

// ========== STAGE 3 COMPLETE - YOU WIN!! ==========
function Stage3CompleteScene() {
  Phaser.Scene.call(this, { key: "Stage3CompleteScene" });
}
Stage3CompleteScene.prototype = Object.create(Phaser.Scene.prototype);
Stage3CompleteScene.prototype.constructor = Stage3CompleteScene;
Stage3CompleteScene.prototype.init = function (data) {
  this.finalScore = data.score;
};
Stage3CompleteScene.prototype.create = function () {
  let self = this;
  this.add.rectangle(400, 300, 800, 600, 0x0a0a2e);
  this.add
    .text(400, 80, "🏆 YOU WIN!! 🏆", {
      fontSize: "72px",
      color: "#ffd700",
      fontStyle: "bold",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 170, "YOU BEAT ALL 3 STAGES!!", {
      fontSize: "32px",
      color: "#ffffff",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 230, "Final Score: " + this.finalScore, {
      fontSize: "36px",
      color: "#00ff00",
    })
    .setOrigin(0.5);
  this.add.text(400, 300, "🏀⚡⏱️", { fontSize: "56px" }).setOrigin(0.5);
  this.add
    .text(400, 380, "Hoops scored. Lightning dodged.", {
      fontSize: "22px",
      color: "#aaaaaa",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 420, "Clock beaten. You're a legend!!", {
      fontSize: "22px",
      color: "#aaaaaa",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 500, "Press SPACE to play again!!", {
      fontSize: "26px",
      color: "#ffff00",
    })
    .setOrigin(0.5);
  this.input.keyboard.once("keydown-SPACE", function () {
    self.scene.start("GameScene");
  });
};
Stage3CompleteScene.prototype.update = function () {};

// ========== GAME OVER ==========
function GameOverScene() {
  Phaser.Scene.call(this, { key: "GameOverScene" });
}
GameOverScene.prototype = Object.create(Phaser.Scene.prototype);
GameOverScene.prototype.constructor = GameOverScene;
GameOverScene.prototype.init = function (data) {
  this.finalScore = data.score;
  this.stage = data.stage;
  this.reason = data.reason;
};
GameOverScene.prototype.create = function () {
  let self = this;
  this.add.rectangle(400, 300, 800, 600, 0x000000);
  this.add
    .text(400, 80, "GAME OVER!!", {
      fontSize: "72px",
      color: "#ff0000",
      fontStyle: "bold",
    })
    .setOrigin(0.5);
  this.add
    .text(400, 160, "Stage " + this.stage + "  |  Score: " + this.finalScore, {
      fontSize: "28px",
      color: "#ffffff",
    })
    .setOrigin(0.5);
  if (this.reason === "time") {
    this.add
      .text(400, 220, "⏱️ YOU RAN OUT OF TIME!!", {
        fontSize: "26px",
        color: "#ff4444",
      })
      .setOrigin(0.5);
  }
  this.add.text(400, 290, "😵", { fontSize: "72px" }).setOrigin(0.5);
  this.add.text(400, 370, "⬇️", { fontSize: "28px" }).setOrigin(0.5);
  this.add.text(400, 420, "🏀", { fontSize: "56px" }).setOrigin(0.5);
  this.add
    .text(400, 500, "Press SPACE to try again!", {
      fontSize: "26px",
      color: "#ffff00",
    })
    .setOrigin(0.5);
  this.input.keyboard.once("keydown-SPACE", function () {
    if (self.stage === 1) self.scene.start("GameScene");
    if (self.stage === 2) self.scene.start("Stage2Scene");
    if (self.stage === 3) self.scene.start("Stage3Scene");
  });
};
GameOverScene.prototype.update = function () {};
