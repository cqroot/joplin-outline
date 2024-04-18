import type { ContentScriptContext, MarkdownEditorContentScriptModule } from 'api/types';
import { EditorView } from '@codemirror/view';

// modified from: https://github.com/personalizedrefrigerator/bug-report/tree/example/plugin-scroll-to-line
export default (context: ContentScriptContext): MarkdownEditorContentScriptModule => {
  return {
    plugin: (editorControl: any) => {
      if (!editorControl.cm6) { return; }

      // Running in CM6
      editorControl.registerCommand('scrollToLine', (lineNumber: number) => {
        const editor: EditorView = editorControl.editor;
        console.log('scrollToLine', lineNumber);

        // Bounds checking
        if (lineNumber < 1) {
          lineNumber = 1;
        }
        if (lineNumber > editor.state.doc.lines) {
          lineNumber = editor.state.doc.lines;
        }

        // Scroll to line, place the line at the *top* of the editor
        const lineInfo = editor.state.doc.line(lineNumber);
        editor.dispatch(editor.state.update({
          effects: EditorView.scrollIntoView(lineInfo.from, {y: 'start'})
        }));
      });
    },
  };
};