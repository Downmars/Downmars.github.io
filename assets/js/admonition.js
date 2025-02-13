
document.querySelectorAll('.admonition.collapsible').forEach(admonition => {
  const header = admonition.querySelector('.admonition-header');
  header.addEventListener('click', () => {
    admonition.classList.toggle('active');
  });
});
