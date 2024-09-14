import { fromEvent, map, single, skip, skipUntil, take, timer } from 'rxjs';
import { marbles } from './viz/rxjs-marbles';

const sourceA$ = timer(0, 1000).pipe(
  map((data) => String.fromCharCode(65 + data)),
  take(10),
);
sourceA$.subscribe(marbles('sourceA', 'This is source A', '.rxjs-source'));

// ----------------------------------------------------- skip
sourceA$
  .pipe(
    //
    skip(2),
  )
  .subscribe(marbles('skip', 'sourceA$ skip(2)'));

// ----------------------------------------------------- single
sourceA$
  .pipe(
    //
    // take(1), // 只有一次事件發生，就不會發生錯誤
    single(),
  )
  .subscribe(marbles('single', 'sourceA$ single'));

// ----------------------------------------------------- skipUntil
// 直到 click 發生時，才會開始發送 sourceA$ 的事件
const windowClick$ = fromEvent(window, 'click');
sourceA$
  .pipe(
    //
    skipUntil(windowClick$),
  )
  .subscribe(marbles('skipUntil', 'sourceA$ skipUntil(windowClick$)'));
