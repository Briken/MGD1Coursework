var canvas;
var canvasContext;
var canvasX;
var canvasY;
var mouseIsDown = 0;

var spawnX;
var spawnY;
var spawnNumber;

var scene1Image;
var firstButton;

var sPumpkin;
var bkgdImage;
var sJackSkellington;
var sEnemy0;
var sEnemy1;
var sEnemy2;
var sEnemy3;
var sEnemy4;
var rButton;

var endingImage;

var backSndPlaying = false;
var menuScreen = true;
var gameScreen = false;
var gameOverScreen = false;

var lastPt = null;


var gameTimer = 60;
var startTimer = 60;
var displayTimer;
var round =1;
var enemyHit = true;

var score = 0;
var lives = 3;
var ammo;
var maxAmmo = 5;

var startTimeMS;

var enemies = new Array(5);
var images = ["JackSkellington.png", "Oogie_Boogie76x64.png", "pumpkin.png"];

var backgroundSound = new Audio();
backgroundSound.src = "RoyaltyFreesoundeffectsWoodlandAmbient1.mp3";
backgroundSound.volume = 0.5;

var shootSound = new Audio();
shootSound.src = "Gun+Shot2.mp3";

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

        scene1Image = new aSprite(0, 0, "scene1.png", 0, 0);
        firstButton = new aSprite(canvas.width/2, canvas.height/2, "button.png", 0, 0);

        rButton = new aSprite((canvas.width/5) *4, canvas.height/10, "rButton.png", 0, 0);
        bkgdImage = new aSprite(0, 0, "BkgdGY.png", 0, 0);
        sJackSkellington = new aSprite(25,canvas.height - 140,"JackSkellington.png", 0, 0);
        sEnemy0 = new aSprite(canvas.width,sJackSkellington.y, "duck.png", -50,-35);
        sEnemy1 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", 50,30);
        sEnemy2 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", -70,15);
        sEnemy3 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", -30,60);
        sEnemy4 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", -50,0);
        sPumpkin = new aSprite(sJackSkellington.x+sJackSkellington.sImage.width/2,sJackSkellington.y+(sJackSkellington.sImage.height/2),"Pumpkin.png", 25, 0);
        enemies = [sEnemy0, sEnemy1, sEnemy2, sEnemy3, sEnemy4];
        startTimeMS = Date.now();
        lastSpawn = Date.now();

        endingImage = new aSprite(0, 0, "endScene.png", 0, 0);
        replayButton = new aSprite(canvas.width/2, canvas.height/2, "replay.png", 0, 0);
    }
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function gameLoop(){
    if (backSndPlaying == false)
    {
        backgroundSound.play();
        backgroundSound.loop = true;
        backSndPlaying = true;
    }
    //setInterval(backgroundSound.play, 179000);
    var elapsed = (Date.now() - startTimeMS)/1000;
    update(elapsed);
    render(elapsed);
    startTimeMS = Date.now();
    requestAnimationFrame(gameLoop);
    gameTimer-=elapsed;
}

function render(delta){
    if (menuScreen == true)
    {
        scene1Image.renderF(canvas.width,canvas.height);
        firstButton.render();
    }
    if (gameScreen == true)
    {
        bkgdImage.renderF(canvas.width,canvas.height);
        styleText("black", 20 + "pt arial", "left", "top");
        rButton.render();

        displayTimer = Math.round(gameTimer);
        canvasContext.fillText("Wave timer: "+ (displayTimer) + " Wave Number: " + round, canvas.width/8, canvas.height/5);
        canvasContext.fillText("Score: "+ (score), canvas.width/4, canvas.height/8);
        canvasContext.fillText("Ammo: "+ (ammo), (canvas.width/6)*5, (canvas.height/6)*5);
        sPumpkin.render();
        sJackSkellington.render();
        for (var i = 0; i < enemies.length; i++){
                if (enemies[i] != null)
                {
                    enemies[i].render();
                }
        }
    }

    if (gameOverScreen == true)
    {
         endingImage.renderF(canvas.width, canvas.height);
         replayButton.render();
         canvasContext.fillText("Score: "+ (score), canvas.width/2, canvas.height/2);
    }
}


