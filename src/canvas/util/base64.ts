export function base64ToBitmap(base64: string, type: string): Promise<ImageBitmap> {
    const bin = atob(base64.replace(/^.*,/, ""));
    const buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([buffer.buffer], { type });
    return createImageBitmap(blob);
}
