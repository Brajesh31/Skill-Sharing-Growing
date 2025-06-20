// import React from 'react';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';

// dayjs.extend(relativeTime);

// export default function CommentSection({
//   comments,
//   currentUserId,
//   isLoading,
//   newComment,
//   onNewCommentChange,
//   onSubmitComment,
//   editingCommentIndex,
//   editCommentText,
//   onStartEditComment,
//   onChangeEditCommentText,
//   onCancelEditComment,
//   onSaveEditedComment,
//   deleteConfirmIndex,
//   onConfirmDeleteComment,
//   onCancelDeleteComment,
//   onDeleteComment,
// }) {
//   const formatDate = (dateString) => dayjs(dateString).fromNow();

//   return (
//     <div className="comment-section">
//       {comments.length === 0 ? (
//         <p className="text-muted">No comments yet.</p>
//       ) : (
//         <ul className="comment-list">
//           {comments.map((c, index) => {
//             const isCurrentUser = c.authorId === currentUserId;
//             return (
//               <li key={c.id || c.commentId || index} className="comment-item">
//                 <div className="commenter-info">
//                   <img
//                     src={c.profileImageUrl}
//                     alt="Commenter Avatar"
//                     className="commenter-avatar"
//                   />
//                   <div className="comment-details">
//                     <div className="comment-header">
//                       <div className="comment-user-info">
//                         <strong>{c.authorName}</strong>
//                         <span className="comment-date">{formatDate(c.timestamp || c.createdAt)}</span>
//                       </div>
//                       {isCurrentUser && editingCommentIndex !== index && deleteConfirmIndex !== index && (
//                         <div className="comment-actions">
//                           <button
//                             className="edit-comment-btn"
//                             onClick={() => onStartEditComment(index)}
//                             disabled={isLoading}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="delete-comment-btn"
//                             onClick={() => onConfirmDeleteComment(index)}
//                             disabled={isLoading}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     {editingCommentIndex === index ? (
//                       <div className="edit-comment-form">
//                         <textarea
//                           className="edit-comment-input"
//                           value={editCommentText}
//                           onChange={onChangeEditCommentText}
//                           disabled={isLoading}
//                         />
//                         <div className="edit-comment-actions">
//                           <button
//                             className="save-comment-btn"
//                             onClick={() => onSaveEditedComment(index)}
//                             disabled={isLoading}
//                           >
//                             Save
//                           </button>
//                           <button
//                             className="cancel-comment-btn"
//                             onClick={onCancelEditComment}
//                             disabled={isLoading}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : deleteConfirmIndex === index ? (
//                       <div className="delete-confirmation">
//                         <p style={{ color: 'red' }}>Are you sure you want to delete this comment?</p>
//                         <div className="delete-confirmation-actions">
//                           <button
//                             className="confirm-delete-btn"
//                             onClick={() => onDeleteComment(index)}
//                             disabled={isLoading}
//                           >
//                             Yes, Delete
//                           </button>
//                           <button
//                             className="cancel-delete-btn"
//                             onClick={onCancelDeleteComment}
//                             disabled={isLoading}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <p className="comment-text">{c.content || c.comment}</p>
//                     )}
//                   </div>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}

//       <form onSubmit={onSubmitComment} className="comment-form">
//         <div className="comment-input-group">
//           <input
//             type="text"
//             className="comment-input"
//             placeholder="Add a comment..."
//             value={newComment}
//             onChange={onNewCommentChange}
//             disabled={isLoading}
//           />
//           <button
//             className="comment-submit-btn"
//             type="submit"
//             disabled={isLoading || !newComment.trim()}
//           >
//             Post
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
