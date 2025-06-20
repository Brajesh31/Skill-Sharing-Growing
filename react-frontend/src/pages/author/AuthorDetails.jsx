import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Breadcrumb from '../../components/Breadcrumb';
import AuthorDetailsMain from './AuthorDetailsMain';
import ScrollToTop from '../../components/ScrollTop';
//
import Logo from '../../assets/images/logos/logo2.png';
import { useParams } from 'react-router';
import { userService } from '../../services/userService';
import { useNotification } from '../../components/Notification/NotificationContext';

const AuthorDetails = () => {

    const { authorId } = useParams();
    const { showNotification } = useNotification();

    const [userData, setUserData] = useState(null);


    useEffect(() => {
        async function fetchDataUser() {
            try {
                const response = await userService.getUserById(authorId);
                setUserData(response);
            } catch (error) {
                showNotification(`${error}, 'Failed to fetch user data. Please try again later.`, "error");
            }
        }
        fetchDataUser();
    }, [authorId])
    return (
        <body className="profile-page">
            <Header
                parentMenu='page'
                menuCategoryEnable='enable'
                headerNormalLogo={Logo}
                headerStickyLogo={Logo}
            />

            <div className="react-wrapper">
                <div className="react-wrapper-inner">
                    <Breadcrumb
                        pageTitle="Author Profile"
                    />
                    <AuthorDetailsMain {...userData} />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <Footer />

        </body>
    );
}


export default AuthorDetails;

