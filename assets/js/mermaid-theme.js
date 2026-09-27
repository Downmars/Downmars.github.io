(() => {
    const diagrams = Array.from(document.querySelectorAll('.mermaid'), (node) => ({
        node,
        source: node.textContent,
    }));
    if (!diagrams.length) return;

    const currentTheme = () => document.body.classList.contains('dark') ? 'dark' : 'neutral';
    let requestedTheme = currentTheme();
    let renderedTheme;
    let rendering = false;

    // Disable Mermaid's automatic pass; all renders go through the same queue.
    mermaid.initialize({ startOnLoad: false });

    async function renderTheme() {
        if (rendering) return;
        rendering = true;
        try {
            // Measure diagram labels after the site's web fonts are available.
            await document.fonts.ready;
            while (renderedTheme !== requestedTheme) {
                const theme = requestedTheme;
                mermaid.initialize({
                    startOnLoad: false,
                    theme,
                    fontFamily: '"SFProText-Regular", "LXGWWenKaiScreenR", sans-serif',
                });
                for (const { node, source } of diagrams) {
                    node.removeAttribute('data-processed');
                    node.textContent = source;
                }
                await mermaid.run({ nodes: diagrams.map(({ node }) => node) });
                renderedTheme = theme;
            }
        } catch (error) {
            console.error('Mermaid rendering failed:', error);
        } finally {
            rendering = false;
        }
    }

    // Read the resulting body class, independent of theme-button listener order.
    new MutationObserver(() => {
        const theme = currentTheme();
        if (theme !== requestedTheme) {
            requestedTheme = theme;
            void renderTheme();
        }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

    void renderTheme();
})();
