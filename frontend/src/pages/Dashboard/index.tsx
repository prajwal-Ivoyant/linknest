import React, { useCallback } from 'react';
import { Layout, Input, Button, Tooltip, Dropdown, Avatar, Typography, Space, Spin, Pagination, Tag, Select } from 'antd';
import { SearchOutlined, AppstoreOutlined, UnorderedListOutlined, MenuUnfoldOutlined, DeleteOutlined, LogoutOutlined, SortAscendingOutlined, ReloadOutlined } from '@ant-design/icons';
import { useBookmarks, useBulkDeleteBookmarks } from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters, resetFilters, setView, clearSelected, setSidebarCollapsed, setImportModalOpen, setAddModalOpen, setPage } from '../../store/uiSlice';
import { logoutThunk } from '../../store/authSlice';
import BookmarkCard from '../../components/BookmarkCard';
import EmptyState from '../../components/EmptyState';
import CategorySidebar from '../../components/CategorySidebar';
import ImportModal from '../../components/ImportModal';
import EditModal from '../../components/EditModal';
import { TOPIC_COLORS, TOPIC_EMOJIS, BROWSER_EMOJIS, BROWSER_COLORS } from '../../utils/helpers';
import type { TopicCategory, BrowserSource, Bookmark } from '../../types';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: '📅 Newest first' },
  { value: 'createdAt-asc', label: '📅 Oldest first' },
  { value: 'title-asc', label: '🔤 Title A→Z' },
  { value: 'title-desc', label: '🔤 Title Z→A' },
  { value: 'visitCount-desc', label: '🔥 Most visited' },
];

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { filters, view, selectedIds, sidebarCollapsed } = useAppSelector((s) => s.ui);

  const { data, isLoading, isFetching, refetch } = useBookmarks(filters);
  const { mutate: bulkDelete, isPending: deleting } = useBulkDeleteBookmarks();

  const bookmarks = data?.bookmarks || [];
  const pagination = data?.pagination;

  const handleSearch = useCallback((value: string) => { dispatch(setFilters({ search: value })); }, [dispatch]);
  const handleSort = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    dispatch(setFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
  };
  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    bulkDelete(selectedIds, { onSuccess: () => dispatch(clearSelected()) });
  };

  const getPageTitle = () => {
    if (filters.isFavorite) return '⭐ Favorites';
    if (filters.isArchived) return '📦 Archive';
    if (filters.search) return `Search: "${filters.search}"`;
    if (filters.browserSource && filters.browserSource !== 'all') return `${BROWSER_EMOJIS[filters.browserSource as BrowserSource]} ${filters.browserSource}`;
    if (filters.topicCategory && filters.topicCategory !== 'all') {
      const emoji = TOPIC_EMOJIS[filters.topicCategory as TopicCategory];
      const color = TOPIC_COLORS[filters.topicCategory as TopicCategory];
      return <span style={{ color }}>{emoji} {filters.topicCategory}</span>;
    }
    return '🔗 All Bookmarks';
  };

  const sortValue = `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`;
  const isEmpty = !isLoading && bookmarks.length === 0;
  const isFiltered = !!(filters.browserSource !== 'all' || filters.topicCategory !== 'all' || filters.isFavorite);

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CategorySidebar />

      {sidebarCollapsed && (
        <div style={{ position: 'fixed', top: 20, left: 16, zIndex: 100, background: 'var(--surface)', borderRadius: 10, border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <Tooltip title="Expand sidebar" placement="right">
            <div onClick={() => dispatch(setSidebarCollapsed(false))} style={{ padding: '10px 12px', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <MenuUnfoldOutlined />
            </div>
          </Tooltip>
        </div>
      )}

      <Layout style={{ background: 'var(--bg)' }}>
        <Header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ flex: 1, maxWidth: 480 }}>
            <Input prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Search bookmarks…" allowClear value={filters.search} onChange={(e) => handleSearch(e.target.value)} style={{ borderRadius: 'var(--radius-input)', borderColor: 'var(--border)' }} />
          </div>
          <div style={{ flex: 1 }} />
          <Space size={8}>
            {isFetching && !isLoading && <Spin size="small" />}
            <Tooltip title="Refresh">
              <Button icon={<ReloadOutlined />} onClick={() => refetch()} style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }} />
            </Tooltip>
            <Button icon={<span>📥</span>} onClick={() => dispatch(setImportModalOpen(true))} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', fontWeight: 500 }}>Import</Button>
            <Button type="primary" icon={<span>+</span>} onClick={() => dispatch(setAddModalOpen(true))} style={{ background: 'var(--primary)', border: 'none', fontWeight: 600 }}>Add</Button>
            <Dropdown trigger={['click']} placement="bottomRight" menu={{ items: [
              { key: 'user', label: <div style={{ padding: '4px 0' }}><div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div></div>, disabled: true },
              { type: 'divider' },
              { key: 'logout', label: 'Sign out', icon: <LogoutOutlined />, danger: true, onClick: () => dispatch(logoutThunk()) },
            ]}}>
              <Avatar size={32} style={{ background: 'var(--primary)', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: '24px', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <Title level={4} style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700, fontSize: 20 }}>{getPageTitle()}</Title>
              <Text style={{ fontSize: 13, color: 'var(--text-muted)' }}>{isLoading ? 'Loading…' : `${pagination?.total ?? 0} bookmark${(pagination?.total ?? 0) !== 1 ? 's' : ''}`}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {selectedIds.length > 0 && (
                <Space>
                  <Tag color="purple" style={{ padding: '2px 10px', borderRadius: 'var(--radius-pill)' }}>{selectedIds.length} selected</Tag>
                  <Button danger size="small" icon={<DeleteOutlined />} loading={deleting} onClick={handleBulkDelete}>Delete</Button>
                  <Button size="small" onClick={() => dispatch(clearSelected())}>Clear</Button>
                </Space>
              )}
              <Select value={sortValue} onChange={handleSort} options={SORT_OPTIONS} size="small" style={{ width: 160 }} suffixIcon={<SortAscendingOutlined />} />
              <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <Tooltip title="Grid view">
                  <div onClick={() => dispatch(setView('grid'))} style={{ padding: '6px 10px', cursor: 'pointer', background: view === 'grid' ? 'var(--primary-soft)' : 'transparent', color: view === 'grid' ? 'var(--primary)' : 'var(--text-muted)', transition: 'var(--transition)' }}><AppstoreOutlined /></div>
                </Tooltip>
                <Tooltip title="List view">
                  <div onClick={() => dispatch(setView('list'))} style={{ padding: '6px 10px', cursor: 'pointer', background: view === 'list' ? 'var(--primary-soft)' : 'transparent', color: view === 'list' ? 'var(--primary)' : 'var(--text-muted)', transition: 'var(--transition)' }}><UnorderedListOutlined /></div>
                </Tooltip>
              </div>
            </div>
          </div>

          {(filters.browserSource !== 'all' || filters.topicCategory !== 'all' || filters.search) && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>Filters:</Text>
              {filters.browserSource && filters.browserSource !== 'all' && (
                <Tag closable onClose={() => dispatch(setFilters({ browserSource: 'all' }))} style={{ background: 'var(--bg)', borderRadius: 'var(--radius-pill)', color: BROWSER_COLORS[filters.browserSource as BrowserSource] }}>
                  {BROWSER_EMOJIS[filters.browserSource as BrowserSource]} {filters.browserSource}
                </Tag>
              )}
              {filters.topicCategory && filters.topicCategory !== 'all' && (
                <Tag closable onClose={() => dispatch(setFilters({ topicCategory: 'all' }))} style={{ background: 'var(--bg)', borderRadius: 'var(--radius-pill)', color: TOPIC_COLORS[filters.topicCategory as TopicCategory] }}>
                  {TOPIC_EMOJIS[filters.topicCategory as TopicCategory]} {filters.topicCategory}
                </Tag>
              )}
              {filters.search && (
                <Tag closable onClose={() => dispatch(setFilters({ search: '' }))} style={{ background: 'var(--bg)', borderRadius: 'var(--radius-pill)' }}>
                  🔍 "{filters.search}"
                </Tag>
              )}
              <Button type="link" size="small" onClick={() => dispatch(resetFilters())} style={{ color: 'var(--text-muted)', padding: 0 }}>Clear all</Button>
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: 12 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} style={{ height: view === 'grid' ? 160 : 60, background: 'var(--surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease infinite' }} />
              ))}
            </div>
          ) : isEmpty ? (
            <EmptyState isFiltered={isFiltered} isSearching={!!filters.search} />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: view === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: view === 'grid' ? 14 : 8 }}>
                {bookmarks.map((bookmark: Bookmark) => (
                  <BookmarkCard key={bookmark._id} bookmark={bookmark} view={view} selected={selectedIds.includes(bookmark._id)} />
                ))}
              </div>
              {pagination && pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                  <Pagination current={pagination.page} total={pagination.total} pageSize={pagination.limit} onChange={(page) => dispatch(setPage(page))} showSizeChanger={false} showTotal={(total) => `${total} bookmarks`} />
                </div>
              )}
            </>
          )}
        </Content>
      </Layout>

      <ImportModal />
      <EditModal />
    </Layout>
  );
};

export default Dashboard;
