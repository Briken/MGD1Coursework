var canvas;
var canvasContext;
var canvasX;
var canvasY;
var mouseIsDown = 0;

var spawnX;
var spawnY;
var spawnNumber;

var sPumpkin;
var bkgdImage;
var sJackSkellington;
var sOggieBoogie;
var sEnemy1;
var sEnemy2;
var sEnemy3;
var sEnemy4;

var lastPt = null;
var gameOverScreen = false;

var score = 0;
var lives = 3;

var startTimeMS;

var enemies = new Array(5);

var spawnTime;
var lastSpawn;
//window.onload =
function load(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    init();

    canvasX = canvas.width/2;
    canvasY = canvas.height-30;

    if(!gameOverScreen){
        gameLoop();
    }
}

    function aSprite(x, y, imageSRC, velx, vely){
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
}

aSprite.prototype.renderF = function (width, height){
    canvasContext.drawImage(this.sImage, this.x, this .y, width, height);
}

aSprite.prototype.render = function(){
    canvasContext.drawImage(this.sImage, this.x, this.y);
}

aSprite.prototype.update = function(deltaTime){
    this.x += deltaTime * this.vx;
    this.y += deltaTime * this.vy;
}

function init(){

    if(canvas.getContext){
//Set Event Listeners for window, mouse and touch
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        resizeCanvas();

        bkgdImage = new aSprite(0, 0, "BkgdGY.png", 0, 0);
        sJackSkellington = new aSprite(25,canvas.height - 140,"JackSkellington.png", 0, 0);
        sOggieBoogie = new aSprite(canvas.width,sJackSkellington.y, "Oogie_Boogie76x64.png", -50,0);
        sEnemy1 =  new aSprite(canvas.width/2,canvas.height/2, "pumpkin.png", -50,0);
        sEnemy2 =  new aSprite(canvas.width,sJackSkellington.y, "JackSkellington.png", -50,0);
        sEnemy3 =  new aSprite(canvas.width,sJackSkellington.y, "Oogie_Boogie76x64.png", -50,0);
        sEnemy4 =  new aSprite(canvas.width,sJackSkellington.y, "Oogie_Boogie76x64.png", -50,0);
        sPumpkin = new aSprite(sJackSkellington.x+sJackSkellington.sImage.width/2,sJackSkellington.y+(sJackSkellington.sImage.height/2),"Pumpkin.png", 25, 0);
        enemies = [sOggieBoogie, sEnemy1, sEnemy2, sEnemy3, sEnemy4];
        startTimeMS = Date.now();
        lastSpawn = Date.now();
        console.log("enemies.length" + enemies.length);
    }
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function gameLoop(){
       var elapsed = (Date.now() - startTimeMS)/1000;

    update(elapsed);
    render(elapsed);
    startTimeMS = Date.now();
    spawnTime = (startTimeMS - lastSpawn)/1000;
    requestAnimationFrame(gameLoop);
}

function render(delta){
    bkgdImage.renderF(canvas.width,canvas.height);
    sPumpkin.render();
    sJackSkellington.render();
    for (var i = 0; i < enemies.length; i++){
            if (enemies[i] != null)
            {

                enemies[i].render();
            }
    }
}

function update(delta){
    sPumpkin.update(delta);
    sOggieBoogie.update(delta);

    for (var i = 0; i<enemies.length; i++){
                if (enemies[i] != null)
                {
                    enemies[i].update(delta);
                }
    }

    if ((spawnTime > 3))
    {
        lastSpawn = Date.now();
        console.log("New Spawn");
        var xory = Math.random()
        if (xory > 0.5)
        {
            spawnY = (canvas.width, (Math.random() * canvas.height) + 1);

            var leftOrRight = Math.random()
            if (leftOrRight > 0.5)
            {
                spawnX = canvas.width;
            }
            if (leftOrRight <= 0.5)
            {
                spawnX = 0;
            }
        }

        if (xory < 0.5)
        {
            spawnX = ((Math.random() * canvas.width) + 1);
            var topOrBottom = Math.random();
            if (topOrBottom < 0.5)
            {
                spawnY = 0;
            }
            if (topOrBottom >= 0.5)
            {
                spawnY = canvas.height;
            }
        }
        var newVelX = Math.sqrt((sJackSkellington.x - spawnX)^2)
        var newVelY = Math.sqrt((sJackSkellington.y - spawnY)^2)

              sEnemy1 =  new aSprite(canvas.width/2, canvas.height/2 , "pumpkin.png", -50, -20);
              sEnemy2 =  new aSprite(canvas.width/2, canvas.height/2 , "JackSkellington.png", newVelX,newVelY);
              sEnemy3 =  new aSprite(canvas.width/2, canvas.height/2 , "Oogie_Boogie76x64.png", newVelX,newVelY);
              sEnemy4 =  new aSprite(canvas.width/2, canvas.height/2 , "Oogie_Boogie76x64.png", newVelX,newVelY);
              enemies[1] = sEnemy1;
              enemies[2] = sEnemy2;
              enemies[3] = sEnemy3;
              enemies[4] = sEnemy4;
        spawnTime = 0;

        console.log(enemies);
        spawnNumber++;
    }
}

function collisionDetection(var sprite1, var sprite2)
{
    if ()
    {}
}

function styleText(txtColour, txtFont, txtAlign, txtBaseline){
    canvasContext.fillStyle = txtColour;
    canvasContext.font = txtFont;
    canvasContext.textAlign = txtAlign;
    canvasContext.textBaseline = txtBaseline;
}

function touchUp(evt){
    evt.preventDefault();
    // Terminate touch path
    lastPt = null;
}

    function touchDown(evt){
    evt.preventDefault();
    if(gameOverScreenScreen){
        //player1Score = 0;
        //player2Score = 0;
        //showingWinScreen = false;
        return;
    }
    touchXY(evt);
}

    function touchXY(evt){
    evt.preventDefault();
    if (lastPt != null){
        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
        var touchY = evt.touches[0].pageY - canvas.offsetTop;
    }
    lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
}