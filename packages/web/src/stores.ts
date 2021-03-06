import { writable, derived } from 'svelte/store';
import { ExtensionsDirectory } from 'dbgate-types';

interface TabDefinition {
  title: string;
  closedTime?: number;
  icon: string;
  props: any;
  selected: boolean;
  busy: boolean;
  tabid: string;
}

export function writableWithStorage<T>(defaultValue: T, storageName) {
  const init = localStorage.getItem(storageName);
  const res = writable<T>(init ? JSON.parse(init) : defaultValue);
  res.subscribe(value => {
    localStorage.setItem(storageName, JSON.stringify(value));
  });
  return res;
}

function subscribeCssVariable(store, transform, cssVariable) {
  store.subscribe(value => document.documentElement.style.setProperty(cssVariable, transform(value)));
}

export const selectedWidget = writable('database');
export const openedConnections = writable([]);
export const currentDatabase = writable(null);
export const openedTabs = writableWithStorage<TabDefinition[]>([], 'openedTabs');
export const extensions = writable<ExtensionsDirectory>(null);
export const visibleCommandPalette = writable(false);
export const commands = writable({});
export const currentTheme = writableWithStorage('theme-light', 'currentTheme');
export const activeTabId = derived([openedTabs], ([$openedTabs]) => $openedTabs.find(x => x.selected)?.tabid);
export const visibleToolbar = writableWithStorage(1, 'visibleToolbar');

subscribeCssVariable(selectedWidget, x => (x ? 1 : 0), '--dim-visible-left-panel');
subscribeCssVariable(visibleToolbar, x => (x ? 1 : 0), '--dim-visible-toolbar');

// export const leftPanelWidth = writable(300);
