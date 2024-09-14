import { auditTime, map, sample, sampleTime, take, timer } from 'rxjs';
// import { createObserver } from './utils/rxjx-development-utils';
import { RxJSVizCollection } from './viz/rxjs-viz-collection';

const collection = new RxJSVizCollection('.rxjs-viz-container');
const sourceA$ = timer(0, 1000).pipe(
  map((data) => ({ name: String.fromCharCode(65 + data), color: '#8e44ad' })),
  take(10),
);
const sourceB$ = timer(500, 2000).pipe(
  map((data) => ({ name: `${data}`, color: '#2ecc71' })),
  take(5),
);

collection.addSource([sourceA$, sourceB$], ['timer(0, 1000)', 'timer(500, 2000)']);

{
  /* 
  ███████╗ █████╗ ███╗   ███╗██████╗ ██╗     ███████╗
  ██╔════╝██╔══██╗████╗ ████║██╔══██╗██║     ██╔════╝
  ███████╗███████║██╔████╔██║██████╔╝██║     █████╗  
  ╚════██║██╔══██║██║╚██╔╝██║██╔═══╝ ██║     ██╔══╝  
  ███████║██║  ██║██║ ╚═╝ ██║██║     ███████╗███████╗
  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝     ╚══════╝╚══════╝ */
  // https://rxjs.dev/api/index/function/sample
  collection.addObservable(
    sourceA$.pipe(sample(sourceB$)),
    'sample',
    '當提供的 observable 發出時從源 observable 中取樣。',
  );

  collection.addObservable(sourceA$.pipe(sampleTime(1500)), 'sampleTime', 'sampleTime(1500)');
}

{
  /* // -------------------------------------------------------------- auditTime
   █████╗ ██╗   ██╗██████╗ ██╗████████╗████████╗██╗███╗   ███╗███████╗
  ██╔══██╗██║   ██║██╔══██╗██║╚══██╔══╝╚══██╔══╝██║████╗ ████║██╔════╝
  ███████║██║   ██║██║  ██║██║   ██║      ██║   ██║██╔████╔██║█████╗  
  ██╔══██║██║   ██║██║  ██║██║   ██║      ██║   ██║██║╚██╔╝██║██╔══╝  
  ██║  ██║╚██████╔╝██████╔╝██║   ██║      ██║   ██║██║ ╚═╝ ██║███████╗
  ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝   ╚═╝      ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝ */

  collection.addObservable(
    sourceA$.pipe(
      //
      auditTime(1500),
    ),
    'auditTime',
    'auditTime 和 sampleTime 很像，但是 auditTime 是在 source 發出後，等待一段時間，再發送出來',
  );
}
