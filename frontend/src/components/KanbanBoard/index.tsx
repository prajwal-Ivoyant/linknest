import React, { useState, useEffect } from 'react';
import { Typography, Spin, Button, Dropdown, Checkbox, Tag, Space } from 'antd';
import {
  MoreOutlined, DeleteOutlined, CloseOutlined,
  CheckSquareOutlined, SortAscendingOutlined,
} from '@ant-design/icons';
import {
  DndContext, DragOverlay, PointerSensor,
  useSensor, useSensors,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import type { Bookmark, BrowserSource, TopicCategory } from '../../types';
import {
  useGroupedBookmarks, useBookmarks,
  useUpdateBookmark, useBulkDeleteBookmarks,
} from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setFilters, resetFilters,
  toggleSelected, clearSelected, selectAll,
} from '../../store/uiSlice';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { BROWSER_EMOJIS, TOPIC_EMOJIS, BROWSER_COLORS, TOPIC_COLORS } from '../../utils/helpers';
import EmptyState from '../EmptyState';

const { Text } = Typography;

// ─── Focused Grid View (Level 3) ─────────────────────────────────────────────

const FocusedList: React.FC<{
  browserSource: string;
  topicCategory: string;
  onReset: () => void;
}> = ({ browserSource, topicCategory, onReset }) => {
  const dispatch = useAppDispatch();
  const { selectedIds } = useAppSelector((s) => s.ui);

  // Selection mode — off by default, toggled via 3-dot menu
  const [selectionMode, setSelectionMode] = useState(false);
  // Sort state — default newest first
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading } = useBookmarks({
    browserSource: browserSource as BrowserSource,
    topicCategory: topicCategory as TopicCategory,
    sortBy,
    sortOrder,
    limit: 100,
  });
  const { mutate: bulkDelete, isPending: deleting } = useBulkDeleteBookmarks();

  const bookmarks = data?.bookmarks || [];
  const total = data?.pagination?.total ?? 0;
  const allIds = bookmarks.map((b: Bookmark) => b._id);
  const allSelected = allIds.length > 0 && allIds.every((id: string) => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0;

  const handleEnterSelection = () => {
    setSelectionMode(true);
  };

  const handleExitSelection = () => {
    setSelectionMode(false);
    dispatch(clearSelected());
  };

  const handleSelectAll = () => {
    if (allSelected) dispatch(clearSelected());
    else dispatch(selectAll(allIds));
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedIds, {
      onSuccess: () => {
        dispatch(clearSelected());
        setSelectionMode(false);
      },
    });
  };

  const handleCardClick = (id: string) => {
    if (!selectionMode) return;
    dispatch(toggleSelected(id));
  };

  // 3-dot menu — only "Select" when not in selection mode
  const menuItems = [
    {
      key: 'select',
      icon: <CheckSquareOutlined />,
      label: 'Select',
      onClick: handleEnterSelection,
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ height: 110, background: 'var(--skeleton)', borderRadius: 'var(--radius-card)', animation: 'pulse 1.5s ease infinite' }} />
        ))}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return <EmptyState
      isFiltered
      isSearching={false}
    />;
  }

  return (
    <div>
      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14, flexWrap: 'wrap', gap: 8,
      }}>

        {/* Left side — count + selection controls (only in selection mode) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {total} bookmark{total !== 1 ? 's' : ''}
          </Text>

          {/* Select-all checkbox + bulk actions — only visible in selection mode */}
          {selectionMode && (
            <Space size={8} style={{ animation: 'fadeIn 0.2s ease' }}>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected && !allSelected}
                onChange={handleSelectAll}
              >
                <Text style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Select all
                </Text>
              </Checkbox>

              {someSelected && (
                <>
                  <Tag
                    color="purple"
                    style={{ margin: 0, padding: '2px 10px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}
                  >
                    {selectedIds.length} selected
                  </Tag>
                  <Button
                    danger size="small"
                    icon={<DeleteOutlined />}
                    loading={deleting}
                    onClick={handleBulkDelete}
                    style={{ borderRadius: 'var(--radius-input)' }}
                  >
                    Delete
                  </Button>
                </>
              )}

              {/* Cancel selection mode */}
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={handleExitSelection}
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-input)' }}
              >
                Cancel
              </Button>
            </Space>
          )}
        </div>

        {/* Right side — Sort dropdown + 3-dot menu */}
        <Space size={6}>
          {/* Sort dropdown — same style as the image */}
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            menu={{
              selectedKeys: [`${sortBy}-${sortOrder}`],
              items: [
                {
                  key: 'createdAt-desc',
                  icon: <SortAscendingOutlined />,
                  label: 'Newest first',
                  onClick: () => { setSortBy('createdAt'); setSortOrder('desc'); },
                },
                {
                  key: 'createdAt-asc',
                  icon: <SortAscendingOutlined />,
                  label: 'Oldest first',
                  onClick: () => { setSortBy('createdAt'); setSortOrder('asc'); },
                },
                {
                  key: 'title-asc',
                  label: 'A → Z',
                  onClick: () => { setSortBy('title'); setSortOrder('asc'); },
                },
                {
                  key: 'title-desc',
                  label: 'Z → A',
                  onClick: () => { setSortBy('title'); setSortOrder('desc'); },
                },
              ],
            }}
          >
            <Button
              size="small"
              icon={<SortAscendingOutlined />}
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-input)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {sortBy === 'createdAt' && sortOrder === 'desc' && 'Newest first'}
              {sortBy === 'createdAt' && sortOrder === 'asc' && 'Oldest first'}
              {sortBy === 'title' && sortOrder === 'asc' && 'A → Z'}
              {sortBy === 'title' && sortOrder === 'desc' && 'Z → A'}
            </Button>
          </Dropdown>

          {/* 3-dot menu — Select option */}
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
            disabled={selectionMode}
          >
            <Button
              size="small"
              icon={<MoreOutlined />}
              style={{
                borderColor: selectionMode ? 'transparent' : 'var(--border)',
                color: selectionMode ? 'transparent' : 'var(--text-secondary)',
                borderRadius: 'var(--radius-input)',
                pointerEvents: selectionMode ? 'none' : 'auto',
              }}
            />
          </Dropdown>
        </Space>
      </div>

      {/* ── Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 10,
      }}>
        {bookmarks.map((bm: Bookmark) => {
          const isSelected = selectedIds.includes(bm._id);
          return (
            <div
              key={bm._id}
              onClick={() => handleCardClick(bm._id)}
              style={{
                position: 'relative',
                outline: isSelected ? '2px solid rgba(124,92,255,0.5)' : '2px solid transparent',
                borderRadius: 'var(--radius-card)',
                cursor: selectionMode ? 'pointer' : 'default',
                transition: 'outline 0.15s ease',
              }}
            >
              {/* Checkbox — only visible in selection mode */}
              {selectionMode && (
                <div
                  style={{
                    position: 'absolute', top: 10, left: 10, zIndex: 5,
                    animation: 'fadeIn 0.15s ease',
                  }}
                  onClick={(e) => { e.stopPropagation(); dispatch(toggleSelected(bm._id)); }}
                >
                  <Checkbox checked={isSelected} />
                </div>
              )}

              <KanbanCard bookmark={bm} showBrowser showTopic={false} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Main Kanban Board ────────────────────────────────────────────────────────

