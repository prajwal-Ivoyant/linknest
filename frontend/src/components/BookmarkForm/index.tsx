import React, { useEffect, useState } from "react";
import {  Form,  Input,  Select,  Typography,  Space,  Switch,  Flex,  Button,  Card, Row, Col} from "antd";
import { LinkOutlined, RobotOutlined } from "@ant-design/icons";
import { BROWSER_SOURCES, TOPIC_CATEGORIES } from "../../types";
import {  BROWSER_COLORS,  BROWSER_EMOJIS,  TOPIC_COLORS,  TOPIC_EMOJIS} from "../../utils/helpers";
import type { BrowserSource, TopicCategory, Bookmark } from "../../types";

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
  mode?: "create" | "edit" | "ai";
  initialValues?: Partial<Bookmark>;
  loading?: boolean;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
};

const BookmarkForm: React.FC<Props> = ({
  mode = "create",
  initialValues,
  loading,
  onSubmit,
  onCancel
}) => {
  const [form] = Form.useForm();

  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const isEdit = mode === "edit";
  const isAI = mode === "ai";

  // ✅ helper to check validity properly
  const checkFormValid = () => {
    const errors = form.getFieldsError();
    const hasErrors = errors.some(({ errors }) => errors.length > 0);

    const values = form.getFieldsValue();
    const requiredFilled = values.url && values.title;

    return !hasErrors && requiredFilled;
  };

  const checkDirty = () => {
    if (!initialValues) return true;

    const current = form.getFieldsValue();

    return (
      current.title !== initialValues.title ||
      current.url !== initialValues.url ||
      current.description !== initialValues.description ||
      current.browserSource !== initialValues.browserSource ||
      current.topicCategory !== initialValues.topicCategory ||
      JSON.stringify(current.tags || []) !== JSON.stringify(initialValues.tags || []) ||
      Boolean(current.isFavorite) !== Boolean(initialValues.isFavorite)
    );
  };

  // ✅ handle initial values
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);

      setIsValid(true);
      setIsDirty(false); // ⭐ edit initially not dirty
    } else {
      form.resetFields();
      form.setFieldsValue({ browserSource: "Other" });

      setIsValid(false);
      setIsDirty(false);
    }
  }, [initialValues]);

  // ✅ handle changes
  const handleValuesChange = () => {
    setIsValid(checkFormValid());
    setIsDirty(checkDirty());
  };

  const submitText =
    mode === "edit" ? "Save Changes" : "Save Bookmark";

  return (
<Form
  form={form}
  layout="vertical"
  onFinish={onSubmit}
  onValuesChange={handleValuesChange}
  requiredMark={true}
>
  {/* AI Hint */}
  {isAI && (
    <Text type="secondary">
      ✨ Auto-filled using AI. You can edit before saving.
    </Text>
  )}

  {/* ROW 1 */}
 <Row gutter={12}>
  <Col span={12}>
    <Form.Item
      name="url"
      label={<Text strong>URL</Text>}
      rules={[
        { required: true, message: "URL required" },
        { type: "url", message: "Enter valid URL" }
      ]}
    >
      <Input
        prefix={<LinkOutlined />}
        size="large"
        disabled={isEdit || isAI}
      />
    </Form.Item>
  </Col>

  <Col span={12}>
    <Form.Item
      name="title"
      label={<Text strong>Title</Text>}
      
      rules={[
        { required: true, message: "Title required", },
        { min: 3, message: "Min 3 characters" }
      ]}
    >
      <Input size="large" />
    </Form.Item>
  </Col>
</Row>

  {/* ROW 2 */}
  <Row gutter={12}>
    <Col span={12}>
      <Form.Item name="description" label={<Text strong>Description</Text>}>
        <TextArea rows={2} />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name="browserSource" label="Browser">
        <Select size="large">
          {BROWSER_SOURCES.map((b) => (
            <Select.Option key={b} value={b}>
              <Space>
                <span>{BROWSER_EMOJIS[b as BrowserSource]}</span>
                <span style={{ color: BROWSER_COLORS[b as BrowserSource] }}>
                  {b}
                </span>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>
  </Row>

  {/* ROW 3 */}
  <Row gutter={12}>
    <Col span={12}>
      <Form.Item
        name="topicCategory"
        label={
          <Space>
            Topic <RobotOutlined style={{ fontSize: 12 }} />
          </Space>
        }
      >
        <Select allowClear size="large" placeholder="AI auto-detect">
          {TOPIC_CATEGORIES.map((t) => (
            <Select.Option key={t} value={t}>
              <Space>
                <span>{TOPIC_EMOJIS[t as TopicCategory]}</span>
                <span style={{ color: TOPIC_COLORS[t as TopicCategory] }}>
                  {t}
                </span>
              </Space>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name="tags" label="Tags">
        <Select mode="tags" size="large" tokenSeparators={[","]} />
      </Form.Item>
    </Col>
  </Row>

  {/* FAVORITE */}
  <Card size="small">
    <Row justify="space-between" align="middle">
      <Col>⭐ Mark as Favorite</Col>
      <Col>
        <Form.Item
          name="isFavorite"
          valuePropName="checked"
          noStyle
        >
          <Switch size="small" />
        </Form.Item>
      </Col>
    </Row>
  </Card>

  {/* ACTIONS */}
  <Row justify="end" gutter={8}>
    {onCancel && (
      <Col>
        <Button onClick={onCancel}>Cancel</Button>
      </Col>
    )}

    <Col>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        disabled={
          !isValid || (mode === "edit" && !isDirty)
        }
      >
        {submitText}
      </Button>
    </Col>
  </Row>
</Form>
  );
};

export default BookmarkForm;