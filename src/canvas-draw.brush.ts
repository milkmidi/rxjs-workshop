import {
  distinct,
  from,
  fromEvent,
  map,
  mergeMap,
  pairwise,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  angleBetween,
  calculateFillPercentage,
  distanceBetween,
  loadImage,
} from './canvas-draw.utils';

const canvas = document.getElementById('canvas2') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
// ctx.fillStyle = 'red';
// ctx.strokeStyle = '#333';

const brushImg = new Image();
brushImg.src = '/img/brush.png';

const mousedown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
const mousemove$ = fromEvent<MouseEvent>(window, 'mousemove');
const mouseup$ = fromEvent<MouseEvent>(window, 'mouseup');

const drawCanvas$ = mousedown$.pipe(
  mergeMap(() =>
    mousemove$.pipe(
      map((move) => {
        return { x: move.offsetX, y: move.offsetY };
      }),
      takeUntil(mouseup$),
      pairwise(),
    ),
  ),
  tap(([prev, curr]) => {
    const dist = distanceBetween(prev, curr);
    const angle = angleBetween(prev, curr);
    ctx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < dist; i += 5) {
      const x = prev.x + Math.sin(angle) * i - 25;
      const y = prev.y + Math.cos(angle) * i - 25;
      ctx.drawImage(brushImg, x, y);
    }
  }),
  map(calculateFillPercentage(canvas)),
  distinct(),
);

from(loadImage('https://fakeimg.pl/500x500/111111/?text=scratch'))
  .pipe(
    switchMap((img) => {
      // ctx.fillStyle = ctx.createPattern(img, 'repeat')!;
      ctx.drawImage(img, 0, 0);
      return drawCanvas$;
    }),
  )
  .subscribe((v) => {
    // console.log(v);
    const percent = document.getElementById('percent2') as HTMLElement;
    percent.innerText = `${v * 100}%`;
  });
