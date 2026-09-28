async function drawScaled(file: File, max: number): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas;
}

/** Small JPEG data URL for fast AI vision checks on mobile data. */
export async function toSmallDataUrl(file: File, max = 768): Promise<string> {
  return (await drawScaled(file, max)).toDataURL("image/jpeg", 0.8);
}

/** Shrinks a phone photo before upload so bulk saves stay quick; falls back to the original file. */
export async function toUploadFile(file: File, max = 1600): Promise<File> {
  try {
    const canvas = await drawScaled(file, max);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
