// src/components/TemplateContent.jsx
import React from 'react';

export default function TemplateContent({ templateType, templateData }) {
  if (!templateData) return null;

  switch (templateType) {
    case 'TODAY_I_LEARNED':
      return (
        <div className="milestone-template today-learned">
          <h5>Skill : {templateData.topicSkill}</h5>
          <div className="milestone-section">
            <p>What I Learned : {templateData.whatLearned}</p>
          </div>
          {templateData.resourceUsed?.length > 0 && (
            <div className="milestone-section">
              <h6>Resources Used :</h6>
              <ul className="resource-list">
                {templateData.resourceUsed.map((r, i) => (
                  <li key={i}>
                    <a href={r} target="_blank" rel="noopener noreferrer">
                      {r}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="milestone-section" style={{ marginTop: '20px' }}>
            <p>Next Steps : {templateData.nextStep}</p>
          </div>
        </div>
      );

    case 'WEEKLY_SUMMARY':
      return (
        <div className="milestone-template weekly-summary">
          <div className="milestone-section">
            <span style={{ color: 'blue' }}>What I Worked On :</span>&nbsp;{templateData.workedOn}
          </div>
          <div className="milestone-section">
            <span style={{ color: 'blue' }}>Highlights :</span>&nbsp;{templateData.highlights}
          </div>
          <div className="milestone-section">
            <span style={{ color: 'blue' }}>Challenges:</span>&nbsp;{templateData.challenge}
          </div>
          <div className="milestone-section">
            <span style={{ color: 'blue' }}>Next Focus :</span>&nbsp;{templateData.nextFocus}
          </div>
          <div className="milestone-section">
            <span style={{ color: 'blue' }}>Progress :</span>&nbsp;{templateData.progress}
          </div>
        </div>
      );

    case 'COMPLETED_A_TUTORIAL':
      return (
        <div className="milestone-template completed-tutorial">
          <div className="tutorial-info">
            <p>Tutorial/Project name : {templateData.tutorialName}</p>
            <p>Platform : {templateData.platform}</p>
            <p>
              Duration : {templateData.duration} &nbsp;&nbsp;&nbsp;&nbsp; Difficulty: {templateData.difficulty}
            </p>
            <p>Skills Gained : {templateData.skillsGained}</p>
            <p>Achievements : {templateData.achievement}</p>
            <p> Recommendation : {templateData.recommendation}</p>
            <p>
              <em>Why: {templateData.recommendationReason}</em>
            </p>
          </div>
          {templateData.demoLink && (
            <div className="milestone-section">
              <h6>Demo Link :</h6>
              <a href={templateData.demoLink} target="_blank" rel="noopener noreferrer">
                {templateData.demoLink}
              </a>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="milestone-content">
          <p>No post</p>
        </div>
      );
  }
}
