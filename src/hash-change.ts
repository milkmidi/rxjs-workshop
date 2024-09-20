import { distinctUntilChanged, fromEvent, map, shareReplay, startWith } from 'rxjs';
import shallowequal from 'shallowequal';

const getLocationHash = () => window.location.hash.replace('#', '').split('/');
const hashChange$ = fromEvent(window, 'hashchange').pipe(
  map(getLocationHash),
  distinctUntilChanged((prev, curr) => {
    console.log('distinctUntilChanged', prev, curr);
    return JSON.stringify(prev) === JSON.stringify(curr);
  }),
  // distinctUntilChanged(shallowequal),
  startWith(getLocationHash()),
  shareReplay(1),
);
hashChange$.subscribe((hash) => {
  console.log(`hash`, hash);
});

setTimeout(() => {
  hashChange$.subscribe((hash) => {
    console.log(`listener2`, hash);
  });
}, 2000);
