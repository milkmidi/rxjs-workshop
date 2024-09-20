import { fromEvent, Observable, share, Subject, switchMap, take, timer } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';

// https://fullstackladder.dev/blog/2020/09/28/mastering-rxjs-13-cold-observable-hot-observable/
/* // --------------------------------------------------------------- Cold Observable
 ██████╗ ██████╗ ██╗     ██████╗      ██████╗ ██████╗ ███████╗███████╗██████╗ ██╗   ██╗ █████╗ ██████╗ ██╗     ███████╗
██╔════╝██╔═══██╗██║     ██╔══██╗    ██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔════╝
██║     ██║   ██║██║     ██║  ██║    ██║   ██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║███████║██████╔╝██║     █████╗  
██║     ██║   ██║██║     ██║  ██║    ██║   ██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══██║██╔══██╗██║     ██╔══╝  
╚██████╗╚██████╔╝███████╗██████╔╝    ╚██████╔╝██████╔╝███████║███████╗██║  ██║ ╚████╔╝ ██║  ██║██████╔╝███████╗███████╗
╚═════╝ ╚═════╝ ╚══════╝╚═════╝      ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝  */
{
  const timer$ = timer(0, 1000).pipe(take(2));
  timer$.subscribe(createObserver('1'));

  setTimeout(() => {
    // 只有在 subscribe 之後，才會開始執行
    // 每次當有新的 subscriber 訂閱，就會重新執行
    timer$.subscribe(createObserver('2'));
  }, 3000);
}

/* // --------------------------------------------------------------- hot Observable
  ██╗  ██╗ ██████╗ ████████╗     ██████╗ ██████╗ ███████╗███████╗██████╗ ██╗   ██╗ █████╗ ██████╗ ██╗     ███████╗
  ██║  ██║██╔═══██╗╚══██╔══╝    ██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔════╝
  ███████║██║   ██║   ██║       ██║   ██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║███████║██████╔╝██║     █████╗  
  ██╔══██║██║   ██║   ██║       ██║   ██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══██║██╔══██╗██║     ██╔══╝  
  ██║  ██║╚██████╔╝   ██║       ╚██████╔╝██████╔╝███████║███████╗██║  ██║ ╚████╔╝ ██║  ██║██████╔╝███████╗███████╗
  ╚═╝  ╚═╝ ╚═════╝    ╚═╝        ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝ */
{
  // 所有的 Subject 都是 hot observable
  const subject = new Subject();
  subject.next(1);
  subject.next(2);
  subject.subscribe(createObserver('Subject'));
  setTimeout(() => {
    subject.next(3);
  }, 4000);
}
{
  const apiRequest$ = new Observable((subscriber) => {
    fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then((res) => res.json())
      .then((data) => {
        subscriber.next(data);
        subscriber.complete();
      });
  });
  const fetchBtn = document.getElementById('fetch-btn') as HTMLButtonElement;
  fromEvent(fetchBtn, 'click')
    .pipe(switchMap(() => apiRequest$))
    .subscribe((data) => {
      console.log(data);
    });
  // 由於 cold Observable 所以每次 subscribe 都會重新執行
  apiRequest$.subscribe();
  apiRequest$.subscribe();
}

/* // --------------------------------------------------------------- Warm Observable
██╗    ██╗ █████╗ ██████╗ ███╗   ███╗     ██████╗ ██████╗ ███████╗███████╗██████╗ ██╗   ██╗ █████╗ ██████╗ ██╗     ███████╗
██║    ██║██╔══██╗██╔══██╗████╗ ████║    ██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔════╝
██║ █╗ ██║███████║██████╔╝██╔████╔██║    ██║   ██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║███████║██████╔╝██║     █████╗  
██║███╗██║██╔══██║██╔══██╗██║╚██╔╝██║    ██║   ██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══██║██╔══██╗██║     ██╔══╝  
╚███╔███╔╝██║  ██║██║  ██║██║ ╚═╝ ██║    ╚██████╔╝██████╔╝███████║███████╗██║  ██║ ╚████╔╝ ██║  ██║██████╔╝███████╗███████╗
╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝ */
{
  // warm observable，先是 cold，加個 share 先啟動一次後，變成可以變成 warm
  const apiRequest2$ = new Observable((subscriber) => {
    fetch('https://jsonplaceholder.typicode.com/posts/2')
      .then((res) => res.json())
      .then((data) => {
        subscriber.next(data);
        subscriber.complete();
      });
  });
  const sharedApiRequest$ = apiRequest2$.pipe(share()); // 加 share
  sharedApiRequest$.subscribe();
  sharedApiRequest$.subscribe();
}
