import { catchError, EMPTY, from, map, of, range, take, timer } from 'rxjs';
import { createObserver } from './utils/rxjx-development-utils';
// https://ithelp.ithome.com.tw/articles/10246196

// EMPTY 不會發出任何值，只會發出 complete 事件
EMPTY.subscribe(createObserver('EMPTY'));
// Marble Diagram
// EMPTY: |

of(1, 2, 3).subscribe(createObserver('of'));
// of: (123|)
from([4, 5, 6]).subscribe(createObserver('from'));
// from: (456|)
from(range(7, 3)).subscribe(createObserver('range'));
// range: (789|)

const wait = (ms: number = 1000) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
from(wait()).subscribe(createObserver('Promise'));

function* myRange(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}
from(myRange(10, 13)).subscribe(createObserver('generator'));

/* 
███╗   ███╗ █████╗ ██████╗ ██████╗ ██╗     ███████╗███████╗    ██████╗ ██╗ █████╗  ██████╗ ██████╗  █████╗ ███╗   ███╗
████╗ ████║██╔══██╗██╔══██╗██╔══██╗██║     ██╔════╝██╔════╝    ██╔══██╗██║██╔══██╗██╔════╝ ██╔══██╗██╔══██╗████╗ ████║
██╔████╔██║███████║██████╔╝██████╔╝██║     █████╗  ███████╗    ██║  ██║██║███████║██║  ███╗██████╔╝███████║██╔████╔██║
██║╚██╔╝██║██╔══██║██╔══██╗██╔══██╗██║     ██╔══╝  ╚════██║    ██║  ██║██║██╔══██║██║   ██║██╔══██╗██╔══██║██║╚██╔╝██║
██║ ╚═╝ ██║██║  ██║██║  ██║██████╔╝███████╗███████╗███████║    ██████╔╝██║██║  ██║╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚══════╝╚══════╝    ╚═════╝ ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝ */
{
  // Marbles Diagram
  timer(0, 1000).pipe(take(5)).subscribe(createObserver('timer'));
  // timer: 0-1-2-3-4|

  // 有資料是在同一個時間點發生，則可以用小括號包起來
  // 0-(12)-(34)-5|

  // 有錯誤發生用 # 表示
  // 0-1-2-3-#
  timer(0, 1000)
    .pipe(
      take(10),
      map((value) => {
        if (value === 3) {
          throw new Error('error');
        }
        return value;
      }),
      catchError((error) => of(error)),
    )
    .subscribe(createObserver('error'));
  // timer: 0-1-2-3-4| or 0-1-2-3-# if an error occurs
}
