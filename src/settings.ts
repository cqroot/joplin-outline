import { SettingItemType } from 'api/types';
import joplin from '../api';

export async function registerSettings() {
  await joplin.settings.registerSection('outline.settings', {
    label: 'Outline',
    iconName: 'fas fa-bars',
  });

  await joplin.settings.registerSettings({
    isVisible: {
      type: SettingItemType.Bool,
      value: true,
      section: 'outline.settings',
      public: false,
      label: 'isVisible',
    },
    toggleShortcut: {
      type: SettingItemType.String,
      value: 'F9',
      description: 'Shortcut to switch panel display',
      section: 'outline.settings',
      public: true,
      label: 'Toggle Shortcut',
    },
    autoHide: {
      type: SettingItemType.Bool,
      value: false,
      description: 'Automatically hide the panel when there is no content',
      section: 'outline.settings',
      public: true,
      label: 'Auto Hide',
    },
    headerDepth: {
      type: SettingItemType.Int,
      value: 6,
      description: 'Header depth',
      section: 'outline.settings',
      public: true,
      label: 'Header Depth',
    },
    fontFamily: {
      type: SettingItemType.String,
      value: 'var(--joplin-font-family)',
      description: 'var(--joplin-font-family)',
      section: 'outline.settings',
      public: true,
      label: 'Font Family',
    },
    fontSize: {
      type: SettingItemType.Int,
      value: '10',
      description: 'Default: 10pt',
      section: 'outline.settings',
      public: true,
      label: 'Font Size (pt)',
    },
    fontWeight: {
      type: SettingItemType.String,
      value: 'normal',
      description: 'bold/normal/lighter',
      section: 'outline.settings',
      public: true,
      label: 'Font Weight',
    },
    fontColor: {
      type: SettingItemType.String,
      value: 'var(--joplin-color)',
      description: 'var(--joplin-color)',
      section: 'outline.settings',
      public: true,
      label: 'Font Color',
    },
    bgColor: {
      type: SettingItemType.String,
      value: 'var(--joplin-background-color)',
      description: 'var(--joplin-background-color)',
      section: 'outline.settings',
      public: true,
      label: 'Background Color',
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
    numberStyle: {
      type: SettingItemType.String,
      value: 'font-weight: normal; font-style: normal',
      description: 'font-weight: normal; font-style: normal',
      section: 'outline.settings',
      public: true,
      label: 'Number <i> Style',
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

export function settingValue(key: string) {
  return joplin.settings.value(key);
}
