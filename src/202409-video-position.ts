import gsap from 'gsap';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { createDraggableStream } from '@/utils/create-draggable-stream';

const scroll$ = fromEvent(window, 'scroll').pipe(
  //
  debounceTime(10),
  startWith(''),
  share(),
);

const dummyVideoEle = document.getElementById('dummy-video') as HTMLElement;
const videoWrapEle = document.getElementById('video-wrap') as HTMLVideoElement;
const videoWrapBackBtn = document.querySelector('.video-wrap__back-btn') as HTMLElement;

// TODO step2: add back btn click event
const videoWrapBackClick$ = fromEvent(videoWrapBackBtn, 'click', () => true);
const videoWrapInOutView$ = scroll$.pipe(
  map(() => dummyVideoEle.getBoundingClientRect().top > 0),
  distinctUntilChanged(),
);

const videoInView$ = merge(videoWrapInOutView$, videoWrapBackClick$).pipe(
  filter((value) => value),
  tap(() => {
    console.log('videoInView');
    videoWrapEle.setAttribute('data-active', 'false');
    gsap.fromTo(videoWrapEle, { opacity: 0 }, { opacity: 1, duration: 0.35 });
  }),
  share(),
);
const videoOutOfView$ = videoWrapInOutView$.pipe(
  filter((value) => !value),
  tap(() => {
    console.log('videoOutOfView');
    videoWrapEle.setAttribute('data-active', 'true');
    gsap.fromTo(videoWrapEle, { opacity: 0 }, { opacity: 1, duration: 0.35 });
  }),
  share(),
);

videoOutOfView$
  .pipe(
    tap((isInView) => {
      console.log('isInView', isInView);
    }),
    switchMap(() => {
      return createDraggableStream(videoWrapEle).pipe(
        tap((value) => {
          const left = gsap.utils.clamp(0, window.innerWidth - videoWrapEle.offsetWidth, value.x);
          const top = gsap.utils.clamp(0, window.innerHeight - videoWrapEle.offsetHeight, value.y);
          videoWrapEle.style.left = `${left}px`;
          videoWrapEle.style.top = `${top}px`;
        }),
        takeUntil(videoInView$),
      );
    }),
  )
  .subscribe();
