import joplin from 'api';
import { ToolbarButtonLocation, ContentScriptType } from 'api/types';
import { registerSettings, settingValue } from './settings';
import mdHeaders from './mdHeaders';

const uslug = require('uslug');

let isVisible = true;

// From https://stackoverflow.com/a/6234804/561309
function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

joplin.plugins.register({
  async onStart() {
    await registerSettings();

    await joplin.contentScripts.register(
			ContentScriptType.CodeMirrorPlugin,
			'codeMirrorScroller',
			'./codeMirrorScroller.js'
		);

    const { panels } = joplin.views;
    const view = await (panels as any).create('outline.panel');

    await panels.setHtml(view, 'Outline');
    await panels.addScript(view, './webview.js');
    await panels.addScript(view, './webview.css');

    await panels.onMessage(view, async (message: any) => {
      if (message.name === 'scrollToTocItem') {
        const editorCodeView = await joplin.settings.globalValue("editor.codeView");
        console.log(editorCodeView);
        if (editorCodeView){
          // scroll in editor
          await joplin.commands.execute('editor.execCommand', {
            name: 'scrollToLineTop',
            args: [message.lineno],
          })
        } else {
          // scroll in preview
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
      const headerDepth = await settingValue('headerDepth');
      const fontFamily = await settingValue('fontFamily');
      const fontSize = await settingValue('fontSize');
      const fontWeight = await settingValue('fontWeight');
      const fontColor = await settingValue('fontColor');
      const bgColor = await settingValue('bgColor');
      const disableLinewrap = await settingValue('disableLinewrap');
      const showNumber = await settingValue('showNumber');
      const numberStyle = await settingValue('numberStyle');

      let pStyle = '';
      if (disableLinewrap) {
        pStyle += 'white-space: nowrap;text-overflow:ellipsis;overflow:hidden;';
      }

      async function getHeaderPrefix(level: number) {
        /* eslint-disable no-return-await */
        return await settingValue(`h${level}Prefix`);
      }

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
      } else if (!await (panels as any).visible(view) && isVisible) {
        (panels as any).show(view);
      }

      const itemHtml = [];
      const headerCount: number[] = [0, 0, 0, 0, 0, 0];

      const slugs: any = {};
      for (const header of headers) {
        // get slug
        const s = uslug(header.text);
        const num = slugs[s] ? slugs[s] : 1;
        const output = [s];
        if (num > 1) output.push(num);
        slugs[s] = num + 1;
        const slug = output.join('-');

        headerCount[header.level - 1] += 1;
        for (let i = header.level; i < 6; i += 1) {
          headerCount[i] = 0;
        }
        let numberPrefix = '';
        if (showNumber) {
          for (let i = 0; i < header.level; i += 1) {
            numberPrefix += headerCount[i];
            if (i !== header.level - 1) {
              numberPrefix += '.';
            }
          }
        }

        // header depth
        /* eslint-disable no-continue */
        if (header.level > headerDepth) {
          continue;
        }

        /* eslint-disable no-await-in-loop */
        itemHtml.push(`
                        <p class="toc-item" style="padding-left:${(header.level - 1) * 15}px;${pStyle}">
                           ${await getHeaderPrefix(header.level)}
                           <i style="${numberStyle}">${numberPrefix}</i>
                            <a class="toc-item-link" href="javascript:;" data-slug="${escapeHtml(slug)}" data-lineno="${header.lineno}" style="color: ${fontColor}">
                                ${escapeHtml(header.text)}
                            </a>
                        </p>
                    `);
      }

      await panels.setHtml(view, `
                    <div class="outline-content" style="font-family: ${fontFamily}; min-height: calc(100vh - 1em); background-color: ${bgColor}; padding: 5px">
                        <a class="header" href="javascript:;"">OUTLINE</a>
                        <div class="container" style="
                            font-size: ${fontSize}pt;
                            font-weight: ${fontWeight};
                        ">
                            ${itemHtml.join('\n')}
                        </div>
                    </div>
                `);
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
        isVisible = !await (panels as any).visible(view);

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
