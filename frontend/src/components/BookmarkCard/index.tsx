import React, { useState } from 'react';
import { Tag, Tooltip, Checkbox, Dropdown } from 'antd';
import { StarOutlined, StarFilled, EditOutlined, DeleteOutlined, MoreOutlined, ExportOutlined, InboxOutlined } from '@ant-design/icons';
import type { Bookmark } from '../../types';
import { useUpdateBookmark, useDeleteBookmark } from '../../hooks/useBookmarks';
import { useAppDispatch } from '../../store/hooks';
import { toggleSelected, setEditBookmarkId } from '../../store/uiSlice';
import { TOPIC_COLORS, TOPIC_BG_COLORS, TOPIC_EMOJIS, BROWSER_COLORS, BROWSER_EMOJIS, getFaviconUrl, getDomain, formatDate } from '../../utils/helpers';
import type { TopicCategory, BrowserSource } from '../../types';

interface Props { bookmark: Bookmark; view: 'grid' | 'list'; selected: boolean; }

const BookmarkCard: React.FC<Props> = ({ bookmark, view, selected }) => {
  const dispatch = useAppDispatch();
  const { mutate: update } = useUpdateBookmark();
  const { mutate: deleteBm } = useDeleteBookmark();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    update({ id: bookmark._id, data: { isFavorite: !bookmark.isFavorite } });
  };
  const handleOpen = () => window.open(bookmark.url, '_blank', 'noopener,noreferrer');

  const topicColor = TOPIC_COLORS[bookmark.topicCategory as TopicCategory] || '#9491a8';
  const topicBg = TOPIC_BG_COLORS[bookmark.topicCategory as TopicCategory] || '#f5f4f0';
  const topicEmoji = TOPIC_EMOJIS[bookmark.topicCategory as TopicCategory] || '📎';
  const browserColor = BROWSER_COLORS[bookmark.browserSource as BrowserSource] || '#9491a8';
  const browserEmoji = BROWSER_EMOJIS[bookmark.browserSource as BrowserSource] || '📎';
  const favicon = !imgError && (bookmark.favicon || getFaviconUrl(bookmark.url, 32));
  const domain = getDomain(bookmark.url);

  const menuItems = [
    { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => dispatch(setEditBookmarkId(bookmark._id)) },
    { key: 'open', label: 'Open link', icon: <ExportOutlined />, onClick: handleOpen },
    { key: 'archive', icon: <InboxOutlined />, label: bookmark.isArchived ? 'Unarchive' : 'Archive', onClick: () => update({ id: bookmark._id, data: { isArchived: !bookmark.isArchived } }) },
    { type: 'divider' as const },
    { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => deleteBm(bookmark._id) },
  ];

  if (view === 'list') {
    return (
      <div className="bookmark-grid-item" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: selected ? 'rgba(108,71,255,0.04)' : 'var(--surface)', borderRadius: 'var(--radius-card)', border: `1px solid ${selected ? 'rgba(108,71,255,0.2)' : 'var(--border)'}`, cursor: 'pointer', transition: 'var(--transition)', boxShadow: hovered ? 'var(--shadow)' : 'none' }}>
        <Checkbox checked={selected} onChange={() => dispatch(toggleSelected(bookmark._id))} onClick={(e) => e.stopPropagation()} style={{ opacity: hovered || selected ? 1 : 0, transition: 'opacity 0.15s ease' }} />
        <div style={{ width: 32, height: 32, borderRadius: 8, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
          {favicon ? <img src={favicon} width={20} height={20} onError={() => setImgError(true)} alt="" style={{ objectFit: 'contain' }} /> : <span style={{ fontSize: 14 }}>🌐</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }} onClick={handleOpen}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 2 }}>{bookmark.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{domain}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <Tooltip title={`Browser: ${bookmark.browserSource}`}><span style={{ fontSize: 14 }}>{browserEmoji}</span></Tooltip>
          <Tag style={{ background: topicBg, color: topicColor, margin: 0, fontSize: 11, padding: '0 8px' }}>{topicEmoji} {bookmark.topicCategory}</Tag>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', width: 64, textAlign: 'right', flexShrink: 0 }}>{formatDate(bookmark.createdAt)}</div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0, opacity: hovered ? 1 : 0, transition: 'opacity 0.15s ease' }}>
          <div onClick={handleFavorite} style={{ padding: 6, borderRadius: 6, cursor: 'pointer', color: bookmark.isFavorite ? '#f59e0b' : 'var(--text-muted)' }}>
            {bookmark.isFavorite ? <StarFilled /> : <StarOutlined />}
          </div>
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <div onClick={(e) => e.stopPropagation()} style={{ padding: 6, borderRadius: 6, cursor: 'pointer', color: 'var(--text-muted)' }}><MoreOutlined /></div>
          </Dropdown>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmark-grid-item" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', background: selected ? 'rgba(108,71,255,0.03)' : 'var(--surface)', borderRadius: 'var(--radius-card)', border: `1px solid ${selected ? 'rgba(108,71,255,0.25)' : hovered ? 'rgba(108,71,255,0.15)' : 'var(--border)'}`, padding: '16px', cursor: 'pointer', transition: 'var(--transition)', boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)', transform: hovered ? 'translateY(-1px)' : 'none', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, opacity: hovered || selected ? 1 : 0, transition: 'opacity 0.15s ease', zIndex: 2 }}>
        <Checkbox checked={selected} onChange={() => dispatch(toggleSelected(bookmark._id))} onClick={(e) => e.stopPropagation()} />
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4, opacity: hovered || bookmark.isFavorite ? 1 : 0, transition: 'opacity 0.15s ease', zIndex: 2 }}>
        <div onClick={handleFavorite} style={{ padding: 5, borderRadius: 6, cursor: 'pointer', color: bookmark.isFavorite ? '#f59e0b' : 'var(--text-muted)', background: 'rgba(255,255,255,0.9)', lineHeight: 1 }}>
          {bookmark.isFavorite ? <StarFilled style={{ fontSize: 13 }} /> : <StarOutlined style={{ fontSize: 13 }} />}
        </div>
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <div onClick={(e) => e.stopPropagation()} style={{ padding: 5, borderRadius: 6, cursor: 'pointer', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.9)', lineHeight: 1 }}><MoreOutlined style={{ fontSize: 13 }} /></div>
        </Dropdown>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
          {favicon ? <img src={favicon} width={18} height={18} onError={() => setImgError(true)} alt="" style={{ objectFit: 'contain' }} /> : <span style={{ fontSize: 12 }}>🌐</span>}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{domain}</span>
      </div>
      <div onClick={handleOpen} style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45, marginBottom: 4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{bookmark.title}</div>
        {bookmark.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{bookmark.description}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <Tooltip title={bookmark.browserSource}><span style={{ fontSize: 13, color: browserColor }}>{browserEmoji}</span></Tooltip>
          <Tag style={{ background: topicBg, color: topicColor, margin: 0, fontSize: 10, padding: '1px 7px', fontWeight: 600 }}>{topicEmoji} {bookmark.topicCategory}</Tag>
          {bookmark.aiCategorized && <Tooltip title={`AI categorized (${Math.round(bookmark.aiConfidence * 100)}% confidence)`}><span style={{ fontSize: 9, color: 'var(--primary)', fontWeight: 700 }}>AI</span></Tooltip>}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(bookmark.createdAt)}</span>
      </div>
      {bookmark.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: -4 }}>
          {bookmark.tags.slice(0, 3).map((tag) => <Tag key={tag} style={{ background: 'var(--bg)', color: 'var(--text-muted)', margin: 0, fontSize: 10, padding: '0 6px' }}>#{tag}</Tag>)}
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;
