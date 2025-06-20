import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SkillSinglePost from '../../components/Myskill/SkillSinglePost';

import courses from '../../data/Courses.json';

const MySkillsGridMain = () => {

    const getInitialStateCategory = () => {
        const category = "";
        return category;
    };

    const [category, setCategory] = useState(getInitialStateCategory);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handleChangeCategory = (e) => {
        setCategory(e.target.value);
        setCurrentPage(1); // Reset to first page when category changes
    };

    const filteredCourses = courses.filter(course => {
        if (category === "") {
            return true;
        } else {
            return course.skill === category;
        }
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

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
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Mobile App Development">Mobile App Development</option>
                            <option value="UX Design">UX Design</option>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Data Science">Data Science</option>
                        </select>
                    </div>
                </div>
                <div className="row align-items-center back-vertical-middle shorting__course2 mb-50">
                    <div className="col-md-6">
                        <div className="all__icons"> 
                            <div className="result-count">We found {filteredCourses.length} courses available for you</div>
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
                    {currentCourses.map((data, index) => {
                        return (  
                            <div key={index} className="single-studies col-lg-4">
                                { 
                                    <SkillSinglePost
                                        skillID={data.id}
                                        skillUserId={data.userId}
                                        skillImg={`${data.image}`}
                                        skill={data.skill}
                                        skillTitle={data.title}
                                        courseAuthor={data.userName} // Assuming "userName" is the author's name
                                        courseAuthorImg={`${data.authorImg}`}
                                        skillSharingPostLikes={data.likes}
                                        courseDescription={data.description} // Pass the description
                                        courseComments={data.comments} // Pass the comments array
                                    />
                                }
                            </div>
                        )
                    })}
                </div>
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
            </div>
        </div>
    );
}

export default MySkillsGridMain;
