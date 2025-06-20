import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
//import InstructorMain from './InstructorMain';
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';
import SkillPostCreationForm from '../../components/Myskill/SkillPostCreationForm';
import MySkillsGridMain from './MySkillsGridMain';

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
                        pageTitle="My Skills"
                    />

                    {/* <InstructorMain /> */}
                    <SkillPostCreationForm />

                    <MySkillsGridMain />

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

