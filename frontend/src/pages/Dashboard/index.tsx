import React, { useCallback } from 'react';
import {
  Layout, Input, Button, Tooltip, Dropdown, Avatar,
  Typography, Space,Flex,Image
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
import { clearAuth } from '../../store/authSlice';
import { useLogoutMutation } from '../../store/authapiSlice';
import KanbanBoard from '../../components/KanbanBoard';
import CategorySidebar from '../../components/CategorySidebar';
import ImportModal from '../../components/ImportModal';
import EditModal from '../../components/EditModal';
import { TOPIC_EMOJIS, BROWSER_EMOJIS } from '../../utils/helpers';
import type { TopicCategory, BrowserSource } from '../../types';
import logo from "../../../public/logo.png"

const { Header, Content,Sider } = Layout;
const { Text, Title } = Typography;

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [logout] = useLogoutMutation();
  const { filters, sidebarCollapsed, theme } = useAppSelector((s) => s.ui);
  const isDark = theme === 'dark';

  const { data: stats } = useBookmarkStats();

  const handleSearch = useCallback((value: string) => {
    dispatch(setFilters({ search: value }));
  }, [dispatch]);


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
        <Header style={{
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '0 24px', height: 60,
          display: 'flex', alignItems: 'center', gap: 16,
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ flex: 1, maxWidth: 440 }}>
            <Input
              prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="Search bookmarks…"
              allowClear
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div style={{ flex: 1 }} />

          <Space size={8}>
            {/* Theme toggle */}
            <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
              <Button
                onClick={() => dispatch(toggleTheme())}
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                style={{
                  borderColor: 'var(--border)', background: 'transparent',
                  color: isDark ? '#f59e0b' : 'var(--text-muted)',
                }}
              />
            </Tooltip>

            <Button
              icon={<span>📥</span>}
              onClick={() => dispatch(setImportModalOpen(true))}
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'transparent', fontWeight: 500 }}
            >
              AI Import
            </Button>

            {/* User avatar */}
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              menu={{
                items: [
                  {
                    key: 'user',
                    label: (
                      <div style={{ padding: '4px 0' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {stats?.total ?? 0} bookmarks
                        </div>
                      </div>
                    ),
                    disabled: true,
                  },
                  { type: 'divider' },
                  { key: 'theme', label: isDark ? '☀️ Light mode' : '🌙 Dark mode', onClick: () => dispatch(toggleTheme()) },
                  { type: 'divider' },
                  { key: 'logout', label: 'Sign out', icon: <LogoutOutlined />, danger: true, onClick: async () => { try { const rt = localStorage.getItem('refreshToken'); if (rt) await logout({ refreshToken: rt }); } finally { dispatch(clearAuth()); } } },
                ],
              }}
            >
              <Avatar
                size={32}
                style={{ background: 'linear-gradient(135deg, var(--primary), #9b7aff)', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: '24px', overflow: 'auto' }}>
       
                  

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