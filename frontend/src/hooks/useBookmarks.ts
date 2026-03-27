import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { bookmarksApi } from '../api';
import type { BookmarkFilters, Bookmark, PaginatedBookmarks, DashboardStats } from '../types';

export const QUERY_KEYS = {
  bookmarks: (filters: BookmarkFilters) => ['bookmarks', filters],
  grouped: (params: object) => ['bookmarks', 'grouped', params],
  stats: () => ['bookmarks', 'stats'],
  bookmark: (id: string) => ['bookmark', id],
};

// ─── Flat list (used by focused view Level 3 + Favorites + Archive) ───────────

export const useBookmarks = (filters: BookmarkFilters) => {
  return useQuery<PaginatedBookmarks>({
    queryKey: QUERY_KEYS.bookmarks(filters),
    queryFn: async (): Promise<PaginatedBookmarks> => {
      const { data } = await bookmarksApi.list(filters);
      return data.data as PaginatedBookmarks;
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};

// ─── Grouped (Kanban Level 1 & 2) ────────────────────────────────────────────

export interface KanbanGroup {
  name: string;
  bookmarks: Bookmark[];
  total: number;
}

export interface GroupedData {
  mode: 'kanban' | 'flat';
  groupBy?: string;
  groups?: KanbanGroup[];
  // flat mode
  bookmarks?: Bookmark[];
  total?: number;
  browserSource?: string;
  topicCategory?: string;
}

export const useGroupedBookmarks = (params: {
  by?: 'browserSource' | 'topicCategory';
  browserSource?: string;
  topicCategory?: string;
  limit?: number;
  search?: string;
}) => {
  return useQuery<GroupedData>({
    queryKey: QUERY_KEYS.grouped(params),
    queryFn: async (): Promise<GroupedData> => {
      const { data } = await bookmarksApi.grouped(params);
      return data.data as GroupedData;
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};

export const useBookmarkStats = () => {
  return useQuery<DashboardStats>({
    queryKey: QUERY_KEYS.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      const { data } = await bookmarksApi.stats();
      return data.data as DashboardStats;
    },
    staleTime: 60_000,
  });
};

export const useCreateBookmark = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Bookmark>) => bookmarksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      message.success('Bookmark added');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to add bookmark');
    },
  });
};

export const useUpdateBookmark = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bookmark> }) =>
      bookmarksApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Failed to update bookmark');
    },
  });
};

export const useDeleteBookmark = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookmarksApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      message.success('Bookmark deleted');
    },
    onError: () => message.error('Failed to delete bookmark'),
  });
};

export const useBulkDeleteBookmarks = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bookmarksApi.bulkDelete(ids),
    onSuccess: (_, ids) => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      message.success(`${ids.length} bookmarks deleted`);
    },
    onError: () => message.error('Bulk delete failed'),
  });
};

export const useImportFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (pct: number) => void }) =>
      bookmarksApi.importFile(file, onProgress),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      message.success(res.data.message || 'Import complete');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      message.error(msg || 'Import failed');
    },
  });
};

// export const useImportUrl = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: ({ url, title, browserSource }: { url: string; title?: string; browserSource?: string }) =>
//       bookmarksApi.importUrl(url, title, browserSource),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['bookmarks'] });
//       message.success('Bookmark imported');
//     },
//     onError: (err: unknown) => {
//       const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
//       message.error(msg || 'Import failed');
//     },
//   });
// };

export const useImportUrl = () => {
  return useMutation({
    mutationFn: ({ url, title, browserSource }: {
      url: string
      title?: string
      browserSource?: string
    }) => bookmarksApi.importUrl(url, title, browserSource),

 
    onSuccess: () => {
      // do nothing here
    },

    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      message.error(msg || 'AI import failed')
    },
  });
};