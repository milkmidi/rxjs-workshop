import { fromEvent, map, switchMap, takeUntil } from 'rxjs';
import { createDraggableCursorStream } from '@/utils/create-draggable-stream';

const createDraggableStream = (ele: HTMLElement) => {
  const mouseDown$ = fromEvent<MouseEvent>(ele, 'mousedown');
  const mouseMove$ = fromEvent<MouseEvent>(window, 'mousemove');
  const mouseUp$ = fromEvent<MouseEvent>(window, 'mouseup');

  return mouseDown$.pipe(
    switchMap((start) => {
      return mouseMove$.pipe(
        map((move) => {
          return {
            x: move.clientX - start.offsetX,
            y: move.clientY - start.offsetY,
          };
        }),
        takeUntil(mouseUp$),
      );
    }),
  );
};

{
  // ------------------------------------------------------------ draggable scrollLeft
  const scrollWrap = document.getElementById('scroll-wrap') as HTMLElement;

  createDraggableStream(scrollWrap).subscribe((pos) => {
    scrollWrap.scrollLeft = -pos.x;
    scrollWrap.scrollTop = -pos.y;
  });
}

{
  // ------------------------------------------------------------ draggable element
  const box1 = document.getElementById('box1') as HTMLElement;
  createDraggableStream(box1).subscribe((pos) => {
    box1.style.left = `${pos.x}px`;
    box1.style.top = `${pos.y}px`;
  });

  // TODO
  // createDraggableCursorStream(box1).subscribe(() => {});
}
