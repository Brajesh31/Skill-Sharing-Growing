import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import { Link } from 'react-router-dom';
import VisibilitySensor from 'react-visibility-sensor';
import countIcon1 from '../../assets/images/profile/2.png';
import countIcon2 from '../../assets/images/profile/3.png';
import countIcon3 from '../../assets/images/profile/4.png';
import { userService } from '../../services/userService';
import { skillPostService } from '../../services/skillPostService';
import SingleCourseFour from '../../components/Course/SingleCourseFour';
import SingleMilestoneThree from '../../components/Milestones/SingleMilestoneThree';
import { milestonePostService } from '../../services/milestonePostService';
import LoadingSpinner from '../../components/Public/LoadingSpinner';
import { useNotification } from '../../components/Notification/NotificationContext';
//
const AuthorDetailsMain = ({
    id,
    email,
    name,
    profileImageUrl,
    bio,
    followingCount,
    followersCount,
    currentUserFollows
}) => {

    const { showNotification } = useNotification();
    const [state, setState] = useState(true);
    const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(currentUserFollows);
    const [skillPosts, setSkillPosts] = useState([]);
    const [milestonePosts, setMilestonePosts] = useState([]);
    const [skillPostLoading, setSkillPostLoading] = useState(true);
    const [milestonePostLoading, setMilestonePostLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [skillPostLikes, setSkillPostLikes] = useState([]);

    useEffect(() => {
        setIsCurrentUserFollowing(currentUserFollows);
    }, [currentUserFollows]);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            setSkillPostLoading(true);
            try {
                const response = await skillPostService.getPostsByUser(id);
                setSkillPosts(response);
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                setSkillPostLoading(false);
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchData() {
            if (!id) return;

            setMilestonePostLoading(true);
            try {
                const response = await milestonePostService.getPostsByUserId(id);
                setMilestonePosts(response);
            } catch (error) {
                showNotification(error.message, 'error');

            } finally {
                setMilestonePostLoading(false);
            }
        }
        fetchData();
    }, [id, showNotification]);

    useEffect(() => {
        if (!id) return;
        async function fetchSkillPostLikes() {
            try {
                const response = await skillPostService.getLikesForAllPostsByUser(id);
                setSkillPostLikes(response);
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }

        fetchSkillPostLikes();
    }, [id]);

    const counters = [
        {
            countNum: followersCount,
            countTitle: 'Followers',
            countSubtext: followersCount > 1000 ? 'k' : '',
            countIcon: countIcon1,
        },
        {
            countNum: followingCount,
            countTitle: 'Following',
            countSubtext: followingCount > 1000 ? 'k' : '',
            countIcon: countIcon2,
        },
        {
            countNum: skillPostLikes,
            countTitle: 'Skill Post Likes',
            countSubtext: skillPostLikes > 1000 ? 'k' : '',
            countIcon: countIcon3,
        }

    ];

    const handleFollow = async () => {
        setSubmitting(true);
        try {
            await userService.followUser(id);
            setIsCurrentUserFollowing(true);
            showNotification('You are now following this user', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUnfollow = async () => {
        setSubmitting(true);
        try {
            await userService.unfollowUser(id);
            setIsCurrentUserFollowing(false);
            showNotification('You have unfollowed this user', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div className="profile-top back__course__area pt---120 pb---90">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <img src={profileImageUrl?.replace("s96-c", "s384-c")} alt={name} />
                        {isCurrentUserFollowing ? (
                            <button
                                className="follows"
                                style={{
                                    border: "none",
                                    width: "100%",
                                    maxWidth: "384px",
                                    backgroundColor: submitting ? "#ccc" : "#f00"
                                }}
                                onClick={handleUnfollow}
                                disabled={submitting}
                            >
                                {submitting ? "Unfollowing..." : "Unfollow"}
                            </button>
                        ) : (
                            <button
                                className="follows"
                                style={{
                                    border: "none",
                                    width: "100%",
                                    maxWidth: "384px",
                                    backgroundColor: submitting ? "#ccc" : "#0066ff"
                                }}
                                onClick={handleFollow}
                                disabled={submitting}
                            >
                                {submitting ? "Following..." : "Follow"}
                            </button>
                        )}
                    </div>
                    <div className="col-lg-8">
                        <ul className="user-section">
                            <li className="user">
                                <span className="name">Name:</span><em>{name}</em>
                            </li>
                            <li>Email:<em>{email}</em> </li>
                            <li className="social">
                                Follow: <em>
                                    <Link to="#"><span aria-hidden="true" className="social_facebook"></span></Link>
                                    <Link to="#"><span aria-hidden="true" className="social_twitter"></span></Link>
                                    <Link to="#"><span aria-hidden="true" className="social_linkedin"></span></Link>
                                </em>
                            </li>
                        </ul>
                        <h3>Biography</h3>
                        <p>{bio}</p>
                        {counters &&
                            <div className="count__area2">
                                <ul className="row">
                                    {counters.map((counter, num) => (
                                        <li key={num} className="col-lg-4">
                                            <div className="count__content">
                                                <div className="icon">
                                                    <img src={counter.countIcon} alt="profile" />
                                                </div>
                                                <div className="text">
                                                    <CountUp start={state ? 0 : counter.countNum} end={counter.countNum} duration={2} onEnd={() => setState(false)} />
                                                    {({ countUpRef, start }) => (
                                                        <VisibilitySensor onChange={start} delayedCall>
                                                            <span ref={countUpRef} />
                                                            <span className="count__content-title counter">{counter.countNum}</span>
                                                        </VisibilitySensor>
                                                    )}

                                                    <em>{counter.countSubtext}</em>
                                                    <p>{counter.countTitle}</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                        <h2 className="teacher__course">Shared Skills</h2>
                        <div className="react-course-filter related__course">
                            <div className="react-course-filter related__course">
                                <div className="row react-grid">
                                    {skillPostLoading && <LoadingSpinner />}
                                    {skillPosts
                                        ?.map((skillPost, _) => {
                                            return (
                                                <div key={skillPost.skillPostId} className="single-studies col-lg-6">
                                                    <SingleCourseFour
                                                        skillPostId={skillPost?.skillPostId}
                                                        authorId={skillPost?.authorId}
                                                        authorName={skillPost?.authorName}
                                                        authorProfileImageUrl={skillPost?.authorProfileImageUrl}
                                                        skillPostImageUrls={skillPost?.skillPostImageUrls}
                                                        skillPostVideoUrl={skillPost?.skillPostVideoUrl}
                                                        skillPostVideoThumbnailUrl={skillPost?.skillPostVideoThumbnailUrl}
                                                        videoDurationSeconds={skillPost?.videoDurationSeconds}
                                                        skillName={skillPost?.skillName}
                                                        title={skillPost?.title}
                                                        description={skillPost?.description}
                                                        noOfLikes={skillPost?.noOfLikes}
                                                        likedUserIds={skillPost?.likedUserIds}
                                                        comments={skillPost?.comments}
                                                        createdAt={skillPost?.createdAt}
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>

                        </div>

                        <h2 className="teacher__course">Milestones</h2>
                        <div className="react-course-filter related__course">
                            <div className="react-course-filter related__course">
                                <div className="row react-grid">
                                    {milestonePostLoading && <LoadingSpinner />}
                                    {milestonePosts
                                        .map((milestonePost, index) => (
                                            <div key={milestonePost?.milestonePostId} className="col-lg-6">
                                                <SingleMilestoneThree
                                                    postId={milestonePost?.milestonePostId}
                                                    authorName={milestonePost?.authorName}
                                                    date={milestonePost?.postedDate}
                                                    profileImg={milestonePost?.profileImageUrl}
                                                    skill={milestonePost?.skill}
                                                    title={milestonePost?.title}
                                                    templateType={milestonePost?.templateType}
                                                    templateData={milestonePost?.templateData}
                                                    likes={milestonePost?.noOfLikes}
                                                    comments={milestonePost?.comments}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >

    );
}

AuthorDetailsMain.propTypes = {
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    profileImageUrl: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    followingCount: PropTypes.number.isRequired,
    followersCount: PropTypes.number.isRequired,
    currentUserFollows: PropTypes.bool.isRequired
};

export default AuthorDetailsMain;