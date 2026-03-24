import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BookmarkFilters } from '../types';

export interface UIState {
  filters: BookmarkFilters;
  theme: 'light' | 'dark';
  selectedIds: string[];
  sidebarCollapsed: boolean;
  importModalOpen: boolean;
  addModalOpen: boolean;
  editBookmarkId: string | null;
}

const DEFAULT_FILTERS: BookmarkFilters = {
  browserSource: 'all',
  topicCategory: 'all',
  isFavorite: false,
  isArchived: false,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 50,
};

const getSystemTheme = (): 'light' | 'dark' =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

const initialState: UIState = {
  filters: DEFAULT_FILTERS,
  theme: getSystemTheme(),
  selectedIds: [],
  sidebarCollapsed: false,
  importModalOpen: false,
  addModalOpen: false,
  editBookmarkId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<BookmarkFilters>>) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    resetFilters(state) {
      state.filters = DEFAULT_FILTERS;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    toggleTheme(state) {
      const next = state.theme === 'light' ? 'dark' : 'light';
      state.theme = next;
      document.documentElement.setAttribute('data-theme', next);
    },
    toggleSelected(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.selectedIds.indexOf(id);
      if (idx === -1) state.selectedIds.push(id);
      else state.selectedIds.splice(idx, 1);
    },
    clearSelected(state) {
      state.selectedIds = [];
    },
    selectAll(state, action: PayloadAction<string[]>) {
      state.selectedIds = action.payload;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setImportModalOpen(state, action: PayloadAction<boolean>) {
      state.importModalOpen = action.payload;
    },
    setAddModalOpen(state, action: PayloadAction<boolean>) {
      state.addModalOpen = action.payload;
    },
    setEditBookmarkId(state, action: PayloadAction<string | null>) {
      state.editBookmarkId = action.payload;
    },
  },
});

export const {
  setFilters, resetFilters, setPage,
  setTheme, toggleTheme,
  toggleSelected, clearSelected, selectAll,
  setSidebarCollapsed, setImportModalOpen, setAddModalOpen, setEditBookmarkId,
} = uiSlice.actions;

export default uiSlice.reducer;