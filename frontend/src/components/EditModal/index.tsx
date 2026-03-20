import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Typography, Space, Switch, Tooltip, Flex, Button, Card } from 'antd';
import { LinkOutlined, RobotOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setEditBookmarkId, setAddModalOpen } from '../../store/uiSlice';
import { useCreateBookmark, useUpdateBookmark, useBookmarks } from '../../hooks/useBookmarks';
import { BROWSER_SOURCES, TOPIC_CATEGORIES } from '../../types';
import { BROWSER_COLORS, BROWSER_EMOJIS, TOPIC_COLORS, TOPIC_EMOJIS } from '../../utils/helpers';
import type { BrowserSource, TopicCategory, Bookmark } from '../../types';

const { Text, Title } = Typography;
const { TextArea } = Input;

const EditModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { editBookmarkId, addModalOpen, filters } = useAppSelector((s) => s.ui);
  const { data } = useBookmarks(filters);
  const { mutateAsync: create, isPending: creating } = useCreateBookmark();
  const { mutateAsync: update, isPending: updating } = useUpdateBookmark();
  const [form] = Form.useForm();

  const isEditing = !!editBookmarkId;
  const isOpen = isEditing || addModalOpen;
  const existingBookmark = editBookmarkId
    ? data?.bookmarks?.find((b: Bookmark) => b._id === editBookmarkId)
    : null;

  useEffect(() => {
    if (isOpen) {
      if (existingBookmark) {
        form.setFieldsValue({
          title: existingBookmark.title,
          url: existingBookmark.url,
          description: existingBookmark.description,
          browserSource: existingBookmark.browserSource,
          topicCategory: existingBookmark.topicCategory,
          tags: existingBookmark.tags,
          isFavorite: existingBookmark.isFavorite
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ browserSource: 'Other' });
      }
    }
  }, [isOpen, existingBookmark, form]);

  const handleClose = () => {
    dispatch(setEditBookmarkId(null));
    dispatch(setAddModalOpen(false));
    form.resetFields();
  };

  const handleSubmit = async (values: {
    title: string;
    url: string;
    description?: string;
    browserSource: BrowserSource;
    topicCategory?: TopicCategory;
    tags?: string[];
    isFavorite?: boolean;
  }) => {
    try {
      if (isEditing && editBookmarkId) {
        await update({ id: editBookmarkId, data: values });
      } else {
        await create(values);
      }
      handleClose();
    } catch { }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={500}
      title={
        <Flex align="center" gap={10}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: isEditing ? '#fef3c7' : 'var(--primary-soft)',
              fontSize: 16
            }}
          >
            {isEditing ? '✏️' : '➕'}
          </Flex>

          <div>
            <Title level={5} style={{ margin: 0 }}>
              {isEditing ? 'Edit Bookmark' : 'Add Bookmark'}
            </Title>

            {!isEditing && (
              <Text style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Leave topic empty for AI auto-categorization
              </Text>
            )}
          </div>
        </Flex>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ marginTop: 8 }}
      >

        <Form.Item
          name="url"
          label={<Text style={{ fontSize: 13, fontWeight: 500 }}>URL *</Text>}
          rules={[{ required: true, type: 'url', message: 'Enter a valid URL' }]}
        >
          <Input
            prefix={<LinkOutlined />}
            placeholder="https://example.com"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="title"
          label={<Text style={{ fontSize: 13, fontWeight: 500 }}>Title *</Text>}
          rules={[{ required: true, message: 'Title is required' }]}
        >
          <Input placeholder="Bookmark title" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label={<Text style={{ fontSize: 13, fontWeight: 500 }}>Description</Text>}
        >
          <TextArea rows={2} placeholder="Optional description…" />
        </Form.Item>

        <Flex gap={12}>
          <Form.Item
            name="browserSource"
            style={{ flex: 1 }}
            label={<Text style={{ fontSize: 13, fontWeight: 500 }}>Browser Source</Text>}
          >
            <Select size="large">
              {BROWSER_SOURCES.map((b) => (
                <Select.Option key={b} value={b}>
                  <Space>
                    <span>{BROWSER_EMOJIS[b as BrowserSource]}</span>
                    <span style={{ color: BROWSER_COLORS[b as BrowserSource] }}>{b}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="topicCategory"
            style={{ flex: 1 }}
            label={
              <Space size={4}>
                <Text style={{ fontSize: 13, fontWeight: 500 }}>Topic</Text>
                {!isEditing && (
                  <Tooltip title="Leave empty for AI auto-detection">
                    <RobotOutlined style={{ fontSize: 12, color: 'var(--primary)' }} />
                  </Tooltip>
                )}
              </Space>
            }
          >
            <Select size="large" placeholder="Auto-detect with AI" allowClear>
              {TOPIC_CATEGORIES.map((t) => (
                <Select.Option key={t} value={t}>
                  <Space>
                    <span>{TOPIC_EMOJIS[t as TopicCategory]}</span>
                    <span style={{ color: TOPIC_COLORS[t as TopicCategory] }}>{t}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Flex>

        <Form.Item
          name="tags"
          label={<Text style={{ fontSize: 13, fontWeight: 500 }}>Tags</Text>}
        >
          <Select
            mode="tags"
            size="large"
            placeholder="Add tags (press Enter)"
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item name="isFavorite" valuePropName="checked">
          <Card
            size="small"
            bodyStyle={{ padding: '10px 14px' }}
            style={{ background: 'var(--bg)', borderRadius: 8 }}
          >
            <Flex align="center" justify="space-between">
              <Space>
                <span>⭐</span>
                <Text style={{ fontSize: 13 }}>Mark as Favorite</Text>
              </Space>

              <Form.Item name="isFavorite" valuePropName="checked" noStyle>
                <Switch size="small" />
              </Form.Item>
            </Flex>
          </Card>
        </Form.Item>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 4 }}>
          <Button
            onClick={handleClose}
            style={{ height: 40 }}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            loading={creating || updating}
            style={{ height: 40 }}
          >
            {creating || updating
              ? 'Saving…'
              : isEditing
                ? 'Save Changes'
                : 'Add Bookmark'}
          </Button>
        </Flex>

      </Form>
    </Modal>
  );
};

export default EditModal;