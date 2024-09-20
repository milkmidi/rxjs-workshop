import {
  animationFrames,
  map,
  Observable,
  share,
  Subject,
  Subscription,
  takeUntil,
  takeWhile,
} from 'rxjs';
import rawStyle from './rxjs-marbles.scss?inline';
import { formatValue } from './rxjs-viz-utils';

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
<style>${rawStyle}</style>
<div id="rxjs-marbles-main">
  <div class="rxjs-marbles__name-wrap">
    <div class="rxjs-marbles__name"></div>
  </div>
  <svg width="900" height="90">
    <g class="rxjs-marbles-container" transform="translate(30, 22)">
      <line
        class="rxjs-marbles__line rxjs-marbles__line--background"
        x1="0" y1="26" x2="840" y2="26"></line>
      <line
        class="rxjs-marbles__line rxjs-marbles__line--progress"
        x1="0" y1="26" y2="26"></line>
      <path
        class="rxjs-marbles__arrow"
        transform="translate(840, 21)" d="M0 0 L10 5 L0 10 z"></path>
      <line
        class="rxjs-marbles__line rxjs-marbles__line-complete"
        x1="0" y1="4" x2="0" y2="50"></line>
      <path
        class="rxjs-marbles__line-error"
        transform="translate(800, 16)" d="M0 0 L20 20 M20 0 L0 20 Z"></path>
    </g>
  </svg>
</div>
`;

const SVG_WIDTH = 850;
const SVG_NS = 'http://www.w3.org/2000/svg';

export default class RxJSMarbles extends HTMLElement {
  private startTime = Date.now();
  private complete$ = new Subject<void>();
  private get marblesContainer() {
    return this.shadowRoot!.querySelector('.rxjs-marbles-container') as SVGElement;
  }
  public get progress() {
    const progressStr = ((Date.now() - this.startTime) / 10000).toFixed(2);
    const progress = parseFloat(progressStr);
    return progress;
  }
  private subscription = new Subscription();
  private values: Map<number, string[]> = new Map();
  constructor(
    private name: string,
    observable?: Observable<any>,
  ) {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    const progressLine = shadowRoot.querySelector(
      '.rxjs-marbles__line--progress',
    ) as SVGLineElement;

    const vizName = shadowRoot.querySelector('.rxjs-marbles__name') as HTMLElement;
    vizName.textContent = name;

    this.appendStaticLineGaps();

    const timerTick$ = animationFrames().pipe(
      map(() => (Date.now() - this.startTime) / 10000),
      takeWhile((data) => data < 1),
      takeUntil(this.complete$),
      share(),
    );
    this.subscription.add(
      timerTick$.subscribe((percentage) => {
        const x2 = percentage * SVG_WIDTH;
        progressLine.setAttribute('x2', x2.toString());
      }),
    );
    if (observable) {
      observable.subscribe({
        next: (value) => this.next(value),
        error: (error: Error) => {
          this.stop();
          this.error(error);
        },
        complete: () => this.complete(),
      });
    }
  }
  public setDescription(description?: string) {
    if (!description) {
      return;
    }
    const descriptionEle = document.createElement('p');
    descriptionEle.textContent = description;
    descriptionEle.classList.add('rxjs-marbles__description');
    const marblesMainEle = this.shadowRoot!.querySelector('#rxjs-marbles-main') as HTMLElement;
    marblesMainEle.appendChild(descriptionEle);
  }
  appendStaticLineGaps() {
    const gaps = Array.from(Array(10).keys());
    gaps.forEach((i) => {
      const line = document.createElementNS(SVG_NS, 'line');
      const gap = (i * SVG_WIDTH) / 10;
      line.setAttribute('class', 'rxjs-marbles__line rxjs-marbles__line-gap');
      line.setAttribute('data-value', (i / 10).toFixed(1));
      line.setAttribute('y1', '10');
      line.setAttribute('y2', '45');
      line.setAttribute('x1', gap.toString());
      line.setAttribute('x2', gap.toString());
      this.marblesContainer.prepend(line);
    });
  }
  public next(v: any) {
    const value = formatValue(v);

    const existingValue = this.values.get(this.progress) || [];
    const isExistingValue = existingValue.length > 0;
    const y = existingValue.length * -5;
    let text = value.name;
    if (isExistingValue) {
      const textEle = this.marblesContainer.querySelector(
        `[data-progress="${this.progress}"] text`,
      );
      if (textEle) {
        const innerText = [...existingValue, value.name].join(',');
        textEle.innerHTML = `(${innerText})`;
      }
      text = '';
    }

    const gStyle = `transform: translate(${this.progress * SVG_WIDTH}px, 26px)`;
    const gEle = document.createElementNS(SVG_NS, 'g');
    gEle.setAttribute('class', 'rxjs-marbles__circle');
    gEle.setAttribute('style', gStyle);
    gEle.setAttribute('data-progress', this.progress.toString());
    gEle.innerHTML = `
      <circle
        class="rxjs-marbles__circle"
        cx="0"
        cy="${y}"
        r="13"
        fill="${value.color}"></circle>
      <text x="0" y="34" text-anchor="middle" stroke-width="0">${text}</text>
    `;
    this.values.set(this.progress, [...existingValue, value.name]);
    if (isExistingValue) {
      this.marblesContainer.prepend(gEle);
    } else {
      this.marblesContainer.appendChild(gEle);
    }
  }
  public error(err: Error) {
    console.error(this.name, err);
    // console.error(err.message);
    const errorEle = this.marblesContainer.querySelector(
      '.rxjs-marbles__line-error',
    ) as SVGPathElement;
    errorEle.style.display = 'block';
    errorEle.style.transform = `translate(${this.progress * SVG_WIDTH - 10}px, 16px)`;
  }
  public stop() {
    this.complete$.next();
  }
  public complete() {
    const completeLine = this.shadowRoot!.querySelector(
      '.rxjs-marbles__line-complete',
    ) as SVGLineElement;
    const style = `transform: translate(${this.progress * SVG_WIDTH}px, 0px); display: block;`;
    completeLine.setAttribute('style', style);
    /* [...this.marblesContainer.querySelectorAll('.rxjs-marbles__line-gap')].forEach((ele) => {
      const dataValue = parseFloat(ele.getAttribute('data-value'));
      if (!isNaN(dataValue) && dataValue > this.progress) {
        ele.style.display = 'none';
      }
    }); */
    this.complete$.next();
  }

  disconnectedCallback() {
    this.subscription.unsubscribe();
  }
}

if (!window.customElements.get('rxjs-marbles')) {
  window.customElements.define('rxjs-marbles', RxJSMarbles);
}
