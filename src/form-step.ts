import { filter, fromEvent, map, race, switchMap, tap } from 'rxjs';

const step1Cta = document.getElementById('step1-cta') as HTMLButtonElement;
const step2Dialog = document.getElementById('step2-dialog') as HTMLDialogElement;
const step2CtaCancel = document.getElementById('step2-cta--cancel') as HTMLButtonElement;
fromEvent(step1Cta, 'click')
  .pipe(
    tap(() => {
      step2Dialog.showModal();
    }),
    switchMap(() => {
      const submit$ = fromEvent(step2Dialog, 'submit').pipe(
        map(() => {
          const form = step2Dialog.querySelector('form') as HTMLFormElement;
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          return data;
        }),
      );
      // ESC keydown to close dialog
      const close$ = fromEvent(step2Dialog, 'close').pipe(map(() => false));
      const cancelCtaClick$ = fromEvent(step2CtaCancel, 'click').pipe(
        tap(() => {
          step2Dialog.close();
        }),
        map(() => false),
      );
      return race(submit$, close$, cancelCtaClick$);
    }),
    filter((value) => !!value),
  )
  .subscribe((value) => {
    console.log(value);
  });
