const canvas = document.getElementById("pong");
const body = document.getElementById('body');
const ctx = canvas.getContext('2d');

const ball =
{
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}


const player1 = {
    x : 0,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

const player2 = {
    x : canvas.width - 10,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

function drawRect(x, y, w, h, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// listening to the mouse
document.body.addEventListener("keydown", movePlayer);

function movePlayer(e)
{
    console.log(e);
    if(e.keyCode==87)
    {
      if(player1.y>0)
      player1.y -= 25;
    }
    if(e.keyCode==83)
    {
      if(player1.y+player1.height < canvas.height)
      player1.y += 25;
    }
    if(e.keyCode==104)
    {
      if(player2.y>0)
      player2.y -= 25;
    }
    if(e.keyCode==98)
    {
      if(player2.y+player2.height < canvas.height)
      player2.y += 25;
    }
}

function resetBall()
{
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y)
{
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collision(b,p)
{
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function, the function that does all calculations
function update()
{
    if( ball.x - ball.radius < 0 )
    {
        player2.score++;
        resetBall();
    }
    else if( ball.x + ball.radius > canvas.width)
    {
        player1.score++;
        resetBall();
    }
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
    {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x + ball.radius < canvas.width/2) ? player1 : player2;

    if(collision(ball,player))
    {
        let collidePoint = (ball.y - (player.y + player.height/2));

        collidePoint = collidePoint / (player.height/2);

        let angleRad = (Math.PI/4) * collidePoint;

        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        ball.speed +=0.1;
    }
}

function render()
{
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    drawText(player1.score,canvas.width/4,canvas.height/5);

    drawText(player2.score,3*canvas.width/4,canvas.height/5);

    drawNet();

    drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);

    drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game()
{
    update();
    render();
}

let framePerSecond = 50;

let loop = setInterval(game,1000/framePerSecond);
