import React from 'react';
import { Button, Typography, Image, Flex, Space, Tag } from 'antd';
import { useAppDispatch } from '../../store/hooks';
import { setImportModalOpen, setAddModalOpen, resetFilters } from '../../store/uiSlice';
import empty from "../../../public/empty.png"

const { Title, Text } = Typography;

interface Props { isFiltered?: boolean; isSearching?: boolean; }

const EmptyState: React.FC<Props> = ({ isFiltered, isSearching }) => {
  const dispatch = useAppDispatch();

  if (isSearching) return (
    <Flex vertical align="center" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <Text style={{ fontSize: 48, marginBottom: 16, opacity: 0.6 }}>🔍</Text>

      <Title level={4} style={{ marginBottom: 8 }}>
        No results found
      </Title>

      <Text style={{ display: 'block', marginBottom: 24, fontSize: 14 }}>
        Try a different search term or adjust your filters
      </Text>

      <Button onClick={() => dispatch(resetFilters())}>
        Clear filters
      </Button>
    </Flex>
  );

  if (isFiltered) return (
    <Flex vertical align="center" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <Image
        src={empty}
        preview={false}
        width={200}
        draggable={false}
        style={{ marginBottom: 20 }}
      />

      <Title level={4} style={{ marginBottom: 8 }}>
        No bookmarks here yet
      </Title>

      <Text style={{ display: 'block', marginBottom: 24, fontSize: 14 }}>
        Bookmarks in this category will appear here once added.
      </Text>

      <Space>
        <Button onClick={() => dispatch(resetFilters())}>
          View all bookmarks
        </Button>

      </Space>
    </Flex>
  );

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        padding: '8px 24px',
        maxWidth: 480,
        margin: '0 auto',
        textAlign: 'center',
        minHeight: 'calc(100vh - 160px)'   
      }}
    >

      <Image
        src={empty}
        preview={false}
        width={200}
        draggable={false}
        style={{ marginBottom: 20 }}
      />

      <Title level={3} style={{ marginBottom: 10, fontWeight: 700 }}>
        Your nest is empty
      </Title>

      <Text style={{ display: 'block', marginBottom: 32, fontSize: 15, lineHeight: 1.6 }}>
        Import your browser bookmarks or add links one by one. AI will automatically organize everything by topic.
      </Text>

      <Space size={12}>
        <Button
          size="large"
          icon={<span>📥</span>}
          onClick={() => dispatch(setImportModalOpen(true))}
          style={{
            height: 44,
            padding: '0 20px',
            borderRadius: 'var(--radius-input)',
            border: '1.5px solid var(--border)',
            fontWeight: 600
          }}
        >
          Import AI bookmarks
        </Button>

       
      </Space>

      <Flex gap={16} justify="center" wrap style={{ marginTop: 48 }}>
        {[
          { icon: '🤖', label: 'AI categorization' },
          { icon: '🗂️', label: 'Browser grouping' },
          { icon: '🔍', label: 'Full-text search' }
        ].map(({ icon, label }) => (
          <Tag
            key={label}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              fontWeight: 500
            }}
          >
            {icon} {label}
          </Tag>
        ))}
      </Flex>

    </Flex>
  );
};

export default EmptyState;