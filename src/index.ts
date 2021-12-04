import joplin from 'api';
import { ToolbarButtonLocation, ContentScriptType } from 'api/types';
import { registerSettings, settingValue } from './settings';
import mdHeaders from './mdHeaders';
import panelHtml from './panelHtml';

joplin.plugins.register({
  async onStart() {
    await registerSettings();

    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      'codeMirrorScroller',
      './codeMirrorScroller.js',
    );

    const { panels } = joplin.views;
    const view = await (panels as any).create('outline.panel');

    await panels.setHtml(view, 'Outline');
    await panels.addScript(view, './webview.js');
    await panels.addScript(view, './webview.css');

    await panels.onMessage(view, async (message: any) => {
      if (message.name === 'scrollToHeader') {
        const editorCodeView = await joplin.settings.globalValue('editor.codeView');
        const noteVisiblePanes = await joplin.settings.globalValue('noteVisiblePanes');
        if (editorCodeView && noteVisiblePanes.includes('editor')) {
          // scroll in raw markdown editor
          await joplin.commands.execute('editor.execCommand', {
            name: 'scrollToLine',
            args: [message.lineno],
          });
        } else {
          // scroll in WYSIWYG editor or viewer
          await joplin.commands.execute('scrollToHash', message.hash);
        }
      } else if (message.name === 'contextMenu') {
        const noteId = (await joplin.workspace.selectedNoteIds())[0];
        const noteTitle = (await joplin.data.get(['notes', noteId], { fields: ['title'] })).title;
        const innerLink = `[${noteTitle}#${message.content}](:/${noteId}#${message.hash})`;

        const input = document.createElement('input');
        input.setAttribute('value', innerLink);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
    });

    async function updateTocView() {
      const note = await joplin.workspace.selectedNote();

      // Settings
      const autoHide = await settingValue('autoHide');

      let headers;
      if (note) {
        headers = mdHeaders(note.body);
      } else {
        headers = [];
      }
      if (headers.length === 0) {
        if (autoHide && await (panels as any).visible(view)) {
          await (panels as any).hide(view);
        }
      } else if (!await (panels as any).visible(view) && (await settingValue('isVisible'))) {
        (panels as any).show(view);
      }

      const htmlText = await panelHtml(headers);
      await panels.setHtml(view, htmlText);
    }

    await joplin.workspace.onNoteSelectionChange(() => {
      updateTocView();
    });
    await joplin.workspace.onNoteChange(() => {
      updateTocView();
    });
    await joplin.settings.onChange(() => {
      updateTocView();
    });

    await updateTocView();

    await joplin.commands.register({
      name: 'toggleOutline',
      label: 'Toggle outline',
      iconName: 'fas fa-bars',
      execute: async () => {
        const isVisible = !await settingValue('isVisible');
        await joplin.settings.setValue('isVisible', isVisible);

        const note = await joplin.workspace.selectedNote();
        const headers = mdHeaders(note.body);
        if (headers.length !== 0 || await settingValue('autoHide') === false) {
          (panels as any).show(view, isVisible);
        }
      },
    });
    await joplin.views.toolbarButtons.create('toggleOutline', 'toggleOutline', ToolbarButtonLocation.NoteToolbar);
    await joplin.views.menus.create('outlineMenu', 'Outline', [
      {
        label: 'toggleOutline',
        commandName: 'toggleOutline',
        accelerator: await settingValue('toggleShortcut'),
      },
    ]);
  },
});
