const CANVAS = { x: 900, y: 450 }
const PLAYERSPEED = 3;
const ball = { x: CANVAS.x / 2, y: CANVAS.y / 2, radius: 15, deg: 45, speed: 10 }
const player1 = { x: CANVAS.x - 20, y: CANVAS.y / 2, width: 25, height: 90 }
const player2 = { x: 20, y: CANVAS.y / 2, width: 25, height: 90 }
let slow = false
const speeds = { slow: 0.7, fast: 10 }
const KEYDOWN = {}
const KEYMAP = {
    38: 'up',
    40: 'down',
    87: 'w',
    83: 's',
};


const redraw = () => {
    ctx.clearRect(0, 0, CANVAS.x, CANVAS.y)
    checkInput();
    update();

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.rect(player1.x - player1.width, CANVAS.y - player1.y - player1.height / 2, player1.width, player1.height);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(player2.x, CANVAS.y - player2.y - player2.height / 2, player2.width, player2.height);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x, CANVAS.y - ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    window.requestAnimationFrame(redraw);
}

const movePlayer = (player, y) => {
    if (player.y + y - player.height / 2 <= 0) { player.y = player.height / 2; return; }
    if (player.y + y + player.height / 2 >= CANVAS.y) { player.y = CANVAS.y - player.height / 2; return; }
    player.y += y
}
const moveBall = (x, y) => { ball.x += x * ball.speed; ball.y += y * ball.speed }

const update = () => {
    xShift = Math.sin(ball.deg * Math.PI / 180)
    yShift = Math.cos(ball.deg * Math.PI / 180)
    moveBall(xShift, yShift)
    checkCollision();
}

const checkCollision = () => {

    if (ball.y + ball.radius >= CANVAS.y || ball.y - ball.radius <= 0) {ball.deg = 180 - ball.deg; return;} // if on top or bottom
    console.log("past 1")
    if (ball.x + ball.radius < player1.x && ball.x - ball.radius > player2.x + player2.width) return; // if past front of player1's paddle
    console.log("past 2")

    if (ball.x + ball.radius >= CANVAS.x) { ball.speed = 0; console.log("HA HA PLAYER 1 LOSES"); return; } // if game over on player1's side
    if (ball.x - ball.radius <= 0) { ball.speed = 0; console.log("HA HA PLAYER 2 LOSES"); return; } // if game over on player2's side
    console.log("past 3")

    if (ball.y - ball.radius <= player1.y + player1.height / 2 && ball.y >= player1.y - player1.height) ball.deg = 90 - ball.deg // if on player1's paddle
    if (ball.y + ball.radius >= player2.y - player2.height / 2 && ball.y - ball.radius <= player2.y + player2.height / 2) ball.deg = 90 - ball.deg // if on player2's paddle
}

const toggleSpeed = () => {
    switch (slow) {
        case true: ball.speed = speeds.fast; slow = false; break;
        case false: ball.speed = speeds.slow; slow = true; break;
    }
}

const checkInput = () => {
    KEYDOWN['up'] && movePlayer(player1, PLAYERSPEED)
    KEYDOWN['down'] && movePlayer(player1, -PLAYERSPEED)
    KEYDOWN['w'] && movePlayer(player2, PLAYERSPEED)
    KEYDOWN['s'] && movePlayer(player2, -PLAYERSPEED);
};

document.addEventListener('keydown', (e) => KEYDOWN[KEYMAP[e.which]] = true);
document.addEventListener('keyup', (e) => {
    KEYDOWN[KEYMAP[e.which]] = false;
});

document.addEventListener('keyup', (e) => { if (e.which === 32) { toggleSpeed(); } if (e.which === 13) { location = location } })

const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", CANVAS.x)
canvas.setAttribute("height", CANVAS.y)
redraw();