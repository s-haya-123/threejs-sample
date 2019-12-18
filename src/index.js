import * as handTrack from "handtrackjs";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Fire } from "three/examples/jsm/objects/Fire.js";

const modelParams = {
  flipHorizontal: true, // flip e.g for video
  maxNumBoxes: 1, // maximum number of boxes to detect
  iouThreshold: 0.5, // ioU threshold for non-max suppression
  scoreThreshold: 0.6
};

let renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setClearColor(new THREE.Color("lightgrey"), 0);
renderer.setSize(640, 480);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";
document.body.appendChild(renderer.domElement);

let onRenderFcts = [];

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  60,
  document.body.offsetWidth / document.body.offset,
  1,
  10
);

camera.position.z = 3;
scene.add(camera);
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
light.position.set(0, 1, 0);
scene.add(light);

let plane = new THREE.PlaneBufferGeometry(20, 20);
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

let arToolkitSource = new THREEx.ArToolkitSource({
  sourceType: "webcam"
});
arToolkitSource.init(function onReady() {
  onResize();
});

window.addEventListener("resize", function() {
  onResize();
});
function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

let arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl:
    THREEx.ArToolkitContext.baseURL + "../data/data/camera_para.dat",
  detectionMode: "mono"
});

arToolkitContext.init(function onCompleted() {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

onRenderFcts.push(function() {
  if (arToolkitSource.ready === false) {
    return;
  }
  arToolkitContext.update(arToolkitSource.domElement);
  scene.visible = camera.visible;
});
const makerRoot = new THREE.Group();
scene.add(makerRoot);
fire.position.set(0, 0, 0);
fire.scale.set(0.5, 0.5, 0.5);

params.Single();
updateAll();

let markerControls = new THREEx.ArMarkerControls(arToolkitContext, makerRoot, {
  type: "pattern",
  patternUrl: THREEx.ArToolkitContext.baseURL + "../data/data/patt.hiro"
});
const geometry = new THREE.CubeGeometry(2.5, 2.5, 2.5);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
scene.visible = false;

fire.visible = false;

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

onRenderFcts.push(function() {
  renderer.render(scene, camera);
});

let lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  requestAnimationFrame(animate);
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  let deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  onRenderFcts.forEach(onRenderFct => {
    onRenderFct(deltaMsec / 10000, nowMsec / 10000);
  });
});

setTimeout(start, 2000);

export function startVideo(video) {
  video.width = video.width || 640;
  video.height = video.height || video.width * (3 / 4);

  return new Promise(function(resolve, reject) {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: "environment"
        }
      })
      .then(stream => {
        //   window.localStream = stream;
        //   video.srcObject = stream
        resolve(true);
        video.onloadedmetadata = () => {
          // video.play()
          resolve(true);
        };
      })
      .catch(function(err) {
        resolve(false);
      });
  });
}
async function start() {
  console.log("detect-hand start");
  const model = await handTrack.load(modelParams);
  const video = document.getElementById("arjs-video");
  const status = await startVideo(video);
  if (status) {
    runDetect(model, video, 0);
  }
}
async function runDetect(model, video, prevCount) {
  const predictions = await model.detect(video);
  console.log(predictions);
  const count = predictions.length > 0 ? prevCount + 1 : prevCount;
  if (count > 4) {
    mesh.visible = false;
    fire.visible = true;
  }
  setTimeout(() => {
    runDetect(model, video, count);
  }, 500);
}
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
