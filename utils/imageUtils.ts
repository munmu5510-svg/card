
export interface ImageBlob {
  data: string;
  mimeType: string;
}

export function dataUrlToBlobData(dataUrl: string): ImageBlob | null {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match || match.length !== 3) {
    return null;
  }
  return {
    mimeType: match[1],
    data: match[2],
  };
}
