import { connectable, interval, multicast, take } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';

const source$ = interval(1000).pipe(take(3));

// source$.subscribe(createObserver('source$'));

// setTimeout(() => {
//   source$.subscribe(createObserver('source2$'));
// }, 2000);

// Creates an observable that multicasts once connect() is called on it.
const sourceConnect$ = connectable(source$);

// 舊的寫法是用 multicast() 來建立一個 connectable observable
// source$.pipe(multicast(() => new Subject()));

sourceConnect$.subscribe(createObserver('sourceConnect1$'));
setTimeout(() => {
  sourceConnect$.subscribe(createObserver('sourceConnect2$'));
}, 2000);

setTimeout(() => {
  // 透過 connect() 來啟動訂閱
  const subscription = sourceConnect$.connect();
  // 一次退订所有的訂閱
  // subscription.unsubscribe();
}, 3000);
