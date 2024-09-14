import {
  concat,
  concatAll,
  concatMap,
  concatWith,
  exhaustMap,
  map,
  merge,
  mergeAll,
  mergeMap,
  mergeWith,
  switchAll,
  switchMap,
  take,
  timer,
} from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';
import { marbles } from './viz/rxjs-marbles';
import { RxJSVizCollection } from './viz/rxjs-viz-collection';

const collection = new RxJSVizCollection('.rxjs-viz-container');

const sourceA$ = timer(500, 2000).pipe(
  map((data) => ({ name: String.fromCharCode(65 + data), color: '#4a69bd' })),
  take(3),
);
const sourceB$ = timer(1000, 500).pipe(
  map((data) => ({ name: data, color: '#78e08f' })),
  take(3),
);

// sourceA$.subscribe(marbles('sourceA', '', '.rxjs-source'));
// sourceB$.subscribe(marbles('sourceB', '', '.rxjs-source'));

collection.addSource([sourceA$, sourceB$], ['SourceA', 'SourceB']);

/* // --------------------------------------------------------------- switchMap
███████╗██╗    ██╗██╗████████╗ ██████╗██╗  ██╗
██╔════╝██║    ██║██║╚══██╔══╝██╔════╝██║  ██║
███████╗██║ █╗ ██║██║   ██║   ██║     ███████║
╚════██║██║███╗██║██║   ██║   ██║     ██╔══██║
███████║╚███╔███╔╝██║   ██║   ╚██████╗██║  ██║
╚══════╝ ╚══╝╚══╝ ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝ */

// https://rxjs.dev/api/index/function/switchMap
// https://rxjs-visualize.explosionpills.com/switchMap
// https://rxjs-cn.github.io/learn-rxjs-operators/operators/transformation/switchmap.html
// https://fullstackladder.dev/blog/2020/10/04/mastering-rxjs-19-switchmap-concatmap-mergemap-exhaustmap/
// switchMap 換成其他另一個 Observable，會退定前一個 Observable
{
  collection.addTitle('switch');

  // switchMap = map + switchAll
  collection.addObservable(
    sourceA$.pipe(
      switchMap((source) => {
        return sourceB$.pipe(map((val) => source.name + val.name));
      }),
    ),
    'switchMap',
    'switchMap 換成其他另一個 Observable，會退定前一個 Observable',
  );
  collection.addObservable(
    sourceA$.pipe(
      map((source) => {
        return sourceB$.pipe(map((val) => source.name + val.name));
      }),
      switchAll(),
    ),
    'map + switchAll',
    '和 switchMap 一樣，但是 switchAll 是用來攤平的',
  );

  collection
    .createButtonAndFromClick('switchMap', '連點會發現會退訂前一個')
    .pipe(switchMap(() => sourceA$))
    .subscribe(createObserver('switchMap from click'));
}

/* // ------------------------------------------------------------------------------------ concat
 ██████╗ ██████╗ ███╗   ██╗ ██████╗ █████╗ ████████╗
██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔══██╗╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║██║     ███████║   ██║   
██║     ██║   ██║██║╚██╗██║██║     ██╔══██║   ██║   
╚██████╗╚██████╔╝██║ ╚████║╚██████╗██║  ██║   ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚═╝  ╚═╝   ╚═╝    */
// https://rxjs-visualize.explosionpills.com/concat
{
  collection.addTitle('concat');
  /*
  -a-b-c-|  sourceA$
  -1-2-3-|  sourceB$
  concat(sourceA$, sourceB$) 
  -a-b-c-1-2-3|
  */
  collection.addObservable(
    concat(sourceA$, sourceB$),
    'concat',
    '要等目前的 Observable complete 後才會接續下一個',
  );

  // ------------------------------------------------------------------------------------ concatWith
  collection.addObservable(
    sourceA$.pipe(concatWith(sourceB$)),
    'concatWith',
    'concatWith 和 concat 是一樣的',
  );

  // ------------------------------------------------------------------------------------ concatMap
  const concatMap$ = sourceA$.pipe(
    concatMap((source) => {
      return sourceB$.pipe(map((val) => source.name + val.name));
    }),
  );
  collection.addObservable(
    concatMap$,
    'concatMap',
    '用 concatMap 會等到前一個 Observable 完成後，才接下一個，就是會依序處理每個 Observable',
  );

  collection.addObservable(
    sourceA$.pipe(
      map((val) => {
        return sourceB$.pipe(map((innerVal) => val.name + innerVal.name));
      }),
      concatAll(),
    ),
    'map + concatAll',
    '和 concatMap 一樣，但是 concatAll 是用來攤平的',
  );

  // https://www.youtube.com/watch?v=czf4Bh8eNPA&list=PLQpZdy2HZ5BTLOyTmzPxOfmfey2ILmqr6&index=12
  collection
    .createButtonAndFromClick('concatMap', '連點會發現需要等前一個跑完')
    .pipe(concatMap(() => sourceA$))
    .subscribe(createObserver('concatMap'));
}

