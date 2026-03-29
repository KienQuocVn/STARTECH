'use client';

import { useSyncExternalStore } from 'react';

type AdminState = {
  sidebarCollapsed: boolean;
};

type Listener = () => void;

let state: AdminState = {
  sidebarCollapsed: false,
};

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function setState(nextState: Partial<AdminState>) {
  state = { ...state, ...nextState };
  emitChange();
}

export function useAdminStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    ...snapshot,
    toggleSidebar: () => setState({ sidebarCollapsed: !snapshot.sidebarCollapsed }),
    setSidebarCollapsed: (value: boolean) => setState({ sidebarCollapsed: value }),
  };
}
