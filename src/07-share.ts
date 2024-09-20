import { interval, map, share, shareReplay, take, tap, timer } from 'rxjs';
import { createObserver, LogMask } from './utils/rxjx-development-utils';

// https://rxjs-cn.github.io/learn-rxjs-operators/operators/multicasting/share.html
/* // --------------------------------------------------------------- share
███████╗██╗  ██╗ █████╗ ██████╗ ███████╗
██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝
███████╗███████║███████║██████╔╝█████╗  
╚════██║██╔══██║██╔══██║██╔══██╗██╔══╝  
███████║██║  ██║██║  ██║██║  ██║███████╗
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ */
{
  const source = timer(0, 1000);
  const example$ = source.pipe(
    tap(() => console.log('SIDE EFFECT')),
    map(() => {
      console.log('map');
      return Math.random();
    }),
    take(3),
  );

  // 不共享的話，副作用會執行兩次
  // example$.subscribe(createObserver('no share1', { logMask: LogMask.NEXT }));
  // example$.subscribe(createObserver('no share2', { logMask: LogMask.NEXT }));

  // 在多個訂閱者間共享 observable
  // share makes the stream hot
  // This is an alias for multicast(() => new Subject()), refCount()).
  const sharedExample$ = example$.pipe(share());
  // share 的話，副作用只執行一次
  sharedExample$.subscribe(createObserver('share3', { logMask: LogMask.NEXT }));
  sharedExample$.subscribe(createObserver('share4', { logMask: LogMask.NEXT }));
}

// --------------------------------------------------------------- shareReplay
{
  // shareReplay 會將 observable 的值緩存起來，並在有新的訂閱時，直接將緩存的值發送給新的訂閱者
  const shared$ = interval(500).pipe(
    //
    take(5),
    shareReplay(3),
  );

  shared$.subscribe(createObserver('shareReplay1'));

  setTimeout(() => {
    shared$.subscribe(createObserver('shareReplay2'));
  }, 5000);
}
