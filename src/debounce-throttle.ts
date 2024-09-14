import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  interval,
  map,
  merge,
  share,
  throttleTime,
  withLatestFrom,
} from 'rxjs';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const MAX_WIDTH = 720;
const timer$ = interval(100).pipe(
  map((v) => (v * 5) % MAX_WIDTH),
  share(),
);

const drawBase$ = fromEvent(canvas, 'mousemove').pipe(
  withLatestFrom(timer$, (event, timer) => timer),
  distinctUntilChanged(),
);

const drawRegular$ = drawBase$.pipe(
  map((x) => ({
    x,
    y: 30,
    fillStyle: '#FFE589',
  })),
);
const drawDebounce$ = drawBase$.pipe(
  debounceTime(250),
  map((x) => ({
    x,
    y: 120,
    fillStyle: '#27ae60',
  })),
);
const drawThrottle$ = drawBase$.pipe(
  throttleTime(250),
  map((x) => ({
    x,
    y: 220,
    fillStyle: '#2980b9',
  })),
);

timer$.subscribe((v) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 290, v, 10);
});
timer$.pipe(filter((v) => v === 0)).subscribe(() => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.font = '20px arial';
  ctx.fillStyle = 'white';
  ctx.textBaseline = 'hanging';
  ctx.fillText('Events over time:', 5, 10);
  ctx.fillText('debounce:', 5, 100);
  ctx.fillText('throttle:', 5, 200);
});

merge(drawRegular$, drawDebounce$, drawThrottle$).subscribe((v) => {
  const { x, y, fillStyle } = v;
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, 2, 50);
});
