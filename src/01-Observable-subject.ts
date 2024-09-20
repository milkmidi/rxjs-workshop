import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';

{
  // --------------------------------------------------------------- Observable
  const observable = new Observable<number>((subscriber) => {
    subscriber.next(Math.random());
  });
  observable.subscribe(createObserver('Observable'));
  observable.subscribe(createObserver('Observable'));
}

{
  // --------------------------------------------------------------- Subject
  const subject = new Subject(); // Subject extends Observable
  subject.next(1);
  subject.subscribe(createObserver('Subject')); // subscription 999
  subject.subscribe(createObserver('Subject')); // subscription 999
  subject.next(999);
}

{
  // --------------------------------------------------------------- BehaviorSubject
  const bSubject = new BehaviorSubject<number>(9527);
  bSubject.subscribe(createObserver('BehaviorSubject')); // Immediately emit 9527
  bSubject.next(9528);
  bSubject.subscribe(createObserver('BehaviorSubject')); // Immediately emit 9528
}

{
  // --------------------------------------------------------------- AsyncSubject
  // 只有在 Subject 被 complete 之後，才會送出最後一筆資料
  // A variant of Subject that only emits a value when it completes. It will emit its latest value to all its observers on completion.
  const subject = new AsyncSubject();
  subject.next(1);
  subject.next(2);
  subject.subscribe(createObserver('AsyncSubject'));
  subject.next(3);
  subject.next(4);
  subject.complete();
}

{
  // --------------------------------------------------------------- ReplaySubject
  // A variant of Subject that "replays" old values to new subscribers by emitting them when they first subscribe.
  const subject = new ReplaySubject<number>(2);
  subject.next(1);
  subject.next(2);
  subject.next(3);
  subject.subscribe(createObserver('ReplaySubject')); // 2, 3
  subject.next(4); // 4
  subject.complete();
}

// --------------------------------------------------------------- Subject asObservable
{
  class MyCode {
    private subject = new Subject();
    // 所有的 Subject 都有 asObservable() 方法，可以將 Subject 轉換成 Observable
    // 這樣可以避免外部直接呼叫 subject next() 方法
    public observable = this.subject.asObservable();
    public next(value: string) {
      this.subject.next(value);
    }
  }
  const myCode = new MyCode();
  myCode.observable.subscribe(createObserver('Subject-asObservable'));
  myCode.next('Hello rxjs');
}
