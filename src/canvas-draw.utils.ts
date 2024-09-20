export type Point = {
  x: number;
  y: number;
};
export const distanceBetween = (point1: Point, point2: Point) =>
  Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);

export const angleBetween = (point1: Point, point2: Point) =>
  Math.atan2(point2.x - point1.x, point2.y - point1.y);

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const calculateFillPercentage = (canvas: HTMLCanvasElement, stride = 32) => {
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  return () => {
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = pixels;
    const { length } = data;
    const total = length / stride;
    let count = 0;
    for (let i = 0; i < length; i += stride) {
      if (data[i] === 0) {
        count++;
      }
    }

    return parseFloat((1 - count / total).toFixed(2));
  };
};
