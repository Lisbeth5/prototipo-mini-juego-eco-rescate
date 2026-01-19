import { globals } from '../globals.js';

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('bg_menu', 'public/assets/bg.png');
    }

    create() {
        this.add.image(480, 270, 'bg_menu');
        this.add.text(300, 160, 'ECO-RESCATE', { fontSize: '40px', color: '#2ecc71' });
        this.add.text(250, 220, 'Recolecta y recicla la basura', { fontSize: '18px' });

        const btn = this.add.text(410, 300, 'EMPEZAR', {
            fontSize: '22px', backgroundColor: '#27ae60', padding: { x: 16, y: 10 }
        }).setInteractive();

        btn.on('pointerdown', () => {
            globals.level = 1;
            globals.score = 0;
            this.scene.start('GameScene');
        });
    }
}