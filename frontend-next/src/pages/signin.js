import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, message, Spin } from 'antd';
import Layout from '../components/Layout';
import authService from '../api/authService';

const hardcodedCredentials = {
    "email": "saksham.bisht_cs22@gla.ac.in",
    "name": "saksham singh bisht",
    "rollNo": "2215001547",
    "accessCode": "CNneGT",
    "clientID": "e76d6d2d-206c-4f9a-96bd-98154f10ce13",
    "clientSecret": "pMrsxEPKYWsMCYWs"
};

export default function SignIn() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

   
    const handleLoginClick = async () => {
        setLoading(true);
        try {
            const loginData = hardcodedCredentials;

            const response = await authService.loginUser(loginData);
            if (response.access_token) {
                localStorage.setItem('authToken', response.access_token);
                localStorage.setItem('tokenType', response.token_type || 'Bearer');
                message.success('Login successful!');
                router.push('/'); 
            } else {
                throw new Error('Login response did not contain access token.');
            }

        } catch (error) {
            message.error(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-10">
                <Card title="Sign In">
                    <Spin spinning={loading} tip="Logging in...">
                        <div className="text-center">
                            <p className="mb-4 text-gray-700">Click the button below to log in with the pre-configured credentials.</p>
                            {/* Simplified Form to just a button */}
                            <Button
                                type="primary"
                                onClick={handleLoginClick}
                                disabled={loading}
                                block
                            >
                                Login
                            </Button>
                        </div>
                    </Spin>
                </Card>
            </div>
        </Layout>
    );
} 