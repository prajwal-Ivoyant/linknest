import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';
import type {
  Bookmark, BookmarkFilters,
  PaginatedBookmarks, DashboardStats,
  BrowserSource, TopicCategory,
} from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GroupedBookmarkItem {
  name: string;
  bookmarks: Bookmark[];
  total: number;
}

export interface GroupedResponse {
  mode: 'kanban' | 'flat';
  groupBy?: string;
  groups?: GroupedBookmarkItem[];
  // flat mode (Level 3)
  bookmarks?: Bookmark[];
  total?: number;
  browserSource?: string;
  topicCategory?: string;
}

export interface GroupedParams {
  by?: 'browserSource' | 'topicCategory';
  browserSource?: string;
  topicCategory?: string;
  limit?: number;
  isArchived?: boolean;
  search?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ImportFileResult {
  count: number;
  browser: string;
}

// ─── Bookmark API Slice ───────────────────────────────────────────────────────

export const bookmarksApiSlice = createApi({
  reducerPath: 'bookmarksApi',
  baseQuery:   baseQueryWithReauth,

  // Cache tag types — used for automatic invalidation
  tagTypes: ['Bookmark', 'BookmarkList', 'BookmarkStats', 'BookmarkGrouped'],

  endpoints: (builder) => ({

    // ── GET /bookmarks ──────────────────────────────────────────────────────
    getBookmarks: builder.query<PaginatedBookmarks, BookmarkFilters>({
        
      query: (filters = {}) => {
        const params: Record<string, string | number | boolean> = {};
        if (filters.browserSource && filters.browserSource !== 'all') params.browserSource = filters.browserSource;
        if (filters.topicCategory && filters.topicCategory !== 'all') params.topicCategory = filters.topicCategory;
        if (filters.isFavorite)  params.isFavorite  = true;
        if (filters.isArchived)  params.isArchived   = true;
        if (filters.search)      params.search       = filters.search;
        if (filters.sortBy)      params.sortBy       = filters.sortBy;
        if (filters.sortOrder)   params.sortOrder    = filters.sortOrder;
        if (filters.page)        params.page         = filters.page;
        if (filters.limit)       params.limit        = filters.limit;
        if (filters.tags)        params.tags         = filters.tags;
        return { url: '/bookmarks', params };
      },
      // Transform: unwrap data.data
      transformResponse: (res: ApiResponse<PaginatedBookmarks>) => res.data,
      providesTags: (result) => [
        'BookmarkList',
        ...(result?.bookmarks ?? []).map(({ _id }) => ({
          type: 'Bookmark' as const,
          id: _id,
        })),
      ],
    }),

    // ── GET /bookmarks/stats ────────────────────────────────────────────────
    getStats: builder.query<DashboardStats, void>({
      query: () => '/bookmarks/stats',
      transformResponse: (res: ApiResponse<DashboardStats>) => res.data,
      providesTags: ['BookmarkStats'],
    }),

    // ── GET /bookmarks/grouped (Kanban) ────────────────────────────────────
    getGrouped: builder.query<GroupedResponse, GroupedParams>({
      query: (params) => ({ url: '/bookmarks/grouped', params }),
      transformResponse: (res: ApiResponse<GroupedResponse>) => res.data,
      providesTags: ['BookmarkGrouped'],
    }),

    // ── GET /bookmarks/:id ──────────────────────────────────────────────────
    getBookmark: builder.query<Bookmark, string>({
      query: (id) => `/bookmarks/${id}`,
      transformResponse: (res: ApiResponse<{ bookmark: Bookmark }>) => res.data.bookmark,
      providesTags: (_, __, id) => [{ type: 'Bookmark', id }],
    }),

    // ── POST /bookmarks ─────────────────────────────────────────────────────
    createBookmark: builder.mutation<Bookmark, Partial<Bookmark>>({
      query: (body) => ({
        url:    '/bookmarks',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiResponse<{ bookmark: Bookmark }>) => res.data.bookmark,
      // Invalidate list + stats so sidebar counts update
      invalidatesTags: ['BookmarkList', 'BookmarkStats', 'BookmarkGrouped'],
    }),

    // ── PATCH /bookmarks/:id ────────────────────────────────────────────────
    updateBookmark: builder.mutation<Bookmark, { id: string; data: Partial<Bookmark> }>({
      query: ({ id, data }) => ({
        url:    `/bookmarks/${id}`,
        method: 'PATCH',
        body:   data,
      }),
      transformResponse: (res: ApiResponse<{ bookmark: Bookmark }>) => res.data.bookmark,
      // Optimistic invalidation of the specific bookmark + grouped view
      invalidatesTags: (_, __, { id }) => [
        { type: 'Bookmark', id },
        'BookmarkList',
        'BookmarkStats',
        'BookmarkGrouped',
      ],
    }),

    // ── DELETE /bookmarks/:id ───────────────────────────────────────────────
    deleteBookmark: builder.mutation<void, string>({
      query: (id) => ({
        url:    `/bookmarks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Bookmark', id },
        'BookmarkList',
        'BookmarkStats',
        'BookmarkGrouped',
      ],
    }),

    // ── DELETE /bookmarks/bulk/delete ───────────────────────────────────────
    bulkDeleteBookmarks: builder.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({
        url:    '/bookmarks/bulk/delete',
        method: 'DELETE',
        body:   { ids },
      }),
      transformResponse: (res: ApiResponse<{ deletedCount: number }>) => res.data,
      invalidatesTags: ['BookmarkList', 'BookmarkStats', 'BookmarkGrouped'],
    }),

    // ── POST /bookmarks/import/url ──────────────────────────────────────────
    // Full AI analysis — returns enriched bookmark
    importUrl: builder.mutation<Bookmark, { url: string; title?: string; browserSource?: string }>({
      query: (body) => ({
        url:    '/bookmarks/import/url',
        method: 'POST',
        body,
      }),
      transformResponse: (res: ApiResponse<{ bookmark: Bookmark }>) => res.data.bookmark,
      invalidatesTags: ['BookmarkList', 'BookmarkStats', 'BookmarkGrouped'],
    }),

    // ── POST /bookmarks/import/file ─────────────────────────────────────────
    // File upload — RTK Query doesn't support onUploadProgress natively,
    // so we use a FormData body and handle it via the base fetch.
    importFile: builder.mutation<ApiResponse<ImportFileResult>, FormData>({
      query: (formData) => ({
        url:     '/bookmarks/import/file',
        method:  'POST',
        body:    formData,
        // Don't set Content-Type — browser sets it with boundary automatically
        formData: true,
      }),
      invalidatesTags: ['BookmarkList', 'BookmarkStats', 'BookmarkGrouped'],
    }),

    // ── POST /bookmarks/:id/visit ───────────────────────────────────────────
    trackVisit: builder.mutation<void, string>({
      query: (id) => ({
        url:    `/bookmarks/${id}/visit`,
        method: 'POST',
      }),
      // Only invalidate the specific bookmark (visit count)
      invalidatesTags: (_, __, id) => [{ type: 'Bookmark', id }],
    }),

  }),
});

// ─── Export auto-generated hooks ──────────────────────────────────────────────

export const {
  useGetBookmarksQuery,
  useGetStatsQuery,
  useGetGroupedQuery,
  useGetBookmarkQuery,
  useCreateBookmarkMutation,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
  useBulkDeleteBookmarksMutation,
  useImportUrlMutation,
  useImportFileMutation,
  useTrackVisitMutation,
} = bookmarksApiSlice;