export function fileToBytes(file: File, callback: (bytes: Uint8Array) => any) {
    const reader = new FileReader();

    reader.onload = async function (event) {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);
       callback(bytes);
    }

    reader.readAsArrayBuffer(file);
}