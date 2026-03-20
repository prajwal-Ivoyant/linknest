import React from 'react';
import { Layout, Typography, Badge, Button } from 'antd';

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
  <Button
    type="text"
    block
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 10,
      height: 32,
      padding: '0 10px',
      borderRadius: 'var(--radius-input)',
      background: active ? 'var(--primary-soft)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-secondary)',
      transition: 'var(--transition)',
    }}
  >
    <span style={{ fontSize: 15, color: active ? 'var(--primary)' : color || 'var(--text-muted)' }}>
      {icon}
    </span>

    <Text
      style={{
        flex: 1,
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        color: 'inherit',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </Text>

    {count !== undefined && count > 0 && (
      <Badge
        count={count > 999 ? '999+' : count}
        style={{
          background: active ? 'rgba(124,92,255,0.15)' : 'var(--bg)',
          color: active ? 'var(--primary)' : 'var(--text-muted)',
          boxShadow: 'none'
        }}
      />
    )}
  </Button>
);

export default SidebarItem