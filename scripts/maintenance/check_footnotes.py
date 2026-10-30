#!/usr/bin/env python3

###
# usage:
# python3 scripts/maintenance/check_footnotes.py content/posts
##

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PATHS = [ROOT / "content"]
INCLUDE_SUFFIXES = {".md", ".html", ".htm"}


MARKDOWN_REF_RE = re.compile(r"\[\^([^\]]+)\](?!:)")
MARKDOWN_DEF_RE = re.compile(r"^\[\^([^\]]+)\]:", re.M)

# Markdown-generated HTML and legacy handcrafted HTML footnotes.
HTML_REF_RE = re.compile(r'id="fnref:([^"]+)"|href="#fn:([^"]+)"')
HTML_DEF_RE = re.compile(r'id="fn:([^"]+)"|href="#fnref:([^"]+)"')


def extract_footnotes(text: str) -> tuple[set[str], set[str]]:
    refs: set[str] = set(MARKDOWN_REF_RE.findall(text))
    defs: set[str] = set(MARKDOWN_DEF_RE.findall(text))

    for match in HTML_REF_RE.findall(text):
        refs.update(value for value in match if value)
    for match in HTML_DEF_RE.findall(text):
        defs.update(value for value in match if value)

    return refs, defs


def iter_files(paths: list[Path]) -> list[Path]:
    files: list[Path] = []
    for path in paths:
        if path.is_file():
            if path.suffix.lower() in INCLUDE_SUFFIXES:
                files.append(path)
            continue
        if path.is_dir():
            for candidate in sorted(path.rglob("*")):
                if candidate.is_file() and candidate.suffix.lower() in INCLUDE_SUFFIXES:
                    files.append(candidate)
    return files


def analyze_file(path: Path) -> tuple[set[str], set[str]]:
    text = path.read_text(encoding="utf-8")
    refs, defs = extract_footnotes(text)
    return refs, defs


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Signale les notes de bas de page appelées sans définition, et les définitions jamais appelées."
    )
    parser.add_argument(
        "paths",
        nargs="*",
        default=[str(path) for path in DEFAULT_PATHS],
        help="Fichiers ou dossiers à analyser. Par défaut: content/",
    )
    args = parser.parse_args()

    files = iter_files([Path(p) for p in args.paths])
    if not files:
        print("Aucun fichier Markdown/HTML à analyser.")
        return 0

    has_issues = False
    for path in files:
        refs, defs = analyze_file(path)
        missing_defs = sorted(refs - defs, key=lambda value: (len(value), value))
        unused_defs = sorted(defs - refs, key=lambda value: (len(value), value))

        if not missing_defs and not unused_defs:
            continue

        has_issues = True
        print(f"{path}:")
        if missing_defs:
            print(f"  appels sans définition: {', '.join(f'[^{ref}]' for ref in missing_defs)}")
        if unused_defs:
            print(f"  définitions jamais appelées: {', '.join(f'[^{ref}]' for ref in unused_defs)}")

    return 1 if has_issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
