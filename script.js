//Drawing paper
const canvas = document.querySelector('canvas');
//Drawing tools
const c = canvas.getContext('2d'); //c = context

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6,
});

const player = new Fighter({
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
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    //Different animations are here
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2,
        }
    }
});

const enemy = new Fighter({
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

decreaseTimer();

//Loop
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    // enemy.update();
    //Player is not moving
    player.velocity.x = 0;

    //Player is moving
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        //Player is not moving
        player.switchSprite('idle');
    }

    //Player jumps
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    //Player falls
    } else if (player.velocity.y > 0){
        player.switchSprite('fall');
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
    
    //End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId});
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
