import { filter, fromEvent, map, merge, startWith, switchMap, takeUntil, tap } from 'rxjs';

// https://www.thisdot.co/blog/how-to-implement-drag-and-drop-using-rxjs
type DraggableCallback = {
  onDragStart?: (e: MouseEvent) => void;
  onDragging?: (e: MouseEvent) => void;
  onDragEnd?: (e: MouseEvent) => void;
};
export const createDraggableStream = (ele: HTMLElement, callback?: DraggableCallback) => {
  const mouseDown$ = fromEvent<MouseEvent>(ele, 'mousedown');
  const mouseMove$ = fromEvent<MouseEvent>(window, 'mousemove');
  const mouseUp$ = fromEvent<MouseEvent>(window, 'mouseup');

  return mouseDown$.pipe(
    switchMap((start) => {
      let prevX = 0;
      let prevY = 0;
      callback?.onDragStart?.(start);
      return mouseMove$.pipe(
        map((move) => {
          const { clientX, clientY, offsetX, offsetY } = move;
          const diffX = clientX - prevX;
          const diffY = clientY - prevY;
          const incrementX = prevX ? diffX : 0;
          const incrementY = prevY ? diffY : 0;
          prevX = clientX;
          prevY = clientY;
          callback?.onDragging?.(move);
          return {
            x: clientX - start.offsetX,
            y: clientY - start.offsetY,
            offsetX,
            offsetY,
            clientX,
            clientY,
            incrementX,
            incrementY,
          };
        }),
        takeUntil(
          mouseUp$.pipe(
            tap((end) => {
              callback?.onDragEnd?.(end);
            }),
          ),
        ),
      );
    }),
  );
};

export const createDraggableCursorStream = (ele: HTMLElement) => {
  let isDragging = false;

  const mouseEnter$ = fromEvent(ele, 'mouseenter');
  const mouseLeave$ = fromEvent(ele, 'mouseleave');
  const mouseDown$ = fromEvent(ele, 'mousedown');
  const mouseUp$ = fromEvent(window, 'mouseup');

  const grabCursor$ = mouseEnter$.pipe(
    filter(() => !isDragging),
    map(() => 'grab'),
  );

  const autoCursor$ = mouseLeave$.pipe(
    filter(() => !isDragging),
    map(() => 'auto'),
  );

  const grabbingCursor$ = mouseDown$.pipe(
    switchMap(() => {
      isDragging = true;
      return mouseUp$.pipe(
        map((e) => {
          isDragging = false;
          if (e.composedPath().includes(ele)) {
            return 'grab';
          }
          return 'auto';
        }),
        startWith('grabbing'),
      );
    }),
  );

  return merge(grabCursor$, autoCursor$, grabbingCursor$).pipe(
    tap((cursorStyle) => {
      document.body.style.cursor = cursorStyle;
    }),
  );
};
