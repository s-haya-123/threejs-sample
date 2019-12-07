import * as comlink from 'comlink';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.vr.enabled = true;
// renderer.xr.enabled = true;
document.body.appendChild( renderer.domElement );
document.body.appendChild(ARButton.createButton(renderer))
const controller = renderer.vr.getController( 0 );
scene.add( controller );
controller.addEventListener( 'selectstart', onSelectStart );
// controller.addEventListener( 'selectend', onSelectEnd );
function onSelectStart() {
    console.log('start');
    animate();
}
// animate();
function animate(){
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    
    renderer.render( scene, camera );
}
