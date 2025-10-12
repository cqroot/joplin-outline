import joplin from 'api';
import { ToolbarButtonLocation, ContentScriptType, MenuItemLocation } from 'api/types';
import { registerSettings, settingValue, pluginIconName } from './settings';
import markdownHeaders from './markdownHeaders';
import panelHtml from './panelHtml';

joplin.plugins.register({
  async onStart() {
    await registerSettings();

    // --- Enregistrement des scripts CodeMirror pour compatibilité Joplin ---
    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      'codeMirror5Scroller',
      './codeMirror5Scroller.js',
    );
    await joplin.contentScripts.register(
      ContentScriptType.CodeMirrorPlugin,
      'codeMirror6Scroller',
      './codeMirror6Scroller.js',
    );

    const { panels } = joplin.views;
    const view = await (panels as any).create('outline.panel');

    await panels.setHtml(view, 'Loading outline panel ...');
    await panels.addScript(view, './webview.js');
    await panels.addScript(view, './webview.css');
    // cp ../node_modules/katex/dist/katex.min.* ./katex/
    await panels.addScript(view, './katex/katex.min.css');
    await panels.addScript(view, './katex/katex.min.js');

    // --- Gestion des messages envoyés depuis la webview (Outline) ---
    await panels.onMessage(view, async (message: any) => {
      if (message.name === 'scrollToHeader') {
        // Défilement dans l’éditeur WYSIWYG ou le visualiseur
        await joplin.commands.execute('scrollToHash', message.hash);
        // Défilement dans l’éditeur Markdown brut
        await joplin.commands.execute('editor.execCommand', {
          name: 'scrollToLine',
          args: [parseInt(message.lineno, 10)],
        });

      // --- ✅ Bloc propre : copie vers presse-papiers via API Joplin ---
      } else if (message.name === 'copyToClipboard') {
        const text = message.content;
        if (typeof text === 'string' && text.length > 0) {
          await joplin.clipboard.writeText(text);
          // Feedback utilisateur déjà géré côté panneau Outline (aucun dialog ici)
        }
        return;

      } else if (message.name === 'contextMenu') {
        const noteId = (await joplin.workspace.selectedNoteIds())[0];
        const noteTitle = (await joplin.data.get(['notes', noteId], { fields: ['title'] })).title;
        let innerLink: string;
        if (message.hash === '') {
          innerLink = `[${noteTitle}](:/${noteId})`;
        } else {
          innerLink = `[${noteTitle}#${message.content}](:/${noteId}#${message.hash})`;
        }

        await joplin.clipboard.writeText(innerLink);
      }
    });

    // --- Met à jour la vue du panneau Outline ---
    async function updateTocView() {
      const note = await joplin.workspace.selectedNote();
      const autoHide = await settingValue('autoHide');

      let headers;
      if (note) {
        headers = markdownHeaders(note.body);
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

    // --- Écoute des changements pour mettre à jour le panneau automatiquement ---
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

    // --- Commande : basculer la visibilité du panneau Outline ---
    await joplin.commands.register({
      name: 'toggleOutline',
      label: 'Toggle outline',
      iconName: pluginIconName(),
      execute: async () => {
        const isVisible = !await settingValue('isVisible');
        await joplin.settings.setValue('isVisible', isVisible);

        const note = await joplin.workspace.selectedNote();
        const headers = markdownHeaders(note.body);
        if (headers.length !== 0 || await settingValue('autoHide') === false) {
          (panels as any).show(view, isVisible);
        }
      },
    });

    // --- Ajoute le bouton et les entrées de menu ---
    await joplin.views.toolbarButtons.create('toggleOutline', 'toggleOutline', ToolbarButtonLocation.NoteToolbar);
    await joplin.views.menus.create('outlineMenu', 'Outline', [
      {
        label: 'toggleOutline',
        commandName: 'toggleOutline',
      },
    ], MenuItemLocation.Tools);
    await joplin.views.menuItems.create('outlineMenuItem', 'toggleOutline', MenuItemLocation.EditorContextMenu);
  },
});
