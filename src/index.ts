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

tf.loadLayersModel('../model/classifyIllust/model.json').then(m => {    
    const batched = loadImg('img');
    const batched2 = loadImg('img2');

    const img = new Image();
    img.src = './assets/44_CuZy55AUAAQjNJU.jpg';
    const resizeImg = tf.image.resizeBilinear(tf.browser.fromPixels(img,3),[224,224]);
    const batched3 = tf.tidy(() => {
        return resizeImg.expandDims(0);
      }).cast('float32').div(tf.scalar(255));

    if( !!batched && !!batched2) {
        console.log(batched);
        console.log('result');
        // const batchImg = batched.concat(batched2);
        // (m.predict(batched) as any).print();
        const predict = (m.predict(batched) as tf.Tensor<tf.Rank>).data().then( (data: any)=>console.log(data));
        console.log(predict);
        // !!batched ? (m.predict(batched) as any).print():{};
        // !!batched2 ? (m.predict(batched2) as any).print():{};
    }
    if ( !!batched3 ) {
        (m.predict(batched3)  as tf.Tensor<tf.Rank>).print();
    }
},
(e)=>{
    console.log(e);
});

