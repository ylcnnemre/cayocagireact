// Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Form, Input, Button, Typography, Space, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthContext } from '../AuthProvider';
import { auth } from '../config';
import { Spin } from 'antd';
import { toast } from 'react-toastify';
const { Title } = Typography;
const Login = () => {
    const [api, contextHolder] = notification.useNotification();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { currentUser, loading } = useAuthContext();

    const openNotification = (placement) => {
        api.info({
            message: `Notification ${placement}`,
            description: "açıklama",
            placement,
            duration: 2000
        });
    };
    useEffect(() => {
        if (!loading) {
            if (currentUser) {
                navigate('/admin');
            }
        }

    }, [currentUser, loading]);

    const handleLogin = async (values) => {
        try {
            const { email, password } = values
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin'); // Başarılı girişten sonra admin sayfasına yönlendirin
        } catch (error) {
            console.log("error", error?.code)
            if (error?.code == "auth/invalid-email" || error?.code == "auth/invalid-credential") {
                toast.error("Email veya parola yanlış", {
                    position: "top-center",
                    autoClose: 2500
                })
            }
            else {
                toast.error("Bir şeyler yanlış gitti", {
                    position: "top-center",
                    autoClose: 2500
                })
            }

        }
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }} >
                <Spin size='large' />
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <Space direction="vertical" style={{ width: '100%' }} align="center">
                <Title level={2} style={{
                    color: "white"
                }} >Giriş Yap</Title>
                <Form
                    name="login_form"
                    initialValues={{ remember: true, }}
                    onFinish={handleLogin}
                    style={styles.form}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="E-posta"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Şifre"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={styles.button}
                        >
                            Giriş Yap
                        </Button>
                    </Form.Item>
                </Form>
            </Space>
        </div>
    );
};

export default Login;




const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#162235',
    },
    form: {
        width: 500,
        padding: '2rem',
        borderRadius: 8,
        backgroundColor: 'white',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    button: {
        width: '100%',
    },
};
