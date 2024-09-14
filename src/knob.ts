import gsap from 'gsap';
import { Observable } from 'rxjs';
import { createDraggableCursorStream } from '@/utils/create-draggable-stream';
import { registerDragAndDropPositionY } from './knob.utils';

// https://codepen.io/bbx/pen/QBKYOy
const pathCircleGenerator = (size: number): string => `
    M ${size / 2}, ${size / 2}
    m 0, -${size / 2}
    a ${size / 2},${size / 2} 0 1 1 0,${size}
    a ${size / 2},${size / 2} 0 1 1 0,-${size}
  `;

const MAX_DEGREE = 280;
const START_DEGREE = (360 - MAX_DEGREE) / 2;

class PgKnob extends HTMLElement {
  private get size(): number {
    const s = this.getAttribute('size') || '50';
    return parseInt(s, 10);
  }
  private get snap(): number {
    const s = this.getAttribute('snap') || '0.01';
    return parseFloat(s);
  }
  private get value(): number {
    const value = this.getAttribute('value') || '0';
    return gsap.utils.clamp(0, 1, parseFloat(value));
  }
  private set value(val: number) {
    const path = this.querySelector('path') as SVGPathElement;
    const degreePercent = MAX_DEGREE / 360;
    const totalLength = path.getTotalLength();
    const offset = totalLength * val * degreePercent;
    const strokeDasharray = `${offset} ${totalLength}`;
    path.setAttribute('stroke-dasharray', strokeDasharray);

    const knob = this.querySelector('.knob') as HTMLElement;
    const info = this.querySelector('.info') as HTMLElement;
    info.textContent = val.toFixed(2);
    const rotateDeg = val * MAX_DEGREE + START_DEGREE;
    knob.style.transform = `rotate(${rotateDeg}deg)`;
  }
  constructor() {
    super();
    const { size } = this;
    const viewBoxSize = size + 20;
    const half = (viewBoxSize - size) >> 1;
    const rotate = START_DEGREE + 180;
    const transform = `translate(${half}, ${half}) rotate(${rotate}, ${size / 2}, ${size / 2})`;
    const d = pathCircleGenerator(size);
    this.innerHTML = `
      <div class="knob">
        <div class="knob__dot"></div>
        <img
          width="250"
          height="250"
          src="/img/knob2.svg" />
      </div>
      <svg viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">
        <g transform="${transform}">
          <path d="${d}"></path>
        </g>
      </svg>
      <div class="info"></div>
    `;
  }

  connectedCallback() {
    const option = {
      dom: this,
      initialValue: this.value,
      snap: this.snap,
      maxDegree: MAX_DEGREE,
    };
    const action$: Observable<number> = registerDragAndDropPositionY(option);
    action$.subscribe((value) => {
      this.value = value;
    });
    // TODO
    // createDraggableCursorStream(this).subscribe();
  }
}

window.customElements.define('pg-knob', PgKnob);
