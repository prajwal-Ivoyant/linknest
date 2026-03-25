import React from 'react';
import { Layout, Typography, Tooltip, Image, Flex, Button } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSidebarCollapsed } from '../../store/uiSlice';

import SidebarMainNav from './SidebarMainNav';
import SidebarBrowseTopicsList from './SidebarBrowseTopicsList';

import logo from "../../../public/logo.png";

const { Sider, Content } = Layout;
const { Text } = Typography;

const CategorySidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed } = useAppSelector((s) => s.ui);

  return (
    <Sider
      collapsed={sidebarCollapsed}
      collapsedWidth={0}
      width={230}
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',          // ⭐ add
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        transition: 'all 0.25s ease',

      }}
    >
      {/* Header */}
      <Flex align="center" justify="space-between" style={{ padding: '20px 16px 12px' }}>
        <Flex align="center" gap={8}>
          <Image
            src={logo}
            preview={false}
            width={35}
            height={35}
            style={{ objectFit: "contain", borderRadius: 6 }}
          />
          <Text style={{ fontWeight: 700, fontSize: 15 }}>
            Link<span style={{ color: "#5a35e8" }}>Nest</span>
          </Text>
        </Flex>

        <Tooltip title="Collapse sidebar">
          <Button
            type="text"
            icon={<MenuFoldOutlined />}
            onClick={() => dispatch(setSidebarCollapsed(true))}
          />
        </Tooltip>
      </Flex>

      {/* Scroll Area */}
      <Content
        className="Sidebar-scroll"
        style={{
          height: "calc(100vh - 64px)",   // header height
          overflowY: "auto",
          overflowX: "hidden",
          padding:"10px"
        }}
      >
        <SidebarMainNav />
        <SidebarBrowseTopicsList />
      </Content>
    </Sider>
  );
};

export default CategorySidebar;