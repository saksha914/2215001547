import { useEffect, useState } from 'react';
import { Card, List, Spin, message } from 'antd';
import Layout from '../components/Layout';
import userService from '../api/userService';

export default function TopUsers() {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopUsers = async () => {
            setLoading(true);
            try {
                const topUsersData = await userService.getTopUsers(5);
                setTopUsers(topUsersData);
            } catch (error) {
                console.error('Error fetching top users:', error);
                message.error('Failed to load top users.');
                setTopUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopUsers();
    }, []);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Top Users</h1>
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spin size="large" />
                    </div>
                ) : topUsers.length > 0 ? (
                    <List
                        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                        dataSource={topUsers}
                        renderItem={(user, index) => (
                            <List.Item>
                                <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <Card.Meta
                                        title={
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
                                                <span className="text-lg font-semibold">{user.name}</span>
                                            </div>
                                        }
                                        description={
                                            <div className="mt-3">
                                                <p className="text-lg font-semibold text-gray-700">{user.postCount} posts</p>
                                            </div>
                                        }
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                ) : (
                    <p className="text-center text-gray-500">No top users found.</p>
                )}
            </div>
        </Layout>
    );
} 