import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userImg from '../../assets/images/author/11.jpg';  // Default image if profile image is not available
import { userService } from '../../services/userService';

const MenuItems = (props) => {
  const { parentMenu } = props;
  const { isAuthenticated, logout } = useContext(AuthContext);
  const location = useLocation();
  const postURL = location.pathname.split('/');
  const pathLength = Number(postURL.length);

  // Mobile menu state
  const [home, setHome] = useState(false);
  const [page, setPage] = useState(false);
  const [event, setEvent] = useState(false);
  const [learnShare, setLearnShare] = useState(false);
  const [my, setMy] = useState(false);
  const [account, setAccount] = useState(false);
  const [blog, setBlog] = useState(false);

  // State for user details
  const [userDetails, setUserDetails] = useState(null);

  const profileImg = userDetails?.profileImageUrl || userImg;  // Fallback to default image if not available

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userData = await userService.getMe();
        setUserDetails(userData);
      } catch {
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);

  const openMobileMenu = (menu) => {
    if (menu === 'home') {
      setHome(!home);
      setPage(false);
      setEvent(false);
      setLearnShare(false);
      setAccount(false);
      setBlog(false);
    } else if (menu === 'page') {
      setHome(false);
      setPage(!page);
      setEvent(false);
      setAccount(false);
      setLearnShare(false);
      setBlog(false);
    } else if (menu === 'event') {
      setHome(false);
      setPage(false);
      setEvent(!event);
      setAccount(false);
      setLearnShare(false);
      setBlog(false);
    } else if (menu === 'learnShare') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setAccount(false);
      setLearnShare(!learnShare);
      setBlog(false);
    } else if (menu === 'my') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setAccount(false);
      setLearnShare(false);
      setMy(!my);
    } else if (menu === 'account') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setAccount(!account);
      setLearnShare(false);
      setMy(false);
    } else if (menu === 'blog') {
      setHome(false);
      setPage(false);
      setEvent(false);
      setLearnShare(false);
      setBlog(!blog);
    }
  };

  return (
    <>
      <li className={location.pathname === '/' ? 'menu-active' : ''}>
        <Link to="/">Home</Link>
      </li>

      {!isAuthenticated && (
        <li className={location.pathname === '/about' ? 'menu-active' : ''}>
          <Link to="/about">About</Link>
        </li>
      )}

      {!isAuthenticated && (
        <li className={location.pathname === '/login' ? 'menu-active' : ''}>
          <Link to="/login">Login</Link>
        </li>
      )}

      {/* Pages Menu */}
      {/* <li className={parentMenu === 'page' || parentMenu === 'event' ? 'has-sub menu-active' : 'has-sub'}>
        <Link to="#" className={page ? 'hash menu-active' : 'hash'} onClick={() => openMobileMenu('page')}>
          Pages
          <span className="arrow"></span>
        </Link>
        <ul className={page ? 'sub-menu sub-menu-open' : 'sub-menu'}>
          <li className={location.pathname === '/about' ? 'menu-active' : ''}>
            <Link to="/about">About</Link>
          </li>
          <li className={location.pathname === '/author' ? 'menu-active' : ''}>
            <Link to="/author">Instructor</Link>
          </li>
          <li className={postURL[1] === 'author' && pathLength > 2 ? 'menu-active' : ''}>
            <Link to="/author/1">Profile</Link>
          </li>
          {!isAuthenticated && (
            <>
              <li className={location.pathname === '/login' ? 'menu-active' : ''}>
                <Link to="/login">Login</Link>
              </li>
              <li className={location.pathname === '/signup' ? 'menu-active' : ''}>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </li> */}

      {/* Authenticated Menu */}
      {isAuthenticated && (
        <>
          <li className={parentMenu === 'learnShare' ? 'has-sub menu-active' : 'has-sub'}>
            <Link to="#" className={learnShare ? 'hash menu-active' : 'hash'} onClick={() => openMobileMenu('learnShare')}>
              Learn &amp; Share
              <span className="arrow" />
            </Link>
            <ul className={learnShare ? 'sub-menu sub-menu-open' : 'sub-menu'}>
              <li className={location.pathname === '/skill-feed' ? 'menu-active' : ''}>
                <Link to="/skill-feed">Skill Posts</Link>
              </li>
              <li className={location.pathname === '/milestones' ? 'menu-active' : ''}>
                <Link to="/milestones">Milestones</Link>
              </li>
              <li className={location.pathname === '/plans' ? 'menu-active' : ''}>
                <Link to="/plans">Plans</Link>
              </li>
            </ul>
          </li>

          <li className={parentMenu === 'my' ? 'has-sub menu-active' : 'has-sub'}>
            <Link
              to="#"
              className={my ? 'hash menu-active' : 'hash'}
              onClick={() => openMobileMenu('my')}
            >
              My
              <span className="arrow" />
            </Link>
            <ul className={my ? 'sub-menu sub-menu-open' : 'sub-menu'}>
              <li className={location.pathname === '/my-skills' ? 'menu-active' : ''}>
                <Link to="/my-skills">Skill Posts</Link>
              </li>
              <li className={location.pathname === '/my-milestones' ? 'menu-active' : ''}>
                <Link to="/my-milestones">Milestones</Link>
              </li>
              <li className={location.pathname === '/my-plans' ? 'menu-active' : ''}>
                <Link to="/my-plans">Plans</Link>
              </li>
            </ul>
          </li>

          <li className={parentMenu === 'account' ? 'has-sub menu-active' : 'has-sub'}>
            <Link to="#" className={account ? 'hash menu-active' : 'hash'} onClick={() => openMobileMenu('account')}>
              <img src={profileImg} alt="Profile" style={{ width: 40, height: 40, marginTop: -8, borderRadius: "50%" }} />
            </Link>
            <ul className={account ? 'sub-menu sub-menu-open' : 'sub-menu'}>
              <li className={location.pathname === '/notifications' ? 'menu-active' : ''}>
                <Link to="/notifications">Notifications</Link>
              </li>
              <li className={postURL[1] === 'my-account' && pathLength > 2 ? 'menu-active' : ''}>
                <Link to="/my-account">Profile</Link>
              </li>
              <li onClick={logout}>
                <Link style={{ color: "red", fontWeight: 700 }} to="/">Log out</Link>
              </li>
            </ul>
          </li>
        </>
      )}
    </>
  );
};

export default MenuItems;

