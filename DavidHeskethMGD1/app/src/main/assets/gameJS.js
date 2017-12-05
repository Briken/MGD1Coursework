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

var menuScreen = true;
var gameScreen = false;
var gameOverScreen = false;

var lastPt = null;


var gameTimer = 15;
var gameTimer = 15;

var score = 0;
var lives = 3;

var startTimeMS;

var enemies = new Array(5);
var images = ["JackSkellington.png", "Oogie_Boogie76x64.png", "pumpkin.png"];

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
aSprite.prototype.updatePos = function(){
if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0)
    {
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.image = randomImage();
    }
}

aSprite.prototype.update = function(deltaTime){

    this.x += deltaTime * this.vx;
    this.y += deltaTime * this.vy;

}

function init(){

    if(canvas.getContext){
//Set Event Listeners for window, mouse and touch
        randomImage();
        //styleText("black", 8 + "pt arial", "left", "top");
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
        sEnemy1 =  new aSprite(canvas.width/2,canvas.height/2, "pumpkin.png", 50,30);
        sEnemy2 =  new aSprite(canvas.width/2,canvas.height/2, "JackSkellington.png", -70,15);
        sEnemy3 =  new aSprite(canvas.width/2,canvas.height/2, "pumpkin.png", -30,60);
        sEnemy4 =  new aSprite(canvas.width/2,canvas.height/2, "pumpkin.png", -50,0);
        sPumpkin = new aSprite(sJackSkellington.x+sJackSkellington.sImage.width/2,sJackSkellington.y+(sJackSkellington.sImage.height/2),"Pumpkin.png", 25, 0);
        enemies = [sOggieBoogie, sEnemy1, sEnemy2, sEnemy3, sEnemy4];
        startTimeMS = Date.now();
        lastSpawn = Date.now();

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

    styleText("black", 8 + "pt arial", "left", "top");
    canvasContext.fillText("Wave timer: "+ (15-spawnTime), canvas.width/2, canvas.height/2);

    sPumpkin.render();
    sJackSkellington.render();
    for (var i = 0; i < enemies.length; i++){
            if (enemies[i] != null)
            {
                enemies[i].render();
            }
    }
}


function randomImage()
{

    var imageReturn =  Math.floor((Math.random()*3));
    console.log(images[imageReturn]);
    return images[imageReturn];
}

function update(delta){
    sPumpkin.update(delta);
   // sOggieBoogie.update(delta);

    for (var i = 0; i<enemies.length; i++){
        if (enemies[i] != null)
        {
            enemies[i].update(delta);
            if (spawnTime > 15)
            {
                enemies[i].updatePos();
            }
        }
    }

    var newVelX = Math.sqrt((sJackSkellington.x - spawnX)^2)
    var newVelY = Math.sqrt((sJackSkellington.y - spawnY)^2)


        enemies[1] = sEnemy1;
        enemies[2] = sEnemy2;
        enemies[3] = sEnemy3;
        enemies[4] = sEnemy4;
        spawnNumber++;
    //}
}

function collisionDetection()
{
    for (var i = 0; i < enemies.length; i++)
    {
            if (lastPt.x < enemies[i].x + enemies[i].sImage.width && lastPt.x > enemies[i].x &&
            lastPt.y > enemies[i].y && lastPt.y < enemies[i].y + enemies[i].sImage.height)
            {
                console.log ("Clicked an enemy");
            }
    }
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
    //if(gameOverScreenScreen){
        //player1Score = 0;
        //player2Score = 0;
        //showingWinScreen = false;
    //    return;
   //}
    touchXY(evt);
    collisionDetection();
}

    function touchXY(evt){
    evt.preventDefault();
    if (lastPt != null){
        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
        var touchY = evt.touches[0].pageY - canvas.offsetTop;
    }
    lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
}