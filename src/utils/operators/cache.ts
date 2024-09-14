import { MonoTypeOperatorFunction, ReplaySubject, share, timer } from 'rxjs';

/**
 * https://medium.com/javascript-everyday/7-custom-rxjs-operators-worth-to-keep-at-hand-16c1764b5153
 */
const cache = <T>(ttl: number = Infinity): MonoTypeOperatorFunction<T> => {
  // https://rxjs.dev/api/index/interface/ShareConfig
  return share({
    connector: () => new ReplaySubject(1),
    resetOnComplete: () => timer(ttl),
    // resetOnRefCountZero: () => timer(ttl),
  });
};
export default cache;
