import { delay, map, takeUntil, takeWhile, timer } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';

const code = document.getElementById('code') as HTMLElement;

const digit = (num: number) => (num < 10 ? `0${num}` : `${num}`);
const formatTimestamp = (timestamp: number, format = 'DD HH mm ss') => {
  const days = Math.floor(timestamp / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timestamp / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((timestamp / (60 * 1000)) % 60);
  const seconds = Math.floor((timestamp / 1000) % 60);

  const daysStr = digit(days);
  const hoursStr = digit(hours);
  const minutesStr = digit(minutes);
  const secondsStr = digit(seconds);

  const resultFormat = format
    .replace('DD', daysStr)
    .replace('HH', hoursStr)
    .replace('mm', minutesStr)
    .replace('ss', secondsStr);

  return resultFormat;
};

const END_DATE = '2024/12/31 23:59:59';
const createCountdown = (targetTime: number | string, formatter = 'DD HH mm ss') => {
  const endTime = new Date(targetTime).getTime();
  // const diffTime = endTime - Date.now();
  // console.log('diffTime', diffTime);
  // 0 秒後開始，每 1000 毫秒發送一次
  return timer(0, 1000).pipe(
    // 當時間到了就停止
    takeWhile(() => Date.now() <= endTime),
    // takeUntil(timer(diffTime)), // 會有 bug，特定的日期會直接 complete // https://github.com/ReactiveX/rxjs/issues/3015
    // takeUntil(createTimer(new Date(END_DATE))),
    map(() => {
      return formatTimestamp(endTime - Date.now(), formatter);
    }),
  );
};

const countdown$ = createCountdown(END_DATE);
countdown$.subscribe({
  next: (value) => {
    const format = value.split(' ').join(':');
    code.innerHTML = format;
  },
  error: (err) => {
    console.log('error', err);
  },
  complete: () => {
    console.log('complete');
    code.innerHTML = 'Happy New Year!';
  },
});

//

// @ts-ignore
// timer()
// .pipe(delay(new Date('2024/8/30 23:59')))
// timer(0, 1000)
// .pipe(delay(diff))
// bug 啦，特定的日期會直接 complete
timer(new Date('2024/12/30 11:33')).subscribe(createObserver('test timer bug'));

timer(0, 1000)
  .pipe(
    //
    takeUntil(timer(new Date('2024/12/30 23:59'))),
  )
  .subscribe(createObserver('test timer bug2'));
