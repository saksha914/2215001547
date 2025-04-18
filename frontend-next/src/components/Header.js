import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Space, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Header: AntHeader } = Layout;

export function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status on component mount and router changes
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, [router.asPath]); // Re-check on route change

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        setIsLoggedIn(false);
        message.success('Logged out successfully.');
        router.push('/signin'); // Redirect to signin page after logout
    };

    const baseMenuItems = [
        { key: '/', label: 'Feed' },
        { key: '/top-users', label: 'Top Users' },
        { key: '/trending', label: 'Trending Posts' },
    ];

    return (
        <AntHeader className="bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Social Analytics
                </Link>
                <div className="flex items-center">
                    <Menu
                        mode="horizontal"
                        selectedKeys={[router.pathname]}
                        items={baseMenuItems.map(item => ({
                            ...item,
                            label: <Link href={item.key}>{item.label}</Link>,
                        }))}
                        className="border-b-0 flex-grow mr-4" // Prevent menu underline and add margin
                    />
                    <Space>
                        {isLoggedIn ? (
                            <Button type="primary" danger onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Link href="/signin" passHref>
                                    <Button>Sign In</Button>
                                </Link>
                                <Link href="/signup" passHref>
                                    <Button type="primary">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </Space>
                </div>
            </div>
        </AntHeader>
    );
} 