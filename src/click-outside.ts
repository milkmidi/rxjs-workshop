import createClickOutSideStream from './utils/create-click-outside-stream';

const box = document.getElementById('box') as HTMLElement;
createClickOutSideStream(box).subscribe(() => {
  console.log('clicked outside');
});
