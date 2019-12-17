import * as handTrack from 'handtrackjs';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { Fire } from 'three/examples/jsm/objects/Fire.js';
// import * as THREE from 'three';


const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

export function startVideo(video) {
    // Video must have height and width in order to be used as input for NN
    // Aspect ratio of 3/4 is used to support safari browser.
    video.width = video.width || 640;
    video.height = video.height || video.width * (3 / 4)
  
    return new Promise(function (resolve, reject) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "environment"
          }
        })
        .then(stream => {
          window.localStream = stream;
          video.srcObject = stream
          video.onloadedmetadata = () => {
            video.play()
            resolve(true)
          }
        }).catch(function (err) {
          resolve(false)
        });
    });
  
  }
async function start() {
    console.log('detect-hand start');
    const model = await handTrack.load(modelParams);
    const video = document.getElementById("arjs-video");    
    const status = await startVideo(video)
    if(status){
        runDetect(model,video);
    }
}
async function runDetect(model, video) {
    const predictions = await model.detect(video);
    console.log(predictions);
    setTimeout(()=>{runDetect(model, video)}, 100);
}

// init renderer
var renderer	= new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize( 640, 480 );
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild( renderer.domElement );

// array of functions for the rendering loop
var onRenderFcts= [];
// init scene and camera
var scene	= new THREE.Scene();
//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////
// Create a camera
var camera = new THREE.PerspectiveCamera(60, document.body.offsetWidth / document.body.offset, 1, 10);
// camera.position.set( );
camera.position.z = 3;
scene.add(camera);
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
light.position.set(0, 1, 0);
scene.add(light);


var plane = new THREE.PlaneBufferGeometry( 20, 20 );
var fire = new Fire( plane, {
    textureWidth: 512,
    textureHeight: 512,
    debug: false
} );
var params = {
    color1: '#ffffff',
    color2: '#ffa000',
    color3: '#000000',
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
params.Single = function () {
    fire.clearSources();
    fire.addSource( 0.5, 0.1, 0.1, 1.0, 0.0, 1.0 );
};


////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////
var arToolkitSource = new THREEx.ArToolkitSource({
    // to read from the webcam
    sourceType : 'webcam',
    // // to read from an image
    // sourceType : 'image',
    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',
    // to read from a video
    // sourceType : 'video',
    // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
})
arToolkitSource.init(function onReady(){
    onResize()
})
// handle resize
window.addEventListener('resize', function(){
    onResize()
})
function onResize(){
    arToolkitSource.onResizeElement()
    arToolkitSource.copyElementSizeTo(renderer.domElement)
    if( arToolkitContext.arController !== null ){
        arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
    }
}

// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
    detectionMode: 'mono',
})
// initialize it
arToolkitContext.init(function onCompleted(){
    // copy projection matrix to camera
    camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
})
// update artoolkit on every frame
onRenderFcts.push(function(){
    if( arToolkitSource.ready === false )	return
    arToolkitContext.update( arToolkitSource.domElement )
    // update scene.visible if the marker is seen
    scene.visible = camera.visible
})
const makerRoot = new THREE.Group();
scene.add(makerRoot);
fire.position.set(0,0,0);

params.Single();
updateAll();
// init controls for camera
var markerControls = new THREEx.ArMarkerControls(arToolkitContext, makerRoot, {
    type : 'pattern',
    patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
    // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    // changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

// add a torus knot
var geometry	= new THREE.CubeGeometry(2,1,1);
var material	= new THREE.MeshNormalMaterial({
    transparent : true,
    opacity: 0.5,
    // side: THREE.DoubleSide
});
var mesh = new THREE.Mesh( geometry, material );
mesh.position.set(0,0,0);
// mesh.scale.set(0.1,0.1,0.1);
scene.add( mesh );
makerRoot.add( fire );
// const project = mesh.position.project(camera)
// console.log(window.innerWidth / 2 * (+project.x + 1.0), window.innerHeight / 2 * (-project.y + 1.0) )

// mesh.position.set(-2.4226338863372803, -0.19854499399662018, -7.350611209869385)
// var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
// var material	= new THREE.MeshNormalMaterial();
// var mesh	= new THREE.Mesh( geometry, material );
// mesh.position.y	= 0.5
// makerRoot.add( mesh );
let loader = new OBJLoader();
loader.load('../dist/Sword.obj',
(group)=>{
    group.name = "sword"
    group.position.set(0,0,0);
    group.scale.set(0.03,0.03,0.03);
    makerRoot.add(group);
});
let total = 0;
onRenderFcts.push(function(delta){
    total += delta;
    console.log(total);
    if(total > 1) {
        console.log(total);
        mesh.visible = false;
    }
    if(total > 1.5) {
        mesh.visible = true;
        total = 0;
    }
})
// render the scene
onRenderFcts.push(function(){
    renderer.render( scene, camera );
})
// run the rendering loop
var lastTimeMsec= null
requestAnimationFrame(function animate(nowMsec){
    // keep looping
    requestAnimationFrame( animate );

    // measure time
    lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
    var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec	= nowMsec
    // call each update function
    onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/10000, nowMsec/10000)
    })
})

// setTimeout(start,100);

function updateAll() {

    updateColor1( params.color1 );
    updateColor2( params.color2 );
    updateColor3( params.color3 );
    updateColorBias( params.colorBias );
    updateBurnRate( params.burnRate );
    updateDiffuse( params.diffuse );
    updateViscosity( params.viscosity );
    updateExpansion( params.expansion );
    updateSwirl( params.swirl );
    updateDrag( params.drag );
    updateAirSpeed( params.airSpeed );
    updateWindX( params.windX );
    updateWindY( params.windY );
    updateSpeed( params.speed );
    updateMassConservation( params.massConservation );

}
function updateColor1( value ) {

    fire.color1.set( value );

}

function updateColor2( value ) {

    fire.color2.set( value );

}

function updateColor3( value ) {

    fire.color3.set( value );

}

function updateColorBias( value ) {

    fire.colorBias = value;

}

function updateBurnRate( value ) {

    fire.burnRate = value;

}

function updateDiffuse( value ) {

    fire.diffuse = value;

}

function updateViscosity( value ) {

    fire.viscosity = value;

}

function updateExpansion( value ) {

    fire.expansion = value;

}

function updateSwirl( value ) {

    fire.swirl = value;

}

function updateDrag( value ) {

    fire.drag = value;

}

function updateAirSpeed( value ) {

    fire.airSpeed = value;

}

function updateWindX( value ) {

    fire.windVector.x = value;

}

function updateWindY( value ) {

    fire.windVector.y = value;

}

function updateSpeed( value ) {

    fire.speed = value;

}

function updateMassConservation( value ) {

    fire.massConservation = value;

}