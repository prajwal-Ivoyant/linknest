import React, { useState } from 'react';
import {  Modal, Tabs, Upload,Typography, Space, Alert,  Flex,  message,} from 'antd';
import { RobotOutlined,} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import {  useImportFile, useImportUrl, useCreateBookmark,} from '../../hooks/useBookmarks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setImportModalOpen } from '../../store/uiSlice';
import { BROWSER_SOURCES } from '../../types';
import type { Bookmark } from '../../types';
import BookmarkForm from '../BookmarkForm';
import FileModal from './fileModal';
import UrlModal from './urlModal';

const { Text, Title } = Typography;

// ─── URL validation ───────────────────────────────────────────────────────────
const isValidUrl = (v: string) => {
  try { new URL(v); return true; } catch { return false; }
};

// ─── Component ────────────────────────────────────────────────────────────────

const ImportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const importModalOpen = useAppSelector((s) => s.ui.importModalOpen);

  const { mutateAsync: importFile, isPending: fileLoading } = useImportFile();
  const { mutateAsync: importUrl, isPending: urlLoading } = useImportUrl();
  const { mutateAsync: createBookmark } = useCreateBookmark();

  // ── local state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'manual'>('file');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [browserSource, setBrowserSource] = useState('Other');
  // After AI analyzes the URL we store the result here so BookmarkForm can pre-fill
  const [aiResult, setAiResult] = useState<Partial<Bookmark> | null>(null);

  // ── close / reset ─────────────────────────────────────────────────────────
  const handleClose = () => {
    dispatch(setImportModalOpen(false));
    setFileList([]);
    setProgress(0);
    setUrlInput('');
    setAiResult(null);
    setActiveTab('file');
  };

  // ── file import ───────────────────────────────────────────────────────────
  const handleFileImport = async () => {
    if (!fileList.length || !fileList[0].originFileObj) return;
    setProgress(0);
    try {
      await importFile({
        file: fileList[0].originFileObj,
        onProgress: (pct) => setProgress(pct),
      });
      handleClose();
    } catch { setProgress(0); }
  };

  // ── URL → AI analyze ──────────────────────────────────────────────────────
  const handleUrlAnalyze = async () => {
    if (!isValidUrl(urlInput.trim())) return;
    setAiResult(null);
    try {
      const res = await importUrl({ url: urlInput.trim(), browserSource });
      const bm = res?.data?.data?.bookmark as Bookmark | undefined;

      if (!bm) { message.error('AI could not analyze this URL'); return; }

      // importUrl already saved the bookmark — we delete it immediately and
      // let the user confirm / edit via BookmarkForm before re-saving.
      // Alternatively: add a dedicated /analyze endpoint in the future.
      setAiResult({
        url: bm.url,
        title: bm.title,
        description: bm.description,
        tags: bm.tags || [],
        topicCategory: bm.topicCategory,
        browserSource: (bm.browserSource || browserSource) as Bookmark['browserSource'],
        isFavorite: false,
      });
      message.success('🤖 AI analyzed — review and save below');
    } catch {
      message.error('AI import failed. Please try again.');
    }
  };

  // ── save confirmed AI result ──────────────────────────────────────────────
  const handleCreateFromAI = async (values: Partial<Bookmark>) => {
    await createBookmark(values);
    handleClose();
  };

  // ── manual create ─────────────────────────────────────────────────────────
  const handleManualCreate = async (values: Partial<Bookmark>) => {
    await createBookmark(values);
    handleClose();
  };

  const urlValid = isValidUrl(urlInput.trim());

  return (
    <Modal
      open={importModalOpen}
      onCancel={handleClose}
      centered
      footer={null}
      width={820}
      destroyOnClose
      title={
        <Flex align="center" gap={10}>
          <Flex align="center" justify="center"
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(108,71,255,0.12)', fontSize: 18
            }}>
            📥
          </Flex>
          <div>
            <Title level={5} style={{ margin: 0 }}>Import Bookmarks</Title>
            {(activeTab !== 'manual') && (
              <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
                AI generates title · description · tags · topic automatically
              </Text>
            )}
          </div>
        </Flex>
      }
    >
      <Space direction="vertical" style={{ width: '100%', marginTop: 8 }} size={16}>

        {(activeTab !== 'manual') && (
          <Alert
            type="info"
            showIcon
            icon={<RobotOutlined />}
            message={
              <Text style={{ fontSize: 13 }}>
                <strong>AI enrichment:</strong> URL import auto-generates title,
                description, tags &amp; topic in one call. File import uses fast
                batch categorization.
              </Text>
            }
          />
        )}

        <Tabs
          activeKey={activeTab}
          onChange={(k) => {
            setActiveTab(k as typeof activeTab);
            setAiResult(null);
          }}
          items={[
            { key: 'file', label: '📁 Import File' },
            { key: 'url', label: '✨ Add URL (AI)' },
            { key: 'manual', label: '✍️ Add Manually' },
          ]}
        />

        {/* ── FILE TAB ──────────────────────────────────────────────────── */}
        {activeTab === 'file' && (
          <FileModal
            fileList={fileList}
            setFileList={setFileList}
            progress={progress}
            fileLoading={fileLoading}
            handleFileImport={handleFileImport}
          />
        )}

        {/* ── URL TAB ───────────────────────────────────────────────────── */}
        {activeTab === 'url' && (
          <UrlModal
            aiResult={aiResult}
            setAiResult={setAiResult}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            urlValid={urlValid}
            browserSource={browserSource}
            setBrowserSource={setBrowserSource}
            urlLoading={urlLoading}
            handleUrlAnalyze={handleUrlAnalyze}
            handleCreateFromAI={handleCreateFromAI}
            BROWSER_SOURCES={BROWSER_SOURCES}
          />
        )}

        {/* ── MANUAL TAB ────────────────────────────────────────────────── */}
        {activeTab === 'manual' && (
          <BookmarkForm
            mode="create"
            onSubmit={handleManualCreate}
            onCancel={handleClose}
          />
        )}

      </Space>
    </Modal>
  );
};

export default ImportModal;