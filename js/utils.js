function rectangularCollision({rectangle1, rectangle2}) {
    //Here attacks actually do something
    return (
        //Check for collision on x-axis
        (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width) &&
        //Check for collision on y-axis
        (rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
    )
}

const gameStatuses = {
    playerWins: 'Player wins',
    enemyWins: 'Enemy Wins',
    tie: 'Tie'
}

function determineWinner({player, enemy, timerId}) {
    //Stop timer if any of the players win
    clearTimeout(timerId);
    
    document.querySelector('#gameOverStatus').style.display = 'flex';
    
    if (enemy.health > player.health) {
        document.querySelector('#gameOverStatus').innerHTML = gameStatuses.enemyWins;
    }
    if (enemy.health < player.health) {
        document.querySelector('#gameOverStatus').innerHTML = gameStatuses.playerWins;
    }
    if (enemy.health === player.health) {
        document.querySelector('#gameOverStatus').innerHTML = gameStatuses.tie;
    }
}

let timer = 10;
let timerId = '';
function decreaseTimer() {
    //Timer number getting lower here

    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId});
    }
}