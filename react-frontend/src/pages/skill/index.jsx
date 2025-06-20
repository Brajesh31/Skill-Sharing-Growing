import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import SkillGridMain from './SkillGridMain';
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';

const Skill = () => {
    return (
        <body className="courses-grid-page">
            <Header
                parentMenu='learnShare'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Skill Feed"
                    />
                    <SkillGridMain />
                    <ScrollToTop />
                </div>
            </div>

            <Footer />

        </body>
    );
}


export default Skill;

