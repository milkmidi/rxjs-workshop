import { Ref, useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { fromEvent, interval, map, Observable, scan, take } from 'rxjs';
// https://yoyoyohamapi.gitbooks.io/-rxjs-react-sql/content/03-useObservable.html
function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [state, setState] = useState(initialValue);
  useEffect(() => {
    const subscription = observable.subscribe(setState);
    return () => {
      console.log('unsubscribe');
      subscription.unsubscribe();
    };
  }, [observable]);
  return state;
}

const Inner = () => {
  const [count2, setCount2] = useState(0);

  // React19 only
  const createFromClick = (ele: HTMLElement) => {
    console.log('createFromClick');
    const subscription = fromEvent(ele, 'click')
      .pipe(scan((acc) => acc + 1, 0))
      .subscribe((value) => {
        setCount2(value);
      });
    return () => {
      subscription.unsubscribe();
      console.log('clearup');
    };
  };

  return (
    <section data-name="inner">
      <div>{Date.now()}</div>
      {/* @ts-ignore */}
      <button ref={createFromClick} className="my-btn" type="button">
        click {count2}
      </button>
    </section>
  );
};

const count$ = interval(1000).pipe(
  map((v) => v + 1),
  take(10),
);
const App = () => {
  const count = useObservable(count$, 0);

  const [show, toggleShow] = useReducer((s) => !s, false);
  return (
    <section data-name="App">
      <div>{Date.now()}</div>
      <div className="text-5xl">{count}</div>
      <button className="btn btn-primary" onClick={toggleShow}>
        ToggleShow
      </button>
      {show && <Inner />}
    </section>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
