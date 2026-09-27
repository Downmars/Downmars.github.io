// Run with: node scripts/check-mermaid.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setImmediate } from 'node:timers/promises';
import test from 'node:test';
import vm from 'node:vm';

const script = readFileSync(new URL('../assets/js/mermaid-theme.js', import.meta.url), 'utf8');

function setup({ dark = false, sources = ['flowchart LR\nA["<br/> & text"] --> B', 'pie\n"Cats": 2'] } = {}) {
    let notify;
    let resolveFonts;
    let active = 0;
    let config;
    const calls = [];
    const errors = [];
    const nodes = sources.map((textContent) => ({
        textContent,
        processed: false,
        removeAttribute(name) {
            assert.equal(name, 'data-processed');
            this.processed = false;
        },
    }));
    const body = { classList: { contains: () => dark } };
    vm.runInNewContext(script, {
        document: {
            body,
            querySelectorAll: () => nodes,
            fonts: { ready: new Promise((resolve) => { resolveFonts = resolve; }) },
        },
        MutationObserver: class {
            constructor(callback) { notify = callback; }
            observe(target, options) {
                assert.equal(target, body);
                assert.equal(options.attributeFilter[0], 'class');
            }
        },
        console: { error: (...args) => errors.push(args) },
        mermaid: {
            initialize(options) {
                assert.equal(active, 0, 'never change Mermaid config during a render');
                assert.equal(options.startOnLoad, false, 'disable automatic duplicate renders');
                config = options;
            },
            run({ nodes: targets }) {
                assert.equal(++active, 1, 'only one render can be active');
                assert.deepEqual(Array.from(targets, (node) => node.textContent), sources);
                assert.ok(targets.every((node) => !node.processed));
                return new Promise((resolve, reject) => {
                    calls.push({
                        theme: config.theme,
                        finish(error) {
                            active--;
                            for (const node of targets) {
                                node.textContent = 'rendered diagram';
                                node.processed = true;
                            }
                            if (error) reject(error);
                            else resolve();
                        },
                    });
                });
            },
        },
    });
    return {
        calls, errors,
        loadFonts: resolveFonts,
        setDark(value) { dark = value; notify(); },
    };
}

test('initial rendering waits for fonts and uses the latest actual theme without a toggle button', async () => {
    const page = setup();
    await setImmediate();
    assert.equal(page.calls.length, 0);
    page.setDark(true);
    page.loadFonts();
    await setImmediate();
    assert.equal(page.calls[0].theme, 'dark');
    page.calls[0].finish();
    await setImmediate();
    page.setDark(true); // An unrelated body-class change must not render again.
    await setImmediate();
    assert.equal(page.calls.length, 1);
    assert.deepEqual(page.errors, []);
});

test('rapid toggles serialize renders, restore source text and settle on the last theme', async () => {
    const page = setup();
    page.loadFonts();
    await setImmediate();
    assert.equal(page.calls[0].theme, 'neutral');
    page.setDark(true);
    page.setDark(false);
    page.setDark(true);
    assert.equal(page.calls.length, 1);
    page.calls[0].finish();
    await setImmediate();
    assert.equal(page.calls[1].theme, 'dark');
    page.setDark(false);
    page.calls[1].finish();
    await setImmediate();
    assert.equal(page.calls[2].theme, 'neutral');
    page.calls[2].finish();
    await setImmediate();
    assert.equal(page.calls.length, 3);
    assert.deepEqual(page.errors, []);
});

test('a rejected render is caught and a later theme change can render again', async () => {
    const page = setup();
    page.loadFonts();
    await setImmediate();
    page.calls[0].finish(new Error('test render failure'));
    await setImmediate();
    assert.equal(page.errors.length, 1);
    page.setDark(true);
    await setImmediate();
    assert.equal(page.calls[1].theme, 'dark');
    page.calls[1].finish();
    await setImmediate();
    assert.equal(page.errors.length, 1);
});

test('pages without diagrams do not start a render', async () => {
    const page = setup({ sources: [] });
    await setImmediate();
    assert.equal(page.calls.length, 0);
    assert.deepEqual(page.errors, []);
});
