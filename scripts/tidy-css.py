"""Remove redundant declarations without reordering selectors or changing fallbacks.

Only earlier identical property/value declarations, and earlier custom-property
values for the exact same selector in the same scope, can be discarded.
"""
from pathlib import Path
import re

def segments(text, delimiter=';'):
    result=[]; start=0; quote=None; depth=0; escaped=False
    for i,ch in enumerate(text):
        if quote:
            if escaped: escaped=False
            elif ch=='\\': escaped=True
            elif ch==quote: quote=None
        elif ch in '\"\'': quote=ch
        elif ch=='(': depth+=1
        elif ch==')': depth-=1
        elif ch==delimiter and depth==0:
            result.append(text[start:i]); start=i+1
    if text[start:].strip(): result.append(text[start:])
    return result

def rules(text):
    items=[]; pos=0
    while pos<len(text):
        match=re.search(r'\S',text[pos:])
        if not match: break
        start=pos+match.start(); opening=text.find('{',start)
        if opening<0: break
        depth=1; i=opening+1; quote=None; escaped=False
        while i<len(text) and depth:
            ch=text[i]
            if quote:
                if escaped: escaped=False
                elif ch=='\\': escaped=True
                elif ch==quote: quote=None
            elif ch in '\"\'': quote=ch
            elif ch=='{': depth+=1
            elif ch=='}': depth-=1
            i+=1
        if depth: raise ValueError('Unbalanced CSS')
        items.append([text[start:opening].strip(),text[opening+1:i-1]])
        pos=i
    return items

def tidy(text):
    parsed=rules(re.sub(r'/\*.*?\*/','',text,flags=re.S)); seen={}; output=[]; removed=0
    for selector,body in reversed(parsed):
        if selector.startswith('@'):
            if selector.startswith(('@media','@supports')):
                body,count=tidy(body); removed+=count
            output.append(selector+' {\n'+body+'\n}'); continue
        declarations=segments(body); keep=[]; newer=seen.setdefault(selector,{})
        for declaration in reversed(declarations):
            if ':' not in declaration: continue
            prop,value=declaration.split(':',1); prop=prop.strip(); value=value.strip()
            if prop in newer and (newer[prop]==value or (prop.startswith('--') and '!important' not in value and '!important' not in newer[prop])):
                removed+=1; continue
            if prop not in newer: newer[prop]=value
            keep.append('    '+prop+': '+value+';')
        if keep: output.append(selector+' {\n'+'\n'.join(reversed(keep))+'\n}')
    return '\n\n'.join(reversed(output)),removed

if __name__=='__main__':
    path=Path('assets/css/style.css'); css,count=tidy(path.read_text())
    path.write_text('/* Portfolio styles. Cascade order is intentional; use scripts/tidy-css.py to remove safe duplicates. */\n'+'\n'.join(line.rstrip() for line in css.splitlines())+'\n')
    print('Removed',count,'redundant CSS declarations; selector order preserved.')
