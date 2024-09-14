import { filter, fromEvent } from 'rxjs';

export default function createClickOutSideStream(target: HTMLElement | string) {
  const ele = typeof target === 'string' ? document.querySelector(target) : target;
  return fromEvent<MouseEvent>(window, 'click').pipe(
    filter((e: MouseEvent) => {
      if (ele) {
        return !e.composedPath().includes(ele);
      }
      return true;
    }),
  );
}
