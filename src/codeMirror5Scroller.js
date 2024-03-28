function plugin(CodeMirror) {
  CodeMirror.defineExtension('scrollToLine', function scrollToLine(lineno) {
    // temporary fix: sometimes the first coordinate is incorrect,
    // resulting in a difference about +- 10 px,
    // call the scroll function twice fixes the problem.
    this.scrollTo(null, this.charCoords({ line: lineno, ch: 0 }, 'local').top);
    this.scrollTo(null, this.charCoords({ line: lineno, ch: 0 }, 'local').top);
  });
}

module.exports = {
  default() {
    return {
      plugin,
    };
  },
};
