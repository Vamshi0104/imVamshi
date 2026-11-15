"""Offline checks for broken assets, anchors, duplicate IDs and metadata."""
from pathlib import Path
from html.parser import HTMLParser
import json
import re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.ids=[]; self.anchors=[]; self.assets=[]; self.labels=[]; self.inputs=[]; self.choices=[]
    def handle_starttag(self,tag,attributes):
        a=dict(attributes)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='a' and a.get('href','').startswith('#'):self.anchors.append(a['href'][1:])
        if tag in ('img','script','iframe','link'):
            value=a.get('src',a.get('href',''))
            if value and not value.startswith(('http','data:','#')):self.assets.append(value.split('#')[0])
        if tag=='input': self.inputs.append(a)
        if tag=='a' and 'data-resume-choice' in a:self.choices.append(a)
        if tag=='img': assert 'alt' in a and 'width' in a and 'height' in a, 'Missing image alt or dimensions'

source=(ROOT/'index.html').read_text(); parser=SiteParser(); parser.feed(source)
assert len(parser.ids)==len(set(parser.ids)), 'Duplicate IDs'
assert all(a in parser.ids for a in parser.anchors), 'Broken anchor'
for path in parser.assets:assert (ROOT/path).is_file(), 'Missing asset: '+path
script=(ROOT/'assets/js/script.js').read_text()
for path in re.findall(r'"(assets/images/[^"]+)"',script):assert (ROOT/path).is_file(),path
for value in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source,re.S):json.loads(value)
assert 'rel="canonical"' in source and 'property="og:url"' in source
assert 'name="phone"' not in source and 'tel:' not in source
assert 'device_token' not in source+script
assert not any(i.get('type')=='email' and 'required' not in i for i in parser.inputs)
assert 'aria-pressed' in script and 'Skip to content' in source
expected={'one-page':'RESUME-VAMSHI_KRISHNA_MADHAVAN.pdf','detailed':'RESUME-VAMSHI_KRISHNA_MADHAVAN_DETAILED.pdf'}
assert {a['data-resume-choice']:a['href'] for a in parser.choices}==expected, 'Resume format mismatch'
assert all('download' in a for a in parser.choices), 'Resume options must download directly'
for asset in (ROOT/'assets/images/covers').glob('*.svg'):ET.parse(asset)
ET.parse(ROOT/'sitemap.xml')
print(f'PASS: {len(parser.ids)} unique IDs, {len(parser.anchors)} anchors, {len(parser.assets)} local assets, metadata, contact privacy, and sitemap.')
