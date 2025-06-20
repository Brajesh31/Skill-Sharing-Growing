import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Logo from '../../assets/images/logos/logo2.png';
import Breadcrumb from '../../components/Breadcrumb/BlogBreadcrumbs';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/Public/LoadingSpinner';
import ScrollToTop from '../../components/ScrollTop';
import { planService } from '../../services/planService';
import PlanDetailsMain from './PlanDetailsMain';

const PlanDetails = () => {
  const { id: planId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await planService.getById(planId);

        setPost(response.data || response);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanDetails();
    }
  }, [planId]);


  if (loading) {
    return <LoadingSpinner size="50px" color="#e74c3c" />
  }

  if (!post) {
    return <div>Post not found!</div>;
  }

  return (
    <body className="course-single blog-post-page blog-post-single-page">
      <Header
        parentMenu='learnShare'
        menuCategoryEnable='enable'
        headerNormalLogo={Logo}
        headerStickyLogo={Logo}
      />

      <div className="react-wrapper">
        <div className="react-wrapper-inner">
          <Breadcrumb
            postTitle={post.title}
            postBannerImg={post.bannerImg}
            postCategory={post.category}
            postAuthor={post.authorName}
            postAuthorImg={post.authorImg}
            postPublishedDate={post.publishedDate}
            postTotalView={post.totalView}
            postDescription={post.description}
            weeks={post.weeks}
          />


          <PlanDetailsMain
            planId={planId}
            postTitle={post.title}
            postBannerImg={post.bannerImg}
            postCategory={post.category}
            postAuthor={post.authorName}
            postAuthorImg={post.authorImg}
            postPublishedDate={post.publishedDate}
            postTotalView={post.totalView}
            postDescription={post.description}
            weeks={post.weeks}
            comments={post.comments}
          />



          {/* scrolltop-start */}
          <ScrollToTop />

        </div>
      </div>

      <Footer />

    </body>
  );
};

export default PlanDetails;