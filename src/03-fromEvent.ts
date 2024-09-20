import mitt from 'mitt';
import { fromEvent, fromEventPattern, take, tap, timer } from 'rxjs';
import { NodeEventHandler } from 'rxjs/internal/observable/fromEvent';
import { createObserver } from './utils/rxjx-development-utils';

/*
███████╗██████╗  ██████╗ ███╗   ███╗███████╗██╗   ██╗███████╗███╗   ██╗████████╗
██╔════╝██╔══██╗██╔═══██╗████╗ ████║██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝
█████╗  ██████╔╝██║   ██║██╔████╔██║█████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   
██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   
██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝     */

{
  const btn1 = document.getElementById('btn1') as HTMLButtonElement;
  fromEvent(btn1, 'click').subscribe(createObserver('fromEvent'));
}

/* 
███████╗██████╗  ██████╗ ███╗   ███╗███████╗██╗   ██╗███████╗███╗   ██╗████████╗██████╗  █████╗ ████████╗████████╗███████╗██████╗ ███╗   ██╗
██╔════╝██╔══██╗██╔═══██╗████╗ ████║██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗████╗  ██║
█████╗  ██████╔╝██║   ██║██╔████╔██║█████╗  ██║   ██║█████╗  ██╔██╗ ██║   ██║   ██████╔╝███████║   ██║      ██║   █████╗  ██████╔╝██╔██╗ ██║
██╔══╝  ██╔══██╗██║   ██║██║╚██╔╝██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║   ██║   ██╔═══╝ ██╔══██║   ██║      ██║   ██╔══╝  ██╔══██╗██║╚██╗██║
██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗ ╚████╔╝ ███████╗██║ ╚████║   ██║   ██║     ██║  ██║   ██║      ██║   ███████╗██║  ██║██║ ╚████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝ */

{
  const eventBus = mitt();

  timer(0, 1000)
    .pipe(
      tap((value) => {
        eventBus.emit('tick', value);
      }),
      take(10),
    )
    .subscribe();

  const addHandler = (handler: NodeEventHandler) => {
    console.log('addHandler');
    eventBus.on('tick', handler);
  };

  const removeHandler = (handler: NodeEventHandler) => {
    console.log('removeHandler');
    eventBus.off('tick', handler);
  };

  const subscription = fromEventPattern(addHandler, removeHandler).subscribe(
    createObserver('fromEventPattern'),
  );

  setTimeout(() => {
    subscription.unsubscribe();
    // clearInterval(id);
  }, 5000);
}
