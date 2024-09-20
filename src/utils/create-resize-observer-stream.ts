import { Observable } from 'rxjs';
import { querySelectorAll } from './dom-utils';

export const createResizeObserverStream = (
  selector: string | HTMLElement | HTMLElement[],
): Observable<ResizeObserverEntry[]> => {
  return new Observable((subscriber) => {
    const mutation = new ResizeObserver((mutations) => {
      subscriber.next(mutations);
    });
    const elements: HTMLElement[] = querySelectorAll(selector);
    elements.forEach((el) => mutation.observe(el));
    return () => {
      mutation.disconnect();
    };
  });
};
