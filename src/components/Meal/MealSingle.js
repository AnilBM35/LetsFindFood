import React, { useState, useEffect, useContext } from 'react';
import './Meal.scss';
import { FaUtensilSpoon } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { BiChevronsRight } from 'react-icons/bi';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Button, Form, Input, List, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UserContext } from '../../App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commentUtil from '../../utils/comment.util';
import favoritesUtil from '../../utils/favorites.util';
import { showSuccessToast, showErrorToast } from '../../utils/toastify.util';

const { TextArea } = Input;
const { Text, Title } = Typography;

const MealSingle = ({ meal }) => {
  const { user } = useContext(UserContext);
  const [isFavorited, setIsFavorited] = useState(false);
  const [form] = Form.useForm();
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [replyFormVisible, setReplyFormVisible] = useState(null);
  const [replyForm] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (!meal?.idMeal) return;
      
      // Fetch comments
      try {
        const data = await commentUtil.getMealComments(meal.idMeal);
        const normalizedData = Array.isArray(data)
          ? data.map(comment => ({
              ...comment,
              likedBy: Array.isArray(comment.likedBy) ? comment.likedBy : [],
            }))
          : [];
        setComments(normalizedData);
      } catch (error) {
        console.error('Error fetching comments:', error);
        showErrorToast('Failed to load comments');
      }

      // Check if favorited
      if (user) {
        try {
          const favorited = await favoritesUtil.isMealFavorited(user.id, meal.idMeal);
          setIsFavorited(favorited);
        } catch (error) {
          console.error('Error checking favorite:', error);
        }
      }
    };

    fetchData();
  }, [meal?.idMeal, user]);

  const handleFavoriteClick = async () => {
    if (!user) {
      showErrorToast('Please login to add favorites');
      return;
    }

    try {
      if (isFavorited) {
        await favoritesUtil.removeFavorite(user.id, meal.idMeal);
        showSuccessToast('Removed from favorites');
      } else {
        await favoritesUtil.addFavorite(user.id, meal.idMeal);
        showSuccessToast('Added to favorites!');
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showErrorToast('Failed to update favorite');
    }
  };

  const handleSubmit = async (values) => {
    if (!user) {
      showErrorToast('Please log in to comment!');
      return;
    }
    if (!values.comment) {
      showErrorToast('Please enter a comment!');
      return;
    }

    setSubmitting(true);
    const newComment = {
      mealId: meal.idMeal,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      author: user.name || 'User',
      content: values.comment,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      parentId: null,
    };

    try {
      await commentUtil.addComment(newComment);
      const updatedComments = await commentUtil.getMealComments(meal.idMeal);
      const normalizedComments = Array.isArray(updatedComments)
        ? updatedComments.map(comment => ({
            ...comment,
            likedBy: Array.isArray(comment.likedBy) ? comment.likedBy : [],
          }))
        : [];
      setComments(normalizedComments);
      form.resetFields();
      showSuccessToast('Comment added!');
    } catch (error) {
      console.error('Error posting comment:', error);
      showErrorToast('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (commentId, values) => {
    if (!user) {
      showErrorToast('Please log in to reply!');
      return;
    }
    if (!values.reply) {
      showErrorToast('Please enter a reply!');
      return;
    }

    setSubmitting(true);
    const newReply = {
      mealId: meal.idMeal,
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      author: user.name || 'User',
      content: values.reply,
      createdAt: new Date().toISOString(),
      parentId: commentId,
      likes: 0,
      likedBy: [],
    };

    try {
      await commentUtil.addComment(newReply);
      const updatedComments = await commentUtil.getMealComments(meal.idMeal);
      const normalizedComments = Array.isArray(updatedComments)
        ? updatedComments.map(comment => ({
            ...comment,
            likedBy: Array.isArray(comment.likedBy) ? comment.likedBy : [],
          }))
        : [];
      setComments(normalizedComments);
      replyForm.resetFields();
      setReplyFormVisible(null);
      showSuccessToast('Reply added!');
    } catch (error) {
      console.error('Error posting reply:', error);
      showErrorToast('Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    if (!user) {
      showErrorToast('Please log in to like!');
      return;
    }

    const comment = comments.find((c) => c.id === commentId);
    if (!comment) {
      showErrorToast('Comment not found!');
      return;
    }

    const hasLiked = (comment.likedBy || []).includes(user.name);
    const updatedComment = {
      ...comment,
      likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
      likedBy: hasLiked
        ? (comment.likedBy || []).filter((name) => name !== user.name)
        : [...(comment.likedBy || []), user.name],
    };

    try {
      await commentUtil.updateComment(commentId, updatedComment);
      const updatedComments = await commentUtil.getMealComments(meal.idMeal);
      const normalizedComments = Array.isArray(updatedComments)
        ? updatedComments.map(comment => ({
            ...comment,
            likedBy: Array.isArray(comment.likedBy) ? comment.likedBy : [],
          }))
        : [];
      setComments(normalizedComments);
      showSuccessToast(hasLiked ? 'Unliked!' : 'Liked!');
    } catch (error) {
      console.error('Error toggling like:', error);
      showErrorToast('Failed to update like');
    }
  };

  const CustomComment = ({ id, author, content, createdAt, likes, likedBy, parentId }) => {
    const normalizedLikedBy = Array.isArray(likedBy) ? likedBy : [];
    const replies = comments
      .filter((c) => c.parentId === id)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return (
      <div style={{ marginBottom: '16px', borderBottom: '1px solid #e8e8e8', paddingBottom: '8px' }}>
        <div style={{ display: 'flex' }}>
          <Avatar icon={<UserOutlined />} />
          <div style={{ marginLeft: '12px', flex: 1 }}>
            <Text strong>{author}</Text>
            <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
              {new Date(createdAt).toLocaleString()}
            </Text>
            <div>{content}</div>
            <div style={{ marginTop: '8px' }}>
              <Button
                type="link"
                onClick={() => handleLike(id)}
                style={{
                  color: normalizedLikedBy.includes(user?.name) ? '#ff4d4f' : '#1890ff',
                  padding: 0,
                  height: 'auto',
                }}
              >
                {normalizedLikedBy.includes(user?.name) ? 'Unlike' : 'Like'} ({likes || 0})
              </Button>
              <Button
                type="link"
                onClick={() => setReplyFormVisible(id === replyFormVisible ? null : id)}
                style={{ padding: '0', height: 'auto', marginLeft: '16px' }}
              >
                Reply
              </Button>
            </div>
            {replyFormVisible === id && (
              <Form
                form={replyForm}
                onFinish={(values) => handleReplySubmit(id, values)}
                style={{ marginTop: '12px' }}
              >
                <Form.Item name="reply" rules={[{ required: true, message: '' }]}>
                  <TextArea rows={2} placeholder="Add a reply..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    Submit Reply
                  </Button>
                </Form.Item>
              </Form>
            )}
            {replies.length > 0 && (
              <List
                dataSource={replies}
                renderItem={(reply) => (
                  <div style={{ marginLeft: '24px', marginTop: '8px' }}>
                    <CustomComment {...reply} />
                  </div>
                )}
                locale={{ emptyText: '' }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (!meal || !meal.idMeal) {
    return <div>Loading meal details...</div>;
  }

  const tags = meal.tags ? meal.tags.split(',') : [];
  const instructions = meal.instructions
    ? meal.instructions.split('\r\n').filter((i) => i.length > 1)
    : [];

  return (
    <div className="section-wrapper">
      <ToastContainer />
      <div className="container">
        <div className="breadcrumb bg-orange text-white">
          <ul className="flex align-center my-2">
            <li className="breadcrumb-item">
              <Link to="/" className="flex align-center">
                <AiFillHome size={22} />
              </Link>
            </li>
            <li className="flex align-center mx-1">
              <BiChevronsRight size={23} />
            </li>
            <li className="breadcrumb-item flex">
              <span className="fs-15 fw-5 text-uppercase">{meal.title}</span>
            </li>
          </ul>
        </div>

        <div className="sc-title">Meal Details</div>
        <section className="sc-details bg-white">
          <div className="details-head grid">
            <div className="details-img">
              <img src={meal.thumbnail} alt={meal.title} className="img-cover" />
              <Button
                type="text"
                icon={isFavorited ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={handleFavoriteClick}
                className="meal-fav-btn"
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                style={{ fontSize: '24px' }}
              />
            </div>
            <div className="details-intro">
              <h3 className="title text-orange">{meal.title}</h3>
              <div className="py-4">
                <div className="category flex align-center">
                  <span className="text-uppercase fw-8 ls-1 my-1">Category: </span>
                  <span className="text-uppercase ls-2">{meal.category}</span>
                </div>
                {meal.source && (
                  <div className="source flex align-center">
                    <span className="fw-7">Source: </span>
                    <a href={meal.source} target="_blank" rel="noopener noreferrer">
                      {meal.source.substring(0, 40) + '...'}
                    </a>
                  </div>
                )}
              </div>
              {tags.length > 0 && (
                <div className="tags flex align-start flex-wrap">
                  <h6 className="fs-16">Tags:</h6>
                  <ul className="flex align-center flex-wrap">
                    {tags.map((tag, idx) => (
                      <li key={idx} className="fs-14">
                        {tag.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="ingredients my-5 px-3 py-3">
                <h6 className="fs-16 text-white">Ingredients</h6>
                <ul className="grid">
                  {meal.ingredients?.map((ingredient, idx) => (
                    <li key={idx} className="flex align-center">
                      <span className="li-dot">{idx + 1}</span>
                      <span className="text-capitalize text-white fs-15">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="details-body">
            {meal.measures?.length > 0 && (
              <div className="measures my-4">
                <h6 className="fs-16">Measurements:</h6>
                <ul className="grid">
                  {meal.measures.map((measure, idx) => (
                    <li key={idx} className="fs-14 flex align-end">
                      <span className="li-icon fs-12 text-orange">
                        <FaUtensilSpoon />
                      </span>
                      <span className="li-text fs-15 fw-6 op-09">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="instructions my-4">
              <h6 className="fs-16">Instructions:</h6>
              <ul className="grid">
                {instructions.map((instruction, idx) => (
                  <li key={idx} className="fs-14">
                    <AiOutlineCheckSquare size={18} className="text-orange li-icon" />
                    <span className="li-text fs-16 fw-5 op-09">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="comments-section my-4">
              <Title level={4}>Comments</Title>
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="comment" rules={[{ required: true, message: '' }]}>
                  <TextArea rows={4} placeholder="Add a comment..." disabled={!user} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={!user}>
                    Submit Comment
                  </Button>
                </Form.Item>
              </Form>
              <List
                dataSource={comments
                  .filter((c) => c.parentId === null)
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
                renderItem={(item) => <CustomComment {...item} />}
                locale={{ emptyText: 'No comments yet. Be the first to comment!' }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MealSingle;