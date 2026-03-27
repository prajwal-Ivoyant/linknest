import React from 'react';
import { Modal, Typography, Flex } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setEditBookmarkId } from '../../store/uiSlice';
import { useUpdateBookmark, useBookmarks } from '../../hooks/useBookmarks';
import BookmarkForm from '../BookmarkForm';
import type { Bookmark } from '../../types';

const { Title, Text } = Typography;

const EditModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { editBookmarkId, filters } = useAppSelector((s) => s.ui);

  const { data } = useBookmarks(filters);
  const { mutateAsync: update, isPending } = useUpdateBookmark();

  const isOpen   = !!editBookmarkId;
  const bookmark = editBookmarkId
    ? data?.bookmarks?.find((b: Bookmark) => b._id === editBookmarkId)
    : null;

  const handleClose = () => dispatch(setEditBookmarkId(null));

  const handleSubmit = async (values: Partial<Bookmark>) => {
    if (!editBookmarkId) return;
    await update({ id: editBookmarkId, data: values });
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={500}
      destroyOnClose   // resets form state every open
      title={
        <Flex align="center" gap={10}>
          <Flex align="center" justify="center"
            style={{ width: 36, height: 36, borderRadius: 10,
              background: 'rgba(245,158,11,0.12)', fontSize: 18 }}>
            <EditOutlined style={{ color: '#f59e0b', fontSize: 16 }} />
          </Flex>
          <div>
            <Title level={5} style={{ margin: 0 }}>Edit Bookmark</Title>
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              Changes are saved immediately
            </Text>
          </div>
        </Flex>
      }
    >
      {/* Only render BookmarkForm once bookmark data is available
          so initialValues are never undefined on first render */}
      {bookmark ? (
        <BookmarkForm
          mode="edit"
          initialValues={bookmark}
          loading={isPending}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      ) : null}
    </Modal>
  );
};

export default EditModal;