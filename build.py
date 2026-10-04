#!/usr/bin/env python3
"""Assemble the GitHub Pages entry point from readable source files."""

import argparse
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent
TEMPLATE = ROOT / "src" / "index.template.html"
STYLES = ROOT / "src" / "styles.css"
SCRIPT = ROOT / "src" / "app.js"
OUTPUT = ROOT / "index.html"


def build() -> str:
    template = TEMPLATE.read_text(encoding="utf-8")
    styles = STYLES.read_text(encoding="utf-8").strip()
    script = SCRIPT.read_text(encoding="utf-8").strip()

    for marker in ("__BUILD_INLINE_STYLES__", "__BUILD_INLINE_SCRIPT__"):
        if template.count(marker) != 1:
            raise SystemExit(f"Expected exactly one {marker} marker in {TEMPLATE}")

    return template.replace("__BUILD_INLINE_STYLES__", styles).replace(
        "__BUILD_INLINE_SCRIPT__", script
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check",
        action="store_true",
        help="fail if index.html is not up to date; do not write files",
    )
    args = parser.parse_args()

    output = build()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != output:
            print("index.html is stale; run python3 build.py", file=sys.stderr)
            return 1
        print("index.html is up to date")
        return 0

    OUTPUT.write_text(output, encoding="utf-8")
    print("Built index.html from src/index.template.html, src/styles.css, and src/app.js")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
