import { defer, fromEvent, map, switchMap, tap, timer } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import cache from './utils/operators/cache';
import { createObserver, LogMask } from './utils/rxjx-development-utils';

{
  const source$ = defer(() => {
    console.log('defer');
    return timer(1000).pipe(
      tap(() => console.log('timer')),
      map(() => Math.random()),
    );
  });

  const cache1$ = source$.pipe(cache(1000));
  cache1$.subscribe(createObserver('cache1', { logMask: LogMask.NEXT }));

  setTimeout(() => {
    // cache
    cache1$.subscribe(createObserver('cache2', { logMask: LogMask.NEXT }));
  }, 1000);

  setTimeout(() => {
    // not cache
    cache1$.subscribe(createObserver('cache3', { logMask: LogMask.NEXT }));
  }, 3000);
}

{
  const fetchPosts$ = fromFetch('/api/mock?value=mock', {
    selector: (response) => response.json(),
  }).pipe(
    tap(() => console.log('fetchPosts$')),
    cache(3000),
  );

  const info = document.getElementById('info') as HTMLDivElement;

  const fetchBtn = document.getElementById('fetch-btn') as HTMLButtonElement;
  fromEvent(fetchBtn, 'click')
    .pipe(switchMap(() => fetchPosts$))
    .subscribe((data) => {
      console.log('response');
      info.innerHTML = JSON.stringify(data, null, 2);
    });
}
