import * as handTrack from "handtrackjs";

const modelParams = {
    flipHorizontal: true, // flip e.g for video
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6
  };

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
          resolve(true);
          video.onloadedmetadata = () => {
            resolve(true);
          };
        })
        .catch(function(err) {
          resolve(false);
        });
    });
  }
  export async function start() {
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