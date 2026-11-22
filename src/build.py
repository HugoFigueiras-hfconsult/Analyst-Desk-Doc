#!/usr/bin/env python3
"""Baut index.html aus den Teilen in src/. Aufruf: python3 src/build.py <zielordner>  (Standard: dist)"""
import glob, os, sys
here = os.path.dirname(os.path.abspath(__file__)); out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "..", "dist")
R = lambda f: open(os.path.join(here, f), encoding="utf-8").read()
js = "\n\n".join(R(os.path.basename(f)) for f in sorted(glob.glob(os.path.join(here, "?-*.js"))))
html = R("head.html") + "\n<style>\n" + R("css.css") + R("css2.css") + "</style>\n</head>\n<body>\n" + R("body.html") + "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n"
os.makedirs(out, exist_ok=True)
open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(html); open(os.path.join(out, "desk.js"), "w", encoding="utf-8").write(js)
print(len(html), "Bytes ->", os.path.join(out, "index.html"), "| Syntaxtest: node --check", os.path.join(out, "desk.js"))
