import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Callback from "../common/Callback";
import PrivateRoute from "../common/PrivateRoute";
import Preloader from "../components/Preloader";
import LoadTop from '../components/ScrollTop/LoadTop';
import Error from '../pages/404';
import About from '../pages/about';
import Login from '../pages/authentication/login';
import Signup from '../pages/authentication/signup';
import AuthorDetails from "../pages/author/AuthorDetails";
import AuthorFollowers from "../pages/author/AuthorFollowers";
import AuthorFollowing from '../pages/author/AuthorFollowing';
import Plan from '../pages/plan';
import PlanDetails from '../pages/plan/PlanDetails';
import Contact from '../pages/contact';
import Skill from '../pages/skill';
//app
import SkillDetails from '../pages/skill/SkillDetails';

import HomeTwo from '../pages/home-2';
import Milestones from '../pages/milestones';
import MyMilestones from '../pages/myMilestones';
import MyPlans from '../pages/myPlans';
import MySkill from '../pages/myskill';
import Preview from "../pages/myskill/Preview";
import Notification from "../pages/notifications";
import Profile from "../pages/profile";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";


const App = () => {
    const { isAuthenticated } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Simulate data loading delay
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    useEffect(() => {
        // Only set up refresh interval if user is authenticated
        if (isAuthenticated) {
            // Check for token refresh every minute
            const refreshInterval = setInterval(() => {
                if (authService.needsRefresh()) {
                    authService.refreshToken();
                }
            }, 60000); // Check every minute

            return () => clearInterval(refreshInterval);
        }
    }, [isAuthenticated]);

    return (
        <BrowserRouter>
            <div className='App'>
                {isLoading ?
                    <Preloader /> : ''
                }
                <LoadTop />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/callback" element={<Callback />} />
                    <Route path="/" exact element={<HomeTwo />} />
                    <Route path="/about" element={<About />} />






                    <Route path="/signup" element={<Signup />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path='*' element={<Error />} />

                    {/* Private Routes */}
                    {/*  Skill Post Routes */}
                    <Route path="/my-skills" exact element={
                        <PrivateRoute>
                            <MySkill />
                        </PrivateRoute>
                    } />
                    <Route path="/my-skills/preview/:skillPostId" exact element={
                        <PrivateRoute>
                            <Preview />
                        </PrivateRoute>
                    } />
                    <Route path="/skill-feed" exact element={
                        <PrivateRoute>
                            <Skill />
                        </PrivateRoute>
                    } />
                    <Route path="/skill-feed/:skillPostId" element={
                        <PrivateRoute>
                            <SkillDetails />
                        </PrivateRoute>
                    } />

                    {/*  Milestone Post Routes */}
                    <Route path="/my-milestones" exact element={
                        <PrivateRoute>
                            <MyMilestones />
                        </PrivateRoute>
                    } />
                    <Route path="/milestones" exact element={
                        <PrivateRoute>
                            <Milestones />
                        </PrivateRoute>
                    } />

                    {/* Roadmap Routes */}
                    <Route path="/my-plans" exact element={
                        <PrivateRoute>
                            <MyPlans />
                        </PrivateRoute>
                    } />
                    <Route path="/plans" exact element={
                        <PrivateRoute>
                            <Plan />
                        </PrivateRoute>
                    } />
                    <Route path="/plans/:id" element={
                        <PrivateRoute>
                            <PlanDetails />
                        </PrivateRoute>
                    } />

                    {/* Author Routes */}
                    <Route path="/author" exact element={
                        <PrivateRoute>
                            <AuthorFollowing />
                        </PrivateRoute>
                    } />
                    <Route path="/author/:authorId" exact element={
                        <PrivateRoute>
                            <AuthorDetails />
                        </PrivateRoute>
                    } />

                    {/* User Profile Routes*/}
                    <Route path="/my-account" exact element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    } />
                    <Route path="/my-account/following/:authorId" exact element={
                        <PrivateRoute>
                            <AuthorFollowing />
                        </PrivateRoute>
                    } />
                    <Route path="/my-account/followers/:authorId" exact element={
                        <PrivateRoute>
                            <AuthorFollowers />
                        </PrivateRoute>
                    } />

                    {/* Notifications  Routes*/}
                    <Route path="/notifications" exact element={
                        <PrivateRoute>
                            <Notification />
                        </PrivateRoute>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
