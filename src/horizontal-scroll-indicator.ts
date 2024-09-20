import { fromEvent, map, startWith, throttleTime } from 'rxjs';

const scrollIndication = document.getElementById('indication') as HTMLElement;
const getScrollPercent = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const height = scrollHeight - clientHeight;
  return scrollTop / height;
};

fromEvent(document, 'scroll')
  .pipe(
    //
    map(getScrollPercent),
    startWith(getScrollPercent()),
    throttleTime(20),
  )
  .subscribe((value) => {
    const percent = Math.round(value * 100);
    scrollIndication.style.width = `${percent}%`;
  });
