#!/usr/bin/env python3
"""Build isolated fixtures and check thoughts without adding public sample posts.

Usage: python3 scripts/check-thoughts.py --hugo /path/to/hugo
The temporary output is retained for browser checks; only Python's stdlib is used.
"""
import argparse
import json
import os
import re
import shutil
import struct
import subprocess
import tempfile
import zlib
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
from xml.etree import ElementTree as ET


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.source = source
        self.elements = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def select(self, tag=None, cls=None):
        return [a for t, a in self.elements if (tag is None or t == tag)
                and (cls is None or cls in a.get('class', '').split())]


def read_page(output, route):
    return Page((output / route / 'index.html').read_text())


def write_png(path, width, height, color):
    def chunk(kind, data):
        return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
    rows = b''.join(b'\0' + bytes(color) * width for _ in range(height))
    path.write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0))
                     + chunk(b'IDAT', zlib.compress(rows)) + chunk(b'IEND', b''))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--hugo', default='hugo')
    parser.add_argument('--base-url', default='http://127.0.0.1:8765/')
    args = parser.parse_args()
    repo = Path(__file__).resolve().parents[1]
    version = subprocess.check_output([args.hugo, 'version'], text=True)
    workflow = (repo / '.github/workflows/hugo.yml').read_text()
    pinned = re.search(r"hugo-version:\s*['\"]?([\d.]+)", workflow).group(1)
    assert f'v{pinned}-' in version or f'v{pinned} ' in version, version
    work = Path(tempfile.mkdtemp(prefix='dlog-thoughts-check-'))
    print(f'Isolated workspace: {work}', flush=True)
    content = work / 'content'
    shutil.copytree(repo / 'content', content)
    # Check the empty state independently of any future real thoughts.
    thoughts = content / 'zh/thoughts'
    shutil.rmtree(thoughts)
    thoughts.mkdir()
    shutil.copyfile(repo / 'content/zh/thoughts/_index.md', thoughts / '_index.md')
    config = work / 'fixtures.json'
    config.write_text(json.dumps({'languages': {lang: {'contentDir': str(content / lang)} for lang in ('zh', 'en')}}))

    def build(name):
        output = work / name
        subprocess.run([args.hugo, '--minify', '--config', f'hugo.yaml,{config}',
                        '--baseURL', args.base_url, '--destination', str(output)], cwd=repo, check=True)
        return output

    empty = build('empty')
    empty_page = read_page(empty, 'zh/thoughts')
    assert len(empty_page.select(cls='thoughts-empty')) == 1
    assert not ET.parse(empty / 'zh/thoughts/index.xml').findall('./channel/item')
    assert not empty_page.select(cls='thought-entry')
    subprocess.run([args.hugo, 'new', 'content', '--kind', 'thoughts', 'thoughts/check-archetype',
                    '--config', f'hugo.yaml,{config}'], cwd=repo, check=True,
                   env={**os.environ, 'TZ': 'Asia/Shanghai'})
    created = (thoughts / 'check-archetype/index.md').read_text()
    assert 'draft: true' in created and '+08:00' in created and 'title: ""' in created

    def record(name, day, body, extra=''):
        bundle = thoughts / name
        bundle.mkdir()
        (bundle / 'index.md').write_text(f'---\ndate: 2026-09-{day:02d}T12:30:00+08:00\n'
                                        f'draft: false\ntags: ["模块验证"]\n{extra}---\n\n{body}\n')
        return bundle

    for i in range(1, 13):
        record(f'check-{i:02d}', i, f'验证样例 {i}：这是一条用于检查时间排序与分页的临时记录。',
               f'title: "验证样例 {i}"\n' if i % 2 else '')
    last = thoughts / 'check-12/index.md'
    last.write_text(last.read_text().replace('验证样例 12：这是一条用于检查时间排序与分页的临时记录。',
                    '无标题验证：保留 `a < b & c`。这里是正文第二句。\n\n'
                    '![横图](wide.png "横图说明")\n![竖图](tall.png "竖图说明")\n\n'
                    '[附件](sample.txt)与[文内链接](#补记)。\n\n## 补记\n\n'
                    '```text\n' + 'long_code_' * 30 + '\n]]>\n```'))
    write_png(thoughts / 'check-12/wide.png', 800, 400, (143, 162, 177))
    write_png(thoughts / 'check-12/tall.png', 400, 800, (173, 157, 140))
    (thoughts / 'check-12/sample.txt').write_text('temporary attachment')
    image_note = thoughts / 'check-11/index.md'
    image_note.write_text(image_note.read_text() + '\n![另一条的单图](single.png "单图说明")\n')
    write_png(thoughts / 'check-11/single.png', 600, 400, (164, 181, 149))
    more = thoughts / 'check-10/index.md'
    more.write_text(more.read_text() + '\n<!--more-->\n\n阅读全文后才显示的验证内容。\n')
    related = thoughts / 'check-09/index.md'
    related.write_text(related.read_text().replace('draft: false', 'draft: false\nrelated: ["/posts/2026_03_15-RSS"]'))
    draft = record('check-draft', 13, '草稿不得发布。') / 'index.md'
    draft.write_text(draft.read_text().replace('draft: false', 'draft: true'))
    future = record('check-future', 14, '未来内容不得发布。') / 'index.md'
    future.write_text(future.read_text().replace('2026-09-14', '2099-09-14'))
    single = build('fixtures')
    first = read_page(single, 'zh/thoughts')
    second = read_page(single, 'zh/thoughts/page/2')
    detail = read_page(single, 'zh/thoughts/check-12')
    assert len(first.select(cls='thought-entry')) == 10
    assert len(second.select(cls='thought-entry')) == 2
    assert first.source.index('check-12/') < first.source.index('check-11/')
    assert any(a.get('rel') == 'next' for a in first.select('a'))
    assert any(a.get('rel') == 'prev' for a in second.select('a'))
    assert '阅读全文后才显示的验证内容' not in first.source
    assert '阅读全文后才显示的验证内容' in read_page(single, 'zh/thoughts/check-10').source
    assert '关联文章' in first.source
    assert 'tw-comment' not in first.source and 'tw-comment' in detail.source
    assert '"data-mapping":"pathname"' in detail.source.replace(' ', '')
    assert len(detail.select('h1', 'thought-sr-only')) == 1
    assert 'CC BY-NC 4.0' in detail.source
    assert not detail.select(cls='toc')
    assert re.search(r'<title>2026-09-12 · 无标题验证', detail.source)
    assert any(a.get('property') == 'og:title' and '无标题验证' in a['content'] for a in detail.select('meta'))

    index = json.loads((single / 'zh/index.json').read_text())
    notes = [item for item in index if '/thoughts/' in item['permalink']]
    assert len(notes) == 12
    assert all(item['kind'] == '翻案集 · 短记' for item in notes)
    title = next(item['title'] for item in notes if '/check-12/' in item['permalink'])
    assert 'a < b & c' in title and title.startswith('2026-09-12 · 无标题验证')
    feed = ET.parse(single / 'zh/thoughts/index.xml').findall('./channel/item')
    assert len(feed) == 12
    assert feed[0].findtext('title') == title
    feed_body = feed[0].findtext('{http://purl.org/rss/1.0/modules/content/}encoded')
    assert ']]&gt;' in feed_body or ']]>' in feed_body
    for page in (first, detail, Page(feed_body)):
        imgs = [a['src'] for a in page.select('img') if '/thoughts/check-12/' in a.get('src', '')]
        assert len(imgs) == 2
        for src in imgs:
            assert src.startswith(args.base_url)
            assert (single / unquote(urlparse(src).path).lstrip('/')).is_file()
        assert any(a.get('href', '').endswith('/check-12/sample.txt') for a in page.select('a'))

    for lang in ('zh', 'en'):
        home_feed = ET.parse(single / lang / 'index.xml').findall('./channel/item')
        assert all('/posts/' in item.findtext('link') for item in home_feed)
        assert [i.findtext('link') for i in home_feed] == [i.findtext('link') for i in ET.parse(empty / lang / 'index.xml').findall('./channel/item')]
        search = read_page(single, f'{lang}/search')
        assert search.select('input')
        assert any('/assets/js/search.' in a.get('src', '') for a in search.select('script'))
        assert 'http-equiv=refresh' in (single / lang / 'search/search/index.html').read_text()
    assert not any('/thoughts/' in a.get('href', '') for a in read_page(single, 'en').select('a'))
    for route in ('zh/archives', 'zh/posts'):
        page = read_page(single, route)
        assert not any('/thoughts/check-' in a.get('href', '') for a in page.select('a'))
    for excluded in ('check-draft', 'check-future', 'check-archetype'):
        assert not (single / 'zh/thoughts' / excluded).exists()
        assert excluded not in (single / 'zh/index.json').read_text()
        assert excluded not in (single / 'zh/thoughts/index.xml').read_text()
    assert 'http-equiv=refresh' in (single / 'zh/thoughts/search/index.html').read_text()
    print(f'PASS: empty state, 12 records, pagination, titles, images, attachments, related links, comments, search, RSS, drafts and future dates.\nBrowser fixtures: {single}\nEmpty state: {empty}')


if __name__ == '__main__':
    main()
