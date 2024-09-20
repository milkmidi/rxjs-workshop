import { filter } from 'rxjs';

type KeyboardEventKeys = 'Escape' | 'Enter';

// https://netbasal.com/creating-custom-operators-in-rxjs-32f052d69457
export function filterKey(key: KeyboardEventKeys) {
  return filter((event: KeyboardEvent) => event.key === key);
}
