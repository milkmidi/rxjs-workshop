// https://rx.js.cool/mixin/undo
import { EMPTY, fromEvent, merge, Observable } from 'rxjs';
import { filter, map, scan, startWith } from 'rxjs/operators';

console.clear();

/**
 * Subscribes to the `undoNotifier`, and emits all values from
 * `source`. When `undoNotifier` emits, it will emit previously
 * emitted values back through time.
 *
 * If a `redoNotifier` is passed, it's subscribed to, and when
 * it emits, will "redo" anything that was "undone", unless new
 * values have come from the source.
 *
 * TODO: Add an upper-bounds to the undo state collected.
 */

type UndoState<T> = {
  state: T[];
  redos: T[];
};
function undo(undoNotifier: Observable<any>, redoNotifier: Observable<any> = EMPTY) {
  return <T>(source: Observable<T>) =>
    merge(
      undoNotifier.pipe(map(() => UNDO_TOKEN)),
      redoNotifier.pipe(map(() => REDO_TOKEN)),
      source,
    ).pipe(
      scan<T | string, UndoState<T>>(
        (acc, value) => {
          const { state, redos } = acc;
          switch (value) {
            case UNDO_TOKEN: {
              if (state.length > 1) {
                redos.push(state.pop()!);
              }
              break;
            }
            case REDO_TOKEN: {
              if (redos.length > 0) {
                state.push(redos.pop()!);
              }
              break;
            }
            default: {
              if (redos) {
                // clear our redos as new history is written
                redos.length = 0;
              }
              // It's not an "undo", push state
              // console.log(value);
              state.push(value as T);
              break;
            }
          }
          console.log(acc);
          return acc;
        },
        { state: [], redos: [] } as UndoState<T>,
      ),
      // we only care about state past here
      map((value) => value.state),
      // Don't emit if we don't have state
      filter((value) => value !== null),
      // Take the last value from state
      map((state) => state[state.length - 1]),
    );
}

// Setup
const add1 = document.querySelector('#add1') as HTMLButtonElement;
const add2 = document.querySelector('#add2') as HTMLButtonElement;
const undoBtn = document.querySelector('#undo') as HTMLButtonElement;
const redoBtn = document.querySelector('#redo') as HTMLButtonElement;
const output = document.querySelector('output') as HTMLElement;
// A static reference we can use to identify "undo" emissions below
const UNDO_TOKEN = 'UNDO';
const REDO_TOKEN = 'REDO';

const INITIAL_VALUE = 0;

const add1Click$ = fromEvent<MouseEvent>(add1, 'click');
const add2Click$ = fromEvent<MouseEvent>(add2, 'click');
const undoClick$ = fromEvent<MouseEvent>(undoBtn, 'click');
const redoClick$ = fromEvent<MouseEvent>(redoBtn, 'click');

// Just a source that increments a number over time when
// you click buttons.
const source$ = merge(
  // when we click "+ 1" it adds `1`
  add1Click$.pipe(map(() => 1)),
  // when we click "+ 2" it adds `2`
  add2Click$.pipe(map(() => 2)),
).pipe(
  // A reducer to accumlate our number
  scan((acc, n) => acc + n, 0),
  // Start with 0, so we have an initial value to display
  startWith(INITIAL_VALUE),
);

// Here we're adding our custom `undo` and subscribing to it.
source$
  .pipe(
    // "Undo" whenever we click the "Undo" button.
    undo(undoClick$, redoClick$),
  )
  .subscribe((value) => {
    output.textContent = `${value}`;
  });
