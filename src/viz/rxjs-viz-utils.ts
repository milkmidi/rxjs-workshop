export type ItemType = {
  name: string;
  color: string;
  progress: number;
  type?: 'combine';
};

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_isplainobject
function isPlainObject(value: any) {
  if (typeof value !== 'object' || value === null) return false;

  if (Object.prototype.toString.call(value) !== '[object Object]') return false;

  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;

  const Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.call(Ctor) === Function.prototype.call(value)
  );
}
const convertToItem = (value: any) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return { name: value, color: '#ffffff' };
  }
  return value;
};
export const isItemType = (value: any): value is ItemType => {
  return isPlainObject(value) && 'name' in value && 'color' in value;
};
export const formatValue = (value: any): { name: string; color: string } => {
  let nextValue;
  if (Array.isArray(value)) {
    const combineName = value
      .map((item) => convertToItem(item).name)
      .join(',')
      .toString();
    nextValue = { name: `(${combineName})`, color: 'white' };
  } else if (isItemType(value)) {
    nextValue = convertToItem(value);
  } else if (isPlainObject(value)) {
    nextValue = { name: JSON.stringify(value), color: 'white' };
  } else {
    nextValue = { name: value, color: 'white' };
  }
  return nextValue;
};
