import React, { useState, useRef } from 'react';
//import { Send } from 'lucide-react';

import MilestonePostForm from '../../components/MyMilestones/MilestonePostForm'; 

export default function MilestonePostCreationForm() {

const [isExpanded, setIsExpanded] = useState(false);

const toggleExpand = () => {
  setIsExpanded(!isExpanded);
};

  return (

<div className="skill-post-page pt-100">
  <div className="container mx-auto py-12">
    <div className="max-w-4xl mx-auto">
      {/* <h2 className="post-title mb-8">Create New Skill Post</h2> */}

      <div className="post-section-header">
        <h2 className="post-title">Create New Milestones Post</h2>
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
        <MilestonePostForm/>
      )}
      
      
    </div>
  </div>
</div>
  );
}