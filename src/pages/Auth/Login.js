import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { Button, Form, Input, Card } from 'antd';
import { UserContext } from '../../App';

const Login = () => {
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
      '&:hover': {
        backgroundColor: '#e67e22',
        borderColor: '#e67e22',
      }
    },
    helpText: {
      textAlign: 'center',
      marginTop: 16,
      color: '#666',
    },
  };

  useEffect(() => {
    console.log("Login component mounted");
    return () => console.log("Login component unmounted");
  }, []);

  const checkLogin = async (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      return {
        id: 1,
        name: 'Admin User',
        email: username,
        role: 'admin'
      };
    }
    return null;
  };

  const onFinish = async (values) => {
    console.log('Login attempt with:', values);
    try {
      const data = await checkLogin(values.username, values.password);
      
      if (data === null) {
        console.log("Login failed");
        toast.error("Login failed. Please check your credentials.");
        setMessage("Invalid username or password");
      } else {
        console.log("Login successful, user data:", data);
        toast.success("Login successful! Redirecting...");
        
        setUser(data);
        localStorage.setItem('is_login', '1');
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('user_role', 'admin');
        
        setTimeout(() => {
          navigate('/admin/dashboard', { replace: true });
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      setMessage("Login error. Please try again.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Validation Failed:', errorInfo);
    setMessage("Please input valid form");
  };

  return (
    <div style={styles.loginContainer}>
      <Card
        style={styles.card}
        type="inner"
        title={<h1 style={styles.title}>Admin Login</h1>}
        styles={{
          header: {
            background: '#ff8c42',
            borderColor: '#ff8c42',
          },
          body: {
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#333',
          }
        }}
      >
        {message && (
          <div style={message.includes("Invalid") ? styles.messageError : styles.messageSuccess}>
            {message}
          </div>
        )}
        
        <Form
          form={form}
          name="login"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={styles.form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={styles.submitButton}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        
        <div style={styles.helpText}>
          {/* Demo credentials can be added here if needed */}
        </div>
      </Card>
    </div>
  );
};

export default Login;