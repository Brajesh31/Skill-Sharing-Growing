import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import FooterTwo from '../../components/Footer/FooterTwo';
import Breadcrumb from '../../components/Breadcrumb';
import AuthorMain from './AuthorMain';
import ScrollToTop from '../../components/ScrollTop';

import Logo from '../../assets/images/logos/logo2.png';
import { userService } from '../../services/userService';
import { useNotification } from '../../components/Notification/NotificationContext';
import { useParams } from 'react-router';

const AuthorFollowing = () => {
    const { authorId } = useParams();

    const { showNotification } = useNotification();
    const [following, setFollowing] = useState([]);
//
    useEffect(() => {
        async function fetchDataUser() {
            try {
                const response = await userService.getFollowing(authorId);
                setFollowing(response);
            } catch (error) {
                showNotification(`${error}, 'Failed to fetch user data. Please try again later.`, "error");
            }
        }
        fetchDataUser();
    }, [authorId]);

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
                        pageTitle="Following"
                    />

                    <AuthorMain
                        authors={following}
                    />

                    {/* scrolltop-start */}
                    <ScrollToTop />
                    {/* scrolltop-end */}
                </div>
            </div>

            <FooterTwo />

        </>
    );
}


export default AuthorFollowing;

