let sun
let planets = []
let G = 1
let numPlanets = 8
let destabilise = 0.05
let sunRadius = 60
let dt = 0.6



function setup() {
  createCanvas(windowWidth, windowHeight);
  sun = new Body(100, createVector(0,0), createVector(0,0));
  
  for (let i = 0; i < numPlanets; i++){

    let r = random(150, min(windowWidth/2, windowHeight/2))
    let theta = random(TWO_PI)
    let planetPos = createVector(r*cos(theta), r*sin(theta))
  
let dir = p5.Vector.normalize(planetPos);
let tangent = createVector(-dir.y, dir.x);


let speed = sqrt((G * sun.mass) / planetPos.mag());
let planetVel = tangent.setMag(speed);


planetVel.mult(random(0.95, 1.05));
  planetVel.mult(random(1 - destabilise, 1 + destabilise));
  planets.push(new Body(random(5,30), planetPos, planetVel));
  }
}

function draw() {
  translate(width/2, height/2)
  background(0)
  
  for (let i = 0; i < planets.length; i++){
  sun.attract(planets[i])
  planets[i].move()
  planets[i].show()
  }
  sun.show()

}

function Body(_mass,_pos,_vel){
  this.mass = _mass
  this.pos = _pos
  this.vel = _vel
  this.r = this.mass
  this.path = []
  
  this.show = function(){
    noStroke();
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r, this.r)
    stroke(255);
   
    for (let i = 0; i < this.path.length - 2; i++){
    line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y)
    }
  }
  
  this.move = function(){
  this.pos.add(p5.Vector.mult(this.vel, dt));
  this.path.push(this.pos.copy());
   
    if(this.path.length > 400){
      this.path.splice(0, 1)
    }
  }
  
  this.applyForce = function(f){
    let acc = p5.Vector.div(f, this.mass);
    this.vel.add(p5.Vector.mult(acc,dt));
  }
  
  this. attract = function(child){
   let force = p5.Vector.sub(this.pos, child.pos);
    let r = force.mag();
    
    if (r < sunRadius) {
    child.vel.mult(-0.5); 
    child.pos = p5.Vector.add(this.pos,
      p5.Vector.random2D().setMag(sunRadius + 5)
    );
    return;
  }
    
  let softening = 100; 
  let strength = (G * this.mass * child.mass) / (r * r + softening);
  
  strength = constrain(strength, -10, 10)
  

force.setMag(strength);
  
child.applyForce(force);
  }
}
