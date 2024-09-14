const COLORS = [
  '#1abc9c',
  '#3498db',
  '#34495e',
  '#e67e22',
  '#c0392b',
  '#44bd32',
  '#192a56',
  '#e056fd',
  '#686de0',
  '#273c75',
  '#c23616',
  '#CAD3C8',
  '#3B3B98',
  '#BDC581',
] as const;

let colorIdx = -1;
const getNextColor = () => {
  colorIdx++;
  colorIdx %= COLORS.length;
  return COLORS[colorIdx];
};

export const createLogger = (label: string, style?: string) => {
  const logStyle = style ?? `background-color: ${getNextColor()};color: white;padding:1px 2px;`;
  return (...value: any[]) => {
    console.log(`%c${label}`, logStyle, ...value);
  };
};
