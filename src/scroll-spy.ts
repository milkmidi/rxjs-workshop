import { filter } from 'rxjs';
import { createIntersectionObservableStream } from './utils/create-intersection-observable-stream';

const navADoms = document.querySelectorAll('nav a');
createIntersectionObservableStream('section', { threshold: 0.75 })
  .pipe(filter((entry) => entry.isIntersecting))
  .subscribe((entry) => {
    // @ts-ignore
    const index = entry.target.dataset.index / 1;
    navADoms.forEach((dom, idx) => {
      dom.classList.toggle('active', idx === index);
    });

    const slideContainerLine = document.querySelector('.side-container__line') as HTMLElement;
    slideContainerLine.style.setProperty('--position-index', `${index}`);
  });
