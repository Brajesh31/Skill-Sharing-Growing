import React, { useState, useEffect } from "react";
import Pagination from "../../components/Public/Pagination";
import { enrollmentService } from "../../services/enrollmentService";
import { planService } from "../../services/planService";
import LoadingSpinner from "../Public/LoadingSpinner";
import { Link } from "react-router-dom";

const PlanDetailsView = () => {
  const [userEnrolls, setUserEnrolls] = useState([]);
  const [currentEnrollment, setCurrentEnrollment] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [completedWeeks, setCompletedWeeks] = useState({});
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [progressPct, setProgressPct] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setIsLoading(true);
        const enrollments = await enrollmentService.getAll();
        setUserEnrolls(enrollments || []);

        setCurrentPage(1);

        if (enrollments?.length > 0) {
          setCurrentEnrollment(enrollments[0]);
        } else {
          setIsLoading(false);
        }
      } catch {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  useEffect(() => {
    const fetchCurrentRoadmap = async () => {
      if (!currentEnrollment) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        setRoadmapData(null);

        const newCompletedWeeks = {};
        currentEnrollment.progress?.forEach((w) => {
          newCompletedWeeks[w.week] = w.completed;
        });
        setCompletedWeeks(newCompletedWeeks);



        if (!currentEnrollment.roadmapId) {
          setIsLoading(false);
          return;
        }

        try {
          const roadmap = await planService.getById(
            currentEnrollment.roadmapId
          );
          setRoadmapData(roadmap);
        } catch {

          try {
            const altId = currentEnrollment.roadmapId.includes(".")
              ? currentEnrollment.roadmapId.split(".")[0]
              : currentEnrollment.roadmapId;

            const roadmap = await planService.getById(altId);
            setRoadmapData(roadmap);
          } catch {
          }
        }

        const total = currentEnrollment.progress?.length || 0;
        const done =
          currentEnrollment.progress?.filter((w) => w.completed).length || 0;
        setProgressPct(total ? Math.round((done / total) * 100) : 0);

        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    fetchCurrentRoadmap();
  }, [currentEnrollment]);

  useEffect(() => {
    if (!userEnrolls.length) return;

    const index = currentPage - 1;
    if (index < 0 || index >= userEnrolls.length) return;

    const selectedEnrollment = userEnrolls[index];

    setCurrentEnrollment(selectedEnrollment);

    setExpandedWeeks({});
  }, [currentPage, userEnrolls]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleWeekExpansion = (weekId) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekId]: !prev[weekId],
    }));
  };

  const toggleWeekCompletion = async (weekId) => {
    // Toggle the local state first for immediate user feedback
    const newCompletedState = !completedWeeks[weekId];

    setCompletedWeeks((prev) => ({
      ...prev,
      [weekId]: newCompletedState,
    }));

    try {
      // Prepare the data to send to the API
      const updateData = {
        week: weekId,
        completed: newCompletedState
      };

      // Call the update function from the enrollment service
      await enrollmentService.update(updateData, currentEnrollment.roadmapId);

      // Update the progress percentage after successful update
      const updatedWeeks = { ...completedWeeks, [weekId]: newCompletedState };
      const total = currentEnrollment.progress?.length || 0;
      const done = Object.values(updatedWeeks).filter(Boolean).length;
      setProgressPct(total ? Math.round((done / total) * 100) : 0);

    } catch {

      setCompletedWeeks((prev) => ({
        ...prev,
        [weekId]: !newCompletedState, // Revert the change
      }));

      // Show an error message to the user (you could implement a toast notification here)
    }
  };

  if (isLoading) {
    return (
      <div className="plan-details-container pt-100">
        <div className="container mx-auto py-12">
          <LoadingSpinner size="50px" color="#e74c3c" />
        </div>
      </div>
    );
  }

  if (!currentEnrollment) {
    return (
      <div className="react-course-filter back__course__page_grid pb---40 pt---110">
        <div className="container pb---70">
          <h3
            className="post-title"
            style={{ fontWeight: 600, texttAlign: "left" }}
          >
            My Enrolled Plans
          </h3>
          <div className="text-center">
                  <p>You're not enrolled in any plan.</p>
                  <Link to="/skill-feed" className="readon orange-btn">
                    Enrolled for plans
                  </Link>
                </div>
        </div>
      </div>
    );
  }

  // if (loading) return <LoadingSpinner size="50px" color="#e74c3c" />
  //   if (error) {
  //       return (
  //         <div className="react-course-filter back__course__page_grid pb---40 pt---110">
  //           <div className="container pb---70">
  //             <div className="alert alert-danger">{error}</div>
  //           </div>
  //         </div>
  //       );
  //     }

  if (!roadmapData) {
    return (
      <div className="plan-details-container pt-100">
        <div className="container mx-auto py-12">
          <div className="no-roadmap">Roadmap data not available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-details-container pt-100">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="plan-details-card">
            {/* Header */}
            <div className="plan-header">
              <h3
                className="post-title"
                style={{ fontWeight: 600, texttAlign: "left" }}
              >
                My Enrolled Plans
              </h3>
            </div>

            <div className="plan-header" style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
              {/* Left side - Image */}
              <img
                src={roadmapData.authorImg}
                alt="Plan Thumbnail"
                className="plan-thumbnail"
                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
              />

              {/* Right side - Text content */}
              <div className="plan-info" style={{ display: "flex", flexDirection: "column" }}>
                <h3 className="post-title" style={{ margin: "0 0 8px 0" }}>{roadmapData.title}</h3>
                <p className="creator-name" style={{ margin: "0 0 4px 0" }}>
                  Created by: {roadmapData.authorName}
                </p>
                <h2 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "normal" }}>{userEnrolls.enrolledAt}</h2>


              </div>

            </div>



            {/* Progress Bar */}
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-percentage">
                  {progressPct}% Complete
                </span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Weeks */}
            <div className="weeks-section">
              <h2>Weekly Plan</h2>
              {currentEnrollment.progress.map((wp) => {
                const weekId = wp.week;
                const weekInfo =
                  roadmapData.weeks.find((w) => w.weekNumber === weekId) || {};
                const isCompleted = completedWeeks[weekId] || false;
                const isExpanded = expandedWeeks[weekId] || false;

                return (
                  <div
                    key={weekId}
                    className={`week-item ${isExpanded ? "expanded" : ""} ${isCompleted ? "completed" : ""
                      }`}
                  >
                    <div
                      className="week-header"
                      onClick={() => toggleWeekExpansion(weekId)}
                    >
                      <div className="week-header-left">
                        <div
                          className="week-completion-checkbox"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWeekCompletion(weekId);
                          }}
                        >
                          {isCompleted && (
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <h3 className="week-title">
                          Week {weekId}: {weekInfo.title || "Untitled"}
                        </h3>
                      </div>
                      <div className="expand-icon">
                        {isExpanded ? "−" : "+"}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="week-content">
                        <p>{weekInfo.content || "No content available."}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {userEnrolls.length > 1 && (
              <div
                className="pagination-container"
                style={{ marginTop: "20px", marginBottom: "50px" }}
              >
                <Pagination
                  currentPage={currentPage}
                  totalItems={userEnrolls.length}
                  itemsPerPage={1}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsView;
