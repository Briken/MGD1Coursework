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
var endlessButton;

var endlessScene;
var highEndless;

var bkgdImage;
var sHunter;
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

var highScore;
var oldScore;
var newHighScore;
var newEndless;
var displayScore;

var setToSix;

var lastPt = null;

//Create an array for the particles
var particles = [];

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


var backgroundSound = new Audio();
backgroundSound.src = "RoyaltyFreesoundeffectsWoodlandAmbient1.mp3";
backgroundSound.volume = 0.5;

var shootSound = new Audio();
shootSound.src = "Gun+Shot2.mp3";

var quack = new Audio();
quack.src = "Quack!.mp3"

var emptySound = new Audio();
emptySound.src = "Gun+Empty.mp3";

var reloadSound = new Audio();
reloadSound.src = "Gun+Reload.mp3";

var spawnTime;
var lastSpawn;
//window.onload =
function load(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    HighScoreCheck();
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
        this.x = GenRandom(canvas.width/5, (canvas.width/5)*4);
        this.y = GenRandom(canvas.height/5, (canvas.height/5)*4);
        this.vx = GenRandom(100, -100);
        this.vy = GenRandom(100, -100);
    }
}

function GenRandom(max, min)
{
    return Math.random()*(max -  min) + min;
}

aSprite.prototype.update = function(deltaTime){

    this.x += deltaTime * this.vx;
    this.y += deltaTime * this.vy;

}


function init(){

    if(canvas.getContext){
//Set Event Listeners for window, mouse and touch

        //styleText("black", 8 + "pt arial", "left", "top");
        window.addEventListener('resize', resizeCanvas, false);
        window.addEventListener('orientationchange', resizeCanvas, false);

        canvas.addEventListener("touchstart", touchDown, false);
        canvas.addEventListener("touchmove", touchXY, true);
        canvas.addEventListener("touchend", touchUp, false);

        document.body.addEventListener("touchcancel", touchUp, false);

        resizeCanvas();

        scene1Image = new aSprite(0, 0, "scene1.png", 0, 0);
        firstButton = new aSprite(canvas.width/2, canvas.height/5, "button.png", 0, 0);
        endlessButton = new aSprite(canvas.width/2, canvas.height/2, "endlessButton.png", 0, 0);


        rButton = new aSprite((canvas.width/5) *4, canvas.height/10, "rButton.png", 0, 0);
        bkgdImage = new aSprite(0, 0, "BkgdGY.png", 0, 0);
        sHunter = new aSprite(25,canvas.height - 140,"hunter.png", 0, 0);
        sEnemy0 = new aSprite(canvas.width,sHunter.y, "duck.png", -50,-35);
        sEnemy1 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", 50,30);
        sEnemy2 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", -70,15);
        sEnemy3 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", -30,60);
        sEnemy4 =  new aSprite(canvas.width/2,canvas.height/2, "duck.png", -50,0);

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
    if (menuScreen)
    {
        scene1Image.renderF(canvas.width,canvas.height);
        firstButton.render();
        endlessButton.render();
    }
    if (gameScreen || endlessScene)
    {
        bkgdImage.renderF(canvas.width,canvas.height);
        styleText("black", 20 + "pt arial", "left", "top");
        rButton.render();

        displayTimer = Math.round(gameTimer);
        canvasContext.fillText("Wave timer: "+ (displayTimer) + " Wave Number: " + round, canvas.width/8, canvas.height/5);
        canvasContext.fillText("Score: "+ (score), canvas.width/4, canvas.height/8);
        canvasContext.fillText("Ammo: "+ (ammo), (canvas.width/6)*5, (canvas.height/6)*5);

        sHunter.render();
        if (particles.length > 0)
        {
            renderP(canvasContext);
        }
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
         if (newHighScore && newEndless)
         {
            canvasContext.fillText("Congrats! You got a new HighScore: "+ localStorage.getItem('high') + " You beat: " + oldScore, canvas.width/5, canvas.height/2);
         }
         if (!newHighScore && newEndless)
         {
            canvasContext.fillText("Congrats! You got: "+ displayScore + " Your score to beat is: " + oldScore, canvas.width/5, canvas.height/2);
         }
         if (newEndless)
         {
            canvasContext.fillText("Congrats! You got a new endless mode HighScore: "+ localStorage.getItem('endless') + " You beat: " + oldScore, canvas.width/5, canvas.height/2);
         }
         if (!newEndless)
         {
            canvasContext.fillText("Congrats! You got: "+ displayScore + " Your score to beat is: " + oldScore, canvas.width/5, canvas.height/2);
         }
    }
}


function update(delta){

if (menuScreen == true)
{
    firstButton.update(delta);
    endlessButton.update(delta);
}
    if (gameScreen || endlessScene)
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
            setToSix = true;
            gameTimer =startTimer/round;
            if (gameScreen)
            {
                if (round == 6)
                {
                    EndSceneSetup();
                    gameScreen = false;
                    gameOverScreen = true;
                    highScore = localStorage.getItem('high')
                }
            }
            if (endlessScene)
            {
                if (startTimer/round < 6 && setToSix)
                {
                    gameTimer = 6
                    setToSix = false;
                }
            }
        }
    }
    if (gameOverScreen)
    {

    }
}

