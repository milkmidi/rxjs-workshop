import {
  distinctUntilChanged,
  from,
  fromEvent,
  map,
  mergeMap,
  pairwise,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
// https://codepen.io/milkmidi/pen/EpwgOQ
import {
  angleBetween,
  calculateFillPercentage,
  distanceBetween,
  loadImage,
} from './canvas-draw.utils';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const mousedown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
const mousemove$ = fromEvent<MouseEvent>(window, 'mousemove');
const mouseup$ = fromEvent<MouseEvent>(window, 'mouseup');

const draggable$ = mousedown$.pipe(
  mergeMap(() =>
    mousemove$.pipe(
      map((move) => {
        return { x: move.offsetX, y: move.offsetY };
      }),
      takeUntil(mouseup$),
      pairwise(),
    ),
  ),
);
const drawCanvas$ = draggable$.pipe(
  tap(([prev, curr]) => {
    const dist = distanceBetween(prev, curr);
    const angle = angleBetween(prev, curr);
    for (let i = 0; i < dist; i += 5) {
      const x = prev.x + Math.sin(angle) * i - 25;
      const y = prev.y + Math.cos(angle) * i - 25;
      ctx.beginPath();
      ctx.arc(x + 10, y + 10, 20, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }
  }),
  map(calculateFillPercentage(canvas)),
  distinctUntilChanged(),
);

from(loadImage('/img/uv-512.jpg'))
  .pipe(
    switchMap((img) => {
      ctx.fillStyle = ctx.createPattern(img, 'repeat')!;
      return drawCanvas$;
    }),
  )
  .subscribe((v) => {
    // console.log(v);
    const percent = document.getElementById('percent') as HTMLElement;
    percent.innerText = `${v * 100}%`;
  });
