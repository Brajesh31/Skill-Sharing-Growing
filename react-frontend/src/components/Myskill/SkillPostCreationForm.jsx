import { useEffect, useRef, useState } from 'react';
import { skillPostService } from '../../services/skillPostService';
import { useNotification } from '../Notification/NotificationContext';

export default function SkillPostCreationForm() {
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedSkill: '', // Changed from skills array to a single selectedSkill
    files: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const availableSkills = [
    'Graphic Design', 'Web Development', 'Photography', 'UX Design',
    'Digital Marketing', 'Data Science', 'Mobile App Development'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const selectSkill = (skill) => {
    setFormData({
      ...formData,
      selectedSkill: formData.selectedSkill === skill ? '' : skill // Toggle selection
    });

    if (errors.selectedSkill) {
      setErrors({ ...errors, selectedSkill: '' });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...formData.files];
    let errorMsg = '';

    // Check file types and limits
    selectedFiles.forEach(file => {
      if (newFiles.length >= 4) {
        errorMsg = 'Maximum of 4 files (1 video + 3 images) allowed';
        return;
      }

      if (file.type.startsWith('video/')) {
        // Check if there's already a video
        const hasVideo = newFiles.some(f => f.type.startsWith('video/'));
        if (hasVideo) {
          errorMsg = 'Only one video is allowed';
          return;
        }

        // Check video duration (this requires loading the video)
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            setErrors({ ...errors, files: 'Video must be 30 seconds or less' });
            return;
          }
          newFiles.push(file);
          setFormData({ ...formData, files: newFiles });
        };

        video.src = URL.createObjectURL(file);
      } else if (file.type.startsWith('image/')) {
        // Count images
        const imageCount = newFiles.filter(f => f.type.startsWith('image/')).length;
        if (imageCount >= 3) {
          errorMsg = 'Maximum of 3 images allowed';
          return;
        }
        newFiles.push(file);
      } else {
        errorMsg = 'Only image and video files are allowed';
        return;
      }
    });

    if (errorMsg) {
      setErrors({ ...errors, files: errorMsg });
    } else {
      setFormData({ ...formData, files: newFiles });
      if (errors.files) {
        setErrors({ ...errors, files: '' });
      }
    }
  };

  const removeFile = (index) => {
    const newFiles = [...formData.files];
    newFiles.splice(index, 1);
    setFormData({ ...formData, files: newFiles });
    if (errors.files) {
      setErrors({ ...errors, files: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.selectedSkill) {
      newErrors.selectedSkill = 'Please select a skill';
    }

    if (formData.files.length === 0) {
      newErrors.files = 'At least one image or video is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Separate images and video for the API
      const images = formData.files.filter(file => file.type.startsWith('image/'));
      const video = formData.files.find(file => file.type.startsWith('video/'));

      // Calculate video duration if there is a video
      let videoDurationSeconds = 0;
      if (video) {
        const videoEl = document.createElement('video');
        videoEl.preload = 'metadata';

        await new Promise((resolve) => {
          videoEl.onloadedmetadata = () => {
            videoDurationSeconds = Math.round(videoEl.duration);
            resolve();
          };
          videoEl.src = URL.createObjectURL(video);
        });
      }

      // Call the skillPostService to create the post
      await skillPostService.create({
        skillName: formData.selectedSkill,
        title: formData.title,
        description: formData.description,
        images: images,
        video: video,
        videoDurationSeconds: video ? videoDurationSeconds : null
      });

      showNotification('post submit successful', 'success');

      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        selectedSkill: '',
        files: []
      });
      setSubmitSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch {
      setErrors({ ...errors, submit: 'Failed to submit post. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      formData.files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <div className="skill-post-page pt-100">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="post-section-header">
            <h2 className="post-title">Create New Skill Post</h2>
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
              {submitSuccess && (
                <div className="success-message mb-4">
                  Post submitted successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block mb-2" htmlFor="title">Post Title *</label>
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
                  <label className="block mb-2" htmlFor="description">Description *</label>
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

                {/* skills */}
                <div className="mb-6">
                  <label className="block mb-2" htmlFor="skills">Skills *</label>

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

                  {errors.selectedSkill && <p className="text-red-500 text-sm mt-1">{errors.selectedSkill}</p>}
                </div>

                {/* media upload */}
                <div className="mb-6">
                  <label className="block mb-2">Media Upload *</label>
                  <p className="text-sm text-gray-600 mb-2">
                    Upload up to 3 photos or a short video (max: 30 sec)
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                    multiple
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="media-upload-btn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Click to upload</span>
                    <span className="text-sm ml-2">
                      Supports: JPG, PNG, GIF, MP4 (video max 30 seconds)
                    </span>
                  </button>

                  {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}

                  {formData.files.length > 0 && (
                    <div className="uploaded-files-container">
                      {formData.files.map((file, index) => (
                        <div key={`${file.name}-${file.lastModified}`} className="uploaded-file-item">
                          <div className="file-preview">
                            {file.type.startsWith('image/') ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="preview-content"
                              />
                            ) : (
                              <video
                                src={URL.createObjectURL(file)}
                                controls
                                className="preview-content"
                              >
                                <track
                                  kind="captions"
                                  label="English captions"
                                  src=""
                                  srcLang="en"
                                  default
                                />
                              </video>
                            )}
                          </div>
                          <p className="file-name">{file.name}</p>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="file-remove-btn"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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