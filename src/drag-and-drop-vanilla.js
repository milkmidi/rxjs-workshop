const box1 = document.getElementById('box1');

box1.addEventListener('mousedown', (event) => {
  const shiftX = event.clientX - box1.getBoundingClientRect().left;
  const shiftY = event.clientY - box1.getBoundingClientRect().top;

  const moveAt = (pageX, pageY) => {
    box1.style.left = `${pageX - shiftX}px`;
    box1.style.top = `${pageY - shiftY}px`;
  };

  moveAt(event.pageX, event.pageY);

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  const control = new AbortController();
  const { signal } = control;
  document.addEventListener('mousemove', onMouseMove, { signal });
  document.addEventListener(
    'mouseup',
    () => {
      control.abort();
    },
    { signal },
  );
});
