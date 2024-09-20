import {
  filter,
  interval,
  MonoTypeOperatorFunction,
  Observable,
  of,
  pipe,
  retry,
  take,
  tap,
} from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';
import { marbles } from './viz/rxjs-marbles';

{
  // ------------------------------------------ Identity operator
  const identity = <T>(source$: Observable<T>) => {
    console.log('identity');
    return source$;
  };

  // ------------------------------------------ MonoTypeOperatorFunction
  const discardOdd = <T extends number>(): MonoTypeOperatorFunction<T> => {
    return pipe(filter((v) => !(v % 2)));
  };

  // ------------------------------------------ Operator’s factory
  const logWithTag = <T>(tag: string) => {
    return (source$: Observable<T>) => {
      return source$.pipe(
        tap((v) => console.log(`%clog:${tag} ${v}`, 'background-color: #3498db;color:white;')),
      );
    };
  };

  // FIXME: implement tapOnce
  const tapOnce = <T>(cb: Function): MonoTypeOperatorFunction<T> => {};

  const source$ = interval(1000).pipe(
    //
    identity,
    discardOdd(),
    // FIXME: implement tapOnce
    // tapOnce((v: any) => console.log(`%ctapOnce: ${v}`, 'color:red;')),
    logWithTag('tag'),
    take(5),
  );
  source$.subscribe(marbles('example'));
}

{
  // https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
  const filterNil = () => {
    return <T>(source: Observable<T>) => {
      return new Observable((subscriber) => {
        const subscription = source.subscribe({
          next(value) {
            if (value !== undefined && value !== null) {
              subscriber.next(value);
            }
          },
          error(error) {
            subscriber.error(error);
          },
          complete() {
            subscriber.complete();
          },
        });
        return () => subscription.unsubscribe();
      });
    };
  };
  // Creating Operators from Existing Operators
  const filterNilV2 = () => {
    return <T>(source$: Observable<T>) => {
      return source$.pipe(filter((value) => value !== undefined && value !== null));
    };
  };

  of(0, 1, 2, null, 3, undefined, 4)
    .pipe(filterNil(), take(5))
    .subscribe((value) => {
      console.log(value);
    });
}

{
  const customFetch = (url: string) => {
    return new Observable((subscriber) => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(new Error(`Request failed with status: ${response.status}`));
        })
        .then((data) => {
          subscriber.next(data);
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  };

  customFetch('/api/mock?delay=1000&value=customFetch')
    .pipe(
      //
      retry(1),
    )
    .subscribe(createObserver('customFetch'));
  customFetch('/api/400?delay=1000&value=customFetch')
    .pipe(
      //
      retry(1),
    )
    .subscribe(createObserver('customFetch'));
}
