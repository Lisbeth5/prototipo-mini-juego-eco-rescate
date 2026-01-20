import { globals } from '../globals.js';

export class GameWinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene' });
    }

    create() {


        this.add.rectangle(480, 270, 960, 540, 0x000000, 0.75);
        this.add.rectangle(480, 270, 520, 380, 0x1e272e, 0.95)
            .setStrokeStyle(3, 0x2ecc71);

        const title = this.add.text(480, 110, '¡FELICIDADES!', {
            fontSize: '40px',
            color: '#2ecc71',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            scale: { from: 0, to: 1 },
            duration: 600,
            ease: 'Back.Out'
        });

        this.add.text(480, 160, 'Has completado ECO-RESCATE', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const papelText = this.add.text(360, 210, '🧻 Papel: 0', {
            fontSize: '20px',
            color: '#ffffff'
        });

        const vidrioText = this.add.text(360, 250, '🍾 Vidrio: 0', {
            fontSize: '20px',
            color: '#ffffff'
        });

        const plasticoText = this.add.text(360, 290, '🧴 Plástico: 0', {
            fontSize: '20px',
            color: '#ffffff'
        });

        const scoreText = this.add.text(360, 330, '⭐ Puntaje: 0', {
            fontSize: '22px',
            color: '#f1c40f'
        });

        this.animateCounter(papelText, '🧻 Papel: ', globals.papel);
        this.animateCounter(vidrioText, '🍾 Vidrio: ', globals.vidrio);
        this.animateCounter(plasticoText, '🧴 Plástico: ', globals.plastico);
        this.animateCounter(scoreText, '⭐ Puntaje: ', globals.score, true);


        const btn = this.add.text(480, 410, 'JUGAR DE NUEVO', {
            fontSize: '22px',
            backgroundColor: '#27ae60',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();


        btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#2ecc71' }));
        btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#27ae60' }));


        btn.on('pointerdown', () => {
            globals.level = 1;
            globals.score = 0;
            globals.papel = 0;
            globals.vidrio = 0;
            globals.plastico = 0;

            this.scene.start('StartScene');
        });
    }

    
    animateCounter(textObj, label, finalValue, pulse = false) {
        let current = 0;

        this.time.addEvent({
            delay: 40,
            repeat: finalValue,
            callback: () => {
                current++;
                textObj.setText(label + current);

                if (pulse) {
                    this.tweens.add({
                        targets: textObj,
                        scale: 1.1,
                        yoyo: true,
                        duration: 100
                    });
                }
            }
        });
    }
}
