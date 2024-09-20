import { defer, fromEvent, map, switchMap, timer } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';

// defer 是一個工廠函數，它會等到有人訂閱時才會執行
const defer$ = defer(() => {
  console.log('defer');
  return timer(1000).pipe(map(() => Math.random()));
});

defer$.subscribe((value) => {
  console.log(value);
});

const btn1 = document.getElementById('btn1') as HTMLButtonElement;
fromEvent(btn1, 'click')
  .pipe(switchMap(() => defer$))
  .subscribe(createObserver('fromEvent'));
