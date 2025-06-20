import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer/index';
import Breadcrumb from '../../components/Breadcrumb';

import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';
import NotificationList from './NotificationList';

const Profile = () => {
    return (
        <>
            <Header
                parentMenu='account'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="My Profile"
                    />

                    <NotificationList/>

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </>
    );
}


export default Profile;

