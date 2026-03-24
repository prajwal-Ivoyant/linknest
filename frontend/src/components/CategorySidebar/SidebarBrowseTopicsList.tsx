import React from 'react';
import { Typography, Skeleton, Divider } from 'antd';
import { useBookmarkStats } from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilters } from '../../store/uiSlice';
import SidebarItem from './SidebarItem';
import { BROWSER_COLORS, BROWSER_EMOJIS, TOPIC_COLORS, TOPIC_EMOJIS } from '../../utils/helpers';
import type { BrowserSource, TopicCategory } from '../../types';
import { BROWSER_SOURCES, TOPIC_CATEGORIES } from '../../types';

const { Text } = Typography;

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text
    style={{
      display: 'block',
      fontSize: 10,
      fontWeight: 700,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      padding: '6px 10px 4px',
    }}
  >
    {children}
  </Text>
);

function SidebarBrowseTopicsList() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((s) => s.ui);
  const { data: stats, isLoading } = useBookmarkStats();

  const browserCounts: Record<string, number> = {};
  const topicCounts: Record<string, number> = {};

  stats?.byBrowser?.forEach((b: { name: string; count: number }) => {
    browserCounts[b.name] = b.count;
  });
  stats?.byTopic?.forEach((t: { name: string; count: number }) => {
    topicCounts[t.name] = t.count;
  });

  return (
    // Outer wrapper: flex column, fills height passed down from CategorySidebar
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* BROWSER SOURCES — fixed, never scrolls */}
      <div style={{ flexShrink: 0 }}>
        <SectionLabel>Browser Sources</SectionLabel>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton.Input key={i} active size="small" block style={{ marginBottom: 6 }} />
          ))
          : BROWSER_SOURCES
            .filter((b) => browserCounts[b] > 0)
            .map((browser) => (
              <SidebarItem
                key={browser}
                icon={<span>{BROWSER_EMOJIS[browser as BrowserSource]}</span>}
                label={browser}
                count={browserCounts[browser]}
                color={BROWSER_COLORS[browser as BrowserSource]}
                active={
                  filters.browserSource === browser &&
                  filters.topicCategory === 'all' &&
                  !filters.isFavorite &&
                  !filters.isArchived
                }
                onClick={() =>
                  dispatch(setFilters({
                    browserSource: browser as BrowserSource,
                    topicCategory: 'all',
                    isFavorite: false,
                    isArchived: false,
                  }))
                }
              />
            ))
        }
      </div>

      <Divider style={{ flexShrink: 0, margin: '10px 0' }} />

      {/* TOPICS LABEL — fixed */}
      <div style={{ flexShrink: 0 }}>
        <SectionLabel>Topics</SectionLabel>
      </div>

      {/* TOPICS LIST — only this scrolls */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: 16,
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--border) transparent',
        }}
      >
        <style>{`
          .topics-scroll::-webkit-scrollbar { width: 4px; }
          .topics-scroll::-webkit-scrollbar-track { background: transparent; }
          .topics-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
          .topics-scroll:hover::-webkit-scrollbar-thumb { background: var(--text-muted); }
        `}</style>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.Input key={i} active size="small" block style={{ marginBottom: 6 }} />
          ))
          : TOPIC_CATEGORIES
            .filter((t) => topicCounts[t] > 0)
            .map((topic) => (
              <SidebarItem
                key={topic}
                icon={<span>{TOPIC_EMOJIS[topic as TopicCategory]}</span>}
                label={topic}
                count={topicCounts[topic]}
                color={TOPIC_COLORS[topic as TopicCategory]}
                active={
                  filters.topicCategory === topic &&
                  !filters.isFavorite &&
                  !filters.isArchived
                }
                onClick={() =>
                  dispatch(setFilters({
                    topicCategory: topic as TopicCategory,
                    browserSource: filters.browserSource,
                    isFavorite: false,
                    isArchived: false,
                  }))
                }
              />
            ))
        }
      </div>
    </div>
  );
}

export default SidebarBrowseTopicsList;