#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
ROOT_DIR=$(dirname "$SCRIPT_DIR")

mkdir -p "$ROOT_DIR/src/katex/"

if [ -f "$ROOT_DIR/node_modules/katex/dist/katex.min.js" ]; then
    cp "$ROOT_DIR/node_modules/katex/dist/katex.min.js" "$ROOT_DIR/src/katex/"
fi

if [ -f "$ROOT_DIR/node_modules/katex/dist/katex.min.css" ]; then
    cp "$ROOT_DIR/node_modules/katex/dist/katex.min.css" "$ROOT_DIR/src/katex/"
fi
