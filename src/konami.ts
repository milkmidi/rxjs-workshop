import {
  bufferCount,
  filter,
  find,
  from,
  fromEvent,
  map,
  mergeMap,
  scan,
  sequenceEqual,
  take,
} from 'rxjs';

// const KONAMI_KEY_CODES = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
const KONAMI_CODES = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
  // 'Enter', // no start key, clearly.
];
{
  // --------------------------------------------------- v1
  fromEvent<KeyboardEvent>(document, 'keydown')
    .pipe(
      map(({ code }) => code),
      bufferCount(10, 1),
      filter((keys) => keys.toString() === KONAMI_CODES.toString()),
      take(1),
    )
    .subscribe(() => {
      console.log('v1 complete');
    });
}
{
  // --------------------------------------------------- v2
  fromEvent<KeyboardEvent>(document, 'keyup')
    .pipe(
      scan((acc, { code }) => {
        return KONAMI_CODES[acc] === code ? acc + 1 : 0;
      }, 0),
      find((value) => value === KONAMI_CODES.length),
    )
    .subscribe(() => {
      console.log('v2 complete');
    });
}
{
  // --------------------------------------------------- v3
  // https://rxjs.dev/api/operators/sequenceEqual
  const codes$ = from(KONAMI_CODES);
  const matches$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
    map(({ code }) => code),
    bufferCount(10, 1),
    mergeMap((last10) => {
      return from(last10).pipe(sequenceEqual(codes$));
    }),
    filter((isMatch) => isMatch),
  );
  matches$.subscribe(() => {
    console.log('v3 complete');
  });
}
