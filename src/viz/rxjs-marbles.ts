import { Observer } from 'rxjs';
import RxJSMarbles from './rxjs-marbles-element';

const querySelector = <T extends HTMLElement>(selector: string | HTMLElement) => {
  if (typeof selector === 'string') {
    return document.querySelector<T>(selector);
  }
  return selector;
};

type MarbleOption = {
  container?: HTMLElement | string;
  name: string;
  description?: string;
};
export function marbles<T>(options: MarbleOption): Observer<T>;
export function marbles<T>(
  name: string,
  description?: string,
  container?: HTMLElement | string,
): Observer<T>;
export function marbles<T>(...rest: any[]) {
  let name;
  let container;
  let description;
  if (typeof rest[0] === 'string') {
    [name, description, container] = rest;
  } else {
    const [option] = rest;
    ({ name, container, description } = option);
  }
  container ??= '.rxjs-viz-container';

  const marbleEle = new RxJSMarbles(name);
  marbleEle.setDescription(description);
  const parentContainer = querySelector(container);
  if (!parentContainer) {
    throw new Error('Parent container not found');
  }
  parentContainer.appendChild(marbleEle);
  return {
    next(value: T) {
      marbleEle.next(value);
    },
    error(error: Error) {
      marbleEle.stop();
      marbleEle.error(error);
    },
    complete() {
      marbleEle.stop();
      marbleEle.complete();
    },
  };
}
