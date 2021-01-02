import joplin from 'api';
import { registerSettings, settingValue } from './settings';

const uslug = require('uslug');

// From https://stackoverflow.com/a/6234804/561309
function escapeHtml(unsafe:string) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function noteHeaders(noteBody:string) {
    const headers = [];
    const lines = noteBody.split('\n');
    let flag_block = false;
    for (let line of lines) {
        // check code block
        const block_match = line.match(/^(```)(.*)/)
        if (block_match) {
            flag_block = !flag_block;
        }
        if (flag_block) continue;

        // check header
        line = line.replace(/(\s#+)?$/, '');
        const match = line.match(/^(#+)\s(.*)*/);
        if (!match) continue;
        headers.push({
            level: match[1].length,
            text: match[2],
        });
    }
    return headers;
}

let slugs:any = {};

function headerSlug(headerText:string) {
    const s = uslug(headerText);
    let num = slugs[s] ? slugs[s] : 1;
    const output = [s];
    if (num > 1) output.push(num);
    slugs[s] = num + 1;
    return output.join('-');
}

joplin.plugins.register({
    onStart: async function() {
        await registerSettings();

        const panels = joplin.views.panels;
        const view = await (panels as any).create();

        await panels.setHtml(view, 'Outline');
        await panels.addScript(view, './webview.js');
        await panels.addScript(view, './webview.css');

        panels.onMessage(view, (message:any) => {
            if (message.name === 'scrollToHash') {
                joplin.commands.execute('scrollToHash', message.hash)
            }
        });

        async function updateTocView() {
            const note = await joplin.workspace.selectedNote();
            slugs = {};

            const fontFamily = await settingValue('fontFamily')
            const fontSize = await settingValue('fontSize')
            const fontWeight = await settingValue('fontWeight')
            const fontColor = await settingValue('fontColor');

            if (note) {
                const headers = noteHeaders(note.body);

                const itemHtml = [];
                for (const header of headers) {
                    const slug = headerSlug(header.text);

                    itemHtml.push(`
						<p class="toc-item" style="padding-left:${(header.level - 1) * 15}px">
							<a class="toc-item-link" href="#" data-slug="${escapeHtml(slug)}" style="color: ${fontColor}">
								${escapeHtml(header.text)}
							</a>
						</p>
					`);
                }

                await panels.setHtml(view, `
                    <div class="outline-content" style='
                        font-family: "${fontFamily}"
                    '>
                        <p class="header">Outline</p>
                        <div class="container" style="
                            font-size: ${fontSize}pt;
                            font-weight: ${fontWeight};
                        ">
                            ${itemHtml.join('\n')}
                        </div>
					</div>
				`);
            } else {
                await panels.setHtml(view, 'Please select a note to view the table of content');
            }
        }

        joplin.workspace.onNoteSelectionChange(() => {
            updateTocView();
        });
        joplin.workspace.onNoteContentChange(() => {
            updateTocView();
        });

        updateTocView();
    },
});
