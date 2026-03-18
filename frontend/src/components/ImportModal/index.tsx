import React, { useState } from 'react';
import {
  Modal, Tabs, Upload, Button, Input, Select,
  Progress, Typography, Space, Alert, Tag, Spin,
} from 'antd';
import { InboxOutlined, LinkOutlined, CloudUploadOutlined, RobotOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useImportFile, useImportUrl } from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setImportModalOpen } from '../../store/uiSlice';
import { BROWSER_SOURCES } from '../../types';
import type { Bookmark } from '../../types';
import { TOPIC_COLORS, TOPIC_BG_COLORS, TOPIC_EMOJIS } from '../../utils/helpers';
import type { TopicCategory } from '../../types';

const { Dragger } = Upload;
const { Text, Title } = Typography;

const ImportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const importModalOpen = useAppSelector((s) => s.ui.importModalOpen);
  const { mutateAsync: importFile, isPending: fileLoading } = useImportFile();
  const { mutateAsync: importUrl, isPending: urlLoading } = useImportUrl();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [browserSource, setBrowserSource] = useState('Other');
  const [activeTab, setActiveTab] = useState('file');
  // AI result preview after URL import
  const [aiResult, setAiResult] = useState<Partial<Bookmark> | null>(null);

  const handleClose = () => {
    dispatch(setImportModalOpen(false));
    setFileList([]);
    setProgress(0);
    setUrlInput('');
    setTitleInput('');
    setAiResult(null);
  };

  const handleFileImport = async () => {
    if (!fileList.length || !fileList[0].originFileObj) return;
    setProgress(0);
    try {
      await importFile({ file: fileList[0].originFileObj, onProgress: (pct) => setProgress(pct) });
      setFileList([]);
      setProgress(0);
      handleClose();
    } catch { setProgress(0); }
  };

  const handleUrlImport = async () => {
    if (!urlInput.trim()) return;
    setAiResult(null);
    try {
      const res = await importUrl({
        url: urlInput.trim(),
        title: titleInput.trim() || undefined,
        browserSource,
      });
      // Show AI-generated preview before closing
      const bm = res.data?.data?.bookmark as Partial<Bookmark>;
      if (bm) {
        setAiResult(bm);
      } else {
        handleClose();
      }
    } catch { /* handled by hook */ }
  };

  const topicColor = aiResult?.topicCategory
    ? TOPIC_COLORS[aiResult.topicCategory as TopicCategory]
    : 'var(--primary)';
  const topicBg = aiResult?.topicCategory
    ? TOPIC_BG_COLORS[aiResult.topicCategory as TopicCategory]
    : 'var(--primary-soft)';
  const topicEmoji = aiResult?.topicCategory
    ? TOPIC_EMOJIS[aiResult.topicCategory as TopicCategory]
    : '📎';

  return (
    <Modal
      open={importModalOpen}
      onCancel={handleClose}
      footer={null}
      width={520}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            📥
          </div>
          <div>
            <Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>Import Bookmarks</Title>
            <Text style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
              AI generates title · description · tags · topic automatically
            </Text>
          </div>
        </div>
      }
    >
      <div style={{ marginTop: 8 }}>
        <Alert
          message={
            <span>
              <RobotOutlined style={{ marginRight: 6, color: 'var(--primary)' }} />
              AI enrichment: URL import auto-generates <strong>title, description, tags &amp; topic</strong> in one call.
              File import uses fast batch categorization.
            </span>
          }
          type="info"
          style={{ borderRadius: 8, marginBottom: 16, background: 'var(--primary-soft)', border: 'none', fontSize: 12 }}
        />

        <Tabs
          activeKey={activeTab}
          onChange={(k) => { setActiveTab(k); setAiResult(null); }}
          items={[{ key: 'file', label: '📁 Import File' }, { key: 'url', label: '🔗 Add URL' }]}
        />

        {/* ── File Import ── */}
        {activeTab === 'file' && (
          <div style={{ marginTop: 8 }}>
            <Dragger
              accept=".html,.htm,.json,.txt"
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: fl }) => setFileList(fl)}
              style={{ borderColor: 'var(--border)', borderRadius: 10, background: 'var(--bg)' }}
            >
              <p style={{ fontSize: 28, marginBottom: 8 }}>
                <InboxOutlined style={{ color: 'var(--primary)' }} />
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                Drop your bookmark file here
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>HTML or JSON · Max 10MB</p>
            </Dragger>

            {progress > 0 && (
              <Progress
                percent={progress}
                size="small"
                strokeColor={{ '0%': '#6c47ff', '100%': '#9b7aff' }}
                style={{ marginTop: 12 }}
              />
            )}

            <div style={{ marginTop: 14, padding: 12, background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <Text style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                How to export from your browser:
              </Text>
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                {[
                  { b: '🌐 Chrome / Brave / Edge', s: 'Bookmarks → Bookmark Manager → ⋮ → Export bookmarks' },
                  { b: '🦊 Firefox', s: 'Bookmarks → Manage Bookmarks → Import & Backup → Export' },
                  { b: '🧭 Safari', s: 'File → Export Bookmarks…' },
                ].map(({ b, s }) => (
                  <div key={b}>
                    <Text style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{b}</Text>
                    <Text style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>{s}</Text>
                  </div>
                ))}
              </Space>
            </div>

            <Button
              type="primary" block size="large"
              loading={fileLoading}
              disabled={!fileList.length}
              onClick={handleFileImport}
              icon={<CloudUploadOutlined />}
              style={{ marginTop: 14, height: 44, borderRadius: 'var(--radius-input)', fontWeight: 600, background: 'var(--primary)', border: 'none' }}
            >
              {fileLoading ? 'Importing & categorizing with AI…' : 'Import & Auto-Categorize'}
            </Button>
          </div>
        )}

        {/* ── URL Import ── */}
        {activeTab === 'url' && (
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* AI Result Preview */}
            {aiResult && (
              <div style={{
                background: 'var(--primary-soft)', borderRadius: 10,
                border: '1px solid rgba(124,92,255,0.2)', padding: 14,
                animation: 'fadeIn 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <RobotOutlined style={{ color: 'var(--primary)', fontSize: 13 }} />
                  <Text style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                    AI Generated — Bookmark Saved ✓
                  </Text>
                </div>

                {/* Title */}
                <Text style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                  {aiResult.title}
                </Text>

                {/* Description */}
                {aiResult.description && (
                  <Text style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 8, lineHeight: 1.5 }}>
                    {aiResult.description}
                  </Text>
                )}

                {/* Topic + confidence */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Tag style={{ background: topicBg, color: topicColor, margin: 0, fontWeight: 600, fontSize: 11 }}>
                    {topicEmoji} {aiResult.topicCategory}
                  </Tag>
                  {aiResult.aiConfidence !== undefined && (
                    <Text style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {Math.round(aiResult.aiConfidence * 100)}% confidence
                    </Text>
                  )}
                </div>

                {/* Tags */}
                {aiResult.tags && aiResult.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {aiResult.tags.map((tag) => (
                      <Tag key={tag} style={{ background: 'var(--surface)', color: 'var(--text-muted)', margin: 0, fontSize: 10, padding: '1px 7px' }}>
                        #{tag}
                      </Tag>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <Button
                    size="small"
                    onClick={() => { setAiResult(null); setUrlInput(''); setTitleInput(''); }}
                    style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  >
                    Add another
                  </Button>
                  <Button
                    type="primary" size="small"
                    onClick={handleClose}
                    style={{ background: 'var(--primary)', border: 'none' }}
                  >
                    Done
                  </Button>
                </div>
              </div>
            )}

            {/* Input form — hide after AI result shown */}
            {!aiResult && (
              <>
                <div>
                  <Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    URL *
                  </Text>
                  <Input
                    prefix={<LinkOutlined style={{ color: 'var(--text-muted)' }} />}
                    placeholder="https://example.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    size="large"
                    onPressEnter={handleUrlImport}
                  />
                </div>

                <div>
                  <Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Title
                    <Text style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                      (optional — AI will generate if left empty)
                    </Text>
                  </Text>
                  <Input
                    placeholder="Leave empty for AI to generate…"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    size="large"
                  />
                </div>

                <div>
                  <Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    Browser Source
                  </Text>
                  <Select
                    value={browserSource}
                    onChange={setBrowserSource}
                    size="large"
                    style={{ width: '100%' }}
                    options={BROWSER_SOURCES.map((b) => ({ value: b, label: b }))}
                  />
                </div>

                {/* What AI will generate */}
                <div style={{
                  padding: '10px 14px', background: 'var(--bg)',
                  borderRadius: 8, border: '1px solid var(--border)',
                }}>
                  <Text style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                    AI will generate for you:
                  </Text>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[
                      { label: '📝 Title', desc: 'cleaned up' },
                      { label: '📄 Description', desc: 'max 25 words' },
                      { label: '🏷️ Tags', desc: '3–6 tags' },
                      { label: '📂 Topic', desc: 'auto-classified' },
                    ].map(({ label, desc }) => (
                      <div key={label} style={{
                        padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                        background: 'var(--primary-soft)', display: 'flex', gap: 4, alignItems: 'center',
                      }}>
                        <Text style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>{label}</Text>
                        <Text style={{ fontSize: 10, color: 'var(--text-muted)' }}>{desc}</Text>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="primary" block size="large"
                  loading={urlLoading}
                  disabled={!urlInput.trim()}
                  onClick={handleUrlImport}
                  icon={urlLoading ? <Spin size="small" /> : <RobotOutlined />}
                  style={{
                    height: 44, borderRadius: 'var(--radius-input)',
                    fontWeight: 600, background: 'var(--primary)', border: 'none',
                  }}
                >
                  {urlLoading ? 'AI is analyzing…' : '✨ Import & Auto-Enrich with AI'}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportModal;