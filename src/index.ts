import * as tf from '@tensorflow/tfjs';
import { LayersModel } from '@tensorflow/tfjs';

console.log('start');
tf.loadLayersModel('../model/classifyIllust/model.json').then(m => {
    let img = document.getElementById('img') as HTMLImageElement;
    if( !img) {
        return;
    }
    console.log('load');
    const resizeImg = tf.image.resizeBilinear(tf.browser.fromPixels(img,3),[224,224]);
    const batched = tf.tidy(() => {
        return resizeImg.expandDims(0);
      }).cast('float32').div(tf.scalar(255));
    // const batched = tf.browser.fromPixels(img,1)
    console.log('result');
    // const reshapeImg = resizeImg.reshape([1,244,244,3])
    const predict = m.predict(batched) as any;
    predict.print();
},
(e)=>{
    console.log(e);
});

