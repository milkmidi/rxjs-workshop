import gsap from 'gsap';
import { map, scan, startWith } from 'rxjs';
import { createDraggableStream } from './utils/create-draggable-stream';

type DragOptions = {
  dom: HTMLElement;
  initialValue?: number;
  snap?: number;
  maxDegree: number;
};

// 上下 Drag and Drop 來控制值
export const registerDragAndDropPositionY = (options: DragOptions) => {
  const { dom, initialValue = 0, snap = 0.01, maxDegree } = options;
  const startDegree = (360 - maxDegree) >> 1;
  const endDegree = startDegree + maxDegree;
  const startValue = (360 + startDegree / 2) * initialValue;
  const clamp = gsap.utils.clamp(startDegree, endDegree);
  const normalize = gsap.utils.normalize(startDegree, endDegree);
  const snapFun = gsap.utils.snap(snap);

  return createDraggableStream(dom).pipe(
    map(({ incrementY }) => incrementY * 1.1),
    startWith(startValue * -1),
    scan((acc, value) => {
      const newValue = acc - value;
      return clamp(newValue);
    }, 0),
    map(normalize),
    map(snapFun),
  );
};
