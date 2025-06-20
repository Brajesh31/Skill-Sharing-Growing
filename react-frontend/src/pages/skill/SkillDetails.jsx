import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Logo from '../../assets/images/logos/logo2.png';
import Breadcrumb from '../../components/Breadcrumb/CourseBreadcrumbs';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/Public/LoadingSpinner';
import ScrollToTop from '../../components/ScrollTop';
import { skillPostService } from '../../services/skillPostService';
import SkillDetailsMain from './SkillDetailsMain';

const SkillDetails = () => {

    const { skillPostId } = useParams();
    const [post, setPost] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                let response;
                response = await skillPostService.getById(skillPostId);
                setPost(response);
            } catch {
                setError("Failed to load posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [skillPostId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button className="btn-retry" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <LoadingSpinner />
            </div>
        );
    }


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
                        skillID={post?.skillPostId}
                        skillUserId={post?.authorId}
                        skillImg={post?.skillPostImageUrls && post?.skillPostImageUrls.length > 0 ? post?.skillPostImageUrls[0] : post?.skillPostVideoThumbnailUrl}
                        bannerImg={post?.skillPostImageUrls && post?.skillPostImageUrls.length > 0 ? post?.skillPostImageUrls[0] : post?.skillPostVideoThumbnailUrl}
                        skill={post?.skillName}
                        skillTitle={post?.title}
                        courseAuthor={post?.authorName}
                        courseAuthorImg={post?.authorProfileImageUrl}
                        skillSharingPostLikes={post?.noOfLikes}
                        likedUserIds={post?.likedUserIds}
                        courseDescription={post?.description}
                        courseComments={post?.comments}
                        createdAt={post?.createdAt}
                    />

                    <SkillDetailsMain
                        skillPostId={post?.skillPostId}
                        authorId={post?.authorId}
                        authorName={post?.authorName}
                        authorProfileImageUrl={post?.authorProfileImageUrl}
                        skillPostImageUrls={post?.skillPostImageUrls}
                        skillPostVideoUrl={post?.skillPostVideoUrl}
                        skillPostVideoThumbnailUrl={post?.skillPostVideoThumbnailUrl}
                        videoDurationSeconds={post?.videoDurationSeconds}
                        skillName={post?.skillName}
                        title={post?.title}
                        description={post?.description}
                        noOfLikes={post?.noOfLikes}
                        likedUserIds={post?.likedUserIds}
                        comments={post?.comments}
                        createdAt={post?.createdAt}
                    />

                    {/* scrollToTop-start */}
                    <ScrollToTop />
                    {/* scrollToTop-end */}
                </div>
            </div>

            <Footer />

        </body>
    );
}

export default SkillDetails;