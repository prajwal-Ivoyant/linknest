import React from 'react';
import { Layout, Typography, Skeleton, Divider, Tooltip, Image } from 'antd';
import { AppstoreOutlined, StarOutlined, InboxOutlined, MenuFoldOutlined, PlusOutlined } from '@ant-design/icons';
import { useBookmarkStats } from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setFilters, setSidebarCollapsed, setImportModalOpen, setAddModalOpen,
} from '../../store/uiSlice';
import { BROWSER_COLORS, BROWSER_EMOJIS, TOPIC_COLORS, TOPIC_EMOJIS } from '../../utils/helpers';
import type { BrowserSource, TopicCategory } from '../../types';
import { BROWSER_SOURCES, TOPIC_CATEGORIES } from '../../types';
import logo from "../../../public/logo.png"

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  color?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, count, active, onClick, color }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '7px 10px', marginBottom: 2, borderRadius: 'var(--radius-input)',
      cursor: 'pointer', userSelect: 'none',
      background: active ? 'var(--primary-soft)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      transition: 'var(--transition)',
    }}
    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#f5f4f0'; }}
    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
  >
    <span style={{ fontSize: 15, color: active ? 'var(--primary)' : color || 'var(--text-muted)', lineHeight: 1 }}>{icon}</span>
    <Text style={{ flex: 1, fontSize: 13, fontWeight: active ? 600 : 400, color: 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label}
    </Text>
    {count !== undefined && count > 0 && (
      <span style={{ fontSize: 11, fontWeight: 600, color: active ? 'var(--primary)' : 'var(--text-muted)', background: active ? 'rgba(108,71,255,0.15)' : 'var(--bg)', borderRadius: 10, padding: '1px 7px', minWidth: 22, textAlign: 'center' }}>
        {count > 999 ? '999+' : count}
      </span>
    )}
  </div>
);

const CategorySidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filters, sidebarCollapsed } = useAppSelector((s) => s.ui);
  const { data: stats, isLoading } = useBookmarkStats();

  const browserCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};
  stats?.byBrowser?.forEach((b: { name: string; count: number }) => { browserCounts[b.name] = b.count; });
  stats?.byTopic?.forEach((t: { name: string; count: number }) => { topicCounts[t.name] = t.count; });

  const isAllActive = filters.browserSource === 'all' && filters.topicCategory === 'all' && !filters.isFavorite && !filters.isArchived;

  return (
    <Sider collapsed={sidebarCollapsed} collapsedWidth={0} width={220}
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', overflow: 'hidden', height: '100vh', position: 'sticky', top: 0, transition: 'all 0.25s ease' }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Image
            src={logo}
            alt="LinkNest"
            preview={false}
            width={32}
            height={32}
            style={{
              objectFit: "contain",
              borderRadius: 6,
            }}
          />
          <Text style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
            Link
            <span style={{ color: "#5a35e8" }}>Nest</span>
          </Text>
        </div>
        <Tooltip title="Collapse sidebar">
          <div onClick={() => dispatch(setSidebarCollapsed(true))} style={{ cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6, lineHeight: 1 }}>
            <MenuFoldOutlined />
          </div>
        </Tooltip>
      </div>

      {/* Add button
      <div style={{ padding: '0 12px 12px' }}>
        <button onClick={() => dispatch(setAddModalOpen(true))}
          style={{ width: '100%', height: 34, borderRadius: 'var(--radius-input)', background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'var(--transition)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#5a35e8')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}>
          <PlusOutlined /> Add Bookmark
        </button>
      </div> */}

      {/* Nav */}
      <div style={{ overflowY: 'auto', height: 'calc(100vh - 140px)', padding: '0 8px 24px' }}>
        <SidebarItem icon={<AppstoreOutlined />} label="All Bookmarks" count={stats?.total} active={isAllActive}
          onClick={() => dispatch(setFilters({ browserSource: 'all', topicCategory: 'all', isFavorite: false, isArchived: false, search: '' }))} />
        <SidebarItem icon={<StarOutlined />} label="Favorites" count={stats?.favorites} active={!!filters.isFavorite}
          onClick={() => dispatch(setFilters({ isFavorite: true, isArchived: false, browserSource: 'all', topicCategory: 'all' }))} />
        <SidebarItem icon={<InboxOutlined />} label="Archive" active={!!filters.isArchived}
          onClick={() => dispatch(setFilters({ isArchived: true, isFavorite: false, browserSource: 'all', topicCategory: 'all' }))} />

        <Divider style={{ margin: '12px 4px', borderColor: 'var(--border)' }} />

        <Text style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 4px', display: 'block', marginBottom: 6 }}>
          Browser Sources
        </Text>
        {isLoading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ padding: '6px 4px' }}><Skeleton.Input size="small" active style={{ width: '100%', height: 28 }} /></div>
        )) : BROWSER_SOURCES.filter((b) => browserCounts[b] > 0).map((browser) => (
          <SidebarItem key={browser} icon={<span>{BROWSER_EMOJIS[browser as BrowserSource]}</span>} label={browser}
            count={browserCounts[browser]} color={BROWSER_COLORS[browser as BrowserSource]}
            active={filters.browserSource === browser && !filters.isFavorite && !filters.isArchived}
            onClick={() => dispatch(setFilters({ browserSource: browser as BrowserSource, topicCategory: 'all', isFavorite: false, isArchived: false }))}
          />
        ))}

        <Divider style={{ margin: '12px 4px', borderColor: 'var(--border)' }} />

        <Text style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 4px', display: 'block', marginBottom: 6 }}>
          Topics
        </Text>
        {isLoading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ padding: '6px 4px' }}><Skeleton.Input size="small" active style={{ width: '100%', height: 28 }} /></div>
        )) : TOPIC_CATEGORIES.filter((t) => topicCounts[t] > 0).map((topic) => (
          <SidebarItem key={topic} icon={<span>{TOPIC_EMOJIS[topic as TopicCategory]}</span>} label={topic}
            count={topicCounts[topic]} color={TOPIC_COLORS[topic as TopicCategory]}
            active={filters.topicCategory === topic && !filters.isFavorite && !filters.isArchived}
            onClick={() => dispatch(setFilters({ topicCategory: topic as TopicCategory, browserSource: 'all', isFavorite: false, isArchived: false }))}
          />
        ))}

        <Divider style={{ margin: '12px 4px', borderColor: 'var(--border)' }} />

        {/* <div onClick={() => dispatch(setImportModalOpen(true))}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--radius-input)', cursor: 'pointer', border: '1.5px dashed var(--border)', color: 'var(--text-muted)', transition: 'var(--transition)', margin: '4px 0' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLDivElement).style.color = 'var(--primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLDivElement).style.color = 'var(--text-muted)'; }}>
          <span style={{ fontSize: 14 }}>📥</span>
          <Text style={{ fontSize: 13, color: 'inherit' }}>Import Bookmarks</Text>
        </div> */}
      </div>
    </Sider>
  );
};

export default CategorySidebar;
