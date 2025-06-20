import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SingleMilestonePost from '../../components/MyMilestones/SingleMilestonePost';
import { milestonePostService } from '../../services/milestonePostService';
import LoadingSpinner from '../../components/Public/LoadingSpinner';
import { userService } from '../../services/userService';

export default function CreatedByMe() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    const fetchMilestones = async () => {
      setLoading(true);
      try {
        const me = await userService.getMe();
        const authorId = me.id;
        const response = await milestonePostService.getByAuthorId(authorId);
        setMilestones(response);
      } catch {
        setError('Failed to load milestones. Please try again later.');
      } finally {
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
          <h3
            className="post-title"
            style={{ fontWeight: 600, textAlign: "left" }}
          >
            My Milestones ({milestones.length})
          </h3>

          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">

              {milestones.length === 0 ? (
                <div className="text-center">
                  <p>No milestones found. Share your learning journey by creating a milestone!</p>
                  <Link to="/my-milestones" className="readon orange-btn">
                    Create Milestone
                  </Link>
                </div>
              ) : (
                milestones.map((data) => (
                  <div key={data.milestonePostId} className="mb-4">
                    <SingleMilestonePost
                      postId={data.milestonePostId}
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

