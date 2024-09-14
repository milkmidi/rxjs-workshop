import { bufferTime, filter, fromEvent, map, Observable, scan, throttleTime } from 'rxjs';

// --------------------------------------------------------------- First examples
//*
{
  // Normally
  // https://rxjs.dev/guide/overview
  document.addEventListener('click', () => {
    console.log('Clicked!');
  });

  // Using RxJS create an observable from the event
  fromEvent(document, 'click').subscribe(() => {
    console.log('fromEvent Clicked!');
  });
}
// */

// --------------------------------------------------------------- Observable
/* 
 ██████╗ ██████╗ ███████╗███████╗██████╗ ██╗   ██╗ █████╗ ██████╗ ██╗     ███████╗
██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔══██╗██╔══██╗██║     ██╔════╝
██║   ██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║███████║██████╔╝██║     █████╗  
██║   ██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══██║██╔══██╗██║     ██╔══╝  
╚██████╔╝██████╔╝███████║███████╗██║  ██║ ╚████╔╝ ██║  ██║██████╔╝███████╗███████╗
 ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝
Observable (可觀察對象)
- 是一種將數據或事件流進行建模的對象。它是一個會發出（emit）一系列值的流，可以是同步或異步的。
- 可以訂閱（subscribe）一個 Observable 來接收它發出的值。
- 像 HTMLElement 就是一個 Observable，它可以發出 click 事件，也可以用 addEventListener 來訂閱這個事件。
 */

// --------------------------------------------------------------- Observer
/* 
 ██████╗ ██████╗ ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
██║   ██║██████╔╝███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
██║   ██║██╔══██╗╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
╚██████╔╝██████╔╝███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
Observer（觀察者）
- Observer 是一個包含 callback 函數的對象，這些函數會用來處理 Observable 發出的值、錯誤和完成信號。
- Observer 可以擁有三個 callback 函數：next、error 和 complete。
*/
{
  const observer = {
    next: (x: any) => console.log(`Observer got a next value: ${x}`),
    error: (err: Error) => console.error(`Observer got an error: ${err}`),
    complete: () => console.log('Observer got a complete notification'),
  };
  fromEvent(document, 'click').subscribe(observer);
  fromEvent(document, 'click').subscribe(() => {
    // 這裡就只有 next 的 callback
  });
}

// --------------------------------------------------------------- Subscription
/*
███████╗██╗   ██╗██████╗ ███████╗ ██████╗██████╗ ██╗██████╗ ████████╗██╗ ██████╗ ███╗   ██╗
██╔════╝██║   ██║██╔══██╗██╔════╝██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
███████╗██║   ██║██████╔╝███████╗██║     ██████╔╝██║██████╔╝   ██║   ██║██║   ██║██╔██╗ ██║
╚════██║██║   ██║██╔══██╗╚════██║██║     ██╔══██╗██║██╔═══╝    ██║   ██║██║   ██║██║╚██╗██║
███████║╚██████╔╝██████╔╝███████║╚██████╗██║  ██║██║██║        ██║   ██║╚██████╔╝██║ ╚████║
╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
當對 Observable 執行 subscribe 時回傳的物件，主要用於 unsubscribe。
*/
{
  const observable = new Observable<number>((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    setTimeout(() => {
      subscriber.next(3);
      subscriber.complete();
      subscriber.next(4);
    }, 500);
    return () => {
      // 這裡是當 complete 時，unsubscribe 時會執行的內容
      console.log('Observable unsubscribe');
    };
  });

  const observer = {
    next: (x: number) => console.log(`Observer got a next value: ${x}`),
    error: (err: Error) => console.error(`Observer got an error: ${err}`),
    complete: () => console.log('Observer got a complete notification'),
  };

  // TODO 這裡
  const subscription = observable.subscribe(observer);
  // subscription.unsubscribe();
}

// --------------------------------------------------------------- Example2
//*
{
  let count = 0;
  document.addEventListener('click', () => {
    console.log(`Clicked ${++count} times`);
  });
  // RxJS
  fromEvent(document, 'click')
    .pipe(scan((acc) => acc + 1, 0))
    .subscribe((value) => {
      console.log(`Clicked ${value} times`);
    });
}
// */
// --------------------------------------------------------------- Example3
{
  let count = 0;
  const rate = 1000;
  let lastClick = Date.now() - rate;
  document.addEventListener('click', () => {
    if (Date.now() - lastClick >= rate) {
      console.log(`Clicked ${++count} times`);
      lastClick = Date.now();
    }
  });
  // RxJS
  fromEvent(document, 'click')
    .pipe(
      throttleTime(1000),
      scan((acc) => acc + 1, 0),
    )
    .subscribe((value) => {
      console.log(`throttleTime Clicked ${value} times`);
    });
}

// --------------------------------------------------------------- Example4 dobule click
{
  fromEvent(window, 'click')
    .pipe(
      bufferTime(300),
      map((list) => list.length),
      filter((value) => value === 2),
    )
    .subscribe(() => {
      console.log('%cdoubleclick', 'background:red;');
    });
}
