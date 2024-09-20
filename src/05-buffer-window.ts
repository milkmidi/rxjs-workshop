import {
  auditTime,
  buffer,
  bufferCount,
  bufferTime,
  count,
  fromEvent,
  map,
  mergeAll,
  mergeMap,
  take,
  tap,
  timer,
  window,
  windowCount,
  windowToggle,
} from 'rxjs';
import { RxJSVizCollection } from './viz/rxjs-viz-collection';

const collection = new RxJSVizCollection('.rxjs-viz-container');

const sourceA$ = timer(0, 1000).pipe(
  map((data) => String.fromCharCode(65 + data)),
  take(10),
);
const sourceB$ = timer(500, 3500).pipe(
  // map((data) => ({ name: `${data}`, color: '#2ecc71' })),
  take(3),
);
collection.addSource([sourceA$, sourceB$], ['timer(0, 1000)', 'timer(500, 3500)']);

{
  /* // -------------------------------------------------------------- buffer
  ██████╗ ██╗   ██╗███████╗███████╗███████╗██████╗ 
  ██╔══██╗██║   ██║██╔════╝██╔════╝██╔════╝██╔══██╗
  ██████╔╝██║   ██║█████╗  █████╗  █████╗  ██████╔╝
  ██╔══██╗██║   ██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗
  ██████╔╝╚██████╔╝██║     ██║     ███████╗██║  ██║
  ╚═════╝  ╚═════╝ ╚═╝     ╚═╝     ╚══════╝╚═╝  ╚═╝ */
  // https://rxjs.dev/api/index/function/buffer
  // Collects values from the past as an array, and emits that array only when another Observable emits.
  collection.addObservable(
    sourceA$.pipe(buffer(sourceB$)),
    'buffer',
    'sourceA.buffer(sourceB), B 發生時，收集 A 發出過的 data',
  );
  collection.addObservable(
    sourceA$.pipe(
      //
      bufferTime(3000),
    ),
    'bufferTime',
    'sourceA.bufferTime(3000)',
  );

  // -------------------------------------------------------------- bufferCount
  // https://rxjs.dev/api/index/function/bufferCount
  collection.addObservable(
    sourceA$.pipe(
      //
      bufferCount(2),
    ),
    'bufferCount',
    'sourceA.bufferCount(2)',
  );
  collection.addObservable(
    sourceA$.pipe(
      //
      bufferCount(2, 3),
    ),
    'sourceA.bufferCount(2, 3)',
    '收集 2 個值，每 3 個值發出一次',
  );
}

{
  /* // -------------------------------------------------------------- window
  ██╗    ██╗██╗███╗   ██╗██████╗  ██████╗ ██╗    ██╗
  ██║    ██║██║████╗  ██║██╔══██╗██╔═══██╗██║    ██║
  ██║ █╗ ██║██║██╔██╗ ██║██║  ██║██║   ██║██║ █╗ ██║
  ██║███╗██║██║██║╚██╗██║██║  ██║██║   ██║██║███╗██║
  ╚███╔███╔╝██║██║ ╚████║██████╔╝╚██████╔╝╚███╔███╔╝
  ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝  ╚══╝╚══╝  */
  // https://rxjs.dev/api/index/function/window
  // https://ithelp.ithome.com.tw/articles/10188504
  // 使用 window 運算子將源 Observable 拆分成每 3 秒一個窗口
  // window 很類似 buffer 可以把一段時間內送出的元素拆出來，只是 buffer 是把元素拆分到陣列中變成
  const example1$ = sourceA$.pipe(
    window(sourceB$),
    mergeMap((value) => value.pipe(count())),
    // map((win) => win.pipe(take(2))), // 每個窗口最多發出2個值
    // mergeAll(),
  );
  collection.addObservable(
    example1$,
    'window(sourceB$)',
    'window 很類似 buffer 可以把一段時間內送出的元素拆出來，window 是把元素拆分出來放到新的 observable',
  );

  /*
  當然這個範例只是想單存的表達 window 的作用，沒什麼太大的意義，
  實務上 window 會搭配其他的 operators 使用，例如我們想計算一秒鐘內觸發了幾次 click 事件
  
  const btn = collection.createButton(
    'window',
    '點擊後，新增一個新的 Observable，並計算經過多久的時間了',
  );
  const click$ = fromEvent(btn, 'click');
  const source$ = interval(1000);
  source$
    .pipe(window(click$))
    .pipe(
      mergeMap((value) => value.pipe(count())),
      // switchAll(),
    )
    .subscribe(createObserver('window'));
  */

  // -------------------------------------------------------------- windowCount
  const windowCount$ = sourceA$.pipe(
    windowCount(3),
    tap(() => {
      console.log('NEW WINDOW!');
    }),
    map((win) => {
      return win.pipe(count());
    }),
    mergeAll(),
    // mergeMap((value) => value.pipe(count())),
  );
  collection.addObservable(windowCount$, 'windowCount', 'sourceA.windowCount(3)');

  // -------------------------------------------------------------- windowToggle
  const mouseDown$ = fromEvent(document, 'mousedown');
  const mouseUp$ = fromEvent(document, 'mouseup');
  const windowToggle$ = sourceA$.pipe(
    //
    windowToggle(mouseDown$, () => {
      // console.log(val);
      return mouseUp$;
    }),
    tap(() => {
      console.log('windowToggle NEW WINDOW!');
    }),
    mergeAll(),
  );

  collection.addObservable(
    windowToggle$,
    'windowToggle',
    ' 每次點都新增一個 window，並在 mouseUp 時關閉',
  );
}
