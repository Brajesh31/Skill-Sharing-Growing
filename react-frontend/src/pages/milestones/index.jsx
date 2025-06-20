import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ScrollToTop from '../../components/ScrollTop';
import MilestonesGridMain from './MilestonesGridMain';

import Logo from '../../assets/images/logos/logo2.png';

const Milestones = () => {
    return (
        <body className="blog-post-page">
            <Header
                parentMenu='learnShare'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Milestones"
                    />

                    <MilestonesGridMain />

                    {/* <BlogMain /> */}

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />
        </body>
    );
}


export default Milestones;

