import {PDFDocument} from "pdf-lib";

export async function createPdfFromBytes(filesBytes: Uint8Array[]) {
    const doc: PDFDocument = await PDFDocument.create();

    for (let i = 0; i < filesBytes.length; i++) {
        const img = await doc.embedJpg(filesBytes[i]);
        const imgDims = img.scale(0.25);

        const page = doc.addPage();
        page.drawImage(img, {
            x: page.getWidth() / 2 - imgDims.width / 2,
            y: page.getHeight() / 2 - imgDims.height / 2,
            width: imgDims.width,
            height: imgDims.height
        });
    }

    return await doc.save();
}