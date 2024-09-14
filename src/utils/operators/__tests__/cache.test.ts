import { map, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import cache from '../cache';

describe.skip('cache', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('should reset the cache when the source completes', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source = cold('a-b 300ms c-d|');
      const expected = 'a-a 300ms c-c|';

      const result = source.pipe(cache(500));

      expectObservable(result).toBe(expected);
    });
  });
});
