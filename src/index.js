import * as handTrack from 'handtrackjs';

const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

async function start() {
    const model = await handTrack.load(modelParams);
    const video = document.getElementById("myvideo");    
    const status = await handTrack.startVideo(video)
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