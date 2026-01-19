import { globals } from '../globals.js';

export class GameWinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene' });
    }

    create() {
        this.add.rectangle(480, 270, 520, 300, 0x000000, 0.85);
        this.add.text(480, 180, '¡GANASTE!', { fontSize: '36px', color: '#2ecc71' }).setOrigin(0.5);
        this.add.text(480, 250, 'Salvaste el planeta 🌍', { fontSize: '18px' }).setOrigin(0.5);
        this.add.text(480, 310, `Puntaje Final: ${globals.score}`, { fontSize: '20px' }).setOrigin(0.5);

        const btn = this.add.text(480, 370, 'VOLVER AL INICIO', {
            fontSize: '18px', backgroundColor: '#27ae60', padding: { x: 14, y: 8 }
        }).setOrigin(0.5).setInteractive();

        btn.on('pointerdown', () => {
            this.scene.start('StartScene');
        });
    }
}