const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [StartScene, GameScene]
};

new Phaser.Game(config);


// PANTALLA INICIAL

function StartScene() {
  Phaser.Scene.call(this, { key: 'StartScene' });
}
StartScene.prototype = Object.create(Phaser.Scene.prototype);
StartScene.prototype.constructor = StartScene;

StartScene.prototype.preload = function () {
  this.load.image('bg_menu', 'assets/bg.png');
};

StartScene.prototype.create = function () {
  this.add.image(480, 270, 'bg_menu');

  this.add.text(300, 160, 'ECO-RESCATE', {
    fontSize: '40px',
    color: '#2ecc71'
  });

  this.add.text(250, 220, 'Recolecta y recicla la basura', {
    fontSize: '18px'
  });

  const btn = this.add.text(410, 300, 'EMPEZAR', {
    fontSize: '22px',
    backgroundColor: '#27ae60',
    padding: { x: 16, y: 10 }
  }).setInteractive();

  btn.on('pointerdown', () => {
    level = 1;
    score = 0;
    this.scene.start('GameScene');
  });
};


// INICIO DEL JUEGO

function GameScene() {
  Phaser.Scene.call(this, { key: 'GameScene' });
}
GameScene.prototype = Object.create(Phaser.Scene.prototype);
GameScene.prototype.constructor = GameScene;

// VARIABLES
let player, cursors;
let platforms, trashGroup, bins;
let door;
let carryingTrash = null;
let score = 0;
let timeLeft = 60;
let level = 1;
let scoreText, timeText, levelText, carryText;
let timerEvent;

// SONIDOS
let audioCtx;

// PRELOAD
GameScene.prototype.preload = function () {
  this.load.image('bg_forest', 'assets/bg.png');
  this.load.image('bg_beach', 'assets/bg_beach.png');
  this.load.image('bg_city', 'assets/bg_city.png');

  this.load.image('platform', 'assets/platform.png');
  this.load.image('platform_beach', 'assets/platform_beach.png');
  this.load.image('platform_city', 'assets/platform_city.png');

  this.load.image('player', 'assets/player.png');

  this.load.image('papel', 'assets/papel.png');
  this.load.image('vidrio', 'assets/vidrio.png');
  this.load.image('plastico', 'assets/plastico.png');

  this.load.image('bin_papel', 'assets/bin_papel.png');
  this.load.image('bin_vidrio', 'assets/bin_vidrio.png');
  this.load.image('bin_plastico', 'assets/bin_plastico.png');

  this.load.image('door_closed', 'assets/door_closed.png');
  this.load.image('door_open', 'assets/door_open.png');
};

// ESCENARIO
GameScene.prototype.create = function () {
  carryingTrash = null;
  timeLeft = 60;

  if (level === 1) this.add.image(480, 270, 'bg_forest');
  if (level === 2) this.add.image(480, 270, 'bg_beach');
  if (level === 3) this.add.image(480, 270, 'bg_city');

  scoreText = this.add.text(20, 15, 'Puntaje: ' + score, { fontSize: '18px' });
  timeText = this.add.text(420, 15, 'Tiempo: ' + timeLeft, { fontSize: '18px' });
  levelText = this.add.text(800, 15, 'Nivel: ' + level, { fontSize: '18px' });
  carryText = this.add.text(20, 40, 'Cargando: Nada', { fontSize: '16px' });

  platforms = this.physics.add.staticGroup();

  let layout = [];
  let tex = 'platform';

  if (level === 1) {
    layout = [[800, 250], // piso
    [200, 440],
    [420, 380],
    [640, 320],
    [420, 220],
    [200, 200]];
  }
  if (level === 2) {
    tex = 'platform_beach';
    layout = [[280,600],
    [150,450],
    [350,350],
    [550,300],
    [750,260],
    [600,200],
    [350,180]];
  }
  if (level === 3) {
    tex = 'platform_city';
    layout = [[880,130],
    [180,450],
    [380,360],
    [600,300],
    [780,240],
    [580,150],
    [370,180]];
  }

  layout.forEach(p => {
    platforms.create(p[0], p[1], tex).setScale(0.1).refreshBody();
  });

  player = this.physics.add.sprite(80, 480, 'player')
    .setScale(0.15)
    .setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();

  trashGroup = this.physics.add.group({ allowGravity: false });
  spawnTrash(this);
  this.physics.add.overlap(player, trashGroup, collectTrash, null, this);

  bins = this.physics.add.staticGroup();
  spawnBins(this);
  this.physics.add.overlap(player, bins, recycleTrash, null, this);

  door = this.physics.add.staticSprite(930, 520, 'door_closed')
    .setScale(0.25)
    .setOrigin(0.5, 1);

  this.physics.add.overlap(player, door, nextLevel, null, this);

  timerEvent = this.time.addEvent({
    delay: 1000,
    loop: true,
    callback: () => {
      timeLeft--;
      timeText.setText('Tiempo: ' + timeLeft);
      if (timeLeft <= 0) this.scene.restart();
    }
  });
};

