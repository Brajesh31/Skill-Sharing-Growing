import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ContactMain from './ContactMain';
import ScrollToTop from '../../components/ScrollTop';

// Image
import Logo from '../../assets/images/logos/logo2.png';

const Contact = () => {
    return (
        <>
            <Header
                parentMenu='contact'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Contact"
                    />

                    <ContactMain />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </>
    );
}


export default Contact;

