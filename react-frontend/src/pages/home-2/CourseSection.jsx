import React, { useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SingleCourseFour from '../../components/Course/SingleCourseFour';
import { skillPostService } from '../../services/skillPostService';

const Course = () => {
    let tab1 = "Trending",
        tab2 = "Recent";

    const tabStyle = 'react-filter';

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await skillPostService.getFeaturedSkillPosts();
                const data = await response.json();
                setPosts(data);

            } catch {
                setError("Failed to load posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    // Sort posts by creation date (newest first) for Recent tab
    const recentPosts = [...posts].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Sort posts by number of likes for Trending tab
    const trendingPosts = [...posts].sort((a, b) =>
        b.noOfLikes - a.noOfLikes
    );

    return (
        <div className="react-course-filter pb---100 pt---120">
            <div className="container">
                <Tabs>
                    <div className="row d-flex align-items-end">
                        <div className="col-lg-5">
                            <div className="react__title__section text-left">
                                <h2 className="react__tittle wow animate__fadeInUp" data-wow-duration="0.3s"> Skill Sharing Posts </h2>
                                <h6 className="react__subtitle wow animate__fadeInUp" data-wow-duration="0.5s">Why I say old chap that is spiffing in my flat such a fibber mufty.</h6>
                            </div>
                        </div>
                        <div className="col-lg-7 text-right">
                            <TabList className={tabStyle}>
                                <Tab><button>{tab1}</button></Tab>
                                <Tab><button>{tab2}</button></Tab>
                                {/* <Tab><button>{tab3}</button></Tab> */}
                            </TabList>
                        </div>
                    </div>
                    <div>
                        <div>
                            <TabPanel className="row">
                                {loading ? (
                                    <div className="loading-container text-center py-5">
                                        <div className="spinner-border" role="status" />
                                    </div>
                                ) : error ? (
                                    <div className="error-container text-center py-5">
                                        <p className="text-danger">{error}</p>
                                        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
                                            Retry
                                        </button>
                                    </div>
                                ) : (
                                    trendingPosts.map((post, index) => (
                                        <div key={index} className="single-studies col-lg-4">
                                            <SingleCourseFour {...post} />
                                        </div>
                                    ))
                                )}
                            </TabPanel>

                            <TabPanel className="row">
                                {loading ? (
                                    <div className="loading-container text-center py-5">
                                        <div className="spinner-border" role="status" />
                                    </div>
                                ) : error ? (
                                    <div className="error-container text-center py-5">
                                        <p className="text-danger">{error}</p>
                                        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
                                            Retry
                                        </button>
                                    </div>
                                ) : (
                                    recentPosts.map((post, index) => (
                                        <div key={index} className="single-studies col-lg-4">
                                            <SingleCourseFour {...post} />
                                        </div>
                                    ))
                                )}
                            </TabPanel>
                        </div>

                    </div>
                </Tabs>
            </div>
        </div>
    );
}

export default Course;