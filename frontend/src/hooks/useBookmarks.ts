/**
 * useBookmarks.ts
 *
 * Re-exports RTK Query hooks from bookmarksApiSlice with friendly names
 * so existing components need minimal changes.
 *
 * RTK Query gives us for free:
 *   - Automatic caching (deduplication of identical requests)
 *   - Background refetch on window focus
 *   - Cache invalidation via tags (no manual queryClient.invalidateQueries)
 *   - Loading / error / success states out of the box
 *   - Optimistic updates possible via onQueryStarted
 */

import { message } from 'antd';
import type { BookmarkFilters, Bookmark } from '../types';
import type { GroupedParams } from '../store/bookmarksApiSlice.ts';
import {
  useGetBookmarksQuery,
  useGetStatsQuery,
  useGetGroupedQuery,
  useCreateBookmarkMutation,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
  useBulkDeleteBookmarksMutation,
  useImportUrlMutation,
  useImportFileMutation,
} from '../store/bookmarksApiSlice.ts';

// Re-export types so other files can import from this module
export type { GroupedParams };
export type { GroupedResponse, GroupedBookmarkItem } from '../store/bookmarksApiSlice.ts';

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Flat paginated list — used by FocusedList (Level 3) and search */
export const useBookmarks = (filters: BookmarkFilters) =>
  useGetBookmarksQuery(filters, {
    // Skip when both are 'all' and limit is 0 — used as a "disabled" sentinel
    skip: filters.limit === 0,
  });

/** Sidebar counts + byBrowser / byTopic breakdowns */
export const useBookmarkStats = () => useGetStatsQuery();

/** Kanban grouped data — Level 1 (browsers) and Level 2 (topics) */
export const useGroupedBookmarks = (params: GroupedParams) =>
  useGetGroupedQuery(params, {
    skip: params.limit === 0,
  });

// ─── Mutations with toasts ────────────────────────────────────────────────────

/** Create a single bookmark (AI categorizes if topic omitted) */
export const useCreateBookmark = () => {
  const [create, state] = useCreateBookmarkMutation();
  return {
    ...state,
    isPending: state.isLoading,
    mutateAsync: async (data: Partial<Bookmark>) => {
      const result = await create(data).unwrap();
      message.success('Bookmark added');
      return result;
    },
    mutate: (data: Partial<Bookmark>) => {
      create(data)
        .unwrap()
        .then(() => message.success('Bookmark added'))
        .catch((err) =>
          message.error(err?.data?.message ?? 'Failed to add bookmark')
        );
    },
  };
};

/** Update an existing bookmark */
export const useUpdateBookmark = () => {
  const [update, state] = useUpdateBookmarkMutation();
  return {
    ...state,
    isPending: state.isLoading,
    mutateAsync: async ({ id, data }: { id: string; data: Partial<Bookmark> }) => {
      const result = await update({ id, data }).unwrap();
      message.success('Bookmark updated');
      return result;
    },
    mutate: ({ id, data }: { id: string; data: Partial<Bookmark> }) => {
      update({ id, data })
        .unwrap()
        .catch((err) =>
          message.error(err?.data?.message ?? 'Failed to update bookmark')
        );
    },
  };
};

/** Delete a single bookmark */
export const useDeleteBookmark = () => {
  const [del, state] = useDeleteBookmarkMutation();
  return {
    ...state,
    isPending: state.isLoading,
    mutateAsync: async (id: string) => {
      await del(id).unwrap();
      message.success('Bookmark deleted');
    },
    mutate: (id: string) => {
      del(id)
        .unwrap()
        .then(() => message.success('Bookmark deleted'))
        .catch(() => message.error('Failed to delete bookmark'));
    },
  };
};

/** Bulk delete by IDs */
export const useBulkDeleteBookmarks = () => {
  const [bulkDel, state] = useBulkDeleteBookmarksMutation();
  return {
    ...state,
    isPending: state.isLoading,
    mutate: (ids: string[], options?: { onSuccess?: () => void }) => {
      bulkDel(ids)
        .unwrap()
        .then(() => {
          message.success(`${ids.length} bookmarks deleted`);
          options?.onSuccess?.();
        })
        .catch(() => message.error('Bulk delete failed'));
    },
  };
};

/** Import a single URL — AI returns full analysis */
export const useImportUrl = () => {
  const [importUrl, state] = useImportUrlMutation();
  return {
    ...state,
    isPending: state.isLoading,
    mutateAsync: async (args: { url: string; title?: string; browserSource?: string }) => {
      const bookmark = await importUrl(args).unwrap();
      // Return in the shape components expect: { data: { data: { bookmark } } }
      return { data: { data: { bookmark } } };
    },
  };
};

/** Import from browser export file — batch AI categorization */
export const useImportFile = () => {
  const [importFile, state] = useImportFileMutation();
  return {
    ...state,
    isPending: state.isLoading,
    mutateAsync: async ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (pct: number) => void;
    }) => {
      const formData = new FormData();
      formData.append('file', file);

      // RTK Query fetchBaseQuery doesn't support onUploadProgress.
      // For progress tracking we use a parallel XHR, then fire the RTK mutation.
      if (onProgress) {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload  = () => resolve();
          xhr.onerror = () => reject(new Error('Upload failed'));

          const token = localStorage.getItem('accessToken');
          const base  = import.meta.env.VITE_API_URL ?? '/api';
          xhr.open('POST', `${base}/bookmarks/import/file`);
          if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.send(formData);
        });
        // Invalidate tags manually after XHR succeeds
        message.success('Bookmarks imported successfully');
        return;
      }

      // No progress needed — use RTK mutation directly
      const res = await importFile(formData).unwrap();
      message.success(res?.data?.browser ?? 'Import complete');
    //   message.success(res?.data?.message ?? 'Import complete');
      return res;
    },
  };
};