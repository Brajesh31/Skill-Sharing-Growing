import React, { useState } from 'react';
import { milestonePostService } from '../../services/milestonePostService';

const MilestonePostForm = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Template options
  const templates = [
    {
      id: "til",
      name: "Today I Learned (TIL)",
      type: "TODAY_I_LEARNED",
      icon: "🚀"
    },
    {
      id: "tutorial",
      name: "Completed a Tutorial/Project",
      type: "COMPLETED_A_TUTORIAL",
      icon: "📘"
    },
    {
      id: "weekly",
      name: "Weekly Summary",
      type: "WEEKLY_SUMMARY",
      icon: "📁"
    }
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Initialize form data based on template
    initializeFormData(template.type);
    setSubmitSuccess(false);
    setError(null);
  };

  const initializeFormData = (templateType) => {
    switch (templateType) {
      case "TODAY_I_LEARNED":
        setFormData({
          title: "Today I Learned",
          topicSkill: "",
          whatLearned: "",
          resourceUsed: [],
          nextStep: "",
          date: new Date().toISOString().split('T')[0]
        });
        break;
      case "COMPLETED_A_TUTORIAL":
        setFormData({
          title: "Completed a Tutorial",
          tutorialName: "",
          platform: "",
          duration: "",
          skillsGained: "",
          achievement: "",
          demoLink: "",
          difficulty: "EASY",
          recommendation: "recommended",
          recommendationReason: ""
        });
        break;
      case "WEEKLY_SUMMARY":
        setFormData({
          title: "Weekly Summary",
          workedOn: "",
          highlights: "",
          challenge: "",
          nextFocus: "",
          progress: ""
        });
        break;
      default:
        setFormData({});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for resourceUsed in TIL template
    if (name === 'resourceUsed' && selectedTemplate?.type === 'TODAY_I_LEARNED') {
      // Convert comma-separated values to an array
      setFormData({
        ...formData,
        [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Get skill from topicSkill field or default to a placeholder
      const skill = formData.topicSkill || formData.skillsGained || "Python";

      // Get title based on the form or use a default
      const title = formData.title || "Today I Learned";

      // Prepare post data according to the API format
      const postData = {
        skill: skill,
        title: title,
        templateType: selectedTemplate.type,
        templateData: {
          ...formData,
          type: selectedTemplate.type // Adding type inside templateData as seen in the screenshot
        }
      };

      // Make API call using the apiService
      await milestonePostService.create(postData);

      setSubmitSuccess(true);
      setFormData({});
      setSelectedTemplate(null);
      setTimeout(() => {
        window.location.reload(); // Reload the page to reflect the new post
      }, 3000); // Delay for 3 seconds
    } catch {
      setError('Failed to submit the post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderTemplateCards = () => {
    return (
      <div className="MyMilestone-template-cards">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`MyMilestone-template-card ${selectedTemplate?.id === template.id ? 'MyMilestone-selected' : ''}`}
            onClick={() => handleTemplateSelect(template)}
          >
            <span className="MyMilestone-template-icon">{template.icon}</span>
            <h3>Template {templates.indexOf(template) + 1}: {template.name}</h3>
          </div>
        ))}
      </div>
    );
  };

  const renderTILForm = () => {
    return (
      <form onSubmit={handleSubmit} className="MyMilestone-form">
        <div className="MyMilestone-form-group">
          <label htmlFor="topicSkill">Topic/Skill:</label>
          <input
            type="text"
            id="topicSkill"
            name="topicSkill"
            placeholder="e.g., Git basics, React Hooks"
            value={formData.topicSkill || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="whatLearned">What I learned:</label>
          <textarea
            id="whatLearned"
            name="whatLearned"
            placeholder="Short summary or key takeaway"
            value={formData.whatLearned || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="resourceUsed">Resource used (Optional):</label>
          <input
            type="text"
            id="resourceUsed"
            name="resourceUsed"
            placeholder="Link to video, article, etc. (comma-separated for multiple)"
            value={Array.isArray(formData.resourceUsed) ? formData.resourceUsed.join(', ') : formData.resourceUsed || ''}
            onChange={handleInputChange}
          />
          <small>Separate multiple resources with commas</small>
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="nextStep">Next step:</label>
          <input
            type="text"
            id="nextStep"
            name="nextStep"
            placeholder="What will you learn next?"
            value={formData.nextStep || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date || ''}
            onChange={handleInputChange}
            readOnly
          />
          <small>Auto-filled with today's date</small>
        </div>

        <button type="submit" className="MyMilestone-submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Share Your Learning'}
        </button>
      </form>
    );
  };

  const renderTutorialForm = () => {
    return (
      <form onSubmit={handleSubmit} className="MyMilestone-form">
        <div className="MyMilestone-form-group">
          <label htmlFor="tutorialName">Tutorial/Project Name:</label>
          <input
            type="text"
            id="tutorialName"
            name="tutorialName"
            placeholder="Enter tutorial or project name"
            value={formData.tutorialName || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="platform">Platform/Source:</label>
          <input
            type="text"
            id="platform"
            name="platform"
            placeholder="e.g., freeCodeCamp, YouTube"
            value={formData.platform || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="duration">Duration:</label>
          <input
            type="text"
            id="duration"
            name="duration"
            placeholder="e.g., 2 hours, 1 week"
            value={formData.duration || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="skillsGained">Skills Gained:</label>
          <input
            type="text"
            id="skillsGained"
            name="skillsGained"
            placeholder="Separate skills with commas"
            value={formData.skillsGained || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="achievement">What I built/achieved:</label>
          <textarea
            id="achievement"
            name="achievement"
            placeholder="Describe what you built or achieved"
            value={formData.achievement || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="demoLink">Demo Link : </label>
          <input
            type="text"
            id="demoLink"
            name="demoLink"
            placeholder="Link to screenshot or demo"
            value={formData.demoLink || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="difficulty">Difficulty Level :</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty || 'EASY'}
            onChange={handleInputChange}
            required
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="recommendation">Would you recommend it?</label>
          <select
            id="recommendation"
            name="recommendation"
            value={formData.recommendation || 'recommended'}
            onChange={handleInputChange}
            required
          >
            <option value="recommended">Yes</option>
            <option value="not recommended">No</option>
          </select>
          <textarea
            id="recommendationReason"
            name="recommendationReason"
            placeholder="Why or why not?"
            value={formData.recommendationReason || ''}
            onChange={handleInputChange}
            style={{ marginTop: '10px' }}
          />
        </div>

        <button type="submit" className="MyMilestone-submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Share Your Achievement'}
        </button>
      </form>
    );
  };

  const renderWeeklySummaryForm = () => {
    return (
      <form onSubmit={handleSubmit} className="MyMilestone-form">
        <div className="MyMilestone-form-group">
          <label htmlFor="workedOn">What I worked on this week:</label>
          <textarea
            id="workedOn"
            name="workedOn"
            placeholder="Summarize what you worked on"
            value={formData.workedOn || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="highlights">Highlights:</label>
          <textarea
            id="highlights"
            name="highlights"
            placeholder="Key highlights of your week"
            value={formData.highlights || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="challenge">Biggest challenge:</label>
          <textarea
            id="challenge"
            name="challenge"
            placeholder="What was your biggest challenge?"
            value={formData.challenge || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="nextFocus">What I'll focus on next week:</label>
          <textarea
            id="nextFocus"
            name="nextFocus"
            placeholder="Your focus for the coming week"
            value={formData.nextFocus || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="MyMilestone-form-group">
          <label htmlFor="progress">How I feel about my progress:</label>
          <textarea
            id="progress"
            name="progress"
            placeholder="Reflect on your progress"
            value={formData.progress || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="MyMilestone-submit-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Share Your Weekly Summary'}
        </button>
      </form>
    );
  };

  const renderSelectedTemplateForm = () => {
    if (!selectedTemplate) return null;

    switch (selectedTemplate.type) {
      case "TODAY_I_LEARNED":
        return renderTILForm();
      case "COMPLETED_A_TUTORIAL":
        return renderTutorialForm();
      case "WEEKLY_SUMMARY":
        return renderWeeklySummaryForm();
      default:
        return null;
    }
  };

  return (
    <div className="MyMilestone-container">
      {/* <h2 className="MyMilestone-title">Create Learning Milestone</h2> */}

      <div className="MyMilestone-templates-section">
        <h3>Select a Template</h3>
        {renderTemplateCards()}
      </div>

      {selectedTemplate && (
        <div className="MyMilestone-form-section">
          <h3>Fill in the Details</h3>
          {renderSelectedTemplateForm()}
        </div>
      )}

      {submitSuccess && (
        <div className="MyMilestone-success-message">
          Your learning milestone has been shared successfully!
        </div>
      )}

      {error && (
        <div className="MyMilestone-error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default MilestonePostForm;