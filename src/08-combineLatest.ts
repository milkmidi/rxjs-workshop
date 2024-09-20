import {
  combineLatest,
  combineLatestAll,
  combineLatestWith,
  map,
  of,
  switchMap,
  take,
  timer,
} from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';
import { RxJSVizCollection } from './viz/rxjs-viz-collection';

const collection = new RxJSVizCollection('.rxjs-viz-container');

// 4 combineAll deprecated, rename to combineLatestAll

// https://fullstackladder.dev/blog/2020/10/05/mastering-rxjs-20-combineall-switchall-concatall-mergeall-startwith/
// https://rxjs.dev/api/index/function/combineLatestAll
// https://rx.js.cool/combination/combineAll
// combineAll 會等待所有內部 Observable 發出值後，再將所有值組合成一個陣列。
// 將 source 發出的每個值對應成取前5個值的 interval observable
/*
    source 中的2個值會被對應成2個(內部的) interval observables，
    這2個內部 observables 每秒使用 combineLatest 策略來 combineAll，
    每當任意一個內部 observable 發出值，就會發出每個內部 observable 的最新值。
  */

const sourceA$ = timer(0, 1000).pipe(
  map((data) => String.fromCharCode(65 + data)),
  take(5),
);
const sourceB$ = timer(1000, 1500).pipe(
  map((data) => `${data}`),
  take(3),
);

collection.addSource([sourceA$, sourceB$], ['timer(0, 1000)', 'timer(1000, 1500)']);

// ----------------------------------------------------------------------- combineLatest
collection.addObservable(
  combineLatest([sourceA$, sourceB$]),
  'combineLatest',
  'combineLatestWith 就是 combineLatest',
);
combineLatest({
  a: sourceA$,
  b: sourceB$,
}).subscribe(createObserver('combineLatest'));

// ----------------------------------------------------------------------- combineLatestWith
collection.addObservable(
  sourceA$.pipe(combineLatestWith(sourceB$)),
  'combineLatestWith',
  '當所有 observable 都有值時，將最新的值合併成一個陣列',
);

collection
  .createButtonAndFromClick('combineLatestWith')
  .pipe(
    switchMap(() => {
      return combineLatest([sourceA$, sourceB$]);
    }),
  )
  .subscribe(createObserver('combineLatest'));

// ----------------------------------------------------------------------- combineLatestAll
const combineLatestAll$ = of(sourceA$, sourceB$).pipe(combineLatestAll());
collection.addObservable(combineLatestAll$, 'combineLatestAll');
