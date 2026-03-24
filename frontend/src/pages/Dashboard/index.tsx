import React, { useCallback } from 'react';
import {
  Layout, Input, Button, Tooltip, Dropdown, Avatar,
  Typography, Space, Flex,Image
} from 'antd';
import {
  SearchOutlined, MenuUnfoldOutlined,
  LogoutOutlined, SunOutlined, MoonOutlined,
} from '@ant-design/icons';
import { useBookmarkStats } from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setFilters, resetFilters,
  setSidebarCollapsed, setImportModalOpen, setAddModalOpen,
  toggleTheme,
} from '../../store/uiSlice';
import { logoutThunk } from '../../store/authSlice';
import KanbanBoard from '../../components/KanbanBoard';
import CategorySidebar from '../../components/CategorySidebar';
import ImportModal from '../../components/ImportModal';
import EditModal from '../../components/EditModal';
import { TOPIC_EMOJIS, BROWSER_EMOJIS } from '../../utils/helpers';
import type { TopicCategory, BrowserSource } from '../../types';
import logo from "../../../public/logo.png"

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { filters, sidebarCollapsed, theme } = useAppSelector((s) => s.ui);
  const isDark = theme === 'dark';

  const { data: stats } = useBookmarkStats();

  const handleSearch = useCallback((value: string) => {
    dispatch(setFilters({ search: value }));
  }, [dispatch]);

  const getPageTitle = () => {
    if (filters.isFavorite) return '⭐ Favorites';
    if (filters.isArchived) return '📦 Archive';
    if (filters.search) return `🔍 "${filters.search}"`;
    if (filters.browserSource && filters.browserSource !== 'all') {
      const bEmoji = BROWSER_EMOJIS[filters.browserSource as BrowserSource];
      if (filters.topicCategory && filters.topicCategory !== 'all') {
        const tEmoji = TOPIC_EMOJIS[filters.topicCategory as TopicCategory];
        return `${bEmoji} ${filters.browserSource}  ›  ${tEmoji} ${filters.topicCategory}`;
      }
      return `${bEmoji} ${filters.browserSource}`;
    }
    if (filters.topicCategory && filters.topicCategory !== 'all') {
      return `${TOPIC_EMOJIS[filters.topicCategory as TopicCategory]} ${filters.topicCategory}`;
    }
    return '🔗 All Bookmarks';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <CategorySidebar />

      {sidebarCollapsed && (
       <Sider
  width={75}
  collapsedWidth={75}
  trigger={null}
  style={{
    background: 'transparent',
    borderRight: '1px solid var(--border)'
  }}
>
  <Flex
    vertical
    align="center"
    gap={12}
    style={{ paddingTop: 16 }}
  >
    <Image
      src={logo}
      preview={false}
      width={35}
      height={35}
      style={{ objectFit: "contain", borderRadius: 6 }}
    />

    <Tooltip title="Expand sidebar" placement="right">
      <Flex
        onClick={() => dispatch(setSidebarCollapsed(false))}
        align="center"
        justify="center"
        style={{
          width: 40,
          height: 40,
          cursor: 'pointer',
          color: 'var(--text-muted)',
          background: 'var(--surface)',
          borderRadius: 10,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)'
        }}
      >
        <MenuUnfoldOutlined />
      </Flex>
    </Tooltip>
  </Flex>
</Sider>
      )}

      <Layout style={{ background: 'var(--bg)' }}>
        {/* ── Header ── */}
        <Header
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '0 24px',
            height: 60,
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <Flex align="center" justify="space-between" style={{ height: '100%' }}>

            {/* LEFT */}
            <Flex style={{ width: 440 }}>
              <Input
                prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
                placeholder="Search bookmarks…"
                allowClear
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Flex>

            {/* RIGHT */}
            <Space size={8}>

              <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
                <Button
                  onClick={() => dispatch(toggleTheme())}
                  icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                  style={{
                    borderColor: 'var(--border)',
                    background: 'transparent',
                    color: isDark ? '#f59e0b' : 'var(--text-muted)',
                  }}
                />
              </Tooltip>

              <Button
                icon={<span>📥</span>}
                onClick={() => dispatch(setImportModalOpen(true))}
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'transparent',
                  fontWeight: 500,
                }}
              >
                AI Import
              </Button>

              <Button
                type="primary"
                onClick={() => dispatch(setAddModalOpen(true))}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                + Add
              </Button>

              <Dropdown
                trigger={['click']}
                placement="bottomRight"
                menu={{
                  items: [
                    {
                      key: 'user',
                      label: (
                        <Space direction="vertical" size={0} style={{ lineHeight: 1.4 }}>
                          <Text strong>{user?.name}</Text>

                          <Text style={{ fontSize: 12, opacity: 0.7 }}>
                            {user?.email}
                          </Text>

                          <Text style={{ fontSize: 11, opacity: 0.6 }}>
                            {stats?.total ?? 0} bookmarks
                          </Text>
                        </Space>
                      ),
                      disabled: true,
                    },
                    { type: 'divider' },
                    {
                      key: 'theme',
                      label: isDark ? '☀️ Light mode' : '🌙 Dark mode',
                      onClick: () => dispatch(toggleTheme()),
                    },
                    { type: 'divider' },
                    {
                      key: 'logout',
                      label: 'Sign out',
                      icon: <LogoutOutlined />,
                      danger: true,
                      onClick: () => dispatch(logoutThunk()),
                    },
                  ],
                }}
              >
                <div>
                  <Avatar
                    size={32}
                    style={{
                      background: 'linear-gradient(135deg, var(--primary), #9b7aff)',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </div>
              </Dropdown>

            </Space>

          </Flex>
        </Header>

        <Content
          style={{
            padding: 24,
            height: 'calc(100vh - 40px)',   // header = 60
            overflow: 'hidden',
          }}>


          {/* Kanban — handles all 3 levels */}
          <KanbanBoard />
        </Content>
      </Layout>

      <ImportModal />
      <EditModal />
    </Layout>
  );
};

export default Dashboard;