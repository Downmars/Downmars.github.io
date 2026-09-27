(() => {
  const dialog = document.querySelector('.thought-gallery');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const photo = dialog.querySelector('.thought-gallery-photo');
  const caption = dialog.querySelector('.thought-gallery-caption');
  const original = dialog.querySelector('.thought-gallery-original');
  const previous = dialog.querySelector('.thought-gallery-prev');
  const next = dialog.querySelector('.thought-gallery-next');
  let images = [];
  let index = 0;
  let opener;

  function showImage() {
    const focused = document.activeElement;
    const link = images[index];
    const source = link.querySelector('img');
    photo.src = original.href = link.href;
    photo.alt = source.alt;
    const text = link.querySelector('.thought-caption')?.textContent || source.alt;
    caption.textContent = `${index + 1} / ${images.length}${text ? ` · ${text}` : ''}`;
    previous.disabled = index === 0;
    next.disabled = index === images.length - 1;
    if (dialog.open && ((focused === previous && previous.disabled) || (focused === next && next.disabled))) {
      dialog.querySelector('.thought-gallery-close').focus();
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-thought-image]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    opener = link;
    // Only traverse images belonging to this record, even on the stream page.
    images = [...link.closest('.thought-entry').querySelectorAll('[data-thought-image]')];
    index = images.indexOf(link);
    showImage();
    dialog.showModal();
    document.documentElement.classList.add('thought-gallery-open');
    dialog.querySelector('.thought-gallery-close').focus();
  });
  previous.addEventListener('click', () => { if (index > 0) { index--; showImage(); } });
  next.addEventListener('click', () => { if (index < images.length - 1) { index++; showImage(); } });
  dialog.querySelector('.thought-gallery-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      (event.key === 'ArrowLeft' ? previous : next).click();
    }
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('thought-gallery-open');
    photo.removeAttribute('src');
    opener?.focus();
  });
})();
