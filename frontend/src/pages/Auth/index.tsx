import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Typography, message, Image, Flex } from 'antd';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginThunk, registerThunk, clearError } from '../../store/authSlice';
import logo from "../../../public/logo.png"

const { Title, Text } = Typography;

const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  React.useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (isAuthenticated) return <Navigate to="/app" replace />;

  const handleLogin = (values: { email: string; password: string }) => {
    dispatch(loginThunk(values));
  };

  const handleRegister = (values: { name: string; email: string; password: string }) => {
    dispatch(registerThunk(values));
  };

  return (
    <Flex
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Background blobs */}
      <div style={{ position: 'fixed', top: -120, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,71,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -80, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,71,255,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Flex
        vertical
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--surface)',
          borderRadius: 16,
          padding: '40px 36px',
          boxShadow: '0 8px 40px rgba(108,71,255,0.12)',
          border: '1px solid var(--border)',
          animation: 'fadeIn 0.4s ease',
        }}
      >
        {/* Logo + Title */}
        <Flex align="center" style={{ marginBottom: 24 }}>
          <Image
            src={logo}
            alt="LinkNest"
            preview={false}
            width={72}
            style={{ objectFit: 'contain', borderRadius: 6 }}
          />
          <Flex vertical style={{ marginLeft: 12 }}>
            <Title level={3} style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.2 }}>
              Link<span style={{ color: '#6c47ff' }}>Nest</span>
            </Title>
            <Text style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              Your AI-powered bookmark manager
            </Text>
          </Flex>
        </Flex>

        <Tabs
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as 'login' | 'register')}
          centered
          items={[
            { key: 'login', label: 'Sign In' },
            { key: 'register', label: 'Create Account' },
          ]}
          style={{ marginBottom: 8 }}
        />

        {activeTab === 'login' ? (
          <Form layout="vertical" onFinish={handleLogin} size="large" requiredMark={false}>
            <Form.Item
              name="email"
              label={<Text style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Email</Text>}
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Password</Text>}
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password placeholder="••••••••" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{
                height: 44, borderRadius: 'var(--radius-input)', fontWeight: 600,
                background: 'linear-gradient(135deg, #6c47ff 0%, #8b6aff 100%)',
                border: 'none', marginTop: 8,
              }}
            >
              Sign In
            </Button>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={handleRegister} size="large" requiredMark={false}>
            <Form.Item
              name="name"
              label={<Text style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Full Name</Text>}
              rules={[{ required: true, min: 2, message: 'Enter your name' }]}
            >
              <Input placeholder="Jane Smith" />
            </Form.Item>

            <Form.Item
              name="email"
              label={<Text style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Email</Text>}
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<Text style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>Password</Text>}
              rules={[{ required: true, min: 6, message: 'Min. 6 characters' }]}
            >
              <Input.Password placeholder="Min. 6 characters" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{
                height: 44, borderRadius: 'var(--radius-input)', fontWeight: 600,
                background: 'linear-gradient(135deg, #6c47ff 0%, #8b6aff 100%)',
                border: 'none', marginTop: 8,
              }}
            >
              Create Account
            </Button>
          </Form>
        )}
      </Flex>
    </Flex>
  );
};

export default AuthPage;