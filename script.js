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
    constructor({position, velocity, color = 'red', offset}) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey = '';
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: offset,
            width: 100,
            height: 50,
        },
        this.color = color;
        this.isAttacking = false;
        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Attack box is drawn here
        if (this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Object reached the ground
        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else { //Object is falling to the ground
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
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
    },
    offset: {
        x: 0,
        y: 0
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
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'blue'
})

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

function rectangularCollision({rectangle1, rectangle2}) {
    //Here attacks actually do something
    return (
        //Check for collision on x-axis
        (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width) &&
        //Check for collision on y-axis
        (rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
    )
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

    //Detect if player hit enemy
    if ((rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking)){
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'; //Here % is added because this is how we subtract 20% per hit
    }
    //Detect if enemy hit player
    if ((rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking)){
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
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

        case ' ':
            player.attack();
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

        case 'ArrowDown':
            enemy.attack();
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
