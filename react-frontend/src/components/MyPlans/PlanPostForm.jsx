import { useState } from 'react';
import { planService } from '../../services/planService';
import { useNotification } from '../../components/Notification/NotificationContext';

export default function PlanPostForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedSkill: '',
    files: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const availableSkills = [
    'Graphic Design', 'Web Development', 'Photography', 'UX Design',
    'Digital Marketing', 'Data Science', 'Mobile App Development'
  ];

  const [weeks, setWeeks] = useState([
    { id: 1, title: '', content: '' }
  ]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const maxTags = 5;

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors(e => ({ ...e, [name]: '' }));
    }
  };

  const selectSkill = (skill) => {
    setFormData(f => ({
      ...f,
      selectedSkill: f.selectedSkill === skill ? '' : skill
    }));
    if (errors.skills) {
      setErrors(e => ({ ...e, skills: '' }));
    }
  };

  const addWeek = () => {
    const newWeekId = weeks.length > 0 ? Math.max(...weeks.map(w => w.id)) + 1 : 1;
    setWeeks(w => [...w, { id: newWeekId, title: '', content: '' }]);
  };

  const removeWeek = (id) => {
    setWeeks(w => w.filter(week => week.id !== id));
  };

  const handleWeekChange = (id, field, value) => {
    setWeeks(w => w.map(week =>
      week.id === id ? { ...week, [field]: value } : week
    ));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
    if (tagError) {
      setTagError('');
    }
  };

  const processTagInput = () => {
    const inputTags = tagInput
      .split(/[,;\s]+/)
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    if (inputTags.length === 0) return;
    if (tags.length + inputTags.length > maxTags) {
      setTagError(`Maximum ${maxTags} tags allowed`);
      return;
    }
    setTags(t => {
      const newTags = [...t];
      inputTags.forEach(tag => {
        if (!newTags.includes(tag)) {
          newTags.push(tag);
        }
      });
      return newTags;
    });
    setTagInput('');
  };

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      processTagInput();
    }
  };

  const handleAddTagClick = () => {
    processTagInput();
  };

  const removeTag = (tagToRemove) => {
    setTags(t => t.filter(tag => tag !== tagToRemove));
    if (tagError) {
      setTagError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) { newErrors.title = 'Title is required'; showNotification('Title is required', 'error') };
    if (!formData.description.trim()) { newErrors.description = 'Description is required'; showNotification('Description is required', 'error') };
    if (!formData.selectedSkill) { newErrors.skills = 'Category is required'; showNotification('Category is required', 'error') };
    if (weeks.length === 0) { newErrors.weeks = 'At least one week is required'; showNotification('At least one week is required', 'error') };
    weeks.forEach((week, index) => {
      if (!week.title.trim()) { newErrors[`weekTitle${index}`] = `Week ${index + 1} title is required`; showNotification(`Week ${index + 1} title is required`, 'error') };
      if (!week.content.trim()) { newErrors[`weekContent${index}`] = `Week ${index + 1} content is required`; showNotification(`Week ${index + 1} content is required`, 'error') };
    });
    if (tags.length > maxTags) { newErrors.tags = `Maximum ${maxTags} tags allowed`; showNotification(`Maximum ${maxTags} tags allowed`, 'error') };
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.selectedSkill,
      weeks: weeks.map(w => ({
        weekNumber: w.id,
        title: w.title,
        content: w.content
      })),
      tags
    };

    try {
      await planService.create(payload);
      // reset form
      setFormData({ title: '', description: '', selectedSkill: '', files: [] });
      setWeeks([{ id: 1, title: '', content: '' }]);
      setTags([]);
      setTagInput('');
      setErrors({});
      showNotification('Post submitted successfully!', 'success');
      setTimeout(() => {
        window.location.reload(); // reload the page to see the new post
      }, 1400); // delay for 1 second
    } catch {
      setErrors(e => ({ ...e, submit: 'Failed to submit post. Please try again.' }));
      showNotification('Failed to load post data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(x => !x);
  };

  return (
    <div className="skill-post-page pt-100">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="post-section-header">
            <h2 className="post-title">Create New Plan</h2>
            <button
              onClick={toggleExpand}
              className="toggle-expand-btn"
            >
              {isExpanded ? (
                <>
                  <span>Collapse</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </>
              ) : (
                <>
                  <span>Expand</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="post-form">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block mb-2" htmlFor="title">Plan Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter post title"
                    className={errors.title ? "post-input-error" : "post-input"}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div className="mb-6">
                  <label className="block mb-2" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter post description"
                    className={errors.description ? "post-textarea-error" : "post-textarea"}
                  ></textarea>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="mb-6">
                  <label className="block mb-2" htmlFor="skills">Category</label>
                  <div className="skills-grid">
                    {availableSkills.map((skill, index) => (
                      <div
                        key={index}
                        className={`skill-item ${formData.selectedSkill === skill
                          ? 'skill-item-selected'
                          : 'skill-item-default'
                          }`}
                        onClick={() => selectSkill(skill)}
                      >
                        {skill}
                        {formData.selectedSkill === skill && (
                          <span className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                </div>

                <div className="mb-6">
                  <div className="weeks-header">
                    <label className="block mb-2">Weeks</label>
                    <button
                      type="button"
                      onClick={addWeek}
                      className="add-week-btn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Week
                    </button>
                  </div>

                  <div className="weeks-container">
                    {weeks.map((week) => (
                      <div key={week.id} className="week-item">
                        <div className="week-header">
                          <h3 className="week-title">Week {week.id}</h3>
                          <button
                            type="button"
                            onClick={() => removeWeek(week.id)}
                            className="remove-week-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>

                        <div className="week-content">
                          <div className="mb-4">
                            <label className="block mb-2" htmlFor={`week-${week.id}-title`}>Title</label>
                            <input
                              type="text"
                              id={`week-${week.id}-title`}
                              value={week.title}
                              onChange={(e) => handleWeekChange(week.id, 'title', e.target.value)}
                              placeholder="Enter week title"
                              className="post-input"
                            />
                          </div>

                          <div>
                            <label className="block mb-2" htmlFor={`week-${week.id}-content`}>Content</label>
                            <textarea
                              id={`week-${week.id}-content`}
                              value={week.content}
                              onChange={(e) => handleWeekChange(week.id, 'content', e.target.value)}
                              placeholder="Enter week content"
                              className="post-textarea"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2" htmlFor="tags" style={{ marginTop: 30 }}>Tags (max 5)</label>
                  <div className={`tags-input-container ${tagError ? 'tags-input-error' : ''}`}>
                    <div className="tags-container">
                      {tags.map((tag, index) => (
                        <div key={index} className="tag-item">
                          <span className="tag-text">{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="tag-remove-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="tags-input-wrapper">
                      <input
                        type="text"
                        id="tags"
                        value={tagInput}
                        onChange={handleTagInputChange}
                        onKeyDown={addTag}
                        placeholder="Type tags (separated by comma)"
                        className="tags-input"
                      />
                      <button
                        type="button"
                        onClick={handleAddTagClick}
                        className="tag-add-btn"
                        disabled={!tagInput.trim() || tags.length >= maxTags}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {tagError && <p className="text-red-500 text-sm mt-1">{tagError}</p>}
                  <p className="text-sm text-gray-500 mt-1">
                    {tags.length} of {maxTags} tags used
                  </p>
                </div>

                {errors.submit && (
                  <div className="error-container">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="post-submit-button"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Post'}
                  {!isSubmitting && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send ml-2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

