import {PageSizes, PDFDocument} from "pdf-lib";

const MARGIN = 24;

// PNG files always start with the bytes 89 50 4E 47 ("\x89PNG")
function isPng(bytes: Uint8Array) {
    return bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4e && bytes[3] == 0x47;
}

export async function createPdfFromBytes(filesBytes: Uint8Array[]) {
    const doc: PDFDocument = await PDFDocument.create();

    for (let i = 0; i < filesBytes.length; i++) {
        const img = isPng(filesBytes[i]) ? await doc.embedPng(filesBytes[i]) : await doc.embedJpg(filesBytes[i]);

        // A4, turned sideways for landscape images
        const [a4Width, a4Height] = PageSizes.A4;
        const landscape = img.width > img.height;
        const page = doc.addPage(landscape ? [a4Height, a4Width] : [a4Width, a4Height]);

        // Shrink to fit inside the margins, but never enlarge small images (they'd get blurry)
        const scale = Math.min(1, (page.getWidth() - 2 * MARGIN) / img.width, (page.getHeight() - 2 * MARGIN) / img.height);
        const imgDims = img.scale(scale);

        page.drawImage(img, {
            x: page.getWidth() / 2 - imgDims.width / 2,
            y: page.getHeight() / 2 - imgDims.height / 2,
            width: imgDims.width,
            height: imgDims.height
        });
    }

    return await doc.save();
}
