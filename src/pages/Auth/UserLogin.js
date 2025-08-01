import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form, Input, Card } from 'antd';
import { UserContext } from '../../App';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const UserLogin = () => {
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
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("../../assets/images/header_image.jpg")',
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
    }
  };
  
  useEffect(() => {
    console.log("User Login component mounted");
    return () => console.log("User Login component unmounted");
  }, []);

  const onFinish = async (values) => {
    console.log('User Login attempt with:', values);
    try {
      const response = await axios.get(
        `http://localhost:4000/users?email=${values.email}&password=${values.password}`
      );
      
      if (response.data.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const user = response.data[0];
      
      toast.success("Login successful! Redirecting...", {
        position: "top-left",
        autoClose: 2000,
      });
      
      setUser(user);
      localStorage.setItem('is_login', '1');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_role', user.role);
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error("User Login error:", error);
      toast.error("Login failed. Please check your credentials.", {
        position: "top-right",
        autoClose: 3000,
      });
      setMessage("Invalid email or password");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Validation Failed:', errorInfo);
    toast.warn("Please fill in all required fields", {
      position: "top-right",
      autoClose: 3000,
    });
    setMessage("Please input valid form");
  };

  return (
    <div style={styles.loginContainer}>
      <ToastContainer />
      <Card
        style={styles.card}
        type="inner"
        title={<h1 style={styles.title}>User Login</h1>}
        styles={{
          header: {
            background: '#ff8c42',
            borderColor: '#ff8c42',
          }
        }}
      >
        {message && (
          <div style={message.includes("error") ? styles.messageError : styles.messageSuccess}>
            {message}
          </div>
        )}
        
        <Form
          form={form}
          name="user_login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={styles.form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password />
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
              Login
            </Button>
          </Form.Item>
        </Form>
        
        <div style={styles.helpText}>
          <span>Don't have an account? </span>
          <span 
            style={styles.linkText}
            onClick={() => navigate('/user/signup')}
            onMouseOver={(e) => e.currentTarget.style.color = '#e67e22'}
            onMouseOut={(e) => e.currentTarget.style.color = '#ff8c42'}
          >
            Sign up here!
          </span>
        </div>
      </Card>
    </div>
  );
};

export default UserLogin;