import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import InstructorMain from './InstructorMain';
import ScrollToTop from '../../components/ScrollTop';

// Image
import Logo from '../../assets/images/logos/logo2.png';

const Instructor = () => {
    return (
        <>
            <Header
                parentMenu='page'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Instructor"
                    />

                    <InstructorMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </>
    );
}


export default Instructor;

