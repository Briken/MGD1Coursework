var particles = [];
function createParticleArray(xPos, yPos, theCanvasContext)
{
//Adds 10 particles to the array with random positions
    for (var i = 0; i<10; i++)
    {
        particles.push(new create(xPos, yPos));
    }
    renderP(theCanvasContext);
}

function create(startX, startY)
{
16.
//
Point
of
touch
17.
this
.x
=
startX;
18.
this
.y
=
startY;
19.
20.
//
Add
random
velocity
to
each
particle
21.
this
.vx
=
Math.random()*5
-
2;
22.
this
.vy
=
Math.random()*5
-
2;
23.
24.
//Random
colo
u
rs
25.
var
red
=
Math.random()*255
>>0;
26.
var
green
=
Math.random()*255>>0;
27.
var
blue
=
Math.random()*255>>0;
28.
this
.color
=
"rgba("
+red+
",
"
+green+
",
"
+blue+
",
0.5)"
;
29.
30.
//Random
size
31.
this
.radius
=
Math.random()*5;
32.
33.
//
fade
value
34.
this
.fade
=
Math.random()*500;
35.
36.
//
particle
dead
37.
this
.dead
=
false
;
38.
}
39.
40.
//
Render
and
move
the
particle
41.
function
renderP(theCanvasContext)
42.
{
43.
var
aCanvasContext
=
theCanvasContext;
44.
aCanvasContext.globalCompositeOperation
=
"source
-
over"
;
45.
//Reduce the opacity of the BG paint
aCanvasContext.fillStyle = "rgba(0, 0, 0, 0.3)";
// Blend the particle with the background
aCanvasContext.globalCompositeOperation="lighter";

//Render the particles
for (var t = 0; t< particles.length; t++)
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
//Add velocity
p.x+=p.vx;
p.y+=p.vy;

//Decreasefadeandifparticleisdeadremoveit
p.fade -= 10;

if(p.fade<0)