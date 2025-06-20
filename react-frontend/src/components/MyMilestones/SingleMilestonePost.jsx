import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNotification } from '../../components/Notification/NotificationContext';
import { authService } from '../../services/authService';

import { milestonePostService } from '../../services/milestonePostService';
import { userService } from '../../services/userService';
import PostActions from './PostActions';
import TemplateContent from './TemplateContent';
import LoadingSpinner from '../Public/LoadingSpinner';


dayjs.extend(relativeTime);


const SingleMilestoneThree = (props) => {
  const {
    itemClass,
    postId,
    authorName,
    date,
    profileImg,
    skill,
    title,
    templateType,
    templateData,
    likes,
    comments: commentsData
  } = props;

  const [currentTemplateType, setCurrentTemplateType] = useState(templateType);
const [currentTemplateData, setCurrentTemplateData] = useState(templateData);

  const { showNotification } = useNotification();
  const [token, setToken] = useState(null);
  

  //const avatarImage = profileImg;
  
  const initialLikes = parseInt(likes, 10) || 0;
  const [currentLikes, setCurrentLikes] = useState(initialLikes);

  const initialComments = commentsData && commentsData.comments
    ? commentsData.comments
    : [];

  const [postComments, setPostComments] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // States for comment editing
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  // States for comment deletion confirmation
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);

  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user details and check if user has liked the post
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch user details
        const userData = await userService.getMe();
        setUserDetails(userData);
        
        const postDetails = await milestonePostService.getById(postId);

        // Check if current user has liked this post
        if (postDetails.likedUserIds && postDetails.likedUserIds.includes(userData.id)) {
          setHasLiked(true);
        }
        
        // Update likes count from fetched data
        if (postDetails.likes) {
          setCurrentLikes(postDetails.likes.length);
        }
        
        // Update comments from fetched data
        if (postDetails.comments) {
          setPostComments(postDetails.comments);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching initial data:', err);
        showNotification('Failed to load post data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchInitialData();
    }
  }, [postId]);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        // Remove like
        await milestonePostService.removeLike(postId);
        setCurrentLikes(prevLikes => prevLikes - 1);
        setHasLiked(false);
        showNotification('Like removed', 'success');
      } else {
        // Add like
        await milestonePostService.addLike(postId);
        setCurrentLikes(prevLikes => prevLikes + 1);
        setHasLiked(true);
        showNotification('Post liked successfully', 'success');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      showNotification(`Failed to ${hasLiked ? 'remove' : 'add'} like`, 'error');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const commentData = { content: newComment };
      const response = await milestonePostService.addComment(postId, commentData);

      const newCommentObj = response.comment || {
        commentId: response.id || Date.now().toString(),
        authorId: userDetails.id,
        authorName: userDetails.name || userDetails.username || 'You',
        content: newComment,
        profileImageUrl: userDetails.profileImageUrl || 'default-avatar.png',
        timestamp: new Date().toISOString()
      };
      
      setPostComments(prevComments => [...prevComments, newCommentObj]);
      setNewComment('');
      showNotification('Comment added', 'success');
    } catch (error) {
      console.error('Error adding comment:', error);
      showNotification('Failed to add comment', 'error');
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showNotification(`${isFollowing ? 'Unfollowed' : 'Following'} ${authorName}`, 'success');
  };

  // Start editing a comment
  const startEditComment = (index) => {
    setEditingCommentIndex(index);
    setEditCommentText(postComments[index].content);
  };

  // Cancel editing a comment
  const cancelEditComment = () => {
    setEditingCommentIndex(null);
    setEditCommentText('');
  };

  // Save edited comment
  const saveEditedComment = async (index) => {
    if (!editCommentText.trim()) return;
    
    const commentToEdit = postComments[index];
    const commentId = commentToEdit.id || commentToEdit.commentId;
    
    try {
      const commentData = { content: editCommentText };
      await milestonePostService.editComment(postId, commentId, commentData);
      
      const updatedComments = [...postComments];
      updatedComments[index] = {
        ...updatedComments[index],
        content: editCommentText
      };
      
      setPostComments(updatedComments);
      setEditingCommentIndex(null);
      setEditCommentText('');
      showNotification('Comment edited', 'success');
    } catch (error) {
      console.error('Error editing comment:', error);
      showNotification('Failed to edit comment', 'error');
      cancelEditComment();
    }
  };

  // Show delete confirmation
  const confirmDeleteComment = (index) => {
    setDeleteConfirmIndex(index);
  };

  // Cancel delete
  const cancelDeleteComment = () => {
    setDeleteConfirmIndex(null);
  };

  // Delete comment after confirmation
  const handleDeleteComment = async (index) => {
    const commentToDelete = postComments[index];
    const commentId = commentToDelete.id || commentToDelete.commentId;
    
    try {
      await milestonePostService.removeComment(postId, commentId);
      
      const updatedComments = [...postComments];
      updatedComments.splice(index, 1);
      setPostComments(updatedComments);
      setDeleteConfirmIndex(null);
      showNotification('Comment deleted', 'success');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showNotification('Failed to delete comment', 'error');
      cancelDeleteComment();
    }
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    return dayjs(dateString).fromNow();
  };


  // Add these state variables to your existing useState declarations
