import { Space, Typography, Upload, Progress, Card, Button } from 'antd';
import { InboxOutlined, CloudUploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Text } = Typography;

interface Props {
  fileList: any[];
  setFileList: (list: any[]) => void;
  progress: number;
  fileLoading: boolean;
  handleFileImport: () => void;
}

const FileModal = ({
  fileList,
  setFileList,
  progress,
  fileLoading,
  handleFileImport,
}: Props) => {
  return (
   <Space direction="vertical" size={14} style={{ width: '100%' }}>
   
               <Dragger
                 accept=".html,.htm,.json,.txt"
                 maxCount={1}
                 fileList={fileList}
                 beforeUpload={() => false}
                 onChange={({ fileList: fl }) => setFileList(fl)}
                 style={{ borderRadius: 12 }}
               >
                 <p>
                   <InboxOutlined
                     style={{ fontSize: 36, color: 'var(--primary)', opacity: 0.8 }}
                   />
                 </p>
                 <Text strong style={{ display: 'block', marginBottom: 4 }}>
                   Drop your bookmark file here
                 </Text>
                 <Text type="secondary" style={{ fontSize: 13 }}>
                   HTML or JSON · Max 10MB
                 </Text>
               </Dragger>
   
               {progress > 0 && (
                 <Progress
                   percent={progress}
                   size="small"
                   strokeColor={{ '0%': '#6c47ff', '100%': '#9b7aff' }}
                 />
               )}
   
               <Card
                 size="small"
                 style={{ borderRadius: 10, background: 'var(--bg)' }}
                 styles={{ body: { padding: '12px 14px' } }}
               >
                 <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                   How to export from your browser:
                 </Text>
                 <Space direction="vertical" size={6} style={{ width: '100%' }}>
                   {[
                     { icon: '🌐', b: 'Chrome / Brave / Edge', s: 'Bookmarks → Bookmark Manager → ⋮ → Export' },
                     { icon: '🦊', b: 'Firefox', s: 'Bookmarks → Manage Bookmarks → Import & Backup → Export' },
                     { icon: '🧭', b: 'Safari', s: 'File → Export Bookmarks…' },
                   ].map(({ icon, b, s }) => (
                     <div key={b}>
                       <Text strong style={{ fontSize: 12 }}>{icon} {b}</Text>
                       <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>{s}</Text>
                     </div>
                   ))}
                 </Space>
               </Card>
   
               <Button
                 type="primary"
                 block
                 size="large"
                 icon={<CloudUploadOutlined />}
                 loading={fileLoading}
                 // Disabled until a file is selected
                 disabled={!fileList.length || fileLoading}
                 onClick={handleFileImport}
                 style={{ height: 46, fontWeight: 600, borderRadius: 10 }}
               >
                 {fileLoading ? 'Importing & categorizing with AI…' : 'Import & Auto-Categorize'}
               </Button>
   
             </Space>
  );
};

export default FileModal;