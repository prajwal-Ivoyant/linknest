import { Flex, Space, Form, Input, Button, Select, Spin, Typography } from 'antd';
import { LinkOutlined, RobotOutlined } from '@ant-design/icons';
import BookmarkForm from '../BookmarkForm';

const { Text } = Typography;

interface Props {
  aiResult: any;
  setAiResult: (val: any) => void;
  urlInput: string;
  setUrlInput: (val: string) => void;
  urlValid: boolean;
  browserSource: string;
  setBrowserSource: (val: string) => void;
  urlLoading: boolean;
  handleUrlAnalyze: () => void;
  handleCreateFromAI: (data: any) => void;
  BROWSER_SOURCES: string[];
}

const UrlModal = ({
  aiResult,
  setAiResult,
  urlInput,
  setUrlInput,
  urlValid,
  browserSource,
  setBrowserSource,
  urlLoading,
  handleUrlAnalyze,
  handleCreateFromAI,
  BROWSER_SOURCES,
}: Props) => {
  return (
    <Flex vertical gap={12}>
      {/* Show BookmarkForm pre-filled with AI data after analysis */}
      {aiResult ? (
        <BookmarkForm
          mode="ai"
          initialValues={aiResult}
          onSubmit={handleCreateFromAI}
          onCancel={() => setAiResult(null)}
        />
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>

          <Form.Item
            name="url"
            label={<Text strong>URL</Text>}
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "URL is required" }
            ]}
          >
            <Input
              prefix={<LinkOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="https://example.com"
              value={urlInput}
              size="large"
              onChange={(e) => setUrlInput(e.target.value)}
              status={urlInput && !urlValid ? 'error' : ''}
              onPressEnter={() => urlValid && handleUrlAnalyze()}
              allowClear
            />
          </Form.Item>

          {urlInput && !urlValid && (
            <Text type="danger" style={{ fontSize: 12 }}>
              Enter a valid URL starting with https://
            </Text>
          )}

          <Form.Item
            label={<Text strong>Browser Source</Text>}
            style={{ marginBottom: 0 }}
          >
            <Select
              value={browserSource}
              onChange={setBrowserSource}
              size="large"
              style={{ width: '100%' }}
              options={BROWSER_SOURCES.map((b) => ({ value: b, label: b }))}
            />
          </Form.Item>

          <Button
            type="primary"
            block
            size="large"
            icon={urlLoading ? <Spin size="small" /> : <RobotOutlined />}
            loading={urlLoading}
            disabled={!urlValid || urlLoading}
            onClick={handleUrlAnalyze}
            style={{ height: 46, fontWeight: 600, borderRadius: 10 }}
          >
            {urlLoading ? 'AI is analyzing…' : '✨ Analyze & Auto-Enrich with AI'}
          </Button>

        </Space>
      )}
    </Flex>
  );
};

export default UrlModal;