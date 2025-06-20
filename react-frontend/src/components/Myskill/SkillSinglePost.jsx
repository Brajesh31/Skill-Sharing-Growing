import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { skillPostService } from '../../services/skillPostService';

const SkillSinglePost = (props) => {
  const navigate = useNavigate();

  const {
    skillID,
    skillImg,
    skill,
    skillUserId,
    skillTitle,
    courseAuthor,
    courseAuthorImg,
    skillSharingPostLikes,
    courseDescription,
    courseComments
  } = props;

  // States to handle the modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // States to hold the edited values
  const [editedTitle, setEditedTitle] = useState(skillTitle);
  const [editedSkill, setEditedSkill] = useState(skill);
  const [editedDescription, setEditedDescription] = useState(courseDescription);

  const handleEdit = () => {
    // Initialize fields with current values on edit
    setEditedTitle(skillTitle);
    setEditedSkill(skill);
    setEditedDescription(courseDescription);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Call the update method from the service
      await skillPostService.update(skillID, {
        skillName: editedSkill,
        title: editedTitle,
        description: editedDescription
      });

      setShowEditModal(false);

      window.location.reload();
    } catch {
      setError("Failed to update skill post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Call the delete method from the service
      await skillPostService.delete(skillID);
      setShowDeleteModal(false);
      // Navigate back to the skills page or refresh
      navigate('/my-skills');
      window.location.reload();
    } catch {
      setError("Failed to delete skill post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    try {
      await skillPostService.addLike(skillID);
      // Refresh the page
      window.location.reload();
    } catch {
    }
  };

  return (
    <div className={'inner-course'}>
      <div className="case-img">
        <Link to="#" className="cate-w">{skill}</Link>
        <img src={skillImg} alt="skill post thumbnail" />
      </div>
      <div className="case-content">
        <ul className="meta-course">
          <li>
            <button onClick={handleLike} className="like-button" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span style={{ marginLeft: '5px' }}>{skillSharingPostLikes} Likes</span>
            </button>
          </li>

          <li>
            <Link to={`/my-skills/preview/${skillID}`} style={{ display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
                <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3.8 11.5a8.5 8.5 0 1 1 17 0z"></path>
              </svg>
              <span style={{ marginLeft: '5px' }}>{courseComments.length} Comments</span>
            </Link>
          </li>
        </ul>
        <h4 className="case-title">
          <Link to={`/skill-feed/${skillID}`}>
            {skillTitle}
          </Link>
        </h4>
        <div className="react__user">
          <Link to={`/author/${skillUserId}`}>
            <img src={courseAuthorImg} alt="user" /> {courseAuthor}
          </Link>
        </div>

        <div className="action-buttons">
          <button className="edit-button" onClick={handleEdit}>
            Edit
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete
          </button>
          <Link to={`/my-skills/preview/${skillID}`}>
            <button className="preview-button">
              Preview
            </button>
          </Link>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowEditModal(false)}
            >
              X
            </button>
            <h3 className="modal-title">Edit Skill Post</h3>
            {error && <div className="error-message">{error}</div>}
            <form className="modal-form" onSubmit={handleEditSubmit}>
              <label htmlFor="skillTitle">Title:</label>
              <input
                type="text"
                id="skillTitle"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
              />

              <label htmlFor="skill">Skill:</label>
              <select
                id="skill"
                value={editedSkill}
                onChange={(e) => setEditedSkill(e.target.value)}
                required
              >
                <option value="">Select Skill</option>
                <option value="Graphic design">Graphic design</option>
                <option value="Web Development">Web Development</option>
                <option value="Photography">Photography</option>
                <option value="UX Design">UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Data Science">Data Science</option>
                <option value="Mobile App Development">Mobile App Development</option>
              </select>

              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                required
                rows="5"
              />

              <div className="modal-footer action-buttons">
                <button
                  type="submit"
                  className="edit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="delete-confirmation-overlay"
          onClick={() => !isSubmitting && setShowDeleteModal(false)}
        >
          <div
            className="delete-confirmation-box"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="delete-confirmation-message">
              Are you sure you want to delete this post?
            </p>
            {error && <div className="error-message">{error}</div>}
            <div className="delete-confirmation-buttons">
              <button
                className="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Yes'}
              </button>
              <button
                className="cancel-delete-btn"
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
SkillSinglePost.propTypes = {
  skillID: PropTypes.string.isRequired,
  skillImg: PropTypes.string.isRequired,
  skill: PropTypes.string.isRequired,
  skillUserId: PropTypes.string.isRequired,
  skillTitle: PropTypes.string.isRequired,
  courseAuthor: PropTypes.string.isRequired,
  courseAuthorImg: PropTypes.string.isRequired,
  skillSharingPostLikes: PropTypes.number.isRequired,
  courseDescription: PropTypes.string.isRequired,
  courseComments: PropTypes.array.isRequired
};

export default SkillSinglePost;