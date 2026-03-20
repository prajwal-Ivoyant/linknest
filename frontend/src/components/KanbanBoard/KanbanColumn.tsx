import React from 'react';
import { Typography, Button } from 'antd';
import { useDroppable } from '@dnd-kit/core';
import type { Bookmark } from '../../types';
import KanbanCard from './KanbanCard';
import {
  BROWSER_COLORS, BROWSER_EMOJIS,
  TOPIC_COLORS, TOPIC_EMOJIS,
} from '../../utils/helpers';
import type { BrowserSource, TopicCategory } from '../../types';

const { Text } = Typography;

interface Props {
  id: string;
  title: string;
  bookmarks: Bookmark[];
  total: number;
  columnType: 'browser' | 'topic';
  onHeaderClick?: () => void;
  onShowAll?: () => void;
}

const KanbanColumn: React.FC<Props> = ({
  id, title, bookmarks, total, columnType, onHeaderClick, onShowAll,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  const isBrowser = columnType === 'browser';

  const emoji = isBrowser
    ? (BROWSER_EMOJIS[title as BrowserSource] || '📎')
    : (TOPIC_EMOJIS[title as TopicCategory] || '📎');

  const accentColor = isBrowser
    ? (BROWSER_COLORS[title as BrowserSource] || 'var(--text-muted)')
    : (TOPIC_COLORS[title as TopicCategory] || 'var(--text-muted)');

  const isClickable = !!onHeaderClick;

  // Header background — always uses surface so it respects dark/light theme.
  // We add a colored left-border accent + very subtle tinted overlay instead of
  // hardcoded pastel backgrounds that only look right in light mode.
  const headerBg = isOver
    ? 'var(--primary-soft)'
    : 'var(--surface)';

  const headerBorderLeft = isOver
    ? `3px solid var(--primary)`
    : `3px solid ${accentColor}`;

  return (
    <div style={{
      width: 280, minWidth: 280, maxWidth: 280,
      display: 'flex', flexDirection: 'column',
      maxHeight: 'calc(100vh - 140px)',
      flexShrink: 0,
    }}>
      {/* ── Column header ── */}
      <div
        onClick={onHeaderClick}
        title={isClickable
          ? (isBrowser ? `View topics inside ${title}` : `View bookmarks in ${title}`)
          : undefined
        }
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 12px',
          borderRadius: 'var(--radius-card)',
          marginBottom: 5,
          marginTop: 5,
          background: headerBg,
          border: `1px solid ${isOver ? 'rgba(124,92,255,0.35)' : 'var(--border)'}`,
          borderLeft: headerBorderLeft,
          cursor: isClickable ? 'pointer' : 'default',
          transition: 'all 0.18s ease',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => {
          if (!isClickable) return;
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = accentColor;
          el.style.borderLeft = `3px solid ${accentColor}`;
          el.style.background = 'var(--bg-subtle)';
          el.style.transform = 'translateY(-1px)';
          el.style.boxShadow = `0 4px 12px ${accentColor}33`;
        }}
        onMouseLeave={(e) => {
          if (!isClickable) return;
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = isOver ? 'rgba(124,92,255,0.35)' : 'var(--border)';
          el.style.borderLeft = headerBorderLeft;
          el.style.background = headerBg;
          el.style.transform = 'none';
          el.style.boxShadow = 'none';
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>

        <Text style={{
          flex: 1, fontSize: 13, fontWeight: 700,
          color: accentColor,
        }}>
          {title}
        </Text>

        {/* Count badge */}
        <span style={{
          fontSize: 11, fontWeight: 700,
          padding: '2px 8px', borderRadius: 10,
          background: isOver ? 'rgba(124,92,255,0.2)' : 'var(--bg)',
          color: isOver ? 'var(--primary)' : 'var(--text-muted)',
          border: '1px solid var(--border)',
        }}>
          {total}
        </span>

        {isClickable && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>›</span>
        )}
      </div>

      {/* ── Droppable card area ── */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '4px 2px',
          borderRadius: 'var(--radius-card)',
          background: isOver ? 'rgba(124,92,255,0.04)' : 'transparent',
          border: `2px dashed ${isOver ? 'rgba(124,92,255,0.3)' : 'transparent'}`,
          transition: 'all 0.15s ease',
          minHeight: 80,
        }}
      >
        {bookmarks.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 80, color: 'var(--text-muted)', fontSize: 12,
            border: '1px dashed var(--border)', borderRadius: 8,
          }}>
            Drop here
          </div>
        ) : (
          bookmarks.map((bm) => (
            <KanbanCard
              key={bm._id}
              bookmark={bm}
              showTopic={isBrowser}
              showBrowser={!isBrowser}
            />
          ))
        )}

        {total > bookmarks.length && (
          <Button
            type="link" size="small" block
            onClick={onShowAll}
            style={{ color: 'var(--primary)', fontSize: 12, marginTop: 4 }}
          >
            + {total - bookmarks.length} more — show all
          </Button>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;