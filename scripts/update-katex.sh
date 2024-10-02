#!/bin/bash

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
mkdir -p "${SCRIPT_DIR}/src/katex/"

if [ -f "${SCRIPT_DIR}/node_modules/katex/dist/katex.min.js" ]; then
	cp "${SCRIPT_DIR}/node_modules/katex/dist/katex.min.js" "${SCRIPT_DIR}/src/katex/"
fi

if [ -f "${SCRIPT_DIR}/node_modules/katex/dist/katex.min.css" ]; then
	cp "${SCRIPT_DIR}/node_modules/katex/dist/katex.min.css" "${SCRIPT_DIR}/src/katex/"
fi
