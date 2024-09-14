import { fromEvent, groupBy, map, merge, mergeMap, of, scan, toArray } from 'rxjs';

{
  /* // -------------------------------------------------------------- groupBy
   ██████╗ ██████╗  ██████╗ ██╗   ██╗██████╗ ██████╗ ██╗   ██╗
  ██╔════╝ ██╔══██╗██╔═══██╗██║   ██║██╔══██╗██╔══██╗╚██╗ ██╔╝
  ██║  ███╗██████╔╝██║   ██║██║   ██║██████╔╝██████╔╝ ╚████╔╝ 
  ██║   ██║██╔══██╗██║   ██║██║   ██║██╔═══╝ ██╔══██╗  ╚██╔╝  
  ╚██████╔╝██║  ██║╚██████╔╝╚██████╔╝██║     ██████╔╝   ██║   
  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═════╝    ╚═╝    */
  // https://rxjs.dev/api/index/function/groupBy
  of(
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'Parcel' },
    { id: 2, name: 'webpack' },
    { id: 1, name: 'TypeScript' },
    { id: 3, name: 'TSLint' },
  )
    .pipe(
      groupBy((p) => p.id),
      mergeMap((group$) => {
        return group$.pipe(toArray());
        /* return group$.pipe(
          //
          reduce((acc, cur) => [...acc, cur], []),
        ); */
      }),
    )
    .subscribe((p) => console.log(p));
}

{
  const btn1 = document.getElementById('btn1') as HTMLButtonElement;
  const btn1Click$ = fromEvent(btn1, 'click').pipe(
    //
    map(() => {
      return {
        id: 1,
        name: 'JavaScript',
      };
    }),
  );

  const btn2 = document.getElementById('btn2') as HTMLButtonElement;
  const btn2Click$ = fromEvent(btn2, 'click').pipe(
    //
    map(() => {
      return {
        id: 2,
        name: 'React',
      };
    }),
  );

  merge(btn1Click$, btn2Click$)
    .pipe(
      //
      groupBy((p) => p.id),
      // scan((acc, cur) => [...acc, cur], []),
      mergeMap((group$) => {
        return group$.pipe(toArray());
      }),
    )
    .subscribe((p) => console.log(p));
}
