// https://codepen.io/xoihazard/pen/QJVEJj
// https://codepen.io/georgehastings/pen/PbLKYO

import { filter, fromEvent, interval, map, mergeMap, of, take, withLatestFrom } from 'rxjs';

const POSSIBLE_CHAR =
  '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const randomChar = () => POSSIBLE_CHAR.charAt(Math.floor(Math.random() * POSSIBLE_CHAR.length));

const INTERVAL = 1000 / 30;
const elements = document.querySelectorAll('[data-decryption-text]');
fromEvent<MouseEvent>(elements, 'mouseover')
  .pipe(
    map(({ target }) => target as HTMLElement),
    filter((el) => !!el.getAttribute('data-decryption-text')),
    mergeMap((el) => {
      const text = el.getAttribute('data-decryption-text') || '';
      const chars = text.split('');
      const effect$ = interval(INTERVAL).pipe(
        map((val) => {
          const progress = val / chars.length;
          const masked = chars.map((char, i) => {
            const position = (i + 1) / chars.length;
            if (position > progress) {
              return randomChar();
            }
            return char;
          });
          return masked.join('');
        }),
        take(chars.length + 1),
      );
      return effect$.pipe(withLatestFrom(of(el)));
    }),
  )
  .subscribe(([randomText, ele]) => {
    ele.innerText = randomText;
  });
