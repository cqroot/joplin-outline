import {SettingItemType} from 'api/types'
import joplin from "../api";

export async function registerSettings() {
    await joplin.settings.registerSection('outline.settings', {
        label: 'Outline',
        iconName: 'fas fa-align-justify'
    });

    await joplin.settings.registerSetting('fontFamily', {
        type: SettingItemType.String,
        value: 'var(--joplin-font-family)',
        description: 'var(--joplin-font-family)',
        section: 'outline.settings',
        public: true,
        label: 'Font Family'
    });
    await joplin.settings.registerSetting('fontSize', {
        type: SettingItemType.String,
        value: 'var(--joplin-font-size)',
        description: 'var(--joplin-font-size)',
        section: 'outline.settings',
        public: true,
        label: 'Font Size'
    });
    await joplin.settings.registerSetting('fontColor', {
        type: SettingItemType.String,
        value: '#42b983',
        description: '#42b983',
        section: 'outline.settings',
        public: true,
        label: 'Font Color'
    });
}

export async function settingValue(key: string) {
    return await joplin.settings.value(key)
}
