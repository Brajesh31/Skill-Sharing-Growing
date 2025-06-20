import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Faq from "../../components/Faq";
import { skillPostService } from "../../services/skillPostService";
import PropTypes from 'prop-types';
import { formatDate } from "../../util/formatDate";
import { userService } from "../../services/userService";

export default function SkillDetailsMain({
    skillPostId,
    authorProfileImageUrl,
    skillPostImageUrls,
    skillPostVideoUrl,
    authorId,
    skillPostVideoThumbnailUrl,
    description,
    comments: initialComments,
}) {
    let tab1 = "Description",
        tab2 = "Comments",
        tab3 = "FAQ";
    const tabStyle = "nav nav-tabs";

    const [comment, setComment] = useState("");
    const [postingComment, setPostingComment] = useState(false);
    const [updatingComment, setUpdatingComment] = useState(false);
    const [deletingComment, setDeletingComment] = useState(false);
    const [commentError, setCommentError] = useState(null);
    const [comments, setComments] = useState(initialComments || []);
    const [userDetails, setUserDetails] = useState(null);

    // States for comment editing
    const [editingCommentIndex, setEditingCommentIndex] = useState(null);
    const [editCommentText, setEditCommentText] = useState('');

    // States for comment deletion confirmation
    const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);

    useEffect(() => {
        setComments(initialComments || []);

        // Fetch user details
        const fetchUserDetails = async () => {
            try {
                const userData = await userService.getMe();
                setUserDetails(userData);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [initialComments]);

    const onPostComment = async (e) => {
        e.preventDefault();

        if (!comment) return;

        try {
            setPostingComment(true);
            const newComment = {
                content: comment,
            };

            await skillPostService.addComment(skillPostId, newComment);

            const tempNewComment = {
                content: comment,
                profileImageUrl: userDetails?.profileImageUrl || authorProfileImageUrl,
                authorId: userDetails?.id,
                authorName: userDetails?.name || userDetails?.username || 'You',
                timestamp: Date.now(),
                id: `temp-${Date.now()}`
            };

            setComments([...comments, tempNewComment]);
            setComment("");
            setCommentError(null);
        } catch (error) {
            setCommentError(error.message || "Failed to post comment");
        } finally {
            setPostingComment(false);
        }
    };

    // Start editing a comment
    const startEditComment = (index) => {
        setEditingCommentIndex(index);
        setEditCommentText(comments[index].content);
    };

    // Cancel editing a comment
    const cancelEditComment = () => {
        setEditingCommentIndex(null);
        setEditCommentText('');
    };

    // Save edited comment
    const saveEditedComment = async (index) => {
        if (!editCommentText.trim()) return;

        const commentToEdit = comments[index];
        const commentId = commentToEdit.id || commentToEdit.commentId;

        try {
            setUpdatingComment(true);
            const commentData = { content: editCommentText };
            await skillPostService.editComment(skillPostId, commentId, commentData);

            const updatedComments = [...comments];
            updatedComments[index] = {
                ...updatedComments[index],
                content: editCommentText
            };

            setComments(updatedComments);
            setEditingCommentIndex(null);
            setEditCommentText('');
        } catch (error) {
            console.error('Error editing comment:', error);
            setCommentError("Failed to edit comment: " + (error.message || "Unknown error"));
            cancelEditComment();
        } finally {
            setUpdatingComment(false);
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
        const commentToDelete = comments[index];
        const commentId = commentToDelete.id || commentToDelete.commentId;

        try {
            setDeletingComment(true);
            await skillPostService.removeComment(skillPostId, commentId);

            const updatedComments = [...comments];
            updatedComments.splice(index, 1);
            setComments(updatedComments);
            setDeleteConfirmIndex(null);
        } catch (error) {
            console.error('Error deleting comment:', error);
            setCommentError("Failed to delete comment: " + (error.message || "Unknown error"));
            cancelDeleteComment();
        } finally {
            setDeletingComment(false);
        }
    };

    return (
        <div className="back__course__page_grid react-courses__single-page pb---16 pt---110">
            <div className="container pb---70">
                <div className="row">
                    <div className="col-lg-12">
                        {skillPostVideoThumbnailUrl && (
                            <div className="course-details-video mb---30">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={skillPostVideoUrl || null}
                                    title="YouTube video player"
                                    allow="accelerometer"
                                ></iframe>
                            </div>
                        )}
                        <Tabs>
                            <div className="course-single-tab">
                                <TabList className={tabStyle}>
                                    <Tab>
                                        <button>{tab1}</button>
                                    </Tab>
                                    <Tab>
                                        <button>{tab2}</button>
                                    </Tab>
                                    <Tab>
                                        <button>{tab3}</button>
                                    </Tab>
                                </TabList>
                                <div className="tab-content" id="back-tab-content">

                                    {/* Description */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>About This Skill</h3>
                                            <p>{description}</p>
                                            <div className="image-banner">
                                                {skillPostImageUrls && skillPostImageUrls.length > 0 ? (
                                                    <div className="image-gallery">
                                                        {skillPostImageUrls.map((imageUrl, index) => (
                                                            <img
                                                                key={skillPostId + index}
                                                                src={
                                                                    imageUrl
                                                                        ? imageUrl
                                                                        : skillPostVideoThumbnailUrl
                                                                            ? skillPostVideoThumbnailUrl
                                                                            : require('../../assets/images/blog/post-banner2.jpg')
                                                                }
                                                                alt={`skill ${index + 1}`}
                                                                className="gallery-image"
                                                            />

                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </TabPanel>

                                    {/* Comments */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <div className="blog-form">
                                                <h3>Write a Comment</h3>
                                                <p className="pb---15">
                                                    Your email address will not be published. Required
                                                    fields are marked *
                                                </p>
                                                <form id="contact-form" onSubmit={onPostComment}>
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="back-textarea">
                                                                <textarea
                                                                    id="message"
                                                                    name="message"
                                                                    placeholder="Message"
                                                                    value={comment}
                                                                    onChange={(e) => setComment(e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="col-lg-12">
                                                            <button
                                                                type="submit"
                                                                className="back-btn"
                                                                disabled={postingComment || !comment}
                                                            >
                                                                {postingComment ? (
                                                                    <div>
                                                                        Posting Comment ...

                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        Post Comment
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
                                                                        >
                                                                            <line
                                                                                x1="5"
                                                                                y1="12"
                                                                                x2="19"
                                                                                y2="12"
                                                                            ></line>
                                                                            <polyline points="12 5 19 12 12 19"></polyline>
                                                                        </svg>
                                                                    </>
                                                                )}
                                                            </button>
                                                            {commentError && (
                                                                <div className="error-message">
                                                                    <p className="error-text">{commentError}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="pt---30" />
                                            <h3>Comments</h3>
                                            {/* Handle empty comments array */}
                                            {comments && comments.length > 0 ? (
                                                comments.map((singleComment, index) => {
                                                    const isCurrentUserComment = userDetails && (singleComment.authorId === userDetails.id);

                                                    return (
                                                        <div
                                                            className="post-author"
                                                            key={singleComment.id || `comment-${index}`}
                                                            style={{ marginBottom: '20px' }}
                                                        >
                                                            <div className="avatar">
                                                                <img
                                                                    src={singleComment.profileImageUrl}
                                                                    alt="user"
                                                                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                                                />
                                                            </div>
                                                            <div className="info">
                                                                <h4 className="name">
                                                                    {singleComment.authorName}{" "}
                                                                    <span className="designation">
                                                                        {formatDate(singleComment.timestamp)}
                                                                    </span>

                                                                    {/* Edit/Delete Actions for Current User's Comments */}
                                                                    {editingCommentIndex !== index && deleteConfirmIndex !== index && (
                                                                        <span className="comment-actions" style={{ marginLeft: '15px', float: 'right' }}>
                                                                            {isCurrentUserComment && (
                                                                                <button
                                                                                    style={{ background: 'none', border: 'none', marginRight: '10px', cursor: 'pointer' }}
                                                                                    onClick={() => startEditComment(index)}
                                                                                    aria-label="Edit comment"
                                                                                    disabled={updatingComment}
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                                                                    </svg>
                                                                                </button>
                                                                            )}

                                                                            {
                                                                                (isCurrentUserComment || userDetails?.id === authorId) && (
                                                                                    <button
                                                                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                                        onClick={() => confirmDeleteComment(index)}
                                                                                        aria-label="Delete comment"
                                                                                        disabled={deletingComment}
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                            <path d="M3 6h18"></path>
                                                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                                                        </svg>
                                                                                    </button>
                                                                                )
                                                                            }

                                                                        </span>
                                                                    )}
                                                                </h4>

                                                                {/* Edit Mode */}
                                                                {editingCommentIndex === index ? (
                                                                    <div className="edit-comment-form">
                                                                        <textarea
                                                                            style={{ width: '100%', minHeight: '50px', marginBottom: '10px', padding: '8px' }}
                                                                            value={editCommentText}
                                                                            onChange={(e) => setEditCommentText(e.target.value)}
                                                                            disabled={postingComment}
                                                                        />
                                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                            <button
                                                                                style={{ padding: '5px 15px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                onClick={() => saveEditedComment(index)}
                                                                                disabled={postingComment}
                                                                            >
                                                                                {updatingComment ? "Saving Changes" : "Save"}
                                                                            </button>
                                                                            <button
                                                                                style={{ padding: '5px 15px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                onClick={cancelEditComment}
                                                                                disabled={postingComment}
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
                                                                                disabled={updatingComment}
                                                                            >
                                                                                {!deletingComment ? "Yes, Delete" : "Deleting Comment..."}
                                                                            </button>
                                                                            <button
                                                                                style={{ padding: '5px 15px', background: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                                onClick={cancelDeleteComment}
                                                                                disabled={postingComment}
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    /* Normal Comment Display */
                                                                    <p>{singleComment.content}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p>No comments yet. Be the first to comment!</p>
                                            )}
                                        </div>
                                    </TabPanel>

                                    {/* faq */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>FAQ</h3>
                                            <Faq />
                                        </div>
                                    </TabPanel>

                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}

SkillDetailsMain.propTypes = {
    skillPostId: PropTypes.string,
    authorProfileImageUrl: PropTypes.string,
    skillPostImageUrls: PropTypes.arrayOf(PropTypes.string),
    skillPostVideoUrl: PropTypes.string,
    skillPostVideoThumbnailUrl: PropTypes.string,
    description: PropTypes.string,
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            content: PropTypes.string,
            profileImageUrl: PropTypes.string,
            authorName: PropTypes.string,
            authorId: PropTypes.string,
            timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ),
};