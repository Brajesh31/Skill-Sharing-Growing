import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SingleMilestoneThree from '../../components/Milestones/SingleMilestoneThree';
import { milestonePostService } from '../../services/milestonePostService';
import LoadingSpinner from '../../components/Public/LoadingSpinner';
//import LoadingSpinner from '../../components/Common/LoadingSpinner'; // Assuming you have this component

const MilestonesGridMain = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const response = await milestonePostService.getAll();
        setMilestones(response);
        setLoading(false);
      } catch {
        setError('Failed to load milestones. Please try again later.');
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  if (loading) {
    return (
      <div className="react-course-filter back__course__page_grid pb---40 pt---110">
        <div className="container pb---70 text-center">
          <LoadingSpinner size="50px" color="#e74c3c" />

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="react-course-filter back__course__page_grid pb---40 pt---110">
        <div className="container pb---70">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="react-course-filter back__course__page_grid pb---40 pt---110">
      <div className="container pb---70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              {milestones.length === 0 ? (
                <div className="text-center">
                  <p>No milestones found. Share your learning journey by creating a milestone!</p>
                  <Link to="/my-milestones" className="readon orange-btn">Create Milestone</Link>
                </div>
              ) : (
                milestones.map((data, index) => (
                  <div key={data.milestonePostId} className="mb-4">
                    <SingleMilestoneThree
                      postId={data.milestonePostId}
                      authorId={data.authorId}
                      authorName={data.authorName}
                      date={data.postedDate}
                      profileImg={data.profileImageUrl}
                      skill={data.skill}
                      title={data.title}
                      templateType={data.templateType}
                      templateData={data.templateData}
                      likes={data.noOfLikes}
                      comments={{ comments: data.comments }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MilestonesGridMain;