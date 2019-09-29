import { Picture, predictImages, loadImage, predictImagesFromTensor, predictImageCanvas } from './predictImageClass';
import * as comlink from "comlink";
import * as tf from '@tensorflow/tfjs';

class PredictionClass {
    constructor() {}
    async predictImages(imgs: HTMLImageElement[]): Promise<Picture[] | undefined> {
        const model = await tf.loadLayersModel('../model/classifyIllust/model.json');
        return predictImages(model, imgs)
    }

    // async predictImagesFromImageData(imgs: ImageData[]): Promise<Picture[] | undefined>{
    //     const model = await tf.loadLayersModel('../model/classifyIllust/model.json');
    //     return predictImages(model, imgs)
    // }
    async predictImagesFromSrc(imgs: string[]){
        const model = await tf.loadLayersModel('../model/classifyIllust/model.json');
        const blob = await (await fetch(imgs[0])).blob();
        const bitmap = await createImageBitmap(blob);
        const canvas = new OffscreenCanvas(bitmap.width,bitmap.height);
        const c = canvas.getContext('2d');
        c && c.drawImage(bitmap,0,0);
        return predictImageCanvas(model, canvas);
        // c && c.drawImage(imgs[0])

        console.log(imgs);
        // return predictImages(model, )
    }
}
comlink.expose(PredictionClass);