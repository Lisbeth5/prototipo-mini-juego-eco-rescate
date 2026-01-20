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
        this.add.text(300, 120, 'ECO-RESCATE', {
            fontSize: '40px',
            color: '#2ecc71',
            fontStyle: 'bold'
        });


        const panel = this.add.graphics();
        panel.fillGradientStyle(
            0xbaf5c8, 
            0xbaf5c8,
            0xeafff0, 
            0xeafff0,
            1
        );

        panel.fillRoundedRect(180, 180, 600, 180, 20);
        panel.lineStyle(2, 0x2ecc71, 0.8);
        panel.strokeRoundedRect(180, 180, 600, 180, 20);

        this.add.text(200, 195, 
            'Descripción:\nRecolecta la basura y deposítala en el contenedor correcto\npara proteger el medio ambiente.',
            {
                fontSize: '16px',
                color: '#145a32',
                wordWrap: { width: 560 }
            }
        );


        this.add.text(200, 255,
            '¿Cómo jugar?\n• Usa las flechas ← → para moverte\n• Salta con ↑\n• Recoge la basura correcta\n• Tiempo estimado por cada nivel: 90 segundos\n• Cada recoleccion suma 10 puntos',
            {
                fontSize: '16px',
                color: '#145a32',
                wordWrap: { width: 560 }
            }
        );


        const btn = this.add.text(410, 390, 'EMPEZAR', {
            fontSize: '22px',
            backgroundColor: '#27ae60',
            color: '#ffffff',
            padding: { x: 20, y: 10 }
        }).setInteractive();


        btn.on('pointerdown', () => {
            globals.level = 1;
            globals.score = 0;
            this.scene.start('GameScene');
        });
    }
}