/* 
███╗   ███╗███████╗██████╗  ██████╗ ███████╗
████╗ ████║██╔════╝██╔══██╗██╔════╝ ██╔════╝
██╔████╔██║█████╗  ██████╔╝██║  ███╗█████╗  
██║╚██╔╝██║██╔══╝  ██╔══██╗██║   ██║██╔══╝  
██║ ╚═╝ ██║███████╗██║  ██║╚██████╔╝███████╗
╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ */
{
  // ------------------------------------------------------------------------------------ merge
  collection.addTitle('merge');
  /*
  -a-b-c-|  sourceA$
  -1-2-3-|  sourceB$
  merge(sourceA$, sourceB$)
  -(a1)-(b2)-(c3)-|
  */
  collection.addObservable(merge(sourceA$, sourceB$), 'merge', '同時執行數個 Observables');

  // ------------------------------------------------------------------------------------ mergeWith
  collection.addObservable(sourceA$.pipe(mergeWith(sourceB$)), 'mergeWith', '和 merge 是一樣的');

  // --------------------------------------------------------------- mergeMap

  const mergeMap$ = sourceA$.pipe(
    mergeMap((sourceA) => {
      return sourceB$.pipe(map((sourceB) => sourceA.name + sourceB.name));
    }),
  );
  collection.addObservable(mergeMap$, 'mergeMap');

  // mergeAll 攤平的方式為同時處理多條 Observable。
  collection.addObservable(
    sourceA$.pipe(
      map((sourceA) => {
        return sourceB$.pipe(map((sourceB) => sourceA.name + sourceB.name));
      }),
      mergeAll(),
    ),
    'map + mergeAll',
  );

  collection
    .createButtonAndFromClick('mergeMap', '連點就會同時發生')
    .pipe(mergeMap(() => sourceA$))
    .subscribe(createObserver('mergeMap click'));
}
/* // --------------------------------------------------------------- exhaustMap
███████╗██╗  ██╗██╗  ██╗ █████╗ ██╗   ██╗███████╗████████╗███╗   ███╗ █████╗ ██████╗ 
██╔════╝╚██╗██╔╝██║  ██║██╔══██╗██║   ██║██╔════╝╚══██╔══╝████╗ ████║██╔══██╗██╔══██╗
█████╗   ╚███╔╝ ███████║███████║██║   ██║███████╗   ██║   ██╔████╔██║███████║██████╔╝
██╔══╝   ██╔██╗ ██╔══██║██╔══██║██║   ██║╚════██║   ██║   ██║╚██╔╝██║██╔══██║██╔═══╝ 
███████╗██╔╝ ██╗██║  ██║██║  ██║╚██████╔╝███████║   ██║   ██║ ╚═╝ ██║██║  ██║██║     
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝      */
// Projects each source value to an Observable which is merged in the output Observable only
// if the previous projected Observable has completed.
{
  collection.addTitle('exhaustMap');
  const exhaustMap$ = sourceA$.pipe(
    exhaustMap((sourceA) => {
      return sourceB$.pipe(map((sourceB) => sourceA.name + sourceB.name));
    }),
  );
  collection.addObservable(exhaustMap$, 'exhaustMap', '因為 A 沒有完成，所以 B 不會被執行');

  collection
    .createButtonAndFromClick(
      'exhaustMap',
      '連點會發現，只有當 sourceA$ 完成後，再次點擊才會再有效果',
    )
    .pipe(exhaustMap(() => sourceA$))
    .subscribe(createObserver('exhaustMap'));
}
