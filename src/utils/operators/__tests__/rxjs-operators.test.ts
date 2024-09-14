import { delay, map } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

// https://fullstackladder.dev/blog/2020/10/20/mastering-rxjs-35-how-to-test-rxjs-with-marble-diagrams/
describe('rxjs operators', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('rxjs testing', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source = cold('a-b-c-d|');
      const expected = 'a-a-a-a|';

      const result = source.pipe(map(() => 'a'));
      expectObservable(result).toBe(expected);
    });
  });

  it('delay', () => {
    scheduler.run(({ cold, expectObservable }) => {
      const source = cold('a-b-c|');
      const expected = '   300ms a-b-(c|)';

      const result = source.pipe(
        //
        delay(300),
      );
      expectObservable(result).toBe(expected);
    });
  });
});
