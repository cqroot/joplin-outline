import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';
import { registerSettings, settingValue } from './settings';
import { mdHeaders } from './mdHeaders';

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

joplin.plugins.register({
    onStart: async function() {
        await registerSettings();

        const panels = joplin.views.panels;
        const view = await (panels as any).create('outline.panel');

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
            }
        });

        async function updateTocView() {
            const note = await joplin.workspace.selectedNote();

            const fontFamily = await settingValue('fontFamily');
            const fontSize = await settingValue('fontSize');
            const fontWeight = await settingValue('fontWeight');
            const fontColor = await settingValue('fontColor');
            const disableLinewrap = await settingValue('disableLinewrap')
            const showNumber = await settingValue('showNumber');
            const numberStyle = await settingValue('numberStyle');

            let p_style = ""
            if (disableLinewrap) {
                p_style += "white-space: nowrap;text-overflow:ellipsis;overflow:hidden;"
            }

            async function getHeaderPrefix (level:number) {
                return await settingValue(`h${level}Prefix`)
            }

            if (note) {
                const headers = mdHeaders(note.body);
                if (headers.length == 0) {
                    if (await (panels as any).visible(view)) {
                        await (panels as any).hide(view)
                    }
                } else {
                    if (!await (panels as any).visible(view)) {
                        (panels as any).show(view)
                    }
                }

                const itemHtml = [];
                let headerCount=new Array(0, 0, 0, 0, 0, 0);

                let slugs:any = {};
                for (const header of headers) {
                    // get slug
                    const s = uslug(header.text);
                    let num = slugs[s] ? slugs[s] : 1;
                    const output = [s];
                    if (num > 1) output.push(num);
                    slugs[s] = num + 1;
                    const slug = output.join('-');

                    headerCount[header.level-1] += 1;
                    for (let i = header.level; i < 6; ++i) {
                        headerCount[i] = 0;
                    }
                    let numberPrefix = "";
                    if (showNumber) {
                        for (let i = 0; i < header.level; i++) {
                            numberPrefix += headerCount[i];
                            if (i != header.level - 1) {
                                numberPrefix += '.';
                            }
                        }
                    }

                    itemHtml.push(`
						<p class="toc-item" style="padding-left:${(header.level - 1) * 15}px;${p_style}">
						    ${await getHeaderPrefix(header.level)}
						    <i style="${numberStyle}">${numberPrefix}</i>
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
                if (await (panels as any).visible(view)) {
                    await (panels as any).hide(view)
                }
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

        await joplin.commands.register({
            name: 'toggleOutline',
            label: 'Toggle Outline',
            iconName: 'fas fa-bars',
            execute: async () => {
                const isVisible = await (panels as any).visible(view);
                (panels as any).show(view, !isVisible);
            },
        });
        await joplin.views.toolbarButtons.create('toggleOutline', 'toggleOutline', ToolbarButtonLocation.NoteToolbar);
    },
});