const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((s) => s.ui);
  const { mutate: updateBookmark } = useUpdateBookmark();
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | null>(null);

  const browserSource = filters.browserSource;
  const topicCategory = filters.topicCategory;

  const isLevel3 = !!(browserSource && browserSource !== 'all' && topicCategory && topicCategory !== 'all');
  const isLevel2 = !!(browserSource && browserSource !== 'all' && (!topicCategory || topicCategory === 'all'));
  const isLevel1 = !isLevel3 && !isLevel2;
  const isSpecialView = filters.isFavorite || filters.isArchived;
  const isSearching = !!(filters.search && filters.search.trim());

  // Clear selections whenever the user leaves Level 3
  useEffect(() => {
    if (!isLevel3) {
      dispatch(clearSelected());
    }
  }, [isLevel3, dispatch]);

  const groupedParams = isLevel2
    ? { by: 'topicCategory' as const, browserSource, limit: 20, search: filters.search }
    // Level 1: group by browser — but pass topicCategory so columns are filtered by topic when one is selected
    : {
      by: 'browserSource' as const, limit: 20, search: filters.search,
      topicCategory: topicCategory && topicCategory !== 'all' ? topicCategory : undefined
    };

  const { data: groupedData, isLoading } = useGroupedBookmarks(
    (isSpecialView || isSearching) ? { by: 'browserSource', limit: 0 } : groupedParams
  );

  const { data: specialData, isLoading: specialLoading } = useBookmarks(
    (isSpecialView || isSearching) ? { ...filters, limit: 100 } : { browserSource: 'all', limit: 0 }
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const bm = event.active.data.current?.bookmark as Bookmark;
    if (bm) setActiveBookmark(bm);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveBookmark(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const bookmark = active.data.current?.bookmark as Bookmark;
    if (!bookmark) return;
    const targetColumn = over.id as string;
    if (isLevel1 && bookmark.browserSource !== targetColumn) {
      updateBookmark({ id: bookmark._id, data: { browserSource: targetColumn as BrowserSource } });
    } else if (isLevel2 && bookmark.topicCategory !== targetColumn) {
      updateBookmark({ id: bookmark._id, data: { topicCategory: targetColumn as TopicCategory } });
    }
  };

  // ─── Breadcrumb ─────────────────────────────────────────────────────────────

  const renderBreadcrumb = () => {
    if (filters.isFavorite || filters.isArchived) return null;

    const crumbs: React.ReactNode[] = [
      <span
        key="all"
        onClick={() => dispatch(resetFilters())}
        style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 600, fontSize: 13 }}
      >
        🔗 All Bookmarks 
      </span>,
    ];

    // Level 1 with topic filter: All Bookmarks › 🎨 Design (browser columns scoped to this topic)
    if (topicCategory && topicCategory !== 'all' && (!browserSource || browserSource === 'all')) {
      const emoji = TOPIC_EMOJIS[topicCategory as TopicCategory];
      const color = TOPIC_COLORS[topicCategory as TopicCategory];
      crumbs.push(
        <span key="sep-topic" style={{ color: 'var(--text-muted)', margin: '0 6px' }}>›</span>,
        <span key="topic-only" style={{ color, fontWeight: 600, fontSize: 13 }}>
          {emoji} {topicCategory}
        </span>
      );
    }

    // Level 2+: show browser in breadcrumb
    if (browserSource && browserSource !== 'all') {
      const emoji = BROWSER_EMOJIS[browserSource as BrowserSource];
      const color = BROWSER_COLORS[browserSource as BrowserSource];
      crumbs.push(
        <span key="sep1" style={{ color: 'var(--text-muted)', margin: '0 6px' }}>›</span>,
        <span
          key="browser"
          onClick={isLevel3 ? () => dispatch(setFilters({ browserSource, topicCategory: 'all' })) : undefined}
          style={{
            cursor: isLevel3 ? 'pointer' : 'default',
            color: isLevel3 ? color : 'var(--text-primary)',
            fontWeight: 600, fontSize: 13,
          }}
        >
          {emoji} {browserSource}
        </span>
      );
    }

    // Level 3: show topic after browser
    if (browserSource && browserSource !== 'all' && topicCategory && topicCategory !== 'all') {
      const emoji = TOPIC_EMOJIS[topicCategory as TopicCategory];
      const color = TOPIC_COLORS[topicCategory as TopicCategory];
      crumbs.push(
        <span key="sep2" style={{ color: 'var(--text-muted)', margin: '0 6px' }}>›</span>,
        <span key="topic" style={{ color, fontWeight: 600, fontSize: 13 }}>
          {emoji} {topicCategory}
        </span>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 2 }}>
        {crumbs}
        {(browserSource !== 'all' || topicCategory !== 'all') && (
          <Button
            type="link" size="small"
            onClick={() => dispatch(resetFilters())}
            style={{ color: 'var(--text-muted)', fontSize: 11, marginLeft: 8 }}
          >
            ← Reset
          </Button>
        )}
      </div>
    );
  };

  // ─── Search results view ────────────────────────────────────────────────────

  if (isSearching) {
    const bookmarks = specialData?.bookmarks || [];
    const total = specialData?.pagination?.total ?? 0;
    return (
      <div>
        {specialLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: 110, background: 'var(--skeleton)', borderRadius: 'var(--radius-card)', animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <EmptyState
            isSearching
          />
        ) : (
          <>
            <Text style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 14 }}>
              {total} result{total !== 1 ? 's' : ''} for <strong style={{ color: 'var(--text-primary)' }}>"{filters.search}"</strong>
            </Text>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {bookmarks.map((bm: Bookmark) => (
                <KanbanCard key={bm._id} bookmark={bm} showBrowser showTopic />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Special views ──────────────────────────────────────────────────────────

  if (isSpecialView) {
    const bookmarks = specialData?.bookmarks || [];
    const label = filters.isFavorite ? '⭐ Favorites' : '📦 Archive';
    return (
      <div>
        <Text style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 16 }}>
          {label}
        </Text>
        {specialLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spin /></div>
        ) : bookmarks.length === 0 ? (
          <EmptyState
            isFiltered
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            {bookmarks.map((bm: Bookmark) => (
              <KanbanCard key={bm._id} bookmark={bm} showBrowser showTopic />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── Level 3: Focused grid ──────────────────────────────────────────────────

  if (isLevel3) {
    return (
      <div>
        {renderBreadcrumb()}
        <FocusedList
          browserSource={browserSource as string}
          topicCategory={topicCategory as string}
          onReset={() => dispatch(resetFilters())}
        />
      </div>
    );
  }

  // ─── Level 1 & 2: Kanban board ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div style={{ display: 'flex', gap: 14 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ width: 280, minWidth: 280 }}>
            <div style={{ height: 44, background: 'var(--skeleton)', borderRadius: 'var(--radius-card)', marginBottom: 10, animation: 'pulse 1.5s ease infinite' }} />
            {Array.from({ length: 3 }).map((__, j) => (
              <div key={j} style={{ height: 100, background: 'var(--skeleton)', borderRadius: 'var(--radius-card)', marginBottom: 8, animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const groups = groupedData?.groups || [];

  return (
    <div>
      {renderBreadcrumb()}
      {groups.length === 0 ? (
        <EmptyState />
      ) : (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 16, alignItems: 'flex-start' }}>
            {groups.map((group) => (
              <KanbanColumn
                key={group.name}
                id={group.name}
                title={group.name}
                bookmarks={group.bookmarks}
                total={group.total}
                columnType={isLevel2 ? 'topic' : 'browser'}
                onHeaderClick={
                  isLevel1
                    ? () => dispatch(setFilters({ browserSource: group.name as BrowserSource, topicCategory: 'all' }))
                    : () => dispatch(setFilters({ browserSource: browserSource as BrowserSource, topicCategory: group.name as TopicCategory }))
                }
                onShowAll={() => {
                  if (isLevel1) {
                    dispatch(setFilters({ browserSource: group.name as BrowserSource, topicCategory: 'all' }));
                  } else {
                    dispatch(setFilters({ browserSource: browserSource as BrowserSource, topicCategory: group.name as TopicCategory }));
                  }
                }}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
            {activeBookmark ? (
              <div style={{ width: 280, opacity: 0.95, transform: 'rotate(2deg)', boxShadow: '0 12px 32px rgba(124,92,255,0.25)' }}>
                <KanbanCard bookmark={activeBookmark} showTopic showBrowser />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default KanbanBoard;