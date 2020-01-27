
fire.position.set(0, 0, 0);
fire.scale.set(0.5, 0.5, 0.5);

let loader = new OBJLoader();
loader.load("Sword.obj", group => {
  group.name = "sword";
  group.position.set(-3, 6, 0);
  group.scale.set(0.03, 0.03, 0.03);
  group.rotation.z += 0.5;
  makerRoot.add(mesh);
  makerRoot.add(group);
  makerRoot.add(fire);
});
params.Single();
updateAll();
let fire = new Fire(plane, {
  textureWidth: 512,
  textureHeight: 512,
  debug: false
});
let params = {
  color1: "#ffffff",
  color2: "#ffa000",
  color3: "#000000",
  colorBias: 0.7,
  burnRate: 2.04,
  diffuse: 1.07,
  viscosity: 0,
  expansion: 1,
  swirl: 50.0,
  drag: 0.35,
  airSpeed: 12.0,
  windX: 0.0,
  windY: 0.75,
  speed: 442.0,
  massConservation: false
};
params.Single = function() {
  fire.clearSources();
  fire.addSource(0.5, 0.1, 0.1, 1.0, 0.0, 1.0);
};
function updateAll() {
    updateColor1(params.color1);
    updateColor2(params.color2);
    updateColor3(params.color3);
    updateColorBias(params.colorBias);
    updateBurnRate(params.burnRate);
    updateDiffuse(params.diffuse);
    updateViscosity(params.viscosity);
    updateExpansion(params.expansion);
    updateSwirl(params.swirl);
    updateDrag(params.drag);
    updateAirSpeed(params.airSpeed);
    updateWindX(params.windX);
    updateWindY(params.windY);
    updateSpeed(params.speed);
    updateMassConservation(params.massConservation);
  }
  function updateColor1(value) {
    fire.color1.set(value);
  }
  
  function updateColor2(value) {
    fire.color2.set(value);
  }
  
  function updateColor3(value) {
    fire.color3.set(value);
  }
  
  function updateColorBias(value) {
    fire.colorBias = value;
  }
  
  function updateBurnRate(value) {
    fire.burnRate = value;
  }
  
  function updateDiffuse(value) {
    fire.diffuse = value;
  }
  
  function updateViscosity(value) {
    fire.viscosity = value;
  }
  
  function updateExpansion(value) {
    fire.expansion = value;
  }
  
  function updateSwirl(value) {
    fire.swirl = value;
  }
  
  function updateDrag(value) {
    fire.drag = value;
  }
  
  function updateAirSpeed(value) {
    fire.airSpeed = value;
  }
  
  function updateWindX(value) {
    fire.windVector.x = value;
  }
  
  function updateWindY(value) {
    fire.windVector.y = value;
  }
  
  function updateSpeed(value) {
    fire.speed = value;
  }
  
  function updateMassConservation(value) {
    fire.massConservation = value;
  }
  