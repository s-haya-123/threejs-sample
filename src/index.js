import * as handTrack from 'handtrackjs';

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
    const model = await handTrack.load(modelParams);
    const video = document.getElementById("myvideo");    
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

start();