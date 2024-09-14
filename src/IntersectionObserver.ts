// @ts-ignore
import { combineLatest, fromEvent } from 'rxjs';
import { createIntersectionObservableOnceStream } from './utils/create-intersection-observable-stream';
import '@/css/app.scss';

// simulate src change
window.addEventListener('click', () => {
  const myComponent = document.querySelector('in-view-img') as InViewImg;
  const color = Math.random().toString(16).slice(2, 8);
  myComponent.setAttribute('src', `https://fakeimg.pl/250x100/${color}/?text=${Math.random()}`);
});
/**
 * 情境：當 MyComponent 進入畫面時，載入圖片
 * 但有可能在 MyComponent 進入畫面前，就已經設定新的 src
 */
class InViewImg extends HTMLElement {
  static get observedAttributes() {
    return ['src'];
  }
  constructor() {
    super();
    combineLatest([
      fromEvent<CustomEvent>(this, 'src-changed'),
      createIntersectionObservableOnceStream(this),
    ]).subscribe(([event, entry]) => {
      console.log('in-view-img', event.detail, entry);
      const img = this.querySelector('img') as HTMLImageElement;
      img.src = event.detail;
    });

    this.innerHTML = `
      <p>MyComponent</p>
      <img />
    `;
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'src') {
      this.dispatchEvent(new CustomEvent('src-changed', { detail: newValue }));
    }
  }
}
window.customElements.define('in-view-img', InViewImg);