function collisionDetection()
{
    if (gameScreen || endlessScene)
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
                        createParticleArray(enemies[i].x, enemies[i].y, canvasContext);
                        quack.play();
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
            reloadSound.play();
        }

        if (lastPt.x < sHunter.x + sHunter.sImage.width && lastPt.x > sHunter.x &&
            lastPt.y > sHunter.y && lastPt.y < sHunter.y + sHunter.sImage.height)
        {
            highEndless = localStorage.getItem('endless');
            EndSceneSetup();
            enemyHit = true;
            endlessScene = false;
            gameOverScreen = true;
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
            round = 1;
            score = 0;
            gameTimer = startTimer;
            enemyHit = true;
        }
        if (lastPt.x < endlessButton.x + endlessButton.sImage.width && lastPt.x > endlessButton.x &&
            lastPt.y > endlessButton.y && lastPt.y < endlessButton.y + endlessButton.sImage.height)
        {
            menuScreen = false;
            endlessScene = true;
            console.log ("Clicked an enemy");
            ammo = maxAmmo;
            round = 1;
            score = 0;
            gameTimer = startTimer;
            enemyHit = true;
        }

    }
    if (gameOverScreen == true)
    {
         if (lastPt.x < replayButton.x + replayButton.sImage.width && lastPt.x > replayButton.x &&
             lastPt.y > replayButton.y && lastPt.y < replayButton.y + replayButton.sImage.height)
         {

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
    if (gameScreen || endlessScene)
        {
            if (ammo > 0)
            {
                shootSound.play();
                collisionDetection();
            }
            if (ammo == 0)
            {
                collisionDetection();
                emptySound.play();
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







function createParticleArray(xPos, yPos, theCanvasContext)
{
    //Adds 10 particles to thearray with random positions
    for(var i = 0; i < 10; i++)
    {
        particles.push(new create(xPos, yPos));
    }
    renderP(theCanvasContext);
}

function create(startX, startY)
{
    this.x = startX;
    this.y = startY;

    //Add random velocity to each particle

    this.vx = Math.random()*5 - 2;
    this.vy = Math.random()*5 - 2;

    //Random colours

    var red = Math.random()*255>>0;
    var green = Math.random()*255>>0;
    var blue = Math.random()*255>>0;
    this.color="rgba("+red+","+green+","+blue+",0.5)";
    //Random size
    this.radius = Math.random()*5;
    //fade value
    this.fade = Math.random()*500;
    //particle dead
    this.dead = false;
    }

//Render and move the particle
function renderP(theCanvasContext)
{
    var aCanvasContext = theCanvasContext;
    aCanvasContext.globalCompositeOperation = "source - over";
    //Reduce the opacity of the BG paint
    aCanvasContext.fillStyle = "rgba(0, 0, 0, 0.3)";

    //Blend the particle with the background
    //aCanvasContext.globalCompositeOperation = "lighter";
    //Render the particles

    for (var t = 0; t < particles.length; t++)
    {
        var p = particles[t];
        aCanvasContext.beginPath();

    //Mix the colours

    var gradient = aCanvasContext.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(0.4, "white");
    gradient.addColorStop(0.4, p.color);
    gradient.addColorStop(1, "black");
    aCanvasContext.fillStyle = gradient;

    aCanvasContext.arc(p.x, p.y, p.radius, Math.PI*2, false);
    aCanvasContext.fill();
    //Addvelocity
    p.x += p.vx;
    p.y += p.vy;
    //Decrease fade and if particle is dead removeit
    p.fade -= 10;
    if (p.fade < 0)
    {
        p.dead = true;
    }
    if(p.dead == true)
    {
        particles.splice(t,1);
    }
    }
}

function EndSceneSetup()
{
    if (gameScreen)
    {
        if (highScore < score)
        {
            oldScore = highScore;
            console.log ("new high score: " + score + " old high score: " + highScore);
            localStorage.setItem('high', score)
            newHighScore = true;
            newEndless = false;
        }
        else
        {
            oldScore = highScore;
            displayScore = score;
            newHighScore = false;
            newEndless = false;
        }
    }
    if (endlessScene)
    {
        if (highEndless < score)
        {
            oldScore = highEndless;
            localStorage.setItem('endless', score);
            newEndlessw = true;
        }
        else
        {
            oldScore = highEndless;
            displayScore = score;
            newEndless = false;
        }
    }
}

function HighScoreCheck()
{
    if (localStorage.getItem('high') == null)
    {
        localStorage.setItem('high', 0);
    }
    if (localStorage.getItem('endless') == null)
    {
        localStorage.setItem('endless', 0);
    }
}