//Drawing paper
const canvas = document.querySelector('canvas');
//Drawing tools
const c = canvas.getContext('2d'); //c = context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite
{
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        this.position.y += this.velocity.y;

        //Object reached the ground
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else { //Object is falling to the ground
            this.velocity.y += gravity;
        }
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }
});

const enemy = new Sprite({
    position: {
        x: 974,
        y: 0
    },
    velocity: {
        x: 0,
        y: 5
    }
})

console.log(player);

//Loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
}

animate();