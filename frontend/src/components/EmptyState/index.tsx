import React from 'react';
import { Button, Typography, Image } from 'antd';
import { useAppDispatch } from '../../store/hooks';
import { setImportModalOpen, setAddModalOpen, resetFilters } from '../../store/uiSlice';
import empty from "../../../public/empty.png"

const { Title, Text } = Typography;

interface Props { isFiltered?: boolean; isSearching?: boolean; }

const EmptyState: React.FC<Props> = ({ isFiltered, isSearching }) => {
  const dispatch = useAppDispatch();

  if (isSearching) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>🔍</div>
      <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: 8 }}>No results found</Title>
      <Text style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 24, fontSize: 14 }}>Try a different search term or adjust your filters</Text>
      <Button onClick={() => dispatch(resetFilters())} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Clear filters</Button>
    </div>
  );

  if (isFiltered) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>📂</div>
      <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: 8 }}>No bookmarks here yet</Title>
      <Text style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 24, fontSize: 14 }}>Bookmarks in this category will appear here once added.</Text>
      <Button onClick={() => dispatch(resetFilters())} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', marginRight: 8 }}>View all bookmarks</Button>
      <Button type="primary" onClick={() => dispatch(setAddModalOpen(true))} style={{ background: 'var(--primary)', border: 'none' }}>Add bookmark</Button>
    </div>
  );

  return (
    <div style={{ textAlign: 'center', padding: '8px 24px', maxWidth: 480, margin: '0 auto' }}>
      <div
        style={{
          margin: "0 auto 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={empty}
          preview={false}
          width={200}
          draggable={false}
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: 10, fontWeight: 700 }}>Your nest is empty</Title>
      <Text style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 32, fontSize: 15, lineHeight: 1.6 }}>
        Import your browser bookmarks or add links one by one. AI will automatically organize everything by topic.
      </Text>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button size="large" icon={<span>📥</span>} onClick={() => dispatch(setImportModalOpen(true))} style={{ height: 44, padding: '0 20px', borderRadius: 'var(--radius-input)', border: '1.5px solid var(--border)', fontWeight: 600, color: 'var(--text-primary)' }}>
          Import bookmarks
        </Button>
        <Button type="primary" size="large" icon={<span>✨</span>} onClick={() => dispatch(setAddModalOpen(true))} style={{ height: 44, padding: '0 20px', borderRadius: 'var(--radius-input)', background: 'var(--primary)', border: 'none', fontWeight: 600 }}>
          Add a link
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
        {[{ icon: '🤖', label: 'AI categorization' }, { icon: '🗂️', label: 'Browser grouping' }, { icon: '🔍', label: 'Full-text search' }].map(({ icon, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--surface)', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <Text style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
