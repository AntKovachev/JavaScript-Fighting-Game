//Drawing paper
const canvas = document.querySelector('canvas');
//Drawing tools
const c = canvas.getContext('2d'); //c = context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite
{
    constructor({position, velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey = '';
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        this.position.x += this.velocity.x;
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

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    arrowLeft: {
       pressed: false,
    },
    arrowRight: {
        pressed: false,
    },
    arrowUp: {
        pressed: false,
    }
}

//Loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    //Player is not moving
    player.velocity.x = 0;

    //Player is moving
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5;
    }

    //Enemy is not moving
    enemy.velocity.x = 0;

    //Enemy is moving
    if (keys.arrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.arrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5;
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //Player logic
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
        break;

        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
        break;

        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -20;
            player.lastKey = 'w';
        break;

        //Enemy logic
        case 'ArrowRight':
            keys.arrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
        break;

        case 'ArrowLeft':
            keys.arrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
        break;

        case 'ArrowUp':
            enemy.velocity.y = -20;
            keys.arrowUp.pressed = true;
            enemy.lastKey = 'ArrowUp';
        break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //Player keys
        case 'd':
            keys.d.pressed = false;
        break;

        case 'a':
            keys.a.pressed = false;
        break;

        //Enemy keys
        case 'ArrowRight':
            keys.arrowRight.pressed = false;
        break;

        case 'ArrowLeft':
            keys.arrowLeft.pressed = false;
        break;
    }
});
