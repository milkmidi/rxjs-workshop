import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  mergeMap,
  of,
  retry,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { createAxiosStream } from './utils/create-axios-stream';
import { createObserver } from './utils/rxjx-development-utils';

const resultEle = document.getElementById('result') as HTMLElement;
const loadingEle = document.getElementById('loading') as HTMLElement;
const inputEle = document.getElementById('input') as HTMLInputElement;

type PokemonItem = {
  name: {
    english: string;
  };
};
const initWithSelector = {
  selector: (response: Response) => response.json(),
};
{
  const validSearch$ = fromEvent(inputEle, 'input').pipe(
    debounceTime(300),
    map((e) => (e.target as HTMLInputElement).value),
    distinctUntilChanged(),
    filter((input) => input !== ''),
    tap(() => {
      loadingEle.removeAttribute('hidden');
    }),
    switchMap((value) => {
      return fromFetch<{ items: PokemonItem[] }>(
        `/api/pokemon?query=${value}&delay=1000`,
        initWithSelector,
      ).pipe(retry(3));
    }),
    map((results) => results.items.map((item) => item.name.english)),
  );

  // validSearch$.subscribe((val) => {
  // });

  const emptySearch$ = fromEvent(inputEle, 'input').pipe(
    debounceTime(300),
    map((event) => (<HTMLInputElement>event.target).value),
    filter((input) => input === ''),
    switchMap(() => of([])),
  );

  merge(validSearch$, emptySearch$).subscribe((value) => {
    resultEle.innerHTML = value.map((v) => `<div>${v}</div>`).join('');
    loadingEle.setAttribute('hidden', 'true');
  });
}

{
  fromEvent(document.getElementById('fromFetchBtn') as HTMLButtonElement, 'click')
    .pipe(
      switchMap(() => {
        return fromFetch(`/api/mock?value=fromFetch&delay=500&_d_=${Date.now()}`, initWithSelector);
      }),
    )
    .subscribe(createObserver('fromFetch'));

  // 14-error.ts 也有一樣的程式碼
  fromEvent(document.getElementById('fromFetchRetryBtn') as HTMLButtonElement, 'click')
    .pipe(
      mergeMap(() => {
        return fromFetch(`/api/400?value=fromFetch&delay=200&_d_=${Date.now()}`).pipe(
          mergeMap((response) => {
            if (response.ok) {
              return response.json();
            }
            return throwError(() => `HTTP error! Status: ${response.status}`);
          }),
          retry({
            count: 2,
            delay: 500,
          }),
        );
      }),
    )
    .subscribe(createObserver('fromFetchRetryBtn'));
}
{
  // axios
  fromEvent(document.getElementById('fromAxiosBtn') as HTMLButtonElement, 'click')
    .pipe(
      switchMap(() => {
        return createAxiosStream({ url: `/api/mock?value=fromAxios&delay=1000&_d_=${Date.now()}` });
      }),
    )
    .subscribe(createObserver('fromAxiosBtn'));
  fromEvent(document.getElementById('fromAxiosRetryBtn') as HTMLButtonElement, 'click')
    .pipe(
      mergeMap(() => {
        return createAxiosStream({
          url: `/api/400?value=fromAxios&delay=200&_d_=${Date.now()}`,
        }).pipe(
          retry({
            count: 1,
            delay: 500,
          }),
        );
      }),
    )
    .subscribe(createObserver('fromAxiosRetryBtn'));
}
