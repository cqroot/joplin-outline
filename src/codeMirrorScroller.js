function plugin(CodeMirror) {
	CodeMirror.defineExtension('scrollToLineTop', function(lineno, verticalShift) {
		this.scrollTo(null, this.charCoords({line: lineno, ch: 0}, "local").top - verticalShift);
	});
}

module.exports = {
	default: function(_context) { 
		return {
			plugin: plugin,
		}
	},
}