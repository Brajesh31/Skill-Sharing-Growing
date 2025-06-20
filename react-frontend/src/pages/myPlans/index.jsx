import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';
import PlanPostForm from '../../components/MyPlans/PlanPostForm'; 
import PlanDetailsView from '../../components/MyPlans/PlanDetailsView'; 
import CreatedMyPlans from '../../components/MyPlans/CreatedMyPlans'; 

const MySkill = () => {
    return (
        <>
            <Header
                parentMenu='my'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Plans"
                    />

                    {/* <InstructorMain /> */}
                    <PlanPostForm />

                    {/* <MySkillsGridMain /> */}
                    <PlanDetailsView />

                    <CreatedMyPlans />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </>
    );
}


export default MySkill;

