import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, Input, Card } from 'antd';
import { UserContext } from '../../App';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UserSignup = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [form] = Form.useForm();
  const { setUser } = useContext(UserContext);

  const styles = {
    loginContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      backgroundImage:
        'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("../../assets/images/header_image.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    card: {
      marginTop: 16,
      width: 500,
      margin: '100px auto',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    },
    title: {
      textAlign: 'center',
      margin: 0,
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    messageSuccess: {
      color: '#52c41a',
      marginBottom: 16,
      textAlign: 'center',
    },
    messageError: {
      color: '#ff4d4f',
      marginBottom: 16,
      textAlign: 'center',
    },
    form: {
      maxWidth: 600,
    },
    submitButton: {
      backgroundColor: '#ff8c42',
      borderColor: '#ff8c42',
    },
    helpText: {
      textAlign: 'center',
      marginTop: 16,
      color: '#666',
    },
    linkText: {
      color: '#ff8c42',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  };

  useEffect(() => {
    console.log('User Signup component mounted');
    return () => console.log('User Signup component unmounted');
  }, []);

  const onFinish = async (values) => {
    console.log('User Signup attempt with:', values);
    try {
      const response = await axios.post('http://localhost:4000/users', {
        name: values.name,
        email: values.email,
        password: values.password,
        age: values.age,
        role: 'user',
      });

      // Assuming the response contains the user data (e.g., { id, name, email, role })
      const newUser = response.data;
      setUser(newUser); // Update UserContext with the new user

      toast.success('Signup successful! Redirecting to login...', {
        position: 'top-right',
        autoClose: 3000,
      });

      form.resetFields();
      setMessage('Signup successful!');

      // Redirect to login page after a short delay to show the toast
      setTimeout(() => navigate('/user/login'), 3500);
    } catch (error) {
      console.error('User Signup error:', error);
      toast.error('Signup failed. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setMessage('Signup error. Please try again.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Validation Failed:', errorInfo);
    toast.warn('Please fill in all required fields', {
      position: 'top-right',
      autoClose: 3000,
    });
    setMessage('Please input valid form');
  };

  return (
    <div style={styles.loginContainer}>
      <ToastContainer />
      <Card
        style={styles.card}
        type="inner"
        title={<h1 style={styles.title}>User Signup</h1>}
        styles={{
          header: {
            background: '#ff8c42',
            borderColor: '#ff8c42',
          },
        }}
      >
        {message && (
          <div style={message.includes('error') ? styles.messageError : styles.messageSuccess}>
            {message}
          </div>
        )}

        <Form
          form={form}
          name="user_signup"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={styles.form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[
              { required: true, message: 'Please input your age!' },
              { pattern: /^[0-9]+$/, message: 'Age must be a number!' },
              {
                validator: (_, value) =>
                  value >= 13 ? Promise.resolve() : Promise.reject('You must be at least 13 years old!'),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={styles.submitButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e67e22';
                e.currentTarget.style.borderColor = '#e67e22';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ff8c42';
                e.currentTarget.style.borderColor = '#ff8c42';
              }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div style={styles.helpText}>
          <span>Already registered? </span>
          <span
            style={styles.linkText}
            onClick={() => navigate('/user/login')}
            onMouseOver={(e) => (e.currentTarget.style.color = '#e67e22')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#ff8c42')}
          >
            Click here!
          </span>
        </div>
      </Card>
    </div>
  );
};

export default UserSignup;