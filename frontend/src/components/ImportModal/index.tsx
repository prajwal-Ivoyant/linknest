import React, { useState } from 'react';
import {
  Modal, Tabs, Upload, Button, Input, Select,
  Progress, Typography, Space, Alert, Tag, Spin,
  Flex, Card
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
      const bm = res.data?.data?.bookmark as Partial<Bookmark>;
      if (bm) setAiResult(bm);
      else handleClose();
    } catch { }
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
      centered
      footer={null}
      width={520}
      
      title={
        <Flex align="center" gap={10}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--primary-soft)',
              fontSize: 16
            }}
          >
            📥
          </Flex>

          <div>
            <Title level={5} style={{ margin: 0 }}>
              Import Bookmarks
            </Title>
            <Text style={{ fontSize: 12 }}>
              AI generates title · description · tags · topic automatically
            </Text>
          </div>
        </Flex>
      }
    >
      <Space direction="vertical" style={{ width: '100%', marginTop: 8 }} size={16}>

        <Alert
          type="info"
          message={
            <span>
              <RobotOutlined style={{ marginRight: 6 }} />
              AI enrichment: URL import auto-generates <strong>title, description, tags & topic</strong> in one call.
              File import uses fast batch categorization.
            </span>
          }
        />

        <Tabs
          activeKey={activeTab}
          onChange={(k) => { setActiveTab(k); setAiResult(null); }}
          items={[
            { key: 'file', label: '📁 Import File' },
            { key: 'url', label: '🔗 Add URL' }
          ]}
        />

        {/* FILE */}
        {activeTab === 'file' && (
          <Space direction="vertical" style={{ width: '100%' }}>

            <Dragger
              accept=".html,.htm,.json,.txt"
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList: fl }) => setFileList(fl)}
            >
              <InboxOutlined style={{ fontSize: 28 }} />
              <Text strong style={{ display: 'block', marginTop: 8 }}>
                Drop your bookmark file here
              </Text>
              <Text type="secondary">HTML or JSON · Max 10MB</Text>
            </Dragger>

            {progress > 0 && (
              <Progress percent={progress} size="small" />
            )}

            <Card size="small">
              <Text strong style={{ fontSize: 12 }}>
                How to export from your browser:
              </Text>

              <Space direction="vertical" size={4}>
                {[
                  { b: '🌐 Chrome / Brave / Edge', s: 'Bookmarks → Bookmark Manager → ⋮ → Export bookmarks' },
                  { b: '🦊 Firefox', s: 'Bookmarks → Manage Bookmarks → Import & Backup → Export' },
                  { b: '🧭 Safari', s: 'File → Export Bookmarks…' },
                ].map(({ b, s }) => (
                  <div key={b}>
                    <Text strong style={{ fontSize: 11 }}>{b}</Text>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>{s}</Text>
                  </div>
                ))}
              </Space>
            </Card>

            <Button
              type="primary"
              block
              size="large"
              loading={fileLoading}
              disabled={!fileList.length}
              onClick={handleFileImport}
              icon={<CloudUploadOutlined />}
            >
              {fileLoading ? 'Importing & categorizing with AI…' : 'Import & Auto-Categorize'}
            </Button>

          </Space>
        )}

        {/* URL */}
        {activeTab === 'url' && (
          <Flex vertical gap={12}>

            {aiResult && (
              <Card>
                <Space direction="vertical" size={8} style={{ width: '100%' }}>

                  <Space>
                    <RobotOutlined />
                    <Text strong>AI Generated — Bookmark Saved ✓</Text>
                  </Space>

                  <Text strong>{aiResult.title}</Text>

                  {aiResult.description && (
                    <Text type="secondary">{aiResult.description}</Text>
                  )}

                  <Space>
                    <Tag style={{ background: topicBg, color: topicColor }}>
                      {topicEmoji} {aiResult.topicCategory}
                    </Tag>

                    {aiResult.aiConfidence !== undefined && (
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {Math.round(aiResult.aiConfidence * 100)}% confidence
                      </Text>
                    )}
                  </Space>

                  {aiResult.tags && (
                    <Space wrap>
                      {aiResult.tags.map((tag) => (
                        <Tag key={tag}>#{tag}</Tag>
                      ))}
                    </Space>
                  )}

                  <Space>
                    <Button size="small" onClick={() => {
                      setAiResult(null);
                      setUrlInput('');
                      setTitleInput('');
                    }}>
                      Add another
                    </Button>

                    <Button type="primary" size="small" onClick={handleClose}>
                      Done
                    </Button>
                  </Space>

                </Space>
              </Card>
            )}

            {!aiResult && (
              <Space direction="vertical" style={{ width: '100%' }}>

                <div>
                  <Text strong style={{ fontSize: 13 }}>URL *</Text>
                  <Input
                    prefix={<LinkOutlined />}
                    placeholder="https://example.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    size="large"
                    onPressEnter={handleUrlImport}
                  />
                </div>

                <div>
                  <Text strong style={{ fontSize: 13 }}>Title</Text>
                  <Input
                    placeholder="Leave empty for AI to generate…"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    size="large"
                  />
                </div>

                <div>
                  <Text strong style={{ fontSize: 13 }}>Browser Source</Text>
                  <Select
                    style={{ width: '100%' }}
                    value={browserSource}
                    onChange={setBrowserSource}
                    size="large"
                    options={BROWSER_SOURCES.map((b) => ({ value: b, label: b }))}
                  />
                </div>

                <Button
                  type="primary"
                  block
                  size="large"
                  loading={urlLoading}
                  disabled={!urlInput.trim()}
                  onClick={handleUrlImport}
                  icon={urlLoading ? <Spin size="small" /> : <RobotOutlined />}
                >
                  {urlLoading ? 'AI is analyzing…' : '✨ Import & Auto-Enrich with AI'}
                </Button>

              </Space>
            )}

          </Flex>
        )}

      </Space>
    </Modal>
  );
};

export default ImportModal;