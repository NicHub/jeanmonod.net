#!/usr/bin/env python3

from __future__ import annotations

import subprocess
import re
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[2]
POSTS_DIR = ROOT / "posts"
CONTENT_DIR = ROOT / "content"


def split_front_matter(text: str) -> tuple[dict, str]:
    if not text.startswith("---\n"):
        return {}, text

    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return {}, text

    _, rest = parts
    fm_text = text[4 : len(text) - len(rest) - 5]
    data = yaml.safe_load(fm_text) or {}
    return data, rest.lstrip("\n")


def convert_with_pandoc(body: str) -> str:
    proc = subprocess.run(
        [
            "pandoc",
            "--from=markdown+raw_html",
            "--to=gfm+raw_html",
            "--wrap=none",
        ],
        input=body,
        text=True,
        capture_output=True,
        check=True,
    )
    return proc.stdout.strip() + "\n"


def build_hugo_front_matter(data: dict) -> dict:
    hugo: dict[str, object] = {}

    if title := data.get("title"):
        hugo["title"] = title

    if date := data.get("date"):
        hugo["date"] = normalize_date(date)

    categories = data.get("categories") or []
    if categories:
        hugo["categories"] = categories

    author = data.get("author") or {}
    if isinstance(author, dict) and author.get("first_name"):
        hugo["author"] = author["first_name"]

    if data.get("published") is False:
        hugo["draft"] = True

    return hugo


def normalize_date(value: object) -> str:
    if hasattr(value, "isoformat"):
        return value.isoformat()

    raw = str(value).strip()
    match = re.match(
        r"^(\d{4}-\d{2}-\d{2}) (\d{1,2}):(\d{1,2}):(\d{1,2})(?:\.\d+)? ([+-]\d{2}):?(\d{2})$",
        raw,
    )
    if match:
        day, hour, minute, second, offset_hour, offset_minute = match.groups()
        return (
            f"{day}T{int(hour):02d}:{int(minute):02d}:{int(second):02d}"
            f"{offset_hour}:{offset_minute}"
        )

    return raw


def write_markdown(target: Path, front_matter: dict, body: str) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    serialized = yaml.safe_dump(front_matter, allow_unicode=True, sort_keys=False).strip()
    target.write_text(f"---\n{serialized}\n---\n\n{body.rstrip()}\n", encoding="utf-8")


def migrate_root_index() -> None:
    source = ROOT / "index.qmd"
    if not source.exists():
        return

    data, body = split_front_matter(source.read_text(encoding="utf-8"))
    front_matter = build_hugo_front_matter(data)
    if "title" not in front_matter:
        front_matter["title"] = "Hypnodingues"
    write_markdown(CONTENT_DIR / "_index.md", front_matter, convert_with_pandoc(body))


def migrate_posts_index() -> None:
    source = POSTS_DIR / "index.qmd"
    if not source.exists():
        return

    data, _body = split_front_matter(source.read_text(encoding="utf-8"))
    front_matter = {"title": data.get("title", "Articles")}
    write_markdown(CONTENT_DIR / "posts" / "_index.md", front_matter, "")


def migrate_posts() -> None:
    for source in sorted(POSTS_DIR.glob("*.qmd")):
        if source.name == "index.qmd":
            continue

        data, body = split_front_matter(source.read_text(encoding="utf-8"))
        target = CONTENT_DIR / "posts" / f"{source.stem}.md"
        write_markdown(target, build_hugo_front_matter(data), convert_with_pandoc(body))


def main() -> None:
    migrate_root_index()
    migrate_posts_index()
    migrate_posts()


if __name__ == "__main__":
    main()
