import * as handTrack from "handtrackjs";

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6
  };

export function startVideo(video) {
    console.log(video.width,video.height);
    video.width = video.width || document.body.offsetWidth;
    video.height = video.height || document.body.offsetHeight;
  
    return new Promise(function(resolve, reject) {
        resolve(true);
    //   navigator.mediaDevices
    //     .getUserMedia({
    //       audio: false,
    //       video: {
    //         facingMode: "environment"
    //       }
    //     })
    //     .then(stream => {
    //       resolve(true);
    //       video.onloadedmetadata = () => {
    //         resolve(true);
    //       };
    //     })
    //     .catch(function(err) {
    //       resolve(false);
    //     });
    });
  }
  let model;
  let video;
  export async function start() {
    console.log("detect-hand start");
    model = await handTrack.load(modelParams);
    video = document.getElementById("arjs-video");
    const status = await startVideo(video);
    return {model, video};
  }
  export async function runDetect() {
    const predictions = await model.detect(video);
    console.log(model.getFPS())
    return predictions;
  }