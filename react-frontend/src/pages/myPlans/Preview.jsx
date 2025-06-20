import React  from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb/CourseBreadcrumbs';
import PreviewDetailsMain from './PreviewDetailsMain';
import ScrollToTop from '../../components/ScrollTop';
import courses from '../../data/Courses.json';

import Logo from '../../assets/images/logos/logo2.png';

const Preview = () => {

    const location = useLocation();
    const courseURL = location.pathname.split('/'); 
    
    const course = courses.find((b) => b.id === Number(courseURL[3]));
    //const flatPrice = course.price.split('.');
    //const flatPriceRegular = course.regularPrice.split('.');

    return (
        <body className="course-single">
            <Header
                parentMenu='learnShare'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        // courseBannerImg= {`${course.bannerImg}`}
                        // skillTitle= {course.title}
                        // courseName= {course.name}
                        // courseAuthor= {course.author}
                        // courseAuthorImg= {course.authorImg}
                        // courseLesson= {course.lesson}
                        // courseEnrolled= {course.enrolled}

                        skillID={course.id}
                                            skillUserId={course.userId}
                                            skillImg={`${course.image}`}
                                            bannerImg={`${course.bannerImg}`}
                                            skill={course.skill}
                                            skillTitle={course.title}
                                            courseAuthor={course.userName} // Assuming "userName" is the author's name
                                            courseAuthorImg={`${course.authorImg}`}
                                            skillSharingPostLikes={course.likes}
                                            courseDescription={course.description} // Pass the description
                                            courseComments={course.comments} // Pass the comments array
                    />

                    <PreviewDetailsMain
                        // skillID={course.id}
                        // skillImg= {`${course.image}`}
                        // skillTitle= {course.title}
                        // courseName= {course.name}
                        // courseAuthor= {course.author}
                        // courseAuthorImg= {course.authorImg}
                        // courseLesson= {course.lesson}
                        // courseDuration= {course.duration}
                        // courseEnrolled= {course.enrolled}
                        // coursePrice= {flatPrice[0]}
                        // courseRegularPrice= {flatPriceRegular[0]}
                        // courseLanguage= {course.language}
                        skillID={course.id}
                                            skillUserId={course.userId}
                                            skillImg={`${course.image}`}
                                            skill={course.skill}
                                            skillTitle={course.title}
                                            courseAuthor={course.userName} // Assuming "userName" is the author's name
                                            courseAuthorImg={`${course.authorImg}`}
                                            skillSharingPostLikes={course.likes}
                                            courseDescription={course.description} // Pass the description
                                            courseComments={course.comments} // Pass the comments array
                    />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </body>
    );
}

export default Preview;