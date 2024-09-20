import {
  forkJoin,
  interval,
  map,
  pairwise,
  race,
  switchMap,
  take,
  timer,
  withLatestFrom,
  zip,
} from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';
import { RxJSVizCollection } from './viz/rxjs-viz-collection';

const collection = new RxJSVizCollection('.rxjs-viz-container');

const sourceA$ = timer(0, 1000).pipe(
  map((data) => ({ name: String.fromCharCode(65 + data), color: '#8e44ad' })),
  take(6),
);
const sourceB$ = timer(500, 2000).pipe(
  map((data) => ({ name: `${data}`, color: '#2ecc71' })),
  take(3),
);

collection.addSource([sourceA$, sourceB$], ['sourceA', 'sourceB']);

{
  /* // ------------------------------------------------------------------------------------ zip
  ███████╗██╗██████╗ 
  ╚══███╔╝██║██╔══██╗
    ███╔╝ ██║██████╔╝
  ███╔╝  ██║██╔═══╝ 
  ███████╗██║██║     
  ╚══════╝╚═╝╚═╝      */
  //
  // https://ithelp.ithome.com.tw/articles/10247438
  // https://rxmarbles.com/#zip
  collection.addObservable(
    zip(sourceA$, sourceB$),
    'zip',
    'zip(sourceA$, sourceB$) - 同時執行數個 Observables，差別是會將每個 Observable 的資料「組合」成一個新的事件值，在新的 Observable 上發生新事件。',
  );
}

{
  /* // --------------------------------------------------------------- forkJoin
  ███████╗ ██████╗ ██████╗ ██╗  ██╗     ██╗ ██████╗ ██╗███╗   ██╗
  ██╔════╝██╔═══██╗██╔══██╗██║ ██╔╝     ██║██╔═══██╗██║████╗  ██║
  █████╗  ██║   ██║██████╔╝█████╔╝      ██║██║   ██║██║██╔██╗ ██║
  ██╔══╝  ██║   ██║██╔══██╗██╔═██╗ ██   ██║██║   ██║██║██║╚██╗██║
  ██║     ╚██████╔╝██║  ██║██║  ██╗╚█████╔╝╚██████╔╝██║██║ ╚████║
  ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝ */
  /*
  const a$ = of(1, 2, 3);
  const b$ = of('a', 'b', 'c');
  forkJoin([a$, b$]).subscribe(console.log);
  // [3, 'c']
 */
  collection.addObservable(
    forkJoin([sourceA$, sourceB$]),
    'forkJoin',
    'forkJoin 會同時訂閱傳入的 Observables，直到每個 Observable 都「結束」後，將每個 Observable 的「最後一筆值」組合起來',
  );
}

{
  /* // --------------------------------------------------------------- race
  ██████╗  █████╗  ██████╗███████╗
  ██╔══██╗██╔══██╗██╔════╝██╔════╝
  ██████╔╝███████║██║     █████╗  
  ██╔══██╗██╔══██║██║     ██╔══╝  
  ██║  ██║██║  ██║╚██████╗███████╗
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝ */
  collection.addObservable(
    race([sourceA$, sourceB$]),
    'race',
    '同時訂閱所有內部 Observables，當其中一個 Observable 先發生第一次事件後，以此 Observable 為主，並將其他 Observable 取消訂閱。',
  );
}

{
  /* // --------------------------------------------------------------- withLatestFrom
  ██╗    ██╗██╗████████╗██╗  ██╗██╗      █████╗ ████████╗███████╗███████╗████████╗███████╗██████╗  ██████╗ ███╗   ███╗
  ██║    ██║██║╚══██╔══╝██║  ██║██║     ██╔══██╗╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔══██╗██╔═══██╗████╗ ████║
  ██║ █╗ ██║██║   ██║   ███████║██║     ███████║   ██║   █████╗  ███████╗   ██║   █████╗  ██████╔╝██║   ██║██╔████╔██║
  ██║███╗██║██║   ██║   ██╔══██║██║     ██╔══██║   ██║   ██╔══╝  ╚════██║   ██║   ██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║
  ╚███╔███╔╝██║   ██║   ██║  ██║███████╗██║  ██║   ██║   ███████╗███████║   ██║   ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║
  ╚══╝╚══╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝ */
  // https://rxjs-cn.github.io/learn-rxjs-operators/operators/combination/withlatestfrom.html
  collection.addObservable(
    sourceA$.pipe(withLatestFrom(sourceB$)),
    'withLatestFrom',
    'sourceA withLatestFrom(sourceB) - 來源發出事件後，同時拿另一個來源最新的資料',
  );
  collection.addObservable(
    sourceA$.pipe(
      withLatestFrom(sourceB$, (a, b) => {
        return b;
      }),
    ),
    'withLatestFrom',
    'sourceA withLatestFrom(sourceB) - 來源發出事件後，同時拿另一個來源最新的資料，並且可以進行轉換',
  );
}

{
  /* // --------------------------------------------------------------- pairwise
  ██████╗  █████╗ ██╗██████╗ ██╗    ██╗██╗███████╗███████╗ 
  ██╔══██╗██╔══██╗██║██╔══██╗██║    ██║██║██╔════╝██╔════╝
  ██████╔╝███████║██║██████╔╝██║ █╗ ██║██║███████╗█████╗  
  ██╔═══╝ ██╔══██║██║██╔══██╗██║███╗██║██║╚════██║██╔══╝  
  ██║     ██║  ██║██║██║  ██║╚███╔███╔╝██║███████║███████╗
  ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝ */
  collection.addObservable(
    sourceA$.pipe(pairwise()),
    'pairwise',
    'sourceA pairwise() 取最新的兩個值',
  );
}
