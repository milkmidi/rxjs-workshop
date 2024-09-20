import { fromEvent, map, of, reduce, scan, take, timer } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';
import { RxJSVizCollection } from './viz/rxjs-viz-collection';

const collection = new RxJSVizCollection('.rxjs-viz-container');
const sourceA$ = timer(500, 2000).pipe(
  map((data) => ({ name: String.fromCharCode(65 + data), color: '#4a69bd' })),
  take(3),
);
collection.addSource([sourceA$], ['SourceA']);

// RxJS
fromEvent(document, 'click')
  .pipe(
    scan((acc) => {
      return acc + 1;
    }, 0),
  )
  .subscribe((value) => {
    console.log(`Clicked ${value} times`);
  });

const numbers$ = of(1, 2, 3);

numbers$
  .pipe(
    // Get the sum of the numbers coming in.
    scan((total, n) => {
      return total + n;
    }),
    // Get the average by dividing the sum by the total number
    // received so far (which is 1 more than the zero-based index).
    // map((sum, index) => sum / (index + 1)),
  )
  .subscribe(console.log);
/* --------------------------------------------------------------- scan 
███████╗ ██████╗ █████╗ ███╗   ██╗
██╔════╝██╔════╝██╔══██╗████╗  ██║
███████╗██║     ███████║██╔██╗ ██║
╚════██║██║     ██╔══██║██║╚██╗██║
███████║╚██████╗██║  ██║██║ ╚████║
╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝ */
// https://www.youtube.com/watch?v=0S115Z9MjhQ
collection
  .createButtonAndFromClick('scan')
  .pipe(scan((acc) => acc + 1, 100))
  .subscribe(createObserver('scan'));
collection.addObservable(sourceA$.pipe(scan((acc) => acc + 1, 100)), 'scan');

/* --------------------------------------------------------------- reduce
██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗███████╗
██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝██╔════╝
██████╔╝█████╗  ██║  ██║██║   ██║██║     █████╗  
██╔══██╗██╔══╝  ██║  ██║██║   ██║██║     ██╔══╝  
██║  ██║███████╗██████╔╝╚██████╔╝╚██████╗███████╗
╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝  ╚═════╝╚══════╝ */
collection.addObservable(sourceA$.pipe(reduce((acc) => acc + 1, 0)), 'reduce');
