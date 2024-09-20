import { distinct, distinctUntilChanged, distinctUntilKeyChanged, of, toArray } from 'rxjs';
import { createObserver, LogMask } from './utils/rxjx-development-utils';

{
  // https://rxjs.dev/api/index/function/distinct
  /* // --------------------------------------------- example1
  ██████╗ ██╗███████╗████████╗██╗███╗   ██╗ ██████╗████████╗
  ██╔══██╗██║██╔════╝╚══██╔══╝██║████╗  ██║██╔════╝╚══██╔══╝
  ██║  ██║██║███████╗   ██║   ██║██╔██╗ ██║██║        ██║   
  ██║  ██║██║╚════██║   ██║   ██║██║╚██╗██║██║        ██║   
  ██████╔╝██║███████║   ██║   ██║██║ ╚████║╚██████╗   ██║   
  ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝   ╚═╝   */
  of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1)
    .pipe(
      // TODO
      distinct(),
      toArray(),
    )
    .subscribe(createObserver('example1', { logMask: LogMask.NEXT })); // [1, 2, 3, 4]

  // --------------------------------------------- example2
  of(
    { name: 'react' },
    { name: 'react' },
    { name: 'vue' },
    { name: 'react' },
    { name: 'angular' },
    { name: 'vue' },
  )
    .pipe(
      // TODO
      distinct(), // not working, because it compares the reference
      toArray(),
    )
    .subscribe(createObserver('example1', { logMask: LogMask.NEXT })); // [1, 2, 3, 4]

  // --------------------------------------------- example3
  of(
    //
    { age: 4, name: 'Foo' },
    { age: 7, name: 'Bar' },
    { age: 5, name: 'Foo' },
    { age: 51, name: 'Foo' },
  )
    .pipe(
      // TODO
      distinct(({ name }) => name),
      toArray(),
    )
    .subscribe(createObserver('example2', { logMask: LogMask.NEXT })); // [{ age: 4, name: 'Foo' }, { age: 7, name: 'Bar' }]
}

{
  /* // --------------------------------------------- distinctUntilChanged
  ██████╗ ██╗███████╗████████╗██╗███╗   ██╗ ██████╗████████╗██╗   ██╗███╗   ██╗████████╗██╗██╗      ██████╗██╗  ██╗ █████╗ ███╗   ██╗ ██████╗ ███████╗██████╗ 
  ██╔══██╗██║██╔════╝╚══██╔══╝██║████╗  ██║██╔════╝╚══██╔══╝██║   ██║████╗  ██║╚══██╔══╝██║██║     ██╔════╝██║  ██║██╔══██╗████╗  ██║██╔════╝ ██╔════╝██╔══██╗
  ██║  ██║██║███████╗   ██║   ██║██╔██╗ ██║██║        ██║   ██║   ██║██╔██╗ ██║   ██║   ██║██║     ██║     ███████║███████║██╔██╗ ██║██║  ███╗█████╗  ██║  ██║
  ██║  ██║██║╚════██║   ██║   ██║██║╚██╗██║██║        ██║   ██║   ██║██║╚██╗██║   ██║   ██║██║     ██║     ██╔══██║██╔══██║██║╚██╗██║██║   ██║██╔══╝  ██║  ██║
  ██████╔╝██║███████║   ██║   ██║██║ ╚████║╚██████╗   ██║   ╚██████╔╝██║ ╚████║   ██║   ██║███████╗╚██████╗██║  ██║██║  ██║██║ ╚████║╚██████╔╝███████╗██████╔╝
  ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚═════╝  */
  // 只要收到和上一次不一樣，就會發送出去
  of(1, 1, 1, 2, 2, 2, 1, 1, 3, 3)
    .pipe(
      // distinctUntilChanged((prev, curr) => prev === curr)
      distinctUntilChanged(),
      toArray(),
    )
    .subscribe(createObserver('distinctUntilChanged', { logMask: LogMask.NEXT }));
}

{
  // --------------------------------------------- distinctUntilKeyChanged
  of(
    //
    { age: 4, name: 'Foo' },
    { age: 7, name: 'Bar' },
    { age: 5, name: 'Foo' },
    { age: 6, name: 'Foo' },
    { age: 9, name: 'Bar' },
  )
    .pipe(
      // 直接比對 name 的值，只要不一樣就發送出去
      distinctUntilKeyChanged('name'),
    )
    .subscribe(createObserver('distinctUntilKeyChanged', { logMask: LogMask.NEXT }));
}
