import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Typography, Space, Switch, Tooltip } from 'antd';
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
  const existingBookmark = editBookmarkId ? data?.bookmarks?.find((b: Bookmark) => b._id === editBookmarkId) : null;

  useEffect(() => {
    if (isOpen) {
      if (existingBookmark) {
        form.setFieldsValue({ title: existingBookmark.title, url: existingBookmark.url, description: existingBookmark.description, browserSource: existingBookmark.browserSource, topicCategory: existingBookmark.topicCategory, tags: existingBookmark.tags, isFavorite: existingBookmark.isFavorite });
      } else {
        form.resetFields();
        form.setFieldsValue({ browserSource: 'Other' });
      }
    }
  }, [isOpen, existingBookmark, form]);

  const handleClose = () => { dispatch(setEditBookmarkId(null)); dispatch(setAddModalOpen(false)); form.resetFields(); };

  const handleSubmit = async (values: { title: string; url: string; description?: string; browserSource: BrowserSource; topicCategory?: TopicCategory; tags?: string[]; isFavorite?: boolean; }) => {
    try {
      if (isEditing && editBookmarkId) { await update({ id: editBookmarkId, data: values }); }
      else { await create(values); }
      handleClose();
    } catch { /* handled by hooks */ }
  };

  return (
    <Modal open={isOpen} onCancel={handleClose} footer={null} width={500}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: isEditing ? '#fef3c7' : 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            {isEditing ? '✏️' : '➕'}
          </div>
          <div>
            <Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>{isEditing ? 'Edit Bookmark' : 'Add Bookmark'}</Title>
            {!isEditing && <Text style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>Leave topic empty for AI auto-categorization</Text>}
          </div>
        </div>
      }>
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} style={{ marginTop: 8 }}>
        <Form.Item name="url" label={<Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>URL *</Text>} rules={[{ required: true, type: 'url', message: 'Enter a valid URL' }]}>
          <Input prefix={<LinkOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="https://example.com" size="large" />
        </Form.Item>
        <Form.Item name="title" label={<Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Title *</Text>} rules={[{ required: true, message: 'Title is required' }]}>
          <Input placeholder="Bookmark title" size="large" />
        </Form.Item>
        <Form.Item name="description" label={<Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Description</Text>}>
          <TextArea rows={2} placeholder="Optional description…" style={{ resize: 'none' }} />
        </Form.Item>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item name="browserSource" label={<Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Browser Source</Text>}>
            <Select size="large">
              {BROWSER_SOURCES.map((b) => <Select.Option key={b} value={b}><Space><span>{BROWSER_EMOJIS[b as BrowserSource]}</span><span style={{ color: BROWSER_COLORS[b as BrowserSource] }}>{b}</span></Space></Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="topicCategory" label={<Space size={4}><Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Topic</Text>{!isEditing && <Tooltip title="Leave empty for AI auto-detection"><RobotOutlined style={{ fontSize: 12, color: 'var(--primary)' }} /></Tooltip>}</Space>}>
            <Select size="large" placeholder="Auto-detect with AI" allowClear>
              {TOPIC_CATEGORIES.map((t) => <Select.Option key={t} value={t}><Space><span>{TOPIC_EMOJIS[t as TopicCategory]}</span><span style={{ color: TOPIC_COLORS[t as TopicCategory] }}>{t}</span></Space></Select.Option>)}
            </Select>
          </Form.Item>
        </div>
        <Form.Item name="tags" label={<Text style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Tags</Text>}>
          <Select mode="tags" size="large" placeholder="Add tags (press Enter)" tokenSeparators={[',']} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="isFavorite" valuePropName="checked">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg)', borderRadius: 8 }}>
            <Space><span>⭐</span><Text style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Mark as Favorite</Text></Space>
            <Form.Item name="isFavorite" valuePropName="checked" noStyle><Switch size="small" /></Form.Item>
          </div>
        </Form.Item>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <button type="button" onClick={handleClose} style={{ height: 40, padding: '0 20px', borderRadius: 'var(--radius-input)', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500 }}>Cancel</button>
          <button type="submit" disabled={creating || updating} style={{ height: 40, padding: '0 24px', borderRadius: 'var(--radius-input)', border: 'none', background: 'var(--primary)', color: '#fff', cursor: creating || updating ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, opacity: creating || updating ? 0.7 : 1 }}>
            {creating || updating ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Bookmark'}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditModal;
