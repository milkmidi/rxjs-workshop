import { EMPTY, fromEvent, iif, interval, map, mergeMap, of, switchMap, take } from 'rxjs';

/* 
██╗██╗███████╗
██║██║██╔════╝
██║██║█████╗  
██║██║██╔══╝  
██║██║██║     
╚═╝╚═╝╚═╝      */
const r$ = of('R');
const x$ = of('X');
interval(1000)
  .pipe(
    take(10),
    mergeMap((v) => iif(() => v % 2 === 0, r$, x$)),
  )
  .subscribe((value) => {
    // console.log(value);
  });

const getHash = () => window.location.hash.replace('#', '');

const HASHS = ['products', 'category'];
of(window.location.hash)
  .pipe(
    map(getHash),
    switchMap((hash) => {
      return iif(() => HASHS.includes(hash), of(hash), EMPTY);
    }),
    take(1),
  )
  .subscribe({
    next: (value) => {
      console.log(value);
    },
    complete: () => {
      console.log('complete');
    },
  });

fromEvent(window, 'hashchange')
  .pipe(map(getHash))
  .subscribe((value) => {
    console.log('hashchange', value);
  });