const [isEditing, setIsEditing] = useState(false);
const [editFormData, setEditFormData] = useState({
    // skill: skill || '',
    // title: title || '',
    templateType: templateType || '',
    templateData: { ...templateData }
  });

// Add this function to handle edit button click
const handleEditClick = () => {
    setIsEditing(true);
    setEditFormData({
    //   skill: skill || '',
    //   title: title || '',
      templateType: templateType || '',
      templateData: { ...templateData }
    });
  };

// Add this function to handle form input changes
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setEditFormData({
    ...editFormData,
    [name]: value
  });
};

// Add this function to handle template data changes
const handleTemplateDataChange = (e) => {
  const { name, value } = e.target;
  setEditFormData({
    ...editFormData,
    templateData: {
      ...editFormData.templateData,
      [name]: value
    }
  });
};

// Add this function to handle form submission
const handleEditSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const updatedData = {
      templateType: editFormData.templateType,
      templateData: editFormData.templateData
    };
    
    await milestonePostService.update(postId, updatedData);
    
    // Update local state
    setCurrentTemplateType(updatedData.templateType);
    setCurrentTemplateData(updatedData.templateData);
    
    // Notify parent component if needed
    if (props.onUpdate) {
      props.onUpdate(updatedData);
    }
    
    showNotification('Post updated successfully', 'success');
    setIsEditing(false);
    
  } catch (error) {
    console.error('Error updating post:', error);
    showNotification('Failed to update post', 'error');
  } finally {
    setIsLoading(false);
  }
};

// Add this function to cancel editing
const handleCancelEdit = () => {
  setIsEditing(false);
};

