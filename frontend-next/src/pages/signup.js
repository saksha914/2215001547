import { useState } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import Layout from '../components/Layout';
import authService from '../api/authService';

export default function SignUp() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const registrationData = {
                ...values,
                githubUsername: values.email.split('@')[0], 
                collegeName: 'Default University', 
                accessCode: 'xgAsNC'
            };

            const response = await authService.registerUser(registrationData);
            message.success('Registration successful! Please save your credentials shown in the console and proceed to login.');
           
            console.log('SAVE THESE CREDENTIALS:', response);
            form.resetFields();
        } catch (error) {
            message.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-10">
                <Card title="Sign Up">
                    <Spin spinning={loading} tip="Registering...">
                        <Form
                            form={form}
                            layout="vertical"
                            name="signup_form"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="rollNo"
                                label="Roll Number"
                                rules={[{ required: true, message: 'Please input your roll number!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="mobileNo"
                                label="Mobile Number"
                                rules={[{ required: true, message: 'Please input your mobile number!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block disabled={loading}>
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>
                </Card>
            </div>
        </Layout>
    );
} 