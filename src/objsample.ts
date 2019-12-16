import * as comlink from 'comlink';
import * as THREE from 'three';
// const THREE = require('../dist/three.module.js');
// import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';


const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
const material = new THREE.MeshNormalMaterial();
let sword: THREE.Group;


const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.vr.enabled = true;
// renderer.xr.enabled = true;
document.body.appendChild( renderer.domElement );
// document.body.appendChild(ARButton.createButton(renderer))
// const controller = renderer.vr.getController( 0 );
// scene.add( controller );
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
light.position.set(0, 1, 0);
scene.add(light);

const rectMesh = new THREE.Mesh( geometry, material );
scene.add( rectMesh );
let loader = new OBJLoader();
loader.load('../dist/Sword.obj',
(group)=>{
    sword = group;
    group.scale.set(0.001,0.001,0.001);
    scene.add(group);
});
// controller.addEventListener( 'selectstart', onSelectStart );
// controller.addEventListener( 'selectend', onSelectEnd );
function onSelectStart() {
    console.log('start');
    animate();
}
function onSelectEnd() {
    // controller.userData.isSelecting = true;
}
function makeArrow(color: number) {
    const geometry = new THREE.ConeGeometry(0.03, 0.1, 32)
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
    const localMesh = new THREE.Mesh(geometry, material);
    localMesh.rotation.x = -Math.PI / 2
    const mesh = new THREE.Group()
    mesh.add(localMesh)
    return mesh
  }
function handleController(controller:THREE.Group) {
    // rectMesh.position.set( 0,0,-0.4).applyMatrix4( controller.matrixWorld);
    // console.log(controller)
    // controller.updateMatrix();
    // console.log(controller.position)
    if (!controller.userData.isSelecting) return;
    console.log(controller.position)
    console.log(controller)
    // rectMesh.position.set(-0.04872144013643265, -0.043070945888757706, 0.06206323951482773);

    // rectMesh.rotation.x += 0.01;
    // rectMesh .rotation.y += 0.02;

    // const mesh = makeArrow(Math.floor(Math.random() * 0xffffff))

    // 5. コントローラーのposition, rotationプロパティを使用して
    //    AR空間内での端末の姿勢を取得し、メッシュに適用する
    // rectMesh.position.copy(controller.position)
    // rectMesh.rotation.copy(controller.rotation)

    // scene.add(mesh)

    controller.userData.isSelecting = false
}
function animate(){
    renderer.setAnimationLoop(render);
}
export function render(){
    renderer.setAnimationLoop(render);
    // handleController(controller);
    // console.log(controller);
    // rectMesh.position.set( 0,0,-0.4).applyMatrix4( controller.matrixWorld);

    rectMesh.rotation.x += 0.01;
    rectMesh.rotation.y += 0.02;
    if(sword) {
        sword.rotation.x += 0.01;
        sword.rotation.y += 0.02;
    }

    // rectMesh.position.x += 0.01;

    renderer.render( scene, camera );
}