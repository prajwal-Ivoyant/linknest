import React, { useState } from 'react';
import { Tag, Tooltip, Dropdown, Flex, Typography, Button, Space } from 'antd';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  StarOutlined, StarFilled, EditOutlined,
  DeleteOutlined, MoreOutlined, ExportOutlined, InboxOutlined,
} from '@ant-design/icons';
import type { Bookmark } from '../../types';
import { useUpdateBookmark, useDeleteBookmark } from '../../hooks/useBookmarks';
import { useAppDispatch } from '../../store/hooks';
import { setEditBookmarkId } from '../../store/uiSlice';
import {
  TOPIC_COLORS, TOPIC_BG_COLORS, TOPIC_EMOJIS,
  BROWSER_COLORS, BROWSER_EMOJIS,
  getFaviconUrl, getDomain, formatDate,
} from '../../utils/helpers';
import type { TopicCategory, BrowserSource } from '../../types';

const { Text } = Typography;

interface Props {
  bookmark: Bookmark;
  showBrowser?: boolean;
  showTopic?: boolean;
}

const KanbanCard: React.FC<Props> = ({ bookmark, showBrowser = false, showTopic = true }) => {

  const dispatch = useAppDispatch();
  const { mutate: update } = useUpdateBookmark();
  const { mutate: deleteBm } = useDeleteBookmark();
  const [imgError, setImgError] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: bookmark._id,
    data: { bookmark },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    update({ id: bookmark._id, data: { isFavorite: !bookmark.isFavorite } });
  };

  const topicColor = TOPIC_COLORS[bookmark.topicCategory as TopicCategory] || '#9491a8';
  const topicBg = TOPIC_BG_COLORS[bookmark.topicCategory as TopicCategory] || '#f5f4f0';
  const topicEmoji = TOPIC_EMOJIS[bookmark.topicCategory as TopicCategory] || '📎';
  const browserColor = BROWSER_COLORS[bookmark.browserSource as BrowserSource] || '#9491a8';
  const browserEmoji = BROWSER_EMOJIS[bookmark.browserSource as BrowserSource] || '📎';

  const favicon = !imgError && (bookmark.favicon || getFaviconUrl(bookmark.url, 32));
  const domain = getDomain(bookmark.url);

  const menuItems = [
    { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => dispatch(setEditBookmarkId(bookmark._id)) },
    
    {
      key: 'archive',
      label: bookmark.isArchived ? 'Unarchive' : 'Archive',
      icon: <InboxOutlined />,
      onClick: () => update({ id: bookmark._id, data: { isArchived: !bookmark.isArchived } })
    },
    { type: 'divider' as const },
    { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => deleteBm(bookmark._id) },
  ];

  return (
    <Flex
      ref={setNodeRef}
      vertical
      style={{
        ...style,
        background: 'var(--surface)',
        border: `1px solid ${isDragging ? 'rgba(124,92,255,0.4)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-card)',
        padding: '11px 12px',
        marginBottom: 8,
        position: 'relative',
        boxShadow: isDragging ? '0 8px 24px rgba(124,92,255,0.2)' : 'var(--shadow-card)',
        userSelect: 'none',
      }}
      {...listeners}
      {...attributes}
    >

      {/* Favicon + domain row */}
      <Flex align="center" gap={7} style={{ marginBottom: 7 }}>

        <Flex
          align="center"
          justify="center"
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: 'var(--bg)',
            flexShrink: 0
          }}
        >
          {favicon
            ? <img src={typeof favicon === 'string' ? favicon : ''} width={14} height={14} onError={() => setImgError(true)} alt="" />
            : <span style={{ fontSize: 10 }}>🌐</span>
          }
        </Flex>

        <Text
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}
        >
          {domain}
        </Text>

        <Button
          type="text"
          size="small"
          onClick={handleFavorite}
          icon={bookmark.isFavorite ? <StarFilled /> : <StarOutlined />}
          style={{
            color: bookmark.isFavorite ? '#f59e0b' : 'var(--text-muted)'
          }}
        />

        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>

      </Flex>

      {/* Title */}
      <Text
        onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.4,
          marginBottom: 8,
          cursor: 'pointer',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {bookmark.title}<br />
        {/* {bookmark.description} */}
      </Text>

      {/* Footer badges */}
      <Flex justify="space-between" wrap gap={4} align="center">

        <Space size={4} wrap>

          {showTopic && (
            <Tag
              style={{
                background: `${topicColor}22`,   // 10% tint
                border: `1px solid ${topicColor}44`, // subtle border
                color: topicColor,
                fontSize: 9,
                fontWeight: 600,
                margin: 0,
                padding: "1px 6px",
              }}
            >
              {topicEmoji} {bookmark.topicCategory}
            </Tag>
          )}

          {showBrowser && (
            <Tooltip title={bookmark.browserSource}>
              <span style={{ fontSize: 12, color: browserColor }}>{browserEmoji}</span>
            </Tooltip>
          )}

          {bookmark.aiCategorized && (
            <Tooltip title={`AI (${Math.round(bookmark.aiConfidence * 100)}%)`}>
              <Text style={{ fontSize: 8, color: 'var(--primary)', fontWeight: 700 }}>AI</Text>
            </Tooltip>
          )}

        </Space>

        <Text style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {formatDate(bookmark.createdAt)}
        </Text>

      </Flex>

      {/* Tags */}
      {bookmark.tags?.length > 0 && (
        <Space wrap size={3} style={{ marginTop: 6 }}>
          {bookmark.tags.slice(0, 3).map((tag) => (
            <Tag
              key={tag}
              style={{
                fontSize: 9,
                background: 'var(--bg)',
                color: 'var(--text-muted)',
                borderRadius: 10
              }}
            >
              #{tag}
            </Tag>
          ))}
        </Space>
      )}

    </Flex>
  );
};

export default KanbanCard;