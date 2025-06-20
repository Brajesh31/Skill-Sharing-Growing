import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../components/Notification/NotificationContext';
import Pagination from '../../components/Public/Pagination';
import { planService } from '../../services/planService';
import { userService } from '../../services/userService';

const CreatedMyPlans = () => {
  const [plans, setPlans] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 2;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showNotification } = useNotification();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    weeks: [],
    tags: []
  });




  // Format date to relative time
  const formatDate = (dateString) => {
    return dayjs(dateString).fromNow();
  };

  useEffect(() => {
    const fetchMyPlans = async () => {
      try {
        const user = await userService.getMe();
        const myPlans = await planService.getByAuthorId(user.id);
        setPlans(myPlans);
      } catch {
      }
    };

    fetchMyPlans();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentPlans = plans.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openEditModal = (plan) => {
    setCurrentPlan(plan);
    setEditFormData({
      title: plan.title,
      description: plan.description,
      category: plan.category,
      weeks: [...plan.weeks],
      tags: [...plan.tags]
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCurrentPlan(null);
  };

  const openDeleteModal = (plan) => {
    setCurrentPlan(plan);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleWeekChange = (weekIndex, field, value) => {
    const updatedWeeks = [...editFormData.weeks];
    updatedWeeks[weekIndex] = {
      ...updatedWeeks[weekIndex],
      [field]: value
    };
    setEditFormData({ ...editFormData, weeks: updatedWeeks });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setEditFormData({ ...editFormData, tags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await planService.update(currentPlan.id, editFormData);
      // Update the local state
      const updatedPlans = plans.map(plan =>
        plan.id === currentPlan.id ? { ...plan, ...editFormData } : plan
      );
      setPlans(updatedPlans);
      closeEditModal();
      // Show success message
      showNotification('YPlan updated successfully!', 'success');
    } catch {
      showNotification('Failed to update plan. Please try again.', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await planService.delete(currentPlan.id);
      // Update the local state by removing the deleted plan
      const updatedPlans = plans.filter(plan => plan.id !== currentPlan.id);
      setPlans(updatedPlans);
      closeDeleteModal();
      // Show success message
      showNotification('Deleted successfully!', 'success');
      
    } catch {
      alert('Failed to delete plan. Please try again.');
    }
  };

  return (
    <div className="react-blog-page pt-100" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="container pb---70">
            <h2 className="post-title"
              style={{ fontWeight: 600, texttAlign: "left", fontSize: "30px" }}>Created Plans ({currentPlans.length})</h2>
            <div className="row">
              <div className="col-12">
                <div className="blog-grid">
                  <div className="row">
                  {currentPlans.length === 0 ? (
                    <div className="text-center">
                      <p>No plans found. Share your plan by creating a plan!</p>
                      <Link to="/my-plans" className="readon orange-btn">
                        Create Plan
                      </Link>
                    </div>
                  ) : (
                    currentPlans?.map((data) => (
                      <div key={data.id} className="col-md-6">
                        <div className="single-blog">
                          <div className="inner-blog">
                            <div className="blog-img">
                              <Link to="/my-plans" className="cate">
                                {data.category}
                              </Link>
                              {/* Image rendering can be handled here if needed */}
                            </div>
                            <div className="blog-content">
                              <ul className="top-part">
                                <li>
                                  <img
                                    src={data.authorImg}
                                    alt="user"
                                    style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                                  />{' '}
                                  {data.authorName}
                                </li>
                                <li className="date-part">
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
                                    className="feather feather-clock"
                                  >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>{' '}

                                  {formatDate(data.publishedDate)}
                                </li>
                                <li>
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
                                    className="feather feather-eye"
                                  >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>{' '}
                                  {data.totalView} views
                                </li>
                              </ul>

                              <h3 className="blog-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Link to="/my-plans">{data.title}</Link>
                              </h3>
                              <p className="blog-desc" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {data.description}
                              </p>

                              <div className="button__sec">
                                <div className='clo-lg-4'>
                                  <button className="delete-btn" onClick={() => openDeleteModal(data)}>Delete</button>
                                  <button className="edit-btn" onClick={() => openEditModal(data)}>Edit</button>
                                </div>

                                <div className="share-course">
                                  Share{' '}
                                  <em>
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
                                      className="feather feather-share-2"
                                    >
                                      <circle cx="18" cy="5" r="3"></circle>
                                      <circle cx="6" cy="12" r="3"></circle>
                                      <circle cx="18" cy="19" r="3"></circle>
                                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                    </svg>
                                  </em>
                                  <span>
                                    <Link to="/my-plans"><i className="social_facebook"></i></Link>
                                    <Link to="/my-plans"><i className="social_twitter"></i></Link>
                                    <Link to="/my-plans"><i className="social_linkedin"></i></Link>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  </div>

                  {/* Pagination Component */}
                  {plans.length > cardsPerPage && (
                    <Pagination
                      currentPage={currentPage}
                      totalItems={plans.length}
                      itemsPerPage={cardsPerPage}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="editmodalPlan">
          <div className="editmodalPlan__overlay" onClick={closeEditModal}></div>
          <div className="editmodalPlan__content">
            <div className="editmodalPlan__header">
              <h3>Edit Plan</h3>
              <button onClick={closeEditModal} className="editmodalPlan__close-btn">×</button>
            </div>
            <div className="editmodalPlan__body">
              <form onSubmit={handleSubmit}>
                <div className="editmodalPlan__form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="editmodalPlan__form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="editmodalPlan__form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="editmodalPlan__form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={editFormData.tags.join(', ')}
                    onChange={handleTagsChange}
                  />
                </div>

                <div className="editmodalPlan__weeks">
                  <h4>Weekly Content</h4>
                  {editFormData.weeks.map((week, index) => (
                    <div key={index} className="editmodalPlan__week-item">
                      <div className="editmodalPlan__week-header">
                        <h5>Week {week.weekNumber}</h5>
                      </div>
                      <div className="editmodalPlan__week-content">
                        <div className="editmodalPlan__form-group">
                          <label>Title</label>
                          <input
                            type="text"
                            value={week.title}
                            onChange={(e) => handleWeekChange(index, 'title', e.target.value)}
                            required
                          />
                        </div>
                        <div className="editmodalPlan__form-group">
                          <label>Content</label>
                          <textarea
                            value={week.content}
                            onChange={(e) => handleWeekChange(index, 'content', e.target.value)}
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="editmodalPlan__footer">
                  <button type="button" onClick={closeEditModal} className="editmodalPlan__cancel-btn">Cancel</button>
                  <button type="submit" className="editmodalPlan__save-btn">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="editmodalPlan editmodalPlan--delete">
          <div className="editmodalPlan__overlay" onClick={closeDeleteModal}></div>
          <div className="editmodalPlan__content editmodalPlan__content--delete">
            <div className="editmodalPlan__header">
              <h3>Confirm Delete</h3>
              <button onClick={closeDeleteModal} className="editmodalPlan__close-btn">×</button>
            </div>
            <div className="editmodalPlan__body">
              <p>Are you sure you want to delete this plan? This action cannot be undone.</p>
              <h4>{currentPlan?.title}</h4>
            </div>
            <div className="editmodalPlan__footer">
              <button onClick={closeDeleteModal} className="editmodalPlan__cancel-btn">Cancel</button>
              <button onClick={handleDelete} className="editmodalPlan__delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedMyPlans;

