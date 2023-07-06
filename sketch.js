// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle = 0;
var angleSpeed = 0;
var canvas;

var birdImage; // Declare a variable to store the bird image

function preload() {
  birdImage = loadImage('./assets/bird.png');
}

////////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create(); // create an engine

  setupGround();

  setupPropeller();

  setupTower();

  setupSlingshot();

  setupMouseInteraction();
}

////////////////////////////////////////////////////////////////
function draw() {
  background(0);

  Engine.update(engine);

  drawGround();

  drawPropeller();

  drawTower();

  drawBirds();

  drawSlingshot();
}


////////////////////////////////////////////////////////////////
// Use arrow keys to control propeller
function keyPressed() {
  if (keyCode == LEFT_ARROW && !gameEnded) {
    angleSpeed -= 0.01; // Adjust the angle speed as needed
  } else if (keyCode == RIGHT_ARROW && !gameEnded) {
    angleSpeed += 0.01; // Adjust the angle speed as needed
  }
  if (gameEnded) { angleSpeed = 0 }
}


// If mouse is released, release the bird from the slingshot
function mouseReleased() {
  setTimeout(() => {
    if (slingshotBird && slingshotConstraint) {
      slingshotBird.isReleased = true;
      slingshotConstraint.bodyB = null;
      slingshotConstraint.pointA = { x: 0, y: 0 };
      slingshotConstraint.stiffness = slingshotStiffness;
    }
  }, 100);
}



function removeFromWorld(body) {
  World.remove(engine.world, body);

}