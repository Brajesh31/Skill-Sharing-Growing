import PlanMain from './PlanMain';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';

const Plan = () => {
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
                        pageTitle="Plans"
                    />

                    <PlanMain />
                   

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />
            
        </body>
    );
}


export default Plan;

