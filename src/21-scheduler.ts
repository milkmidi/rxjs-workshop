import {
  animationFrameScheduler,
  asyncScheduler,
  interval,
  observeOn,
  of,
  queueScheduler,
  takeWhile,
} from 'rxjs';
import { createLogger } from '@/utils/logger';
import { createObserver } from './utils/rxjx-development-utils';

const box = document.querySelector('.box') as HTMLElement;
/*
// https://fullstackladder.dev/blog/2020/10/19/mastering-rxjs-34-introduce-scheduler-of-rxjs/
Scheduler 依照運作邏輯分成以下幾類：
  null：也就是不指定 Scheduler，那們就是同步執行的。
  queueScheduler：也是同步處理的，但在執行時 RxJS 會將所有同步的 Observable 資料放到 queue 內，再依序執行，稍後我們會說明這和 null 有什麼區別。
  asapScheduler：非同步處理，與使用 Promise 一樣的非同步處理層級，也就是使用 microtask
  asyncScheduler：非同步處理，處理方式同 setIntervael ，屬於 macrotask 層級
  animationFrameScheduler：非同步處理，處理方式同 requestAnimationFrame，也是屬於 macrotask 層級，但更適用於動畫處理 (效能較優)
*/
{
  // ----------------------------------------------------------
  const log1 = createLogger('log1');
  console.group('default');
  log1('start');
  of(1, 2, 3).subscribe(createObserver('of', { logger: log1 }));
  log1('end');
  console.groupEnd();

  // ---------------------------------------------------------- asyncScheduler
  const asyncSchedulerLog = createLogger('asyncScheduler');
  console.group('asyncScheduler');
  asyncSchedulerLog('asyncScheduler - start');
  // 同步執行
  // of(1, 2, 3, asyncScheduler) 這個是舊寫法，deprecated
  of(1, 2, 3)
    .pipe(
      //
      observeOn(asyncScheduler),
    )
    .subscribe(createObserver('asyncScheduler', { logger: asyncSchedulerLog }));
  asyncSchedulerLog('asyncScheduler - end');
  console.groupEnd();
}

{
  // ---------------------------------------------------------- animationFrameScheduler
  const intervals = interval(10); // Intervals are scheduled
  // with async scheduler by default...
  intervals
    .pipe(
      observeOn(animationFrameScheduler), // ...but we will observe on animationFrame
      takeWhile((val) => {
        return val <= 300;
      }),
    ) // scheduler to ensure smooth animation.
    .subscribe({
      next: (val) => {
        box.style.height = `${val}px`;
      },
      complete: () => {
        box.style.backgroundColor = 'red';
      },
    });
}
