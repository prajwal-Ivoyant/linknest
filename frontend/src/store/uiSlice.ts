import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BookmarkFilters } from '../types';

// ─── State ───────────────────────────────────────────────────────────────────

export interface UIState {
  filters: BookmarkFilters;
  view: 'grid' | 'list';
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
  limit: 24,
};

const initialState: UIState = {
  filters: DEFAULT_FILTERS,
  view: 'grid',
  selectedIds: [],
  sidebarCollapsed: false,
  importModalOpen: false,
  addModalOpen: false,
  editBookmarkId: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

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
    setView(state, action: PayloadAction<'grid' | 'list'>) {
      state.view = action.payload;
    },
    toggleSelected(state, action: PayloadAction<string>) {
      const id = action.payload;
      const idx = state.selectedIds.indexOf(id);
      if (idx === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(idx, 1);
      }
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
  setFilters,
  resetFilters,
  setPage,
  setView,
  toggleSelected,
  clearSelected,
  selectAll,
  setSidebarCollapsed,
  setImportModalOpen,
  setAddModalOpen,
  setEditBookmarkId,
} = uiSlice.actions;

export default uiSlice.reducer;
