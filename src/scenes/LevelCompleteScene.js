import { globals } from '../globals.js';

export class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    create() {
        this.add.rectangle(480, 270, 420, 260, 0x000000, 0.75);
        this.add.text(480, 210, `Nivel Superado\n\nSiguiente nivel: ${globals.level + 1}`, {
            fontSize: '20px', align: 'center'
        }).setOrigin(0.5);

        const btn = this.add.text(480, 330, 'CONTINUAR', {
            fontSize: '18px', backgroundColor: '#27ae60', padding: { x: 12, y: 8 }
        }).setOrigin(0.5).setInteractive();

        btn.on('pointerdown', () => {
            globals.level++;
            this.scene.start('GameScene');
        });
    }
}