import React, { useState, useEffect } from 'react';
import { Table, Typography, message } from 'antd';
import './commentSection.scss'; // Ensure this matches the exact file name

const { Title } = Typography;

const CommentsContext = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllComments = async () => {
      setLoading(true);
      try {
        // Fetch all comments without filtering by mealId
        const response = await fetch('http://localhost:4000/comments');
        const data = await response.json();
        console.log('Fetched all comments:', data);
        // Ensure all comments have a likedBy array
        const normalizedData = Array.isArray(data)
          ? data.map(comment => ({
              ...comment,
              likedBy: Array.isArray(comment.likedBy) ? comment.likedBy : [],
            }))
          : [];
        setComments(normalizedData);
      } catch (error) {
        console.error('Error fetching comments:', error);
        message.error('Failed to load comments');
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllComments();
  }, []);

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: 'Meal ID',
      dataIndex: 'mealId',
      key: 'mealId',
    },
    {
      title: 'Comment ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Likes',
      dataIndex: 'likes',
      key: 'likes',
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => record.parentId ? 'Reply' : 'Comment',
    },
  ];

  return (
    <div className="comments-context">
      <Title level={2}>Comments</Title>
      <Table
        columns={columns}
        dataSource={comments}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: 'No comments available' }}
      />
    </div>
  );
};

export default CommentsContext;