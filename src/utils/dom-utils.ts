export const querySelector = <T extends HTMLElement>(target: string | HTMLElement) => {
  return typeof target === 'string' ? document.querySelector<T>(target) : target;
};

export const querySelectorAll = <T extends HTMLElement>(
  selector: string | HTMLElement[] | HTMLElement,
) => {
  if (typeof selector === 'string') {
    return [...document.querySelectorAll<T>(selector)];
  }
  if (Array.isArray(selector)) {
    return selector;
  }
  return [selector];
};
