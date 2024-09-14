import { combineLatestWith, fromEvent, map, startWith } from 'rxjs';

const weightEle = document.getElementById('weight-slider') as HTMLInputElement;
const heightEle = document.getElementById('height-slider') as HTMLInputElement;
const bmiTextEle = document.getElementById('bmi-result') as HTMLDivElement;

const weightTextEle = document.getElementById('weight-text') as HTMLDivElement;
const heightTextEle = document.getElementById('height-text') as HTMLDivElement;

const weight$ = fromEvent(weightEle, 'input').pipe(
  map((e) => (e.target as HTMLInputElement).valueAsNumber),
  startWith(weightEle.valueAsNumber),
);
const height$ = fromEvent(heightEle, 'input').pipe(
  map((e) => (e.target as HTMLInputElement).valueAsNumber),
  startWith(heightEle.valueAsNumber),
);

const bmiCalculate = (w: number, h: number) => w / (h * 0.01) ** 2;
const bmi$ = weight$.pipe(
  combineLatestWith(height$),
  map(([w, h]) => bmiCalculate(w, h)),
);

weight$.subscribe((value) => {
  weightTextEle.innerHTML = `${value}`;
});
height$.subscribe((value) => {
  heightTextEle.innerHTML = `${value}`;
});

bmi$.subscribe((value) => {
  bmiTextEle.innerHTML = `${Math.floor(value * 10) / 10}`;
});
