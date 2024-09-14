import {
  catchError,
  from,
  fromEvent,
  interval,
  map,
  mergeMap,
  of,
  retry,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { createObserver } from './utils/rxjx-development-utils';

{
  const source$ = throwError(() => 'This is an error!');
  source$.subscribe(createObserver('throwError'));
}
// Marbles diagram
// #

// https://rx.js.cool/error/catchError

{
  const error1Btn = document.getElementById('error1-btn') as HTMLButtonElement;
  fromEvent(error1Btn, 'click')
    .pipe(
      switchMap(() => {
        return interval(1000).pipe(
          map((n) => {
            if (n === 2) {
              throw new Error('ErrorMessage1');
            }
            return n;
          }),
          catchError((err) => of(err.message)),
        );
      }),
    )
    .subscribe(createObserver('catchError 1'));

  // GOOD
  const error2Btn = document.getElementById('error2-btn') as HTMLButtonElement;
  fromEvent(error2Btn, 'click')
    .pipe(
      switchMap(() => {
        return interval(1000).pipe(
          map((n) => {
            if (n === 4) {
              throw new Error('ErrorMessage2');
            }
            return n;
          }),
          catchError((err) => {
            // TODO
            throw new Error(`error in source. Details: ${err.message}`);
          }),
        );
      }),
    )
    .subscribe(createObserver('catchError 2'));
}

{
  // Promise 抛出错误
  const myBadPromise = () => {
    return new Promise((resolve, reject) => {
      reject(new Error('Rejected!'));
    });
  };
  const error3Btn = document.getElementById('error3-btn') as HTMLButtonElement;
  const source$ = timer(1000).pipe(
    mergeMap(() =>
      from(myBadPromise())
        //
        .pipe(catchError((error) => of(`Bad Promise: ${error}`))),
    ),
  );
  fromEvent(error3Btn, 'click')
    .pipe(switchMap(() => source$))
    .subscribe(createObserver('myBadPromise'));
}

{
  const fetchErrorBtn = document.getElementById('fetch-error-btn') as HTMLButtonElement;
  fromEvent(fetchErrorBtn, 'click')
    .pipe(
      mergeMap(() => {
        return fromFetch(`/api/400?value=fromFetch&delay=200&_d_=${Date.now()}`).pipe(
          switchMap((response) => {
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
    .subscribe(createObserver('fetch-error-btn'));
}

{
  // ---------------------------------------------- throwError
  const source$ = interval(500);
  const example$ = source$.pipe(
    mergeMap((val) => {
      if (val > 2) {
        return throwError(() => 'Error!');
      }
      return of(val);
    }),
    retry(1),
  );
  example$.subscribe(createObserver('retry'));
}