const handleDelete = async () => {
  setLoading(true);
  try {
    await milestonePostService.delete(postId);
    window.location.reload(); // Refresh the page or redirect as needed
    //if (onDelete) onDelete(postId);
  } catch (error) {
    console.error("Failed to delete:", error);
  }
  setLoading(false);
  setShowConfirm(false);
};

  if (isLoading) {
    return <LoadingSpinner size="50px" color="#e74c3c" />
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={itemClass ? itemClass : 'inner-milestone'}>
      {/* Post Header */}
      <div className="case-content">
        <div className="react__user_milestone">
          <div className="user-info">
            <img src={profileImg} alt="User Avatar" /> 
            <div className="user-details">
              <span className="user-name">{authorName}</span>
              <span className="post-date">{formatDate(date)}</span>
            </div>
          </div>
          <button className="follow-btn" onClick={handleEditClick} disabled={isLoading}>
            Edit
          </button>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              //className="bg-transparent text-red px-4 py-2 border-0 hover:bg-red-700 text-sm"
              style={{ border: 'none', fontSize: '14px', color: 'red' , background:'transparent', cursor: 'pointer', marginLeft: '10px'}}
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm mr-2">Confirm?</span>
              <button
                onClick={handleDelete}
                style={{ border: 'none', fontSize: '14px', color: 'red' , background:'transparent', cursor: 'pointer', marginLeft: '10px'}}
                disabled={loading}
              >
                {loading ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-800 px-3 py-1 text-sm rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          )}
          
        </div>
                
        {/* Post Title */}
        <h4 className="case-title">
          <Link to={`/milestone/${postId}`}>
            {templateData.title || 'Untitled Post'}
          </Link>
        </h4>
        
        {isEditing ? (
  <div className="edit-milestone-form">
    <form onSubmit={handleEditSubmit}>
      {/* <div className="form-group">
        <label>Skill</label>
        <input
          type="text"
          name="skill"
          value={editFormData.skill || skill}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleInputChange}
          disabled="disabled"
        />
      </div> */}

      <div className="form-group">
  <label>Template Type</label>
  <select
    name="templateType"
    value={templateType}
    disabled="disabled"
  >
    <option value="TODAY_I_LEARNED">{templateType}</option>
    {/* <option value="PROJECT_SHOWCASE">Project Showcase</option>
    <option value="ACHIEVEMENT">Achievement</option>
    <option value="SKILL_PROGRESS">Skill Progress</option> */}
    {/* Add other template types as needed */}
  </select>
</div>
      
      {/* Dynamic form fields based on templateType */}
      {templateType === 'TODAY_I_LEARNED' && (
        <>
          <div className="form-group">
            <label>Skill</label>
            <input
              type="text"
              name="topicSkill"
              value={editFormData.templateData.topicSkill || skill}
              onChange={handleTemplateDataChange}
              
            />
          </div>
          
          <div className="form-group">
            <label>What I learned</label>
            <input
              type="text"
              name="whatLearned"
              value={editFormData.templateData.whatLearned || ''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label>Resource used</label>
            <input
              type="text"
              name="resourceUsed"
              value={editFormData.templateData.resourceUsed || ''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label>Next step</label>
            <input
              type="text"
              name="nextStep"
              value={editFormData.templateData.nextStep || ''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={editFormData.templateData.date || ''}
              onChange={handleTemplateDataChange}
              
            />
          </div>
        </>
      )}

      {templateType === 'WEEKLY_SUMMARY' && (
        <>
          <div className="form-group">
            <label>What I Worked On :</label>
            <input
              type="text"
              name="workedOn"
              value={editFormData.templateData.workedOn || ''}
              onChange={handleTemplateDataChange}
              
            />
          </div>
          
          <div className="form-group">
            <label>Highlights :</label>
            <input
              type="text"
              name="highlights"
              value={editFormData.templateData.highlights || ''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label>Challenges:</label>
            <input
              type="textfield"
              name="challenge"
              value={editFormData.templateData.challenge || ''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label>Next Focus :</label>
            <input
              type="text"
              name="nextFocus"
              value={editFormData.templateData.nextFocus ||''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Progress :</label>
            <input
              type="text"
              name="progress"
              value={editFormData.templateData.progress || ''}
              onChange={handleTemplateDataChange}
              
            />
          </div>
        </>
      )}

      {templateType === 'COMPLETED_A_TUTORIAL' && (
        <>
          <div className="form-group">
            <label>Tutorial/Project name :</label>
            <input
              type="text"
              name="tutorialName"
              value={editFormData.templateData.tutorialName || ''}
              onChange={handleTemplateDataChange}
              
            />
          </div>
          
          <div className="form-group">
            <label>Platform/Source :</label>
            <input
              type="text"
              name="platform"
              value={editFormData.templateData.platform || ''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label>Duration :</label>
            <input
              type="textfield"
              name="duration"
              value={editFormData.templateData.duration || ''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label>Skills Gained :</label>
            <input
              type="text"
              name="skillsGained"
              value={editFormData.templateData.skillsGained ||''}
              onChange={handleTemplateDataChange}
            />
          </div>
          
          <div className="form-group">
            <label>What I built/achieved :</label>
            <input
              type="text"
              name="achievement"
              value={editFormData.templateData.achievement || ''}
              onChange={handleTemplateDataChange}
              
            />
          </div>

          <div className="form-group">
            <label>Demo Link :</label>
            <input
              type="text"
              name="demoLink"
              value={editFormData.templateData.demoLink || ''}
              onChange={handleTemplateDataChange}
              
            />
          </div>

          <div className="form-group">
            <label>Difficulty Level : </label>
            <select
              type="text"
              name="difficulty"
              value={editFormData.templateData.difficulty || ''}
              onChange={handleTemplateDataChange}
              
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Would you recommend it? </label>
            <select
              type="text"
              name="recommendation"
              value={editFormData.templateData.recommendation || ''}
              onChange={handleTemplateDataChange}
              
            >
              <option value="recommended">Yes</option>
              <option value="not recommended">No</option>
            </select>
            <textarea 
            type="text"
              name="recommendationReason"
              value={editFormData.templateData.recommendationReason || ''}
              style={{marginTop: '10px'}}
              onChange={handleTemplateDataChange}
            />
          </div>
        </>
      )}
      
      {/* Add similar form fields for other template types as needed */}
      
      <div className="form-actions">
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" className="cancel-btn" onClick={handleCancelEdit} disabled={isLoading}>
          Cancel
        </button>
      </div>
    </form>
  </div>
) : (
  /* Your existing template content component */
  <TemplateContent 
  templateType={currentTemplateType} 
  templateData={currentTemplateData} 
/>
)}
          
        {/* Post Meta */}
        <ul className="meta-milestone">
          <li>
            {currentLikes} Likes
          </li>
          <li>
            {postComments.length} Comments
          </li>
        </ul>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="comment-section">
          {postComments.length === 0 ? (
            <p className="text-muted">No comments yet.</p>
          ) : (
            <ul className="comment-list">
              {postComments.map((c, index) => {
                const commentAvatar = c.profileImageUrl;
                const isCurrentUserComment = userDetails && (c.authorId === userDetails.id);
                
                return (
                  <li key={c.id || c.commentId || index} className="comment-item">
                    <div className="commenter-info">
                      <img
                        src={commentAvatar}
                        alt="Commenter Avatar"
                        className="commenter-avatar"
                      />
                      <div className="comment-details">
                        <div className="comment-header">
                          <div className="comment-user-info">
                            <strong>{c.authorName || c.authorId}</strong>
                            <span className="comment-date">{formatDate(c.timestamp || c.createdAt)}</span>
                          </div>
                          
                          
                            <div className="comment-actions">
                            {isCurrentUserComment && editingCommentIndex !== index && deleteConfirmIndex !== index && (
                              <button 
                                className="edit-comment-btn" 
                                onClick={() => startEditComment(index)}
                                aria-label="Edit comment"
                                disabled={isLoading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                              </button>
                              )}
                              <button 
                                className="delete-comment-btn" 
                                onClick={() => confirmDeleteComment(index)}
                                aria-label="Delete comment"
                                disabled={isLoading}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          
                        </div>
                        
                        {editingCommentIndex === index ? (
                          <div className="edit-comment-form">
                            <textarea
                              className="edit-comment-input"
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              disabled={isLoading}
                            />
                            <div className="edit-comment-actions">
                              <button className="save-comment-btn" onClick={() => saveEditedComment(index)} disabled={isLoading}>
                                Save
                              </button>
                              <button className="cancel-comment-btn" onClick={cancelEditComment} disabled={isLoading}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : deleteConfirmIndex === index ? (
                          <div className="delete-confirmation">
                            <p style={{color:"red"}}>Are you sure you want to delete this comment?</p>
                            <div className="delete-confirmation-actions">
                              <button className="confirm-delete-btn" onClick={() => handleDeleteComment(index)} disabled={isLoading}>
                                Yes, Delete
                              </button>
                              <button className="cancel-delete-btn" onClick={cancelDeleteComment} disabled={isLoading}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="comment-text">{c.content || c.comment}</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <div className="comment-input-group">
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isLoading}
              />
              <button className="comment-submit-btn" type="submit" disabled={isLoading || !newComment.trim()}>
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Post Actions */}
      <PostActions
  hasLiked={hasLiked}
  onLike={handleLike}
  onToggleComments={toggleComments}
  disabled={isLoading}
/>
    </div>
  );
};

export default SingleMilestoneThree;