import { fromEvent } from 'rxjs';
import { createMutationObserverStream } from './utils/create-mutation-observer-stream';

const wrapperEle = document.querySelector('.wrapper') as HTMLElement;
createMutationObserverStream(wrapperEle).subscribe((mutations) => {
  console.log(mutations);
});

fromEvent(document.getElementById('add')!, 'click').subscribe(() => {
  const div = document.createElement('div');
  div.textContent = 'New div';
  wrapperEle.appendChild(div);
  // console.log(3);
});
