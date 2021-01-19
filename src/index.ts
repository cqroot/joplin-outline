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
    let flag_comment = false;
    for (let line of lines) {
        // check code block
        if (line.match(/^(?:```)/)) {
            flag_block = !flag_block;
            continue
        }
        // check comment block
        if (line.match(/^(?:<!--)/)) {
            flag_comment = !flag_comment
            continue
        }
        if (flag_comment && line.match(/(?:-->)/)) {
            flag_comment = !flag_comment
            continue
        }
        if (flag_block || flag_comment) continue;

        // check header
        line = line.replace(/(\s#+)?$/, '');
        const match = line.match(/^(#+)\s(?:\[(.*)\]|(.*))/);
        if (!match) continue;
        headers.push({
            level: match[1].length,
            text: typeof(match[2]) === "undefined" ? match[3] : match[2],
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

        await panels.onMessage(view, async (message: any) => {
            if (message.name === 'scrollToHash') {
                await joplin.commands.execute('scrollToHash', message.hash)
            } else if (message.name === 'contextMenu') {
                const noteId = (await joplin.workspace.selectedNoteIds())[0]
                const noteTitle = (await joplin.data.get(['notes', noteId], { fields: ['title'] } )).title
                const innerLink = `[${noteTitle}#${message.content}](:/${noteId}#${message.hash})`

                let input = document.createElement("input");
                input.setAttribute("value", innerLink);
                document.body.appendChild(input);
                input.select();
                document.execCommand("copy");
                document.body.removeChild(input);
                alert(`The inner link has been copied to clipboard:\n${innerLink}`)
            }
        });

        async function updateTocView() {
            const note = await joplin.workspace.selectedNote();
            slugs = {};

            const fontFamily = await settingValue('fontFamily');
            const fontSize = await settingValue('fontSize');
            const fontWeight = await settingValue('fontWeight');
            const fontColor = await settingValue('fontColor');
            async function getHeaderPrefix (level:number) {
                return await settingValue(`h${level}Prefix`)
            }

            if (note) {
                const headers = noteHeaders(note.body);

                const itemHtml = [];
                for (const header of headers) {
                    const slug = headerSlug(header.text);

                    itemHtml.push(`
						<p class="toc-item" style="padding-left:${(header.level - 1) * 15}px">
						    ${await getHeaderPrefix(header.level)}
							<a class="toc-item-link" href="javascript:;" data-slug="${escapeHtml(slug)}" style="color: ${fontColor}">
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
    },
});
