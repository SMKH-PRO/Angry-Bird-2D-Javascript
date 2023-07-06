// Physics.js

var slingshotX = 150;
var slingshotY = 400;
var slingshotStiffness = 0.01;
var slingshotDamping = 0.0001;
let winMessage = "";

// physics.js
////////////////////////////////////////////////////////////////
function setupGround() {
  ground = Bodies.rectangle(500, 600, 1000, 40, {
    isStatic: true,
    angle: 0
  });
  World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
function drawGround() {
  push();
  fill(128);
  drawVertices(ground.vertices);
  pop();
}

////////////////////////////////////////////////////////////////
// Step 1: Amend the setupPropeller() function
function setupPropeller() {
  propeller = Bodies.rectangle(150, 480, 200, 15, {
    isStatic: true,
    angle: angle
  });
  World.add(engine.world, [propeller]);
}

////////////////////////////////////////////////////////////////
// Step 2: Amend the drawPropeller() function
function drawPropeller() {
  push();
  angle += angleSpeed;
  Body.setAngle(propeller, angle);
  Body.setAngularVelocity(propeller, angleSpeed);
  fill(255);
  drawVertices(propeller.vertices);
  pop();
}

////////////////////////////////////////////////////////////////
// Step 3: Amend the drawBirds() function
function drawBirds() {
  push();
  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];
    fill(255);
    drawVertices(bird.vertices);
    if (isOffScreen(bird)) {
      removeFromWorld(bird);
      birds.splice(i, 1);
      i--; // Decrement the loop counter to avoid skipping the next bird
    }
  }
  pop();
}

////////////////////////////////////////////////////////////////
// Step 4: Amend the setupTower() function
function setupTower() {
  const boxSize = 80;
  const towerWidth = 3;
  const towerHeight = 6;
  const towerX = 600;
  const towerY = 560;

  for (let i = 0; i < towerHeight; i++) {
    for (let j = 0; j < towerWidth; j++) {
      let x = towerX + j * boxSize;
      let y = towerY - i * boxSize;
      let box = Bodies.rectangle(x, y, boxSize, boxSize);
      boxes.push(box);
      let color = random(100, 200);
      colors.push(color);
      World.add(engine.world, [box]);
    }
  }
}

////////////////////////////////////////////////////////////////
// Step 5: Amend the drawTower() function
function drawTower() {
  push();
  for (let i = 0; i < boxes.length; i++) {
    let box = boxes[i];
    let color = colors[i];
    fill(color);
    drawVertices(box.vertices);

    if (isOffScreen(box)) {
      removeFromWorld(box);
      boxes.splice(i, 1);
      colors.splice(i, 1);
      i--;
    }
  }
  pop();
}
////////////////////////////////////////////////////////////////
// Step 6: Amend the setupSlingshot() function
function setupSlingshot(customX, customY) {
  // Load the bird image

  slingshotBird = Bodies.circle(customX ?? slingshotX, customY ?? slingshotY, 30, {
    friction: 0,
    restitution: 0.90
  });

  Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

  slingshotConstraint = Constraint.create({
    pointA: { x: slingshotX, y: slingshotY },
    bodyB: slingshotBird,
    stiffness: slingshotStiffness,
    damping: slingshotDamping
  });

  World.add(engine.world, [slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
// Step 7: Amend the drawSlingshot() function
function drawSlingshot() {
  push();
  fill(255, 0);
  drawVertices(slingshotBird.vertices);
  drawConstraint(slingshotConstraint);
  imageMode(CENTER);
  image(birdImage, slingshotBird.position.x, slingshotBird.position.y, slingshotBird.circleRadius * 2, slingshotBird.circleRadius * 2);
  pop();
}

/////////////////////////////////////////////////////////////////
// Step 8: Implement one of the ideas for further development
// Idea: Turn it into a game with a countdown and win/lose conditions
let countdown = 60000; // 60 seconds countdown
let gameEnded = false;

let canvasClicked = false;

function draw() {
  background(0);
  Engine.update(engine);

  drawGround();
  drawPropeller();
  drawTower();
  drawBirds();
  drawSlingshot();

  if (!gameEnded) {
    fill(255);
    textSize(24);
    let remainingTime = max(0, countdown - millis());
    let seconds = Math.floor(remainingTime / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    text(`Time remaining: ${minutes}:${nf(seconds, 2)}`, 20, 30);

    if (remainingTime <= 0) {
      gameEnded = true;
      textSize(48);
      text("GAME OVER", width / 2 - 120, height / 2);
    } else if (boxes.length === 0) {
      gameEnded = true;
      textSize(48);
      text("YOU WIN!", width / 2 - 100, height / 2);
    }
  } else {
    textSize(48);
    text("YOU WIN!", width / 2 - 100, height / 2);
  }

  if (gameEnded && canvasClicked) {
    // Reload the page when canvas is clicked after winning
    location.reload();
  }
}

// Handle mouse interaction events
function mouseClicked() {
  if (gameEnded) {
    canvasClicked = true;
  }
}

////////////////////////////////////////////////////////////////
// Step 9: Code presentation: formatting, comments, variable naming
// Make sure your code is properly formatted, commented, and uses meaningful variable names.

// Helper function to draw vertices of a body
function drawVertices(vertices) {
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}

// Helper function to draw a constraint
function drawConstraint(constraint) {
  push();
  const offsetA = constraint.pointA;
  const posA = constraint.bodyA ? constraint.bodyA.position : { x: 0, y: 0 };
  const offsetB = constraint.pointB;
  const posB = constraint.bodyB ? constraint.bodyB.position : { x: 0, y: 0 };
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}

function setupMouseInteraction() {
  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  };
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);
}

function keyTyped() {
  // If 'b' create a new bird to use with the propeller
  if (key === 'b') {
    setupSlingshot(mouseX, mouseY);

    slingshotBird.isReleased = true;
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
    slingshotConstraint.stiffness = slingshotStiffness;
  }

  // If 'r' reset the slingshot
  if (key === 'r') {
    if (slingshotBird && slingshotConstraint) {
      removeFromWorld(slingshotBird);
      removeFromWorld(slingshotConstraint);
      setupSlingshot();
    }
  }
}

function isOffScreen(body) {
  const position = body.position;
  return (
    position.x < 0 ||
    position.x > width ||
    position.y < 0 ||
    position.y > height
  );
}
