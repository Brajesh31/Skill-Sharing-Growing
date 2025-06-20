import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { planService } from '../../services/planService';
import LoadingSpinner from '../../components/Public/LoadingSpinner';

const PlanMain = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await planService.getAll();
                setPlans(data);
                setLoading(false);
            } catch {
                setError('Failed to load plans. Please try again later.');
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Get current plans for pagination
    const indexOfLastPlan = currentPage * itemsPerPage;
    const indexOfFirstPlan = indexOfLastPlan - itemsPerPage;
    const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);

    // Get popular posts (3 items with highest view count)
    const popularPosts = [...plans].sort((a, b) => b.totalView - a.totalView).slice(0, 3);

    // Total pages calculation
    const totalPages = Math.ceil(plans.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    if (loading) return <LoadingSpinner size="50px" color="#e74c3c" />
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
        <div className="react-blog-page pb---40 pt---110">
            <div className="container pb---70">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="blog-grid">
                            {currentPlans.map((data, index) => (
                                <div key={data.id || index} className="single-blog">
                                    <div className="inner-blog">
                                        <div className="blog-img">
                                            <Link to={`/plan/${data.id}`} className="cate">{data.category}</Link>
                                        </div>
                                        <div className="blog-content">
                                            <ul className="top-part">
                                                <li>
                                                    <img style={{ width: 36, height: 36, borderRadius: "50%" }} src={data.authorImg} alt={data.authorName} /> {data.authorName}
                                                </li>
                                                <li className="date-part">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> {new Date(data.publishedDate).toLocaleDateString()}
                                                </li>
                                                <li>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> {data.totalView} views
                                                </li>
                                            </ul>

                                            <h3 className="blog-title"><Link to={`/blog/${data.id}`}>{data.title}</Link></h3>
                                            <p className="blog-desc">{data.description}</p>
                                            <div className="button__sec">
                                                <Link to={`/plans/${data.id}`} className="blog-btn">Read More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></Link>
                                                <div className="share-course">
                                                    Share <em><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></em>
                                                    <span>
                                                        <Link to="#"><i aria-hidden="true" className="social_facebook"></i></Link>
                                                        <Link to="#"><i aria-hidden="true" className="social_twitter"></i></Link>
                                                        <Link to="#"><i aria-hidden="true" className="social_linkedin"></i></Link>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <ul className="back-pagination">
                            {/* Previous button */}
                            {currentPage > 1 && (
                                <li className="back-prev">
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage - 1);
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left">
                                            <line x1="19" y1="12" x2="5" y2="12"></line>
                                            <polyline points="12 19 5 12 12 5"></polyline>
                                        </svg>
                                    </Link>
                                </li>
                            )}

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                <li key={number} className={currentPage === number ? "active" : ""}>
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(number);
                                    }}>
                                        {number}
                                    </Link>
                                </li>
                            ))}

                            {/* Next button */}
                            {currentPage < totalPages && (
                                <li className="back-next">
                                    <Link to="#" onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage + 1);
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="col-lg-4">
                        <div className="react-sidebar ml----30">
                            <div className="widget back-search">
                                <h3 className="widget-title">Search</h3>
                                <form>
                                    <input type="text" name="input" placeholder="Search..." />
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                            <div className="widget back-post">
                                <h3 className="widget-title">Popular Posts</h3>
                                <ul className="related-courses">
                                    {popularPosts.map((data, index) => (
                                        <li key={data.id || index}>

                                            <div className="titles">
                                                <h4 >
                                                    <Link to={`/blog/${data.id}`} style={{ 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis', 
                                                        whiteSpace: 'nowrap',
                                                        display: 'block',
                                                        width: '270px',
                                                    }}>{data.title} ff</Link>
                                                </h4>
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg> {new Date(data.publishedDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="widget react-categories-course">
                                <h3 className="widget-title">Course categories</h3>
                                <ul className="recent-category">
                                    <li> <Link to="#">Art & Design <em>(6)</em></Link></li>
                                    <li> <Link to="#">Exercise <em>(4)</em></Link></li>
                                    <li> <Link to="#">Photography <em>(8)</em></Link></li>
                                    <li> <Link to="#">Environmental Sciences <em>(3)</em></Link></li>
                                    <li> <Link to="#">Software Training <em>(5)</em></Link></li>
                                    <li> <Link to="#">Software Development <em>(2)</em></Link></li>
                                    <li> <Link to="#">Music <em>(10)</em></Link></li>
                                    <li> <Link to="#">Material Design <em>(2)</em></Link></li>
                                    <li> <Link to="#">Technology <em>(7)</em></Link></li>
                                </ul>
                            </div>
                            <div className="widget widget-tags">
                                <h3 className="widget-title">Tags</h3>
                                <ul className="tags">
                                    <li><Link to="#">Education</Link></li>
                                    <li><Link to="#">SEO Marketing</Link></li>
                                    <li><Link to="#">Business</Link></li>
                                    <li><Link to="#">Solutions</Link></li>
                                    <li><Link to="#">UX</Link></li>
                                    <li><Link to="#">Case Study</Link></li>
                                    <li><Link to="#">Creative</Link></li>
                                    <li><Link to="#">Insights</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanMain;