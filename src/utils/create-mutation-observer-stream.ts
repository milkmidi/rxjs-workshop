import { Observable } from 'rxjs';

const DEFAULT_CONFIG: MutationObserverInit = {
  attributes: true,
  childList: true,
  subtree: true,
};
export const createMutationObserverStream = (
  target: Element,
  config = DEFAULT_CONFIG,
): Observable<MutationRecord[]> => {
  return new Observable((subscriber) => {
    const mutation = new MutationObserver((mutations) => {
      subscriber.next(mutations);
    });
    mutation.observe(target, config);
    return () => {
      mutation.disconnect();
    };
  });
};
