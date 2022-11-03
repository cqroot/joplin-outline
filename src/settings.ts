import { SettingItemSubType, SettingItemType } from 'api/types';
import joplin from '../api';

export function pluginIconName(): string {
  return 'fas fa-list';
}

export async function registerSettings(): Promise<void> {
  await joplin.settings.registerSection('outline.settings', {
    label: 'Outline',
    iconName: pluginIconName(),
  });

  await joplin.settings.registerSettings({
    isVisible: {
      type: SettingItemType.Bool,
      value: true,
      section: 'outline.settings',
      public: false,
      label: 'isVisible',
    },

    disableLinewrap: {
      type: SettingItemType.Bool,
      value: false,
      description: 'Disable the linewrap',
      section: 'outline.settings',
      public: true,
      label: 'Disable Linewrap',
    },
    showNumber: {
      type: SettingItemType.Bool,
      value: false,
      description: 'show numbered headers',
      section: 'outline.settings',
      public: true,
      label: 'Show Number',
    },
    collapsible: {
      type: SettingItemType.Bool,
      value: false,
      description: 'headers can be collapsed',
      section: 'outline.settings',
      public: true,
      label: 'Collapsible',
    },
    autoHide: {
      type: SettingItemType.Bool,
      value: false,
      description: 'Automatically hide the panel when there is no content',
      section: 'outline.settings',
      public: true,
      label: 'Auto Hide',
    },
    hoverStyleType: {
      type: SettingItemType.Int,
      value: 0,
      description: 'Item hover style type',
      section: 'outline.settings',
      public: true,
      label: 'Hover Style Type',
      isEnum: true,
      options: ['bold', 'highlight'],
    },
    headerDepth: {
      type: SettingItemType.Int,
      value: 6,
      description: 'Header depth',
      section: 'outline.settings',
      public: true,
      label: 'Header Depth',
    },

    userStyleFile: {
      type: SettingItemType.String,
      value: `${await joplin.settings.globalValue('profileDir')}/outline.css`,
      description: 'User style file (CSS)',
      section: 'outline.settings',
      public: true,
      label: 'User Style File',
      advanced: true,
      subType: SettingItemSubType.FilePath,
    },
    headerIndent: {
      type: SettingItemType.Int,
      value: 15,
      description: 'Default: 15px',
      section: 'outline.settings',
      public: true,
      label: 'Header Indent (px)',
      advanced: true,
    },
    fontFamily: {
      type: SettingItemType.String,
      value: 'var(--joplin-font-family)',
      description: 'var(--joplin-font-family)',
      section: 'outline.settings',
      public: true,
      label: 'Font Family',
      advanced: true,
    },
    fontSize: {
      type: SettingItemType.Int,
      value: '10',
      description: 'Default: 10pt',
      section: 'outline.settings',
      public: true,
      label: 'Font Size (pt)',
      advanced: true,
    },
    fontColor: {
      type: SettingItemType.String,
      value: 'var(--joplin-color)',
      description: 'var(--joplin-color)',
      section: 'outline.settings',
      public: true,
      label: 'Font Color',
      advanced: true,
    },
    bgColor: {
      type: SettingItemType.String,
      value: 'var(--joplin-background-color)',
      description: 'var(--joplin-background-color)',
      section: 'outline.settings',
      public: true,
      label: 'Background Color',
      advanced: true,
    },
    userStyle: {
      type: SettingItemType.String,
      value: '',
      description: 'User style',
      section: 'outline.settings',
      public: true,
      label: 'User Style',
      advanced: true,
    },
    h1Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outline.settings',
      public: true,
      label: 'H1 Prefix',
      advanced: true,
    },
    h2Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outline.settings',
      public: true,
      label: 'H2 Prefix',
      advanced: true,
    },
    h3Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outline.settings',
      public: true,
      label: 'H3 Prefix',
      advanced: true,
    },
    h4Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outline.settings',
      public: true,
      label: 'H4 Prefix',
      advanced: true,
    },
    h5Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outline.settings',
      public: true,
      label: 'H5 Prefix',
      advanced: true,
    },
    h6Prefix: {
      type: SettingItemType.String,
      value: '',
      section: 'outline.settings',
      public: true,
      label: 'H6 Prefix',
      advanced: true,
    },
  });
}

export function settingValue(key: string): Promise<any> {
  return joplin.settings.value(key);
}
