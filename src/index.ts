import * as tf from '@tensorflow/tfjs';

function loadImg(id: string): tf.Tensor<tf.Rank> | undefined {
    let img = document.getElementById(id) as HTMLImageElement;
    if( !img ) {
        return;
    }
    const resizeImg = tf.image.resizeBilinear(tf.browser.fromPixels(img,3),[224,224]);
    return tf.tidy(() => {
        return resizeImg.expandDims(0);
      }).cast('float32').div(tf.scalar(255));
}

console.log('start');
tf.loadLayersModel('../model/classifyIllust/model.json').then(m => {    
    const batched = loadImg('img');
    const batched2 = loadImg('img2');
    if( !!batched && !!batched2) {
        console.log(batched);
        console.log('result');
        const batchImg = batched.concat(batched2);
        (m.predict(batchImg) as any).print();
        // !!batched ? (m.predict(batched) as any).print():{};
        // !!batched2 ? (m.predict(batched2) as any).print():{};
    }
},
(e)=>{
    console.log(e);
});

