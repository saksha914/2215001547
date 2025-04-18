import { useEffect, useState, useCallback } from 'react';
import { Card, List, Spin, message } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import userService from '../api/userService';
import postService from '../api/postService';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  const fetchAndProcessFeed = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setIsPolling(true);
    }

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
        setPosts([]);
        if (isInitialLoad) setLoading(false);
        setIsPolling(false);
        return;
      }
      const postsWithDetails = await Promise.all(
        allPosts.map(async (post) => {
          let commentCount = 0;
          try {
            const comments = await postService.getPostComments(post.id);
            commentCount = comments.length;
          } catch (error) {
            console.warn(`[Diagnosis] Could not fetch comments for post ${post.id}:`, error);
          }
          return {
            ...post,
            commentCount,
            userName: usersMap.get(String(post.userId)) || 'Unknown User'
          };
        })
      );
      postsWithDetails.reverse();
      setPosts(postsWithDetails);

    } catch (error) {
      console.error('Error fetching or processing feed:', error);
      if (isInitialLoad) {
        message.error('Failed to load feed.');
        setPosts([]);
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    fetchAndProcessFeed(true);

    const interval = setInterval(() => {
      if (!isPolling) {
        fetchAndProcessFeed(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAndProcessFeed, isPolling]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Latest Posts</h1>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : posts.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={posts}
            renderItem={(post) => (
              <List.Item key={post.id}>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
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
              </List.Item>
            )}
          />
        ) : (
          <p className="text-center text-gray-500">No posts found.</p>
        )}
      </div>
    </Layout>
  );
}
