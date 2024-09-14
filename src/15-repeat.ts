import { of, timer } from 'rxjs';
import { map, repeat, take } from 'rxjs/operators';
import { marbles } from './viz/rxjs-marbles';

const sourceA$ = timer(0, 500).pipe(take(4));
sourceA$.subscribe(marbles({ name: 'sourceA', container: '.rxjs-source' }));

const example = sourceA$.pipe(repeat(3));
example.subscribe(marbles('repeat(3)'));
