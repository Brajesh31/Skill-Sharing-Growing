import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
//import InstructorMain from './InstructorMain';
import ScrollToTop from '../../components/ScrollTop';


import Logo from '../../assets/images/logos/logo2.png';
//import MySkillsGridMain from './MySkillsGridMain';
import MilestonePostCreationForm from '../../components/MyMilestones/MilestonePostCreationForm';
import CreatedByMe from './CreatedByMe';

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
                        pageTitle="My Milestones"
                    />

                    <MilestonePostCreationForm />

                    <CreatedByMe />

          

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

