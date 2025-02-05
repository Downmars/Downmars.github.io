// 新增脚本 assets/js/island-header.js
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const blurBg = document.querySelector('.nav-blur-bg');
    const titleSwitcher = document.querySelector('.logo-switcher');
    let lastScroll = 0;
    let accumulatedY = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const scrollDirection = currentScroll > lastScroll ? 'down' : 'up';
        const h1 = document.querySelector('h1.post-title');

        // 模糊背景控制
        if(blurBg) {
            const opacity = Math.min(currentScroll / 200, 0.9);
            blurBg.style.opacity = opacity;
        }

        // 标题切换逻辑
        if(h1) {
            const h1Bottom = h1.getBoundingClientRect().bottom + currentScroll;
            titleSwitcher.classList.toggle('title-switched', currentScroll > h1Bottom - 200);
        }

        // 导航栏动态定位
        if(currentScroll > 100) {
            const delta = Math.abs(currentScroll - lastScroll);
            accumulatedY = scrollDirection === 'down' 
                ? Math.min(accumulatedY + delta, 100) 
                : Math.max(accumulatedY - delta*2, 0);

            const translateY = scrollDirection === 'down' 
                ? Math.min(accumulatedY/2, 40) 
                : -Math.min(accumulatedY, 20);
            
            header.style.transform = `translate(-50%, ${translateY}px)`;
        }

        lastScroll = currentScroll;
    });

    // 移动端菜单优化
    const menu = document.getElementById('menu');
    if(window.innerWidth < 768) {
        menu.style.display = 'none';
        const menuToggle = document.createElement('button');
        menuToggle.innerHTML = '☰';
        menuToggle.classList.add('mobile-menu-toggle');
        header.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    }
});
