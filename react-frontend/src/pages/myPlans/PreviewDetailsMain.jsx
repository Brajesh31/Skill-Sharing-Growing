import React  from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Faq from '../../components/Faq';
import courses from '../../data/Courses.json';

import authorImg1 from '../../assets/images/course-single/user4.jpg'
import authorImg2 from '../../assets/images/course-single/user5.jpg'

const PreviewDetailsMain = (props) => {
    let tab1 = "Discription",
        tab3 = "Comments",
        tab4 = "FAQ"
        const tabStyle = 'nav nav-tabs';

    const { skillImg, skillID, skillUserId, skill, skillTitle, courseAuthor, courseAuthorImg, skillSharingPostLikes, courseDescription, courseComments } = props;
    
    return (
        <div className="back__course__page_grid react-courses__single-page pb---16 pt---110">
            <div className="container pb---70">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="course-details-video mb---30">
                            <iframe width="100%" height="400" src="https://www.youtube.com/embed/e5Hc2B50Z7c" title="YouTube video player" allow="accelerometer"></iframe>
                        </div>
                        <Tabs>
                            <div className="course-single-tab">
                                <TabList className={tabStyle}>
                                    <Tab><button>{tab1}</button></Tab>
                                    <Tab><button>{tab3}</button></Tab>
                                    <Tab><button>{tab4}</button></Tab>
                                </TabList>
                                
                                <div className="tab-content" id="back-tab-content">
                                    
                                    {/* Discription */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>About This Skill</h3>
                                            <p>{courseDescription}</p>
                                            <div className="image-banner"><img src={require(`../../assets/images/course/${skillImg}`)} alt="user" /></div>
                                        </div>
                                    </TabPanel>
                                    
                                    {/* Comments */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>Comments</h3>                                            
                                            
                                            {/* Loop over the comments array passed down via props */}
                                            {courseComments && courseComments.map((singleComment, index) => (
                                            <Link to="#" className="post-author" key={index}>
                                                <div className="avatar">
                                                {/* If you want each comment to have its own image from the JSON, do: 
                                                    <img src={require(`../../assets/images/course-single/${singleComment.profileImg}`)} alt="user" />
                                                    Otherwise, use a static import like authorImg1 or authorImg2 
                                                */}
                                                <img 
                                                    src={require(`../../assets/images/course-single/${singleComment.profileImg}`)} 
                                                    alt="user" 
                                                />
                                                </div>
                                                <div className="info">
                                                <h4 className="name">
                                                    {singleComment.userName}{" "}
                                                    <span className="designation">{singleComment.date}</span>
                                                </h4>
                                                <p>{singleComment.comment}</p>
                                                </div>
                                            </Link>
                                            ))}

                                            
                                            
                                        </div>
                                    </TabPanel>
                                    
                                    {/* faq */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>FAQ</h3>
                                            <Faq />
                                        </div>
                                    </TabPanel>
                                </div>
                            </div>
                        </Tabs>
                        
                    </div>
                    
                </div>
            </div>
        </div> 
    );
}

export default PreviewDetailsMain;