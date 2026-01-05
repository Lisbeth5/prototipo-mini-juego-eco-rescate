const config = {
    width: 320,
    height: 180,
    parent: "container",
    type: Phaser.AUTO,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);

function preload() {
    console.log("soy preload");
}
function create() {
    console.log("soy created");
}
function update(time, delta) {
    console.log(delta);
}