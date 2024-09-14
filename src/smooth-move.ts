import {
  animationFrames,
  delay,
  from,
  fromEvent,
  map,
  mergeMap,
  of,
  scan,
  tap,
  withLatestFrom,
} from 'rxjs';

type Position = {
  x: number;
  y: number;
};
type PositionWithRotate = Position & { rotate: number };

const lerp = (start: Position, end: Position): PositionWithRotate => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const rate = 0.05;
  return {
    x: start.x + dx * rate,
    y: start.y + dy * rate,
    rotate: Math.atan2(end.x - start.x, end.y - start.y),
  } as PositionWithRotate;
};
const mouseMove$ = fromEvent<MouseEvent>(window, 'mousemove').pipe(
  map((e) => ({ x: e.clientX, y: e.clientY })),
);

const smoothMove$ = animationFrames().pipe(
  withLatestFrom(mouseMove$, (_, move) => move),
  scan(lerp),
);

const DELAY_TIME = 200;
from(document.querySelectorAll<HTMLElement>('.box'))
  .pipe(
    mergeMap((element, index) => {
      return smoothMove$.pipe(
        delay(index * DELAY_TIME),
        withLatestFrom(of(element)),
        tap(([, ele]) => {
          ele.setAttribute('data-active', 'true');
        }),
      );
    }),
  )
  .subscribe(([pos, ele]) => {
    const { x, y } = pos;
    // @ts-ignore
    ele.style.transform = `translate(${x}px, ${y}px) rotate(${-pos.rotate}rad)`;
  });

// reference https://ithelp.ithome.com.tw/articles/10187999