function randomImage()
{

    var imageReturn =  Math.floor((Math.random()*3));
    console.log(images[imageReturn]);
    return images[imageReturn];
}

function update(delta){

if (menuScreen == true)
{
    firstButton.update(delta);
}
    if (gameScreen == true)
    {
        rButton.update(delta);
        if (gameTimer < 0)
        {
            enemies[0] = sEnemy0;
            enemies[1] = sEnemy1;
            enemies[2] = sEnemy2;
            enemies[3] = sEnemy3;
            enemies[4] = sEnemy4;
        }
        sPumpkin.update(delta);
        for (var i = 0; i<enemies.length; i++){
            if (enemies[i] != null)
            {
                enemies[i].update(delta);
                if (gameTimer < 0)
                {
                    enemies[i].updatePos();
                    lastSpawn = Date.now();
                }
            }
        }
        if (gameTimer < 0)
        {
            round++;
            gameTimer =startTimer/round;
            if (round == 6)
            {
                gameScreen = false;
                gameOverScreen = true;
            }
        }

        var newVelX = Math.sqrt((sJackSkellington.x - spawnX)^2)
        var newVelY = Math.sqrt((sJackSkellington.y - spawnY)^2)
        spawnNumber++;
    }
    if (gameOverScreen)
    {

    }
}

function collisionDetection()
{
    if (gameScreen == true)
    {
        if (ammo > 0)
        {
            ammo--;
            for (var i = 0; i < enemies.length; i++)
            {
                if (enemies[i] != null)
                {
                    if (lastPt.x < enemies[i].x + enemies[i].sImage.width && lastPt.x > enemies[i].x &&
                    lastPt.y > enemies[i].y && lastPt.y < enemies[i].y + enemies[i].sImage.height)
                    {
                        canvasContext.clearRect(enemies[i].x, enemies[i].y, enemies[i].sImage.width, enemies[i].sImage.height);
                        enemies[i] = null;
                        score += 2;
                        enemyHit = true;
                    }
                }
            }
        }
        if (lastPt.x < rButton.x + rButton.sImage.width && lastPt.x > rButton.x &&
            lastPt.y > rButton.y && lastPt.y < rButton.y + rButton.sImage.height)
        {
            enemyHit = true;
            ammo = maxAmmo;
        }
    }

    if (menuScreen == true)
    {
        if (lastPt.x < firstButton.x + firstButton.sImage.width && lastPt.x > firstButton.x &&
            lastPt.y > firstButton.y && lastPt.y < firstButton.y + firstButton.sImage.height)
        {
            menuScreen = false;
            gameScreen = true;
            console.log ("Clicked an enemy");
            ammo = maxAmmo;
            enemyHit = true;
        }
    }
    if (gameOverScreen == true)
    {
         if (lastPt.x < replayButton.x + replayButton.sImage.width && lastPt.x > replayButton.x &&
             lastPt.y > replayButton.y && lastPt.y < replayButton.y + replayButton.sImage.height)
         {
             wave = 1;
             score = 0;
             gameOverScreen = false;
             menuScreen = true;
             enemyHit = true;
         }

    }
    if (enemyHit == false)
    {
       score--;

    }
    enemyHit = false;
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
    touchXY(evt);
    if (gameScreen)
        {
            if (ammo > 0)
            {
                shootSound.play();
                collisionDetection();
            }
            if (ammo == 0)
            {
                collisionDetection();
            }
        }
    if (menuScreen)
    {
        collisionDetection();
    }
    if(gameOverScreen)
    {
        collisionDetection();
    }
}

    function touchXY(evt){
    evt.preventDefault();
    if (lastPt != null){
        var touchX = evt.touches[0].pageX - canvas.offsetLeft;
        var touchY = evt.touches[0].pageY - canvas.offsetTop;
    }
    lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
}