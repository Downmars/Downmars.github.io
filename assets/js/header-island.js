document.addEventListener('DOMContentLoaded', () => {
  let lastScroll = 0;
  let accumulatedY = 0;
  const header = document.getElementById('island-header');
  const titleWrapper = document.getElementById('title-wrapper');
  const blurLayer = document.getElementById('menu-blur');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const scrollDirection = currentScroll > lastScroll ? 'down' : 'up';
    const h1 = document.querySelector('h1.post-title');

    // 模糊层透明度控制
    if(blurLayer) {
      blurLayer.style.opacity = Math.min(currentScroll / 200, 0.9);
    }

    // 标题切换逻辑
    if(h1) {
      const h1Bottom = h1.getBoundingClientRect().bottom + currentScroll;
      if(currentScroll > h1Bottom - 200) {
        titleWrapper.classList.add('title-switched');
      } else {
        titleWrapper.classList.remove('title-switched');
      }
    }

    // 导航栏隐藏/显示逻辑
    if(currentScroll > 100) {
      const deltaY = Math.abs(currentScroll - lastScroll);
      accumulatedY = scrollDirection === 'down' 
        ? Math.min(accumulatedY + deltaY, 100) 
        : Math.max(accumulatedY - deltaY*2, 0);

      header.style.transform = `translate(-50%, ${scrollDirection === 'down' 
        ? Math.min(accumulatedY/2, 40) 
        : -Math.min(accumulatedY, 20)}px)`;
    }

    lastScroll = currentScroll;
  });
});