// UPDATE
GameScene.prototype.update = function () {
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
    player.setFlipX(true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
    player.setFlipX(false);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.blocked.down) {
    player.setVelocityY(-460);
  }
};


// FUNCIONES

function spawnTrash(scene) {
  const types = ['papel', 'vidrio', 'plastico'];
  const plats = platforms.getChildren().filter(p => p.y < 500);
  Phaser.Utils.Array.Shuffle(plats);

  const count = Math.min(Phaser.Math.Between(3, 5), plats.length);

  for (let i = 0; i < count; i++) {
    const t = Phaser.Utils.Array.GetRandom(types);
    const trash = scene.add.sprite(plats[i].x, plats[i].y - 24, t).setScale(0.14);
    trash.type = t;
    scene.physics.add.existing(trash);
    trash.body.setAllowGravity(false);
    trashGroup.add(trash);
  }
}

function collectTrash(player, trash) {
  if (carryingTrash) return;
  carryingTrash = trash.type;
  carryText.setText('Cargando: ' + carryingTrash);
  playPickupSound();
  trash.destroy();
}

function spawnBins(scene) {
  [['bin_papel','papel'],['bin_vidrio','vidrio'],['bin_plastico','plastico']]
  .forEach((b,i)=>{
    const bin = scene.add.sprite(300+i*160,520,b[0]).setScale(0.20).setOrigin(0.5,1);
    bin.type = b[1];
    scene.physics.add.existing(bin,true);
    bins.add(bin);
  });
}

function recycleTrash(player, bin) {
  if (carryingTrash === bin.type) {
    carryingTrash = null;
    carryText.setText('Cargando: Nada');
    score += 10;
    scoreText.setText('Puntaje: ' + score);
    playRecycleSound();
    if (trashGroup.countActive(true) === 0) door.setTexture('door_open');
  }
}

function nextLevel() {
  if (trashGroup.countActive(true) === 0 && !carryingTrash) {
    timerEvent.remove();
    if (level === 3) showGameWin(this);
    else showLevelComplete(this);
  }
}

// PANTALLA NIVEL SUPERADO
function showLevelComplete(scene) {
  scene.add.rectangle(480,270,420,260,0x000000,0.75);
  scene.add.text(350,210,`Nivel Superado\n\nTiempo: ${60-timeLeft}s\nPuntaje: ${score}`,
    {fontSize:'20px',align:'center'});
  const btn = scene.add.text(395,330,'Siguiente Nivel',{
    fontSize:'18px',backgroundColor:'#27ae60',padding:{x:12,y:8}
  }).setInteractive();

  btn.on('pointerdown',()=>{
    level++;
    scene.scene.restart();
  });
}

// PANTALLA FINAL
function showGameWin(scene) {
  scene.add.rectangle(480,270,520,300,0x000000,0.85);

  scene.add.text(300,180,'¡GANASTE!',{
    fontSize:'36px',
    color:'#2ecc71'
  });

  scene.add.text(260,230,
    'Salvaste el planeta\nreciclando y cuidando el medio ambiente 🌍',
    {fontSize:'18px',align:'center'}
  );

  scene.add.text(360,300,`Puntaje Final: ${score}`,{fontSize:'20px'});

  const btn = scene.add.text(385,360,'Volver al inicio',{
    fontSize:'18px',
    backgroundColor:'#27ae60',
    padding:{x:14,y:8}
  }).setInteractive();

  btn.on('pointerdown',()=>{
    level = 1;
    score = 0;
    scene.scene.start('StartScene');
  });
}

// SONIDOS
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTone(f,d,t){
  initAudio();
  const o=audioCtx.createOscillator();
  const g=audioCtx.createGain();
  o.type=t;o.frequency.value=f;
  g.gain.setValueAtTime(0.15,audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+d);
  o.connect(g);g.connect(audioCtx.destination);
  o.start();o.stop(audioCtx.currentTime+d);
}
function playPickupSound(){playTone(600,0.08,'sine');}
function playRecycleSound(){
  playTone(900,0.1,'triangle');
  setTimeout(()=>playTone(1200,0.1,'triangle'),120);
}
