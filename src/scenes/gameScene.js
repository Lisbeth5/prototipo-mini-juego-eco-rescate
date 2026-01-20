import { globals } from '../globals.js';
import { playPickupSound, playRecycleSound } from '../audio.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Rutas actualizadas a public/assets/
        this.load.image('bg_forest', 'public/assets/bg.png');
        this.load.image('bg_beach', 'public/assets/bg_beach.png');
        this.load.image('bg_city', 'public/assets/bg_city.png');
        this.load.image('platform', 'public/assets/platform.png');
        this.load.image('platform_beach', 'public/assets/platform_beach.png');
        this.load.image('platform_city', 'public/assets/platform_city.png');
        this.load.image('player', 'public/assets/player.png');
        this.load.image('papel', 'public/assets/papel.png');
        this.load.image('vidrio', 'public/assets/vidrio.png');
        this.load.image('plastico', 'public/assets/plastico.png');
        this.load.image('bin_papel', 'public/assets/bin_papel.png');
        this.load.image('bin_vidrio', 'public/assets/bin_vidrio.png');
        this.load.image('bin_plastico', 'public/assets/bin_plastico.png');
        this.load.image('door_closed', 'public/assets/door_closed.png');
        this.load.image('door_open', 'public/assets/door_open.png');
    }

    create() {
        this.carryingTrash = null;
        globals.timeLeft = 90;

        // Fondo según nivel
        const backgrounds = { 1: 'bg_forest', 2: 'bg_beach', 3: 'bg_city' };
        this.add.image(480, 270, backgrounds[globals.level]);

        // UI
        this.scoreText = this.add.text(20, 15, 'Puntaje: ' + globals.score, { fontSize: '18px' });
        this.timeText = this.add.text(420, 15, 'Tiempo: ' + globals.timeLeft, { fontSize: '18px' });
        this.levelText = this.add.text(800, 15, 'Nivel: ' + globals.level, { fontSize: '18px' });
        this.carryText = this.add.text(20, 40, 'Cargando: Nada', { fontSize: '16px' });
        this.contadorText = this.add.text(20,60, '', {fontSize: '16px'});



        // Plataformas
        this.platforms = this.physics.add.staticGroup();
        this.setupLevelLayout();

        // Jugador
        this.player = this.physics.add.sprite(80, 480, 'player').setScale(0.20).setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Basura y Contenedores
        this.trashGroup = this.physics.add.group({ allowGravity: false });
        this.spawnTrash();
        this.physics.add.overlap(this.player, this.trashGroup, this.collectTrash, null, this);

        this.bins = this.physics.add.staticGroup();
        this.spawnBins();
        this.physics.add.overlap(this.player, this.bins, this.recycleTrash, null, this);

        // Puerta
        this.door = this.physics.add.staticSprite(930, 520, 'door_closed').setScale(0.26).setOrigin(0.5, 1);
        this.physics.add.overlap(this.player, this.door, this.nextLevelCheck, null, this);

        // Temporizador
        this.timerEvent = this.time.addEvent({
            delay: 1000, loop: true,
            callback: () => {
                globals.timeLeft--;
                this.timeText.setText('Tiempo: ' + globals.timeLeft);
                if (globals.timeLeft <= 0) this.scene.restart();
            }
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
        } else {
            this.player.setVelocityX(0);
        }
        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-540);
        }
    }
    

    setupLevelLayout() {
    let layout = [];
    let tex = 'platform';

    // Tamaño y separación por nivel
    let scale = 0.6;   
    let gapX = 180;    
    let gapY = 80;     


    if (globals.level === 1) {
        scale = 0.1;
        gapX = 250;
        gapY = 80;

        layout = [
            [480, 520],
            [480 - gapX, 520 - gapY],
            [480, 520 - gapY * 2],
            [480 + gapX, 520 - gapY * 3],
            [480, 520 - gapY * 4],
            [480 - gapX, 510 - gapY * 5]
        ];
    }


    if (globals.level === 2) {
        tex = 'platform_beach';

        scale = 0.1;   
        gapX = 200;    
        gapY = 70;     

        layout = [
            [480, 520],                
            [500 - gapX, 520 - gapY],           
            [480 + gapX, 520 - gapY * 2],      
            [480, 520 - gapY * 3],      
            [480 + gapX, 520 - gapY * 4],     
            [480 - gapX, 520 - gapY * 4.5]     
        ];
    }


    if (globals.level === 3) {
        tex = 'platform_city';
        scale = 0.1;
        gapX = 200;
        gapY = 65;

        layout = [
            [480, 520],
            [540 + gapX, 520 - gapY],
            [480 - gapX, 520 - gapY * 2],
            [480 + gapX, 520 - gapY * 3],
            [480, 520 - gapY * 4],
            [480 - gapX, 520 - gapY * 5]
        ];
    }

    // CREACIÓN DE PLATAFORMAS
    layout.forEach(p => {
        this.platforms
            .create(p[0], p[1], tex)
            .setScale(scale)
            .refreshBody();
    });
}


    spawnTrash() {
        const types = ['papel', 'vidrio', 'plastico'];
        const plats = this.platforms.getChildren().filter(p => p.y < 500);
        Phaser.Utils.Array.Shuffle(plats);
        const count = Math.min(Phaser.Math.Between(3, 5), plats.length);

        for (let i = 0; i < count; i++) {
            const t = Phaser.Utils.Array.GetRandom(types);
            const trash = this.add.sprite(plats[i].x, plats[i].y - 24, t).setScale(0.14);
            trash.type = t;
            this.physics.add.existing(trash);
            trash.body.setAllowGravity(false);
            this.trashGroup.add(trash);
        }
    }

    collectTrash(player, trash) {
        if (this.carryingTrash) return;
        this.carryingTrash = trash.type;
        this.carryText.setText('Cargando: ' + this.carryingTrash);
        playPickupSound();
        trash.destroy();
    }

    spawnBins() {
        [['bin_papel','papel'],['bin_vidrio','vidrio'],['bin_plastico','plastico']].forEach((b,i)=>{
            const bin = this.add.sprite(300+i*160,520,b[0]).setScale(0.24).setOrigin(0.5,1);
            bin.type = b[1];
            this.physics.add.existing(bin,true);
            this.bins.add(bin);
        });
    }


    recycleTrash(player, bin) {
    if (this.carryingTrash === bin.type) {
        if (bin.type === 'papel') globals.papel++;
        if (bin.type === 'vidrio') globals.vidrio++;
        if (bin.type === 'plastico') globals.plastico++;

        this.carryingTrash = null;
        this.carryText.setText('Cargando: Nada');

        this.contadorText.setText(
            'Papel: ' + globals.papel +
            '\nVidrio: ' + globals.vidrio +
            '\nPlástico: ' + globals.plastico
        );

        globals.score += 10;
        this.scoreText.setText('Puntaje: ' + globals.score);
        playRecycleSound();

        if (this.trashGroup.countActive(true) === 0) {
            this.door.setTexture('door_open');
        }
    }
}


    nextLevelCheck() {
    if (this.trashGroup.countActive(true) === 0 && !this.carryingTrash) {

        this.timerEvent.remove();
        if (globals.level === 3) {

            globals.papel = 0;
            globals.vidrio = 0;
            globals.plastico = 0;

            this.scene.start('GameWinScene');
        } 
        else {
            this.scene.start('LevelCompleteScene');
        }
    }
}    
}