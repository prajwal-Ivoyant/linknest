import React, { useEffect, useRef, useState } from 'react';
import {
    Layout, Button, Typography, Row, Col, Card, Space, Tag,
    Divider, Avatar, Statistic, Tooltip, Badge, Steps, Grid,
    FloatButton,
} from 'antd';
import {
    RocketOutlined, ThunderboltOutlined, ExperimentOutlined,
    CloudUploadOutlined, SearchOutlined, StarOutlined,
    SafetyCertificateOutlined, TeamOutlined,
    ArrowRightOutlined, CheckCircleFilled, GithubOutlined,
    LinkedinOutlined, MoonOutlined, SunOutlined,
    DownloadOutlined, GlobalOutlined,
    ApiOutlined, DatabaseOutlined, CloudSyncOutlined,
    ProjectOutlined, LayoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleTheme } from '../../store/uiSlice';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// ─── Reusable Feature Card ────────────────────────────────────────────────────

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    desc: string;
    color: string;
    tag?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc, color, tag }) => (
    <Card
        hoverable
        style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            height: '100%',
            transition: 'all 0.25s ease',
        }}
        styles={{ body: { padding: 28 } }}
    >
        <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${color}18`,
            border: `1.5px solid ${color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color, marginBottom: 18,
        }}>
            {icon}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>{title}</Text>
            {tag && (
                <Tag color="purple" style={{ borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{tag}</Tag>
            )}
        </div>
        <Text style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{desc}</Text>
    </Card>
);

// ─── Browser Badge ────────────────────────────────────────────────────────────

const BrowserBadge: React.FC<{ emoji: string; name: string; color: string }> = ({ emoji, name, color }) => (
    <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 20,
        background: 'var(--surface)', border: '1px solid var(--border)',
        fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)',
    }}>
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <span style={{ color }}>{name}</span>
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => (
    <div style={{
        padding: '24px 28px', borderRadius: 14,
        background: 'var(--surface)', border: '1px solid var(--border)',
        textAlign: 'center',
    }}>
        <div style={{ fontSize: 36, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
        <Text style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</Text>
    </div>
);

// ─── Main Landing Page ────────────────────────────────────────────────────────

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector((s) => s.ui);
    const isDark = theme === 'dark';
    const screens = useBreakpoint();
    const isMobile = !screens.md;

  
    const features: FeatureCardProps[] = [
        {
            icon: <ExperimentOutlined />,
            title: 'AI Auto-Categorization',
            desc: 'Groq AI reads your bookmarks and instantly classifies them into 15 topics — AI, Development, Design, Finance, and more.',
            color: '#7c5cff',
            tag: 'GPT-4o-mini',
        },
        {
            icon: <CloudUploadOutlined />,
            title: 'One-Click Import',
            desc: 'Upload your browser export file (HTML or JSON) from Chrome, Firefox, Edge, Brave, or Safari. We handle the rest.',
            color: '#0891b2',
        },
        {
            icon: <ProjectOutlined />,
            title: 'Kanban Board',
            desc: 'Visualize all your bookmarks in a drag-and-drop Kanban board. Reorganize by dragging cards between browser or topic columns.',
            color: '#059669',
        },
        {
            icon: <SearchOutlined />,
            title: 'Full-Text Search',
            desc: 'Instantly search across thousands of bookmarks by title, URL, tags, or description. Find anything in milliseconds.',
            color: '#d97706',
        },
        {
            icon: <LayoutOutlined />,
            title: 'Two-Level Hierarchy',
            desc: 'Browse by Browser Source first, then drill down into AI-generated topics. Every bookmark has its place.',
            color: '#dc2626',
        },
        {
            icon: <SafetyCertificateOutlined />,
            title: 'JWT Authentication',
            desc: 'Secure access and refresh token rotation keeps your data private. Your bookmarks, your account, your control.',
            color: '#7c3aed',
        },
    ];

    const steps = [
        {
            title: 'Sign up',
            description: 'Create your free account in seconds.',
            icon: <CheckCircleFilled style={{ color: '#7c5cff' }} />,
        },
        {
            title: 'Import',
            description: 'Upload your browser bookmark export file.',
            icon: <CheckCircleFilled style={{ color: '#7c5cff' }} />,
        },
        {
            title: 'AI sorts it',
            description: 'Groq AI categorizes every bookmark automatically.',
            icon: <CheckCircleFilled style={{ color: '#7c5cff' }} />,
        },
        {
            title: 'Explore',
            description: 'Browse, search, and rediscover your links.',
            icon: <CheckCircleFilled style={{ color: '#7c5cff' }} />,
        },
    ];

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', background: 'var(--bg)' }}>

            {/* ── Navbar ── */}
            <Header style={{
                background: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                padding: '0 32px',
                height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
                backdropFilter: 'blur(12px)',
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/logo.png" alt="LinkNest" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                    <Text strong style={{ fontSize: 18, color: 'var(--text-primary)' }}>
                        Link<span style={{ color: 'var(--primary)' }}>Nest</span>
                    </Text>
                </div>

                {/* Nav links */}
                {!isMobile && (
                    <Space size={32}>
                        {[
                            { label: 'Features', id: 'features' },
                            { label: 'How it works', id: 'howitworks' },
                            { label: 'Tech Stack', id: 'techstack' },
                        ].map((item) => (
                            <Text
                                key={item.label}
                                onClick={() => scrollToSection(item.id)}
                                style={{
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    fontWeight: 500
                                }}
                            >
                                {item.label}
                            </Text>
                        ))}
                    </Space>
                )}


                {/* Right actions */}
                <Space size={12}>
                    <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
                        <Button
                            type="text"
                            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                            onClick={() => dispatch(toggleTheme())}
                            style={{ color: isDark ? '#f59e0b' : 'var(--text-muted)' }}
                        />
                    </Tooltip>
                    <Button onClick={() => navigate('/login')} style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                        Sign in
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => navigate('/login')}
                        style={{ background: 'var(--primary)', border: 'none', fontWeight: 600 }}
                    >
                        Get started free
                    </Button>
                </Space>
            </Header>

            <Content>
                {/* ── Hero Section ── */}
                <div style={{
                    padding: isMobile ? '60px 24px 80px' : '100px 48px 120px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Background glow blobs */}
                    <div style={{
                        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
                        width: 600, height: 400, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Badge */}
                    <div style={{ marginBottom: 24 }}>
                        <Badge
                            count={<span style={{ background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, border: '1px solid rgba(124,92,255,0.2)' }}>
                                ✨ Used Groq AI 
                            </span>}
                        />
                    </div>

                    {/* Logo */}
                    <div style={{ marginBottom: 32 }}>
                        <img
                            src="/logo.png"
                            alt="LinkNest"
                            style={{
                                width: isMobile ? 100 : 140,
                                height: isMobile ? 100 : 140,
                                objectFit: 'contain',
                                filter: isDark ? 'drop-shadow(0 0 32px rgba(124,92,255,0.5))' : 'drop-shadow(0 4px 20px rgba(108,71,255,0.3))',
                                animation: 'float 4s ease-in-out infinite',
                            }}
                        />
                    </div>

                    <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50%       { transform: translateY(-12px); }
            }
          `}</style>

                    {/* Headline */}
                    <Title
                        style={{
                            fontSize: isMobile ? 36 : 64,
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            lineHeight: 1.15,
                            marginBottom: 20,
                            maxWidth: 800,
                            margin: '0 auto 20px',
                        }}
                    >
                        Your bookmarks,{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #7c5cff 0%, #c084fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            organized by AI
                        </span>
                    </Title>

                    <Paragraph style={{
                        fontSize: isMobile ? 16 : 20,
                        color: 'var(--text-secondary)',
                        maxWidth: 560,
                        margin: '0 auto 40px',
                        lineHeight: 1.7,
                    }}>
                        Import from any browser. AI auto-categorizes everything. Explore with a beautiful Kanban board. Never lose a link again.
                    </Paragraph>

                    {/* CTA Buttons */}
                    <Space size={14} wrap style={{ justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<RocketOutlined />}
                            onClick={() => navigate('/login')}
                            style={{
                                height: 52, padding: '0 32px', fontWeight: 700, fontSize: 16,
                                background: 'linear-gradient(135deg, #6c47ff 0%, #9b7aff 100%)',
                                border: 'none', borderRadius: 12,
                                boxShadow: '0 4px 20px rgba(124,92,255,0.4)',
                            }}
                        >
                            Start organizing
                        </Button>

                    </Space>

                    {/* Browser pills */}
                    <div style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                        <Text style={{ color: 'var(--text-muted)', fontSize: 13, alignSelf: 'center' }}>Works with:</Text>
                        {[
                            { emoji: '🌐', name: 'Chrome', color: '#4285F4' },
                            { emoji: '🦊', name: 'Firefox', color: '#FF7139' },
                            { emoji: '🔷', name: 'Edge', color: '#0078D4' },
                            { emoji: '🦁', name: 'Brave', color: '#FB542B' },
                            { emoji: '🧭', name: 'Safari', color: '#006CFF' },
                        ].map((b) => <BrowserBadge key={b.name} {...b} />)}
                    </div>
                </div>

                {/* ── Stats Bar ── */}
                <div style={{
                    background: 'var(--surface)',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                    padding: '40px 48px',
                }}>
                    <Row gutter={[24, 24]} justify="center">
                        {[
                            { value: `∞`, label: 'Bookmarks capacity', color: '#7c5cff' },
                            { value: '15', label: 'AI topic categories', color: '#0891b2' },
                            { value: '5', label: 'Browser sources', color: '#059669' },
                            { value: '< 1s', label: 'AI categorization time', color: '#d97706' },
                        ].map((stat) => (
                            <Col key={stat.label} xs={12} sm={6}>
                                <StatCard {...stat} />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* ── Features Section ── */}
                <div id="features" style={{ padding: isMobile ? '60px 24px' : '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <Tag color="purple" style={{ borderRadius: 20, marginBottom: 16, padding: '4px 16px', fontSize: 12, fontWeight: 700 }}>
                            FEATURES
                        </Tag>
                        <Title level={2} style={{ color: 'var(--text-primary)', fontWeight: 800, marginBottom: 12 }}>
                            Everything you need to manage links
                        </Title>
                        <Text style={{ color: 'var(--text-secondary)', fontSize: 16 }}>
                            Built for developers, researchers, and curious minds who save a lot of links.
                        </Text>
                    </div>

                    <Row gutter={[20, 20]}>
                        {features.map((f) => (
                            <Col key={f.title} xs={24} sm={12} lg={8}>
                                <FeatureCard {...f} />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* ── How It Works ── */}
                <div id="howitworks" style={{
                    background: 'var(--surface)',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                    padding: isMobile ? '60px 24px' : '80px 48px',
                }}>
                    <div style={{ maxWidth: 900, margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <Tag color="green" style={{ borderRadius: 20, marginBottom: 16, padding: '4px 16px', fontSize: 12, fontWeight: 700 }}>
                                HOW IT WORKS
                            </Tag>
                            <Title level={2} style={{ color: 'var(--text-primary)', fontWeight: 800, marginBottom: 12 }}>
                                Up and running in 60 seconds
                            </Title>
                        </div>

                        <Steps
                            direction={isMobile ? 'vertical' : 'horizontal'}
                            current={3}
                            items={steps.map((s) => ({
                                title: <Text strong style={{ color: 'var(--text-primary)' }}>{s.title}</Text>,
                                description: <Text style={{ color: 'var(--text-muted)', fontSize: 13 }}>{s.description}</Text>,
                                icon: s.icon,
                            }))}
                            style={{ '--step-icon-bg': 'var(--primary-soft)' } as React.CSSProperties}
                        />
                    </div>
                </div>

                {/* ── Tech Stack ── */}
                <div id="techstack" style={{ padding: isMobile ? '60px 24px' : '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <Tag color="blue" style={{ borderRadius: 20, marginBottom: 16, padding: '4px 16px', fontSize: 12, fontWeight: 700 }}>
                            TECH STACK
                        </Tag>
                        <Title level={2} style={{ color: 'var(--text-primary)', fontWeight: 800 }}>
                            Built with modern tools
                        </Title>
                    </div>

                    <Row gutter={[16, 16]} justify="center">
                        {[
                            { icon: <ApiOutlined />, label: 'React 18 + TypeScript', color: '#0891b2' },
                            { icon: <ThunderboltOutlined />, label: 'Vite + Ant Design 5', color: '#f59e0b' },
                            { icon: <DatabaseOutlined />, label: 'MongoDB + Mongoose', color: '#059669' },
                            { icon: <CloudSyncOutlined />, label: 'Node.js + Express', color: '#dc2626' },
                            { icon: <ExperimentOutlined />, label: 'Groq AI', color: '#7c5cff' },
                            { icon: <SafetyCertificateOutlined />, label: 'JWT Auth + Redux', color: '#d97706' },
                        ].map((tech) => (
                            <Col key={tech.label} xs={12} sm={8} md={4}>
                                <Card
                                    hoverable
                                    style={{
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 12,
                                        textAlign: 'center',
                                    }}
                                    styles={{ body: { padding: '20px 12px' } }}
                                >
                                    <div style={{ fontSize: 28, color: tech.color, marginBottom: 10 }}>{tech.icon}</div>
                                    <Text style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{tech.label}</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* ── CTA Banner ── */}
                <div style={{
                    margin: isMobile ? '0 16px 60px' : '0 48px 80px',
                    borderRadius: 24,
                    padding: isMobile ? '48px 24px' : '64px 48px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #6c47ff 0%, #9b7aff 50%, #c084fc 100%)',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: -60, right: -60, width: 240, height: 240,
                        borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -40, left: -40, width: 200, height: 200,
                        borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none',
                    }} />

                    <img src="/logo.png" alt="" style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 20, opacity: 0.9 }} />

                    <Title level={2} style={{ color: '#fff', fontWeight: 800, marginBottom: 12 }}>
                        Ready to organize your bookmarks?
                    </Title>
                    <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 36 }}>
                        Import your bookmarks now. AI does the hard work of organizing everything.
                    </Paragraph>
                    <Button
                        size="large"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate('/login')}
                        style={{
                            height: 52, padding: '0 36px', fontWeight: 700, fontSize: 16,
                            background: '#fff', color: '#6c47ff', border: 'none',
                            borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        }}
                    >
                        Get started — it's free
                    </Button>
                </div>
            </Content>

            {/* ── Footer ── */}
            <Footer style={{
                background: 'var(--surface)',
                borderTop: '1px solid var(--border)',
                padding: '40px 48px',
            }}>
                <Row gutter={[24, 32]} justify="space-between" align="middle">
                    <Col xs={24} md={8}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <img src="/logo.png" alt="LinkNest" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                            <Text strong style={{ fontSize: 16, color: 'var(--text-primary)' }}>
                                Link<span style={{ color: 'var(--primary)' }}>Nest</span>
                            </Text>
                        </div>
                        <Text style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7 }}>
                            AI-powered bookmark manager. Save, organize, and rediscover your links effortlessly.
                        </Text>
                    </Col>

                    <Col xs={24} md={8}>
                        <Row gutter={[0, 8]}>

                            {[
                                { label: 'Features', type: 'scroll', id: 'features' },
                                { label: 'Sign in', type: 'route', path: '/login' },
                                { label: 'Register', type: 'route', path: '/login' },
                            ].map((item) => (
                                <Col span={12} key={item.label}>
                                    <Text
                                        key={item.label}
                                        onClick={() => {
                                            if (item.type === 'scroll' && item.id) {
                                                scrollToSection(item.id);
                                            }
                                            if (item.type === 'route' && item.path) {
                                                navigate(item.path);
                                            }
                                        }}
                                        style={{
                                            color: 'var(--text-secondary)',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </Col>
                            ))}


                        </Row>
                    </Col>

                    <Col xs={24} md={8} style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <Space size={12} style={{ marginBottom: 12 }}>
                            <Button
                                type="text"
                                icon={<GithubOutlined />}
                                href="https://github.com/prajwal-Ivoyant"
                                target="_blank"

                                style={{
                                    color: 'var(--text-muted)',
                                    transition: '0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#7c5cff'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            />
                            <Button
                                type="text"
                                icon={<LinkedinOutlined />}
                                href="https://www.linkedin.com/in/prajwal-15969a-/"
                                target="_blank"
                                style={{
                                    color: 'var(--text-muted)',
                                    transition: '0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#7c5cff'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            />
                            <Button
                                type="text"
                                icon={<GlobalOutlined />}
                                href="https://github.com/prajwalp111"
                                target="_blank"
                                style={{
                                    color: 'var(--text-muted)',
                                    transition: '0.2s',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#7c5cff'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            />
                            
                        </Space>
                        <div>
                            <Text style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                                © 2026 LinkNest. Built with ❤️ and{' '}
                                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>AI</span>
                            </Text>
                        </div>
                    </Col>
                </Row>
            </Footer>

            {/* Float button — scroll to top */}
            <FloatButton.BackTop
                style={{ bottom: 72, right: 24 }}
                visibilityHeight={400}
            />
        </Layout>
    );
};

export default LandingPage;