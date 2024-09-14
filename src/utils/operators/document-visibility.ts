import { Observable, skipWhile } from 'rxjs';

const documentVisibility = () => {
  return <T>(source$: Observable<T>) => {
    return source$.pipe(
      //
      skipWhile(() => document.visibilityState !== 'visible'),
    );
  };
};
export default documentVisibility;
