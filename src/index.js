import * as handTrack from "handtrackjs";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Fire } from "three/examples/jsm/objects/Fire.js";
import { start,runDetect } from './trakinghand.js';


const width = window.innerWidth;
const height = window.innerHeight;

// canvas 要素の参照を取得する
const canvas = document.querySelector('#myCanvas');
let renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas: canvas
});
renderer.setClearColor(new THREE.Color("lightgrey"), 0);
renderer.setSize(document.body.offsetWidth, document.body.offsetHeight);
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0px";
renderer.domElement.style.left = "0px";
document.body.appendChild(renderer.domElement);

let onRenderFcts = [];

let scene = new THREE.Scene();
// let camera = new THREE.PerspectiveCamera(
//   60,
//   document.body.offsetWidth / document.body.offset,
//   1,
//   10
// );

const camera = new THREE.PerspectiveCamera(45, width / height);
        // const camera = new THREE.PerspectiveCamera(45, document.body.offsetWidth / document.body.offset);

camera.position.z = 3;
scene.add(camera);
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
light.position.set(0, 1, 0);
scene.add(light);


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

let markerControls = new THREEx.ArMarkerControls(arToolkitContext, makerRoot, {
  type: "pattern",
  patternUrl: THREEx.ArToolkitContext.baseURL + "../data/data/patt.hiro"
});
const geometry = new THREE.CubeGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
mesh2.position.z = -1;
scene.visible = true;

let loader = new OBJLoader();
let sword;
loader.load("Bird.obj", group => {
  sword = group;
  group.name = "sword";
  group.position.set(0, 0, 0);
  group.scale.set(0.2, 0.2, 0.2);
  // group.rotation.z += 0.5;
  group.rotation.set(30,0,0.2);
  scene.add(group);
});

// mesh.position.set(0,0,0);
mesh2.position.set(0,-1,0);
// scene.add( mesh );
scene.add( mesh2 );
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.x = 0;
mouse.y = 0;
onRenderFcts.push(function() {
  raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects( scene.children );
	for ( let i = 0; i < intersects.length; i++ ) {
    // intersects[ i ].object.material.color.set( 0xff0000 );
    sword.rotation.x += 0.1
    sword.rotation.y += 0.1
	}
  renderer.render(scene, camera);
});
// onRenderFcts.push(()=>{
//   mesh2.rotation.x += 0.01;
//   mesh2.rotation.y += 0.01;
// })
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

setTimeout(async ()=>{
  await start();
  predict();
  timer(500);
}, 2000);

function timer(msec) {
  predict();
  setTimeout(()=>{
    timer(msec);
  },msec);
}
async function predict() {
  const predictions = await runDetect();
  // console.log(predictions);
  trackingHandObject(sword,predictions);
  setRaycastVec(mouse,predictions);
}
function trackingHandObject(obj,predictions) {
  if (predictions.length) {
    const [x,y,width, height] = predictions[0].bbox;
    obj.position.x = 1 - ( x / document.body.offsetWidth) * 2;
    obj.position.y = 1 - ( y / document.body.offsetHeight ) * 2;
    // console.log(obj.position);
  }
}
function setRaycastVec(mouse, predictions) {
  if (predictions.length) {
    const [x,y] = predictions[0].bbox;
    mouse.x = 1 - ( x / document.body.offsetWidth) * 2;
    mouse.y = 1 - ( y / document.body.offsetHeight ) * 2;
    // console.log(mouse);
  }
}
// document.addEventListener('mousemove', handleMouseMove);

//         // マウスを動かしたときのイベント
//         function handleMouseMove(event) {
//           // canvas要素上のXY座標
//           const x = event.clientX;
//           const y = event.clientY;
//           console.log(x,y);
//           // canvas要素の幅・高さ
//           const w = window.innerWidth;
//           const h = window.innerHeight;
//           console.log(w,h)
//           // -1〜+1の範囲で現在のマウス座標を登録する
//           mouse.x = (x / w) * 2 - 1;
//           mouse.y = -(y / h) * 2 + 1;
//           console.log(mouse);
//         }
// function onMouseMove( event ) {

// 	// calculate mouse position in normalized device coordinates
//   // (-1 to +1) for both components
// 	mouse.x = ( event.clientX / document.body.offsetWidth ) * 2 - 1;
// 	mouse.y = - ( event.clientY / document.body.offsetHeight ) * 2 + 1;
//   console.log('mouse', mouse);

// }
// window.addEventListener( 'mousemove', onMouseMove, false );

