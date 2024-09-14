import { fromEvent, interval, partition, Subject, take } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';
import { marbles } from './viz/rxjs-marbles';

{
  /* // --------------------------------------------------------------- partition
  partition 會將 Observable 依照條件拆成兩個 Observable 物件
  ██████╗  █████╗ ██████╗ ████████╗██╗████████╗██╗ ██████╗ ███╗   ██╗
  ██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██║╚══██╔══╝██║██╔═══██╗████╗  ██║
  ██████╔╝███████║██████╔╝   ██║   ██║   ██║   ██║██║   ██║██╔██╗ ██║
  ██╔═══╝ ██╔══██║██╔══██╗   ██║   ██║   ██║   ██║██║   ██║██║╚██╗██║
  ██║     ██║  ██║██║  ██║   ██║   ██║   ██║   ██║╚██████╔╝██║ ╚████║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ */
  const observableValues = interval(1000).pipe(take(6));
  const [evens$, odds$] = partition(observableValues, (value) => value % 2 === 0);

  odds$.subscribe(marbles('partition odds'));
  evens$.subscribe(marbles('partition evens'));
}

{
  // SPA
  const isLogin$ = new Subject<boolean>();
  const [login$, logout$] = partition(isLogin$, (value) => value);
  login$.subscribe(createObserver('login'));
  logout$.subscribe(createObserver('logout'));

  const loginBtn = document.getElementById('login-btn') as HTMLElement;
  fromEvent(loginBtn, 'click').subscribe(() => {
    isLogin$.next(true);
  });

  const logoutBtn = document.getElementById('logout-btn') as HTMLElement;
  fromEvent(logoutBtn, 'click').subscribe(() => {
    isLogin$.next(false);
  });
}
