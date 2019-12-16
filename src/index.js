import * as handTrack from 'handtrackjs';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
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
    console.log(status);
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
var camera = new THREE.Camera();
scene.add(camera);
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
light.position.set(0, 1, 0);
scene.add(light);
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

// init controls for camera
var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
    type : 'pattern',
    patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
    // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
    // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
    changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

// add a torus knot
var geometry	= new THREE.CubeGeometry(1,1,1);
var material	= new THREE.MeshNormalMaterial({
    transparent : true,
    opacity: 0.5,
    side: THREE.DoubleSide
});
var mesh	= new THREE.Mesh( geometry, material );
mesh.position.y	= geometry.parameters.height/2
scene.add( mesh );
var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
var material	= new THREE.MeshNormalMaterial();
var mesh	= new THREE.Mesh( geometry, material );
mesh.position.y	= 0.5
scene.add( mesh );
let loader = new OBJLoader();
loader.load('../assets/Sword.obj',
(group)=>{
    group.name = "sword"
    console.log(group);
    
    group.position.set(0,0,0);
    group.scale.set(0.01,0.01,0.01);
    // const material	= new THREE.MeshNormalMaterial();
    // const mesh = THREE.Mesh(group, material);
    scene.add(group);
});
onRenderFcts.push(function(delta){
    mesh.rotation.x += Math.PI*delta;
    mesh.rotation.y += Math.PI*delta;
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
        onRenderFct(deltaMsec/1000, nowMsec/1000)
    })
})

// setTimeout(start,1000);
