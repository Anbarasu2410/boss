import React from "react";
import { Form, Input, Button, Card, Typography, Checkbox, message, ConfigProvider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const res = await login(values.email, values.password);

      if (res.autoSelected) {
        // navigate("/dashboard");
         navigate("/"); 
      } else if (res.companies && res.companies.length > 0) {
        navigate("/select-company");
      } else {
        message.error("No companies found for your account");
      }
    } catch (err) {
      message.error(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#1890ff", borderRadius: 8 } }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-2xl rounded-2xl border-0" bordered={false} style={{ padding: "40px 32px" }}>
            <div className="text-center mb-4">
              <img src="/logo.jpg" alt="Logo" className="h-16 w-auto mx-auto" />
            </div>

            <div className="text-center mb-8">
              <Title level={2} className="!mb-2 !text-gray-800 font-semibold">Welcome Back</Title>
              <Text className="text-gray-500 text-base">Please sign in to continue</Text>
            </div>

            <Form form={form} name="login" onFinish={onFinish} autoComplete="off" layout="vertical" requiredMark={false} size="large">
              <Form.Item label="Email" name="email" className="mb-4" rules={[{ required: true, message: "Please input your email!" }]}>
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Enter your email" className="rounded-lg h-12" />
              </Form.Item>

              <Form.Item label="Password" name="password" className="mb-2" rules={[{ required: true, message: "Please input your password!" }]}>
                <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Enter your password" className="rounded-lg h-12" />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600 text-sm mb-6">Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full h-12 rounded-lg text-base font-semibold">Sign In</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;
