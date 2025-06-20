import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../components/Notification/NotificationContext';
import { enrollmentService } from '../../services/enrollmentService';
import { planService } from '../../services/planService';
import { userService } from '../../services/userService';

const PlanDetailsMain = (props) => {
    const { planId, comments, weeks } = props;
    const [enrolled, setEnrolled] = useState(false);
    const { showNotification } = useNotification();
    const [commentText, setCommentText] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [postComments, setPostComments] = useState(comments || []);
    const [plans, setPlans] = useState([]);

    // States for comment editing
    const [editingCommentIndex, setEditingCommentIndex] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    // States for comment deletion confirmation
    const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);

    // Format date to relative time
    const formatDate = (dateString) => {
        return dayjs(dateString).fromNow();
    };

    useEffect(() => {
        const checkEnrollment = async () => {
            try {
                const response = await enrollmentService.getAll();
                const isEnrolled = response.some(enrollment => enrollment.roadmapId === planId);
                setEnrolled(isEnrolled);
            } catch {
            }
        };

        // Fetch user details
        const fetchUserDetails = async () => {
            try {

                const userData = await userService.getMe();
                setUserDetails(userData);
            } catch {
            }
        };

        const fetchPlans = async () => {
            try {
                const data = await planService.getAll();
                setPlans(data);
            } catch {
            }
        };

        checkEnrollment();
        fetchUserDetails();
        fetchPlans();


        setPostComments(comments || []);
    }, [planId, comments]);

    const popularPosts = [...plans].sort((a, b) => b.totalView - a.totalView).slice(0, 3);

    const handleEnrollClick = async () => {
        if (!planId) {
            console.error("Plan ID is undefined");
            return;
        }


        if (enrolled) {
            return;
        }

        try {
            await enrollmentService.create(planId);
            setEnrolled(true);
            showNotification('You Enrolled successful', 'success');
        } catch (error) {
            console.error("Error enrolling:", error);
            showNotification('Enrollment failed', 'error');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            return;
        }

        try {
            setIsLoading(true);
            const commentData = {
                content: commentText
            };

            const response = await planService.addComment(planId, commentData);
            showNotification('Comment posted successfully', 'success');

            // Create a new comment object to add to the state
            const newCommentObj = response.comment || {
                commentId: response.id || Date.now().toString(),
                authorId: userDetails.id,
                authorName: userDetails.name || userDetails.username || 'You',
                content: commentText,
                profileImageUrl: userDetails.profileImageUrl || 'default-avatar.png',
                timeStamp: new Date().toISOString()
            };

            // Update the comments in state
            setPostComments(prevComments => [...prevComments, newCommentObj]);

            // Clear the comment field
            setCommentText('');
        } catch (error) {
            console.error("Error posting comment:", error);
            showNotification('Failed to post comment', 'error');
        } finally {
            setIsLoading(false);
        }
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
            setIsLoading(true);
            const commentData = { content: editCommentText };
            await planService.editComment(planId, commentId, commentData);

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
        } finally {
            setIsLoading(false);
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
            setIsLoading(true);
            await planService.removeComment(planId, commentId);

            const updatedComments = [...postComments];
            updatedComments.splice(index, 1);
            setPostComments(updatedComments);
            setDeleteConfirmIndex(null);
            showNotification('Comment deleted', 'success');
        } catch (error) {
            console.error('Error deleting comment:', error);
            showNotification('Failed to delete comment', 'error');
            cancelDeleteComment();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="back__course__page_grid react-courses__single-page pb---40 pt---110">
            <div className="container pb---70">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="blog-single-inner">
                            <div className="blog-content">
                                <p>Pellentesque in ipsum id orci porta dapibus. Nulla porttitor accumsan tincidunt. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Curabitur aliquet quam id dui posuere blandit. Nulla porttitor accumsan tincidunt. </p>

                                <p>Let me share with you  one of my favorite quotes , as stated in that quote, there are three key factors to achieve massive success in your life.</p>


                                <div className="back-order-list pb---25">
                                    <ul>
                                        {weeks.map((week) => (
                                            <li key={week.weekNumber}>
                                                <i className="icon_check"></i> Week {week.weekNumber} - {week.title}: {week.content}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="blog-tags">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <button
                                                type="submit"
                                                className="back-btn"
                                                onClick={handleEnrollClick}
                                                disabled={enrolled}
                                                style={{
                                                    backgroundColor: enrolled ? '#e0e0e0' : '#4CAF50',
                                                    color: enrolled ? '#666' : 'white',
                                                    padding: '10px 20px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: enrolled ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.3s ease',
                                                    opacity: enrolled ? '0.8' : '1'
                                                }}
                                            >
                                                {enrolled ? 'Already Enrolled' : 'Enroll'}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="feather feather-arrow-right"
                                                    style={{ display: enrolled ? 'none' : 'block' }}
                                                >
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="share-course">Share this post:
                                                <em><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></em>
                                                <span>
                                                    <Link to="#"><i aria-hidden="true" className="social_facebook"></i></Link>
                                                    <Link to="#"><i aria-hidden="true" className="social_twitter"></i></Link>
                                                    <Link to="#"><i aria-hidden="true" className="social_linkedin"></i></Link>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="author-comment">
                                    <h4 className="title-comments">{postComments.length} Comments</h4>
                                    <ul>
                                        {postComments.map((comment, index) => {
                                            const isCurrentUserComment = userDetails && (comment.authorId === userDetails.id);

                                            return (
                                                <li key={comment.id || comment.commentId || index}>
                                                    <div className="row">
                                                        <div className="col-lg-1">
                                                            <div className="image-comments">
                                                                <img src={comment.profileImageUrl} alt={comment.authorName} />
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-11">
                                                            <div className="dsc-comments">
                                                                <h6>
                                                                    {comment.authorName}
                                                                    <span className="reply" style={{ marginLeft: '10px' }}>
                                                                        <span className="date">{formatDate(comment.timeStamp || comment.createdAt)}</span>
                                                                    </span>

                                                                    {/* Edit/Delete Actions for Current User's Comments */}

                                                                    {isCurrentUserComment && editingCommentIndex !== index && deleteConfirmIndex !== index && (
                                                                        <span className="comment-actions" style={{ marginLeft: '15px', float: 'right' }}>
                                                                            <button
                                                                                style={{ background: 'none', border: 'none', marginRight: '10px', cursor: 'pointer' }}
                                                                                onClick={() => startEditComment(index)}
                                                                                aria-label="Edit comment"
                                                                                disabled={isLoading}
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                                </svg>
                                                                            </button>
                                                                            <button
                                                                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
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
                                                                        </span>
                                                                    )}
                                                                </h6>

                                                                {/* Edit Mode */}
                                                                {editingCommentIndex === index ? (
                                                                    <div className="edit-comment-form">
                                                                        <textarea
                                                                            style={{ width: '100%', minHeight: '100px', marginBottom: '10px', padding: '8px' }}
                                                                            value={editCommentText}
                                                                            onChange={(e) => setEditCommentText(e.target.value)}
                                                                            disabled={isLoading}
                                                                        />
                                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                            <button
                                                                                style={{ padding: '5px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                onClick={() => saveEditedComment(index)}
                                                                                disabled={isLoading}
                                                                            >
                                                                                Save
                                                                            </button>
                                                                            <button
                                                                                style={{ padding: '5px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                onClick={cancelEditComment}
                                                                                disabled={isLoading}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : deleteConfirmIndex === index ? (
                                                                    /* Delete Confirmation */
                                                                    <div className="delete-confirmation">
                                                                        <p style={{ color: "red" }}>Are you sure you want to delete this comment?</p>
                                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                            <button
                                                                                style={{ padding: '5px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                onClick={() => handleDeleteComment(index)}
                                                                                disabled={isLoading}
                                                                            >
                                                                                Yes, Delete
                                                                            </button>
                                                                            <button
                                                                                style={{ padding: '5px 15px', background: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                onClick={cancelDeleteComment}
                                                                                disabled={isLoading}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    /* Normal Comment Display */
                                                                    <p>{comment.content}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className="back-blog-form">
                                    <div id="blog-form" className="blog-form">
                                        <h3>Leave a Comment</h3>
                                        <br></br>
                                        <form onSubmit={handleCommentSubmit}>
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="back-textarea">
                                                        <textarea
                                                            placeholder="Message"
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                            disabled={isLoading}
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                <div className="col-lg-12">
                                                    {planId && <button disabled={isLoading || !commentText.trim()}>Comment</button>}
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 md-mt-60">
                        <div className="react-sidebar ml----30">
                            <div className="widget back-post">
                                <h3 className="widget-title">Popular Posts</h3>
                                <ul className="related-courses">
                                    {popularPosts.map((data, index) => (
                                        <li key={data.id || index}>

                                            <div className="titles">
                                                <h4 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <Link to={`/blog/${data.id}`} style={{ 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis', 
                                                        whiteSpace: 'nowrap',
                                                        display: 'block',
                                                        width: '270px',
                                                    }}>{data.title} ff</Link>
                                                </h4>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg> {new Date(data.publishedDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

PlanDetailsMain.propTypes = {
    planId: PropTypes.string.isRequired,

    comments: PropTypes.arrayOf(PropTypes.shape({
        commentId: PropTypes.string,
        authorId: PropTypes.string.isRequired,
        authorName: PropTypes.string.isRequired,
        profileImageUrl: PropTypes.string,
        timeStamp: PropTypes.string,
        content: PropTypes.string
    })),

    weeks: PropTypes.arrayOf(PropTypes.shape({
        weekNumber: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    })).isRequired
};

export default PlanDetailsMain;