import { Observer } from 'rxjs';
import { createLogger } from '@/utils/logger';

export const LogMask = {
  NEXT: 2,
  ERROR: 4,
  COMPLETE: 8,
  ALL: 14,
} as const;

type LogMaskValue = (typeof LogMask)[keyof typeof LogMask];
const hasLogPermission = (value: LogMaskValue, needMask: LogMaskValue) => {
  return (value & needMask) === value;
};
type CreateObserverOptions = {
  style?: string;
  logMask?: LogMaskValue;
  logger?: ReturnType<typeof createLogger>;
};

export function createObserver<T>(label: string): Observer<T>;
export function createObserver<T>(label: string, logMask: LogMaskValue): Observer<T>;
export function createObserver<T>(label: string, options: CreateObserverOptions): Observer<T>;
export function createObserver<T>(
  label: string,
  options: LogMaskValue | CreateObserverOptions = {},
): Observer<T> {
  let innerOptions = options;
  if (typeof options === 'number') {
    innerOptions = { logMask: options } as CreateObserverOptions;
  }
  const {
    style,
    logMask = LogMask.ALL,
    logger = createLogger(label, style),
  } = innerOptions as CreateObserverOptions;
  const startTime = Date.now();
  const getNowTime = () => ((Date.now() - startTime) / 1000).toFixed(1);
  return {
    next: (value: any) => {
      if (hasLogPermission(LogMask.NEXT, logMask)) {
        logger(`${getNowTime()}s`, value);
      }
    },
    error: (err: any) => {
      if (hasLogPermission(LogMask.ERROR, logMask)) {
        logger(`${getNowTime()}s ❌ error`, err);
      }
    },
    complete: () => {
      if (hasLogPermission(LogMask.COMPLETE, logMask)) {
        logger(`${getNowTime()}s`, '✅ complete');
      }
    },
  };
}
createObserver.LogMask = LogMask;

export const randomColor = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
};
export function* randomColorGenerator() {
  while (true) {
    yield randomColor();
  }
}
export const randomColorIterator = randomColorGenerator();
