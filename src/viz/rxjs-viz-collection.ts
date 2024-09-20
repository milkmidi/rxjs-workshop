import { fromEvent, Observable } from 'rxjs';
import RxJSMarbles from './rxjs-marbles-element';
import style from './rxjs-viz-collection.module.scss';

const scrollToSource = (target: HTMLElement) => {
  const dataSource = document.querySelector('[data-name="Source"]');
  if (dataSource) {
    const dataSourceHeight = dataSource.getBoundingClientRect().height;
    const positionY = window.scrollY + target.getBoundingClientRect().top - dataSourceHeight;
    window.scrollTo({ top: positionY, behavior: 'smooth' });
  }
};
export class RxJSVizCollection extends HTMLElement {
  constructor(parent?: string) {
    super();
    if (parent) {
      const parentEle = document.querySelector(parent);
      parentEle?.appendChild(this);
    }
    this.classList.add(style.collection);
  }

  addObservable(observable: Observable<any>, name: string, description?: string) {
    const marbleEle = new RxJSMarbles(name, observable);
    marbleEle.setDescription(description);
    this.appendChild(marbleEle);
  }
  addTitle(title: string) {
    const titleEle = document.createElement('p');
    titleEle.innerText = title;
    titleEle.classList.add(style.title);
    this.appendChild(titleEle);
  }
  addSource(observableList: Observable<any>[], names: string[]) {
    const sourceWrapEle = document.querySelector('.rxjs-source') as HTMLElement;
    observableList.forEach((o, i) => {
      sourceWrapEle.appendChild(new RxJSMarbles(names[i], o));
    });
    fromEvent(sourceWrapEle, 'dblclick').subscribe(() => {
      scrollToSource(sourceWrapEle);
    });
  }
  createButton(text: string, description?: string) {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.classList.add('button');
    if (description) {
      const descriptionEle = document.createElement('p');
      descriptionEle.innerText = description;
      descriptionEle.classList.add('text-sm');
      btn.appendChild(descriptionEle);
    }
    this.appendChild(btn);
    return btn;
  }
  createButtonAndFromClick(text: string, description?: string) {
    const btn = this.createButton(text, description);
    return fromEvent(btn, 'click');
  }
}

if (!window.customElements.get('rxjs-viz-collection')) {
  window.customElements.define('rxjs-viz-collection', RxJSVizCollection);
}
