import { filter, mergeMap, Observable, take, tap } from 'rxjs';
import { querySelectorAll } from './dom-utils';

export function createIntersectionObservableStream(
  selector: string | HTMLElement[] | HTMLElement,
  options?: IntersectionObserverInit,
) {
  const elements: HTMLElement[] = querySelectorAll(selector);
  const ioObservable = new Observable<IntersectionObserverEntry[]>((observer) => {
    const io = new IntersectionObserver((entries) => {
      observer.next(entries);
    }, options);
    elements.forEach((ele) => io.observe(ele));
    return () => {
      io.disconnect();
    };
  });
  return ioObservable.pipe(
    mergeMap((entries) => entries),
    tap((entry) => {
      entry.target.setAttribute('data-intersecting', `${entry.isIntersecting}`);
    }),
  );
}
export const createIntersectionObservableOnceStream = (
  selector: string | HTMLElement[] | HTMLElement,
  options?: IntersectionObserverInit,
) => {
  return createIntersectionObservableStream(selector, options).pipe(
    filter((entry) => entry.isIntersecting),
    take(1),
  );
};
