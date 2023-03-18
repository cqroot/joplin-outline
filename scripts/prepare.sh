#!/bin/bash

mkdir -p "./src/katex/"

if [ -f "./node_modules/katex/dist/katex.min.js" ]; then
	cp "./node_modules/katex/dist/katex.min.js" "./src/katex/"
fi

if [ -f "./node_modules/katex/dist/katex.min.css" ]; then
	cp "./node_modules/katex/dist/katex.min.css" "./src/katex/"
fi
