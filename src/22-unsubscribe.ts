import { interval, Subscription } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';

const timer1$ = interval(1000);

const subscription1 = timer1$.subscribe(createObserver('timer1'));
const subscriptionA = timer1$.subscribe(createObserver('timerA'));
const subscriptionB = timer1$.subscribe(createObserver('timerB'));

const subscription = new Subscription();
subscription.add(subscriptionA);
subscription.add(subscriptionB);

setTimeout(() => {
  subscription1.unsubscribe();
  subscription.unsubscribe();
}, 3000);
