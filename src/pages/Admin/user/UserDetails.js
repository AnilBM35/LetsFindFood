import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from 'axios';
import { Card, Descriptions, Spin, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserDetails = (props) => {
  let params = useParams();
  const [user, setUser] = useState({
    name: '',
    age: '',
    email: '',
    role: '',
  });
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true); // Start loading
    axios.get(`http://localhost:4000/users/${params.userId}`)
      .then(function (response) {
        setUser(response.data);
        setLoading(false); // Stop loading when data is fetched
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false); // Stop loading on error
      });
  }, [params.userId]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card
        title={
          <Title level={3} style={{ margin: 0, color: '#ff8c42' }}>
            <UserOutlined style={{ marginRight: '8px' }} /> User Details
          </Title>
        }
        bordered={false}
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
        headStyle={{
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #e8e8e8',
          borderRadius: '8px 8px 0 0',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" tip="Loading user details..." />
          </div>
        ) : (
          <Descriptions
            bordered
            column={1}
            size="middle"
            labelStyle={{ fontWeight: 'bold', width: '150px', backgroundColor: '#f5f5f5' }}
            contentStyle={{ backgroundColor: '#fff' }}
          >
            <Descriptions.Item label="Full Name">{user.name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Age">{user.age || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Role">{user.role || 'N/A'}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  );
};

export default UserDetails;