import { useEffect, useState } from 'react';
import { Card, List, Spin, Badge, message } from 'antd';
import { CommentOutlined, FireOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import userService from '../api/userService';
import postService from '../api/postService';

export default function TrendingPosts() {
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndProcessTrendingPosts = async () => {
            setLoading(true);
            try {

                const usersData = await userService.getAllUsers();
                const usersMap = new Map(Object.entries(usersData));


                let allPosts = [];
                const userIds = Object.keys(usersData);
                await Promise.all(
                    userIds.map(async (userId) => {
                        try {
                            const userPosts = await userService.getUserPosts(userId);
                            allPosts = allPosts.concat(userPosts.map(p => ({ ...p, userId })));
                        } catch (error) {
                            console.warn(`Could not fetch posts for user ${userId}:`, error);
                        }
                    })
                );

                if (allPosts.length === 0) {
                    setTrendingPosts([]);
                    setLoading(false);
                    return;
                }
                const postsWithCommentCounts = await Promise.all(
                    allPosts.map(async (post) => {
                        try {
                            const comments = await postService.getPostComments(post.id);
                            return { ...post, commentCount: comments.length };
                        } catch (error) {
                            console.warn(`Could not fetch comments for post ${post.id}:`, error);
                            return { ...post, commentCount: 0 };
                        }
                    })
                );
                const maxComments = Math.max(...postsWithCommentCounts.map(p => p.commentCount));
                const trending = postsWithCommentCounts
                    .filter(p => p.commentCount === maxComments)
                    .map(post => ({
                        ...post,
                        userName: usersMap.get(String(post.userId)) || 'Unknown User'
                    }))
                    .sort((a, b) => b.commentCount - a.commentCount);

                setTrendingPosts(trending);

            } catch (error) {
                console.error('Error fetching or processing trending posts:', error);
                message.error('Failed to load trending posts.');
                setTrendingPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAndProcessTrendingPosts();
    }, []);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FireOutlined className="text-red-500" />
                    Trending Posts
                </h1>
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spin size="large" />
                    </div>
                ) : trendingPosts.length > 0 ? (
                    <List
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={trendingPosts}
                        renderItem={(post, index) => (
                            <List.Item>
                                <Badge.Ribbon
                                    text={`${post.commentCount} Comments`}
                                    color={index < 3 ? 'red' : 'blue'}
                                >
                                    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                                        <Card.Meta
                                            title={post.userName}
                                            description={<p className="text-base mt-1">{post.content}</p>}
                                        />
                                        <div className="mt-4 flex items-center gap-4 text-gray-500 text-sm">
                                            <span className="flex items-center gap-1">
                                                <CommentOutlined />
                                                {post.commentCount} comments
                                            </span>
                                        </div>
                                    </Card>
                                </Badge.Ribbon>
                            </List.Item>
                        )}
                    />
                ) : (
                    <p className="text-center text-gray-500">No trending posts found.</p>
                )}
            </div>
        </Layout>
    );
} 