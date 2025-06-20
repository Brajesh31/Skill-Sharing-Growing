import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SkillSinglePost from '../../components/Myskill/SkillSinglePost';
import { skillPostService } from '../../services/skillPostService';

const MySkillsGridMain = () => {
    const [skillPosts, setSkillPosts] = useState([]);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Fetch current user's skill posts
    useEffect(() => {
        const fetchCurrentUserPosts = async () => {
            try {
                const response = await skillPostService.getCurrentUserPosts();
                setSkillPosts(response);
            } catch {
                setError("Failed to load your skill posts. Please try again later.");
            }
        };

        fetchCurrentUserPosts();
    }, []);

    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1); // Reset to first page when category changes
    };

    // Get unique skill categories from the fetched posts
    const uniqueSkills = [...new Set(skillPosts.map(post => post.skillName))];

    const filteredPosts = skillPosts.filter(post => {
        if (category === "") {
            return true;
        } else {
            return post.skillName === category;
        }
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    // Handle page number change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (error) {
        return (
            <div className="react-course-filter back__course__page_grid pb-40 pt-110">
                <div className="container text-center py-5">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="react-course-filter back__course__page_grid pb---40 pt---110">
            <div className="container pb---70">
                <div className="row align-items-center back-vertical-middle shorting__course mb-50">
                    <div className="col-md-2">
                        <div className="all__icons">
                            <div className="list__icons">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders">
                                    <line x1="4" y1="21" x2="4" y2="14"></line>
                                    <line x1="4" y1="10" x2="4" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12" y2="3"></line>
                                    <line x1="20" y1="21" x2="20" y2="16"></line>
                                    <line x1="20" y1="12" x2="20" y2="3"></line>
                                    <line x1="1" y1="14" x2="7" y2="14"></line>
                                    <line x1="9" y1="8" x2="15" y2="8"></line>
                                    <line x1="17" y1="16" x2="23" y2="16"></line>
                                </svg>
                            </div>
                            <div className="result-count">Filters</div>
                        </div>
                    </div>
                    <div className="col-md-10 text-right">
                        <select className="from-control category" onChange={handleChangeCategory}>
                            <option value="">All Categories</option>
                            {uniqueSkills.map((skill, index) => (
                                <option key={index} value={skill}>{skill}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row align-items-center back-vertical-middle shorting__course2 mb-50">
                    <div className="col-md-6">
                        <div className="all__icons">
                            <div className="result-count">We found {filteredPosts.length} posts available for you</div>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        <select className="from-control">
                            <option>Sort by: Default</option>
                            <option>Sort by Comments</option>
                            <option>Sort by Likes</option>
                        </select>
                    </div>
                </div>
                <div className="row">
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post, index) => (
                            <div key={index} className="single-studies col-lg-4">
                                <SkillSinglePost
                                    skillID={post.skillPostId}
                                    skillUserId={post.authorId}
                                    skillImg={post.skillPostImageUrls && post.skillPostImageUrls.length > 0
                                        ? post.skillPostImageUrls[0]
                                        : post.skillPostVideoThumbnailUrl}
                                    skill={post.skillName}
                                    skillTitle={post.title}
                                    courseAuthor={post.authorName}
                                    courseAuthorImg={post.authorProfileImageUrl}
                                    skillSharingPostLikes={post.noOfLikes}
                                    courseDescription={post.description}
                                    courseComments={post.comments}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p>No skill posts found. Create your first skill post!</p>
                        </div>
                    )}
                </div>
                {filteredPosts.length > itemsPerPage && (
                    <ul className="back-pagination pt---20">
                        <li>
                            <Link to="#" onClick={handlePrevPage}>Prev</Link>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={currentPage === i + 1 ? "active" : ""}>
                                <Link to="#" onClick={() => handlePageChange(i + 1)}>
                                    {i + 1}
                                </Link>
                            </li>
                        ))}
                        <li className="back-next">
                            <Link to="#" onClick={handleNextPage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MySkillsGridMain;