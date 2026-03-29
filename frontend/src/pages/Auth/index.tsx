import React, { useState, useEffect } from "react";
import { Form, Input, Button, Tabs, Typography, message, Card, Row, Col, Space, theme, Image, Flex } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { clearError } from "../../store/authSlice";
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useLoginMutation, useRegisterMutation } from "../../store/authapiSlice";
import { bookmarksApiSlice } from "../../store/bookmarksApiSlice";
import logo from "../../../public/logo.png";

const { Title, Text } = Typography;

const AuthPage: React.FC = () => {
  const { token } = theme.useToken();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error } = useAppSelector((s) => s.auth);

  const [activeTab, setActiveTab] = useState<"login" | "register">(
    location.pathname === "/register" ? "register" : "login"
  );

  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] =
    useRegisterMutation();

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const [loginValid, setLoginValid] = useState(false);
  const [registerValid, setRegisterValid] = useState(false);

  const isLoading = loginLoading || registerLoading;

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error]);

  const handleLogin = async (values: any) => {
    try {
      await login(values).unwrap();
      dispatch(bookmarksApiSlice.util.resetApiState());
      message.success("Welcome back!");
      navigate("/app");
    } catch (e: any) {
      message.error(e?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (values: any) => {
    try {
      await register(values).unwrap();
      message.success("Account created. Please sign in.");
      setActiveTab("login");
      registerForm.resetFields();
    } catch (e: any) {
      message.error(e?.data?.message || "Registration failed");
    }
  };

  const validateLogin = () => {
    const hasErrors = loginForm
      .getFieldsError()
      .some(({ errors }) => errors.length);
    setLoginValid(loginForm.isFieldsTouched(true) && !hasErrors);
  };

  const validateRegister = () => {
    const hasErrors = registerForm
      .getFieldsError()
      .some(({ errors }) => errors.length);
    setRegisterValid(registerForm.isFieldsTouched(true) && !hasErrors);
  };

  return (
    <>

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontWeight: 600
        }}
      >
      </Button>


      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          minHeight: "100vh",
          background: token.colorBgLayout
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: 920,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary
          }}
          bodyStyle={{ padding: 48 }}
        >
          <Row gutter={48} align="middle">
            {/* LEFT BRAND PANEL */}
            <Col xs={24} md={12}>
              <Space
                direction="vertical"
                size="large"
                style={{ textAlign: "center", width: "100%" }}
              >
                <Image
                  src={logo}
                  width={120}
                  preview={false}
                />

                <Title level={2} style={{ margin: 0 }}>
                  Link
                  <span style={{ color: token.colorPrimary }}>Nest</span>
                </Title>

                <Text type="secondary">
                  AI-powered bookmark manager to organize,
                  categorize and find links instantly.
                </Text>
              </Space>
            </Col>

            {/* RIGHT FORM PANEL */}
            <Col xs={24} md={12}>
              <Tabs
                centered
                size="large"
                activeKey={activeTab}
                onChange={(k) => setActiveTab(k as any)}
                items={[
                  { key: "login", label: "Sign In" },
                  { key: "register", label: "Create Account" }
                ]}
              />

              {activeTab === "login" && (
                <Form
                  form={loginForm}
                  layout="vertical"
                  onFinish={handleLogin}
                  onValuesChange={validateLogin}
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true },
                      { type: "email" }
                    ]}
                  >
                    <Input size="large" autoFocus />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true },
                      { min: 4 }
                    ]}
                  >
                    <Input.Password size="large" />
                  </Form.Item>

                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    disabled={!loginValid}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form>
              )}

              {activeTab === "register" && (
                <Form
                  form={registerForm}
                  layout="vertical"
                  onFinish={handleRegister}
                  onValuesChange={validateRegister}
                >
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true }]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true },
                      { type: "email" }
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true },
                      { min: 4 }
                    ]}
                  >
                    <Input.Password size="large" />
                  </Form.Item>

                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    block
                    loading={isLoading}
                    disabled={!registerValid}
                  >
                    {isLoading
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                </Form>
              )}
            </Col>
          </Row>
        </Card>
      </Flex>

    </>
  );
};

export default AuthPage;