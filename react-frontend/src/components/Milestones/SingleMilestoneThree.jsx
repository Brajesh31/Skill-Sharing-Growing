import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../components/Notification/NotificationContext';
import { milestonePostService } from '../../services/milestonePostService';
import { userService } from '../../services/userService';
import LoadingSpinner from '../Public/LoadingSpinner';


dayjs.extend(relativeTime);

const SingleMilestoneThree = (props) => {
  const {
    itemClass,
    authorId,
    postId,
    authorName,
    date,
    profileImg,
    templateType,
    templateData,
    likes,
    comments
  } = props;

  const [userDetails, setUserDetails] = useState(null);        // Current user
  const [isFollowing, setIsFollowing] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const initialLikes = parseInt(likes, 10) || 0;
  const [currentLikes, setCurrentLikes] = useState(initialLikes);

  const initialComments = comments?.comments ?? [];
  const [postComments, setPostComments] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Comment editing states
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showNotification } = useNotification();

  // Fetch current user, post details, and author follow status
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get current user info
        const user = await userService.getMe();
        setUserDetails(user);

        // Get post details
        const postDetails = await milestonePostService.getById(postId);

        // Likes
        if (postDetails.likedUserIds?.includes(user.id)) {
          setHasLiked(true);
        }
        if (Array.isArray(postDetails.likes)) {
          setCurrentLikes(postDetails.likes.length);
        }

        // Comments
        if (Array.isArray(postDetails.comments)) {
          setPostComments(postDetails.comments);
        }

        // Get author info to check if current user follows them
        const author = await userService.getUserById(authorId);
        setIsFollowing(!!author.currentUserFollows);
      } catch {
        setError('Failed to load post data.');
        showNotification('Failed to load post data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId && authorId) {
      fetchData();
    }
  }, [postId, authorId, showNotification]);

  // Handle like/unlike
  const handleLike = async () => {
    if (isLoading) return;
    try {
      if (hasLiked) {
        await milestonePostService.removeLike(postId);
        setCurrentLikes(prev => Math.max(prev - 1, 0));
        setHasLiked(false);
        showNotification('Like removed', 'success');
      } else {
        await milestonePostService.addLike(postId);
        setCurrentLikes(prev => prev + 1);
        setHasLiked(true);
        showNotification('Post liked', 'success');
      }
    } catch {
      showNotification('Error updating like', 'error');
    }
  };

  // Toggle comment section visibility
  const toggleComments = () => setShowComments(prev => !prev);

  // Submit new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    try {
      const commentData = { content: newComment.trim() };
      const response = await milestonePostService.addComment(postId, commentData);

      const newObj = response.comment || {
        commentId: response.id || Date.now().toString(),
        authorId: userDetails.id,
        authorName: userDetails.name || userDetails.username || 'You',
        content: newComment.trim(),
        profileImageUrl: userDetails.profileImageUrl || 'default-avatar.png',
        timestamp: new Date().toISOString()
      };

      setPostComments(prev => [...prev, newObj]);
      setNewComment('');
      showNotification('Comment added', 'success');
    } catch {
      showNotification('Failed to add comment', 'error');
    }
  };

  // Follow/unfollow author
  const handleFollow = async () => {
    if (isLoading) return;
    try {
      if (isFollowing) {
        await userService.unfollowUser(authorId);
        showNotification(`Unfollowed ${authorName}`, 'success');
      } else {
        await userService.followUser(authorId);
        showNotification(`Following ${authorName}`, 'success');
      }
      setIsFollowing(prev => !prev);
    } catch {
      showNotification('Error updating follow status', 'error');
    }
  };

  // Comment editing handlers
  const startEditComment = (idx) => {
    setEditingCommentIndex(idx);
    setEditCommentText(postComments[idx].content);
  };
  const cancelEditComment = () => {
    setEditingCommentIndex(null);
    setEditCommentText('');
  };
  const saveEditedComment = async (idx) => {
    if (!editCommentText.trim()) return;
    const comment = postComments[idx];
    const commentId = comment.id || comment.commentId;

    try {
      await milestonePostService.editComment(postId, commentId, { content: editCommentText.trim() });
      setPostComments(prev => prev.map((c, i) => i === idx ? { ...c, content: editCommentText.trim() } : c));
      cancelEditComment();
      showNotification('Comment edited', 'success');
    } catch {
      showNotification('Failed to edit comment', 'error');
      cancelEditComment();
    }
  };

  // Comment deletion handlers
  const confirmDeleteComment = (idx) => setDeleteConfirmIndex(idx);
  const cancelDeleteComment = () => setDeleteConfirmIndex(null);
  const handleDeleteComment = async (idx) => {
    const comment = postComments[idx];
    const commentId = comment.id || comment.commentId;

    try {
      await milestonePostService.removeComment(postId, commentId);
      setPostComments(prev => prev.filter((_, i) => i !== idx));
      cancelDeleteComment();
      showNotification('Comment deleted', 'success');
    } catch {
      showNotification('Failed to delete comment', 'error');
      cancelDeleteComment();
    }
  };

  // Format date to relative time
  const formatDate = (ds) => dayjs(ds).fromNow();

  // Render template-specific content
  const renderTemplateContent = () => {
    if (!templateData) return null;
    switch (templateType) {
      case 'TODAY_I_LEARNED':
        return (
          <div className="milestone-template today-learned">
            <h5>Topic/Skill: {templateData.topicSkill}</h5>
            <div className="milestone-section">
              <p>What I Learned: {templateData.whatLearned}</p>
            </div>
            {templateData.resourceUsed?.length > 0 && (
              <div className="milestone-section">
                <h6>Resources Used:</h6>
                <ul className="resource-list">
                  {templateData.resourceUsed.map((r, i) => (
                    <li key={i}><a href={r} target="_blank" rel="noopener noreferrer">{r}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <div className="milestone-section" style={{ marginTop: '20px' }}>
              <p>Next Steps: {templateData.nextStep}</p>
            </div>
          </div>
        );
      case 'WEEKLY_SUMMARY':
        return (
          <div className="milestone-template weekly-summary">
            <div className="milestone-section"><span style={{ color: "blue" }}>What I Worked On :</span>&nbsp;{templateData.workedOn}</div>
            <div className="milestone-section"><span style={{ color: "blue" }}>Highlights :</span>&nbsp;{templateData.highlights}</div>
            <div className="milestone-section"><span style={{ color: "blue" }}>Challenges:</span>&nbsp;{templateData.challenge}</div>
            <div className="milestone-section"><span style={{ color: "blue" }}>Next Focus :</span>&nbsp;{templateData.nextFocus}</div>
            <div className="milestone-section"><span style={{ color: "blue" }}>Progress :</span>&nbsp;{templateData.progress}</div>
          </div>
        );
      case 'COMPLETED_A_TUTORIAL':
        return (
          <div className="milestone-template completed-tutorial">
            <div className="tutorial-info">
              <p>Tutorial/Project name : {templateData.tutorialName}</p>
              <p>Platform : {templateData.platform}</p>
              <p>Duration : {templateData.duration} &nbsp;&nbsp;&nbsp;&nbsp; Difficulty: {templateData.difficulty}</p>
              <p>Skills Gained : {templateData.skillsGained}</p>
              <p>Achievements : {templateData.achievement}</p>
              <p> Recommendation : {templateData.recommendation}</p>
              <p><em>Why: {templateData.recommendationReason}</em></p>
            </div>
            {templateData.demoLink && (
              <div className="milestone-section">
                <h6>Demo Link :</h6>
                <a href={templateData.demoLink} target="_blank" rel="noopener noreferrer">{templateData.demoLink}</a>
              </div>
            )}
          </div>
        );
      default:
        return <div className="milestone-content"><p>No post</p></div>;
    }
  };

  // if (isLoading) return <LoadingSpinner size="50px" color="#e74c3c" />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className={itemClass ? itemClass : 'inner-milestone'}>
      {/* Post Header */}
      <div className="case-content">
        <div className="react__user_milestone">
          <div className="user-info">
            <img src={profileImg} alt={`${authorName}`} />
            <div className="user-details">
              <a href={`http://localhost:3000/author/${authorId}`} className="user-name">
                {authorName}
              </a>
              <span className="post-date">{formatDate(date)}</span>
            </div>

          </div>
          {userDetails?.id !== authorId && (
            <button className="follow-btn" onClick={handleFollow} disabled={isLoading}>
              {isFollowing ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check" style={{ marginRight: '5px' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Following
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus" style={{ marginRight: '5px' }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Follow
                </>
              )}
            </button>
          )}
        </div>

        {/* Post Title */}
        <h4 className="case-title">
          <Link to="/milestones">
            {templateData.title || 'Untitled Post'}
          </Link>
        </h4>

        {/* Template Specific Content */}
        {renderTemplateContent()}

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

                          {isCurrentUserComment && editingCommentIndex !== index && deleteConfirmIndex !== index && (
                            <div className="comment-actions">
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
                          )}
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
                            <p style={{ color: "red" }}>Are you sure you want to delete this comment?</p>
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
      <div className="post-actions">
        <button className={`action-btn like-btn ${hasLiked ? 'liked' : ''}`} onClick={handleLike} disabled={isLoading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
          {hasLiked ? 'Liked' : 'Like'}
        </button>
        <button className="action-btn comment-btn" onClick={toggleComments} disabled={isLoading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
            <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3.8 11.5a8.5 8.5 0 1 1 17 0z"></path>
          </svg>
          Comment
        </button>
        <button className="action-btn share-btn" disabled={isLoading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share
        </button>
      </div>
    </div>
  );
};
SingleMilestoneThree.propTypes = {
  itemClass: PropTypes.string,
  authorId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  profileImg: PropTypes.string.isRequired,
  templateType: PropTypes.string.isRequired,
  templateData: PropTypes.object.isRequired,
  likes: PropTypes.number,
  comments: PropTypes.object
};

export default SingleMilestoneThree;