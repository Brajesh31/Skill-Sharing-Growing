import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
//main
import countIcon1 from '../../assets/images/profile/2.png'
import countIcon2 from '../../assets/images/profile/3.png'
import countIcon3 from '../../assets/images/profile/4.png'
import { userService } from "../../services/userService";
import { useNotification } from "../../components/Notification/NotificationContext";
import { skillPostService } from "../../services/skillPostService";


const ProfileMain = () => {
    const { showNotification } = useNotification();
    const [author, setAuthor] = useState();
    const [skillPostLikes, setSkillPostLikes] = useState([]);
    const [error, setError] = useState(null);
    const [userBio, setUserBio] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        async function fetchUserData() {
            try {
                setError(null);
                const response = await userService.getMe();
                setAuthor(response);
                setUserBio(response.bio);
            } catch (error) {
                setError(`Failed to fetch user data: ${error.message}`);
            }
        }

        fetchUserData();
    }, [])

    useEffect(() => {
        async function fetchSkillPostLikes() {
            try {
                setError(null);
                const response = await skillPostService.getLikesForAllPostsForCurrentUser();
                setSkillPostLikes(response);
            } catch (error) {
                setError(`Failed to fetch skill post likes: ${error.message}`);
            }
        }

        fetchSkillPostLikes();
    }, [author]);

    const [state, setState] = useState(true);

    const counters = [
        {
            countNum: author?.followersCount,
            countTitle: 'Followers',
            countSubtext: author?.followersCount > 1000 ? 'k' : '',
            countIcon: countIcon1,
        },
        {
            countNum: author?.followingCount,
            countTitle: 'Following',
            countSubtext: author?.followingCount > 1000 ? 'k' : '',
            countIcon: countIcon2,
        },
        {
            countNum: skillPostLikes,
            countTitle: 'Skill Post Likes',
            countSubtext: skillPostLikes > 1000 ? 'k' : '',
            countIcon: countIcon3,
        }
    ];

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await userService.updateBio(userBio);

            setShowEditModal(false);

            showNotification('Bio updated successfully!', 'success');
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) {
        return (
            <div className="react-course-filter back__course__page_grid pb-40 pt-110">
                <div className="container text-center py-5">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="modal-close"
                            onClick={() => setShowEditModal(false)}
                        >
                            X
                        </button>
                        <h3 className="modal-title">Edit Skill Post</h3>
                        {error && <div className="error-message">{error}</div>}
                        <form className="modal-form" onSubmit={handleEditSubmit}>
                            <label htmlFor="description">Description:</label>
                            <textarea
                                id="description"
                                value={userBio}
                                onChange={(e) => setUserBio(e.target.value)}
                                required
                                rows="5"
                            />

                            <div className="modal-footer action-buttons">
                                <button
                                    type="submit"
                                    className="edit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setShowEditModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="profile-top back__course__area pt---120 pb---90">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <img src={author?.profileImageUrl?.replace("s96-c", "s384-c")} alt={author?.authorName} />
                            <Link
                                to={`/my-account/followers/${author?.id}`}
                                className="follows"
                                style={{
                                    border: "none",
                                    width: "100%",
                                    maxWidth: "384px",
                                }}

                            >
                                {"Followers"}
                            </Link>
                            <Link
                                to={`/my-account/following/${author?.id}`}
                                className="follows"
                                style={{
                                    border: "none",
                                    width: "100%",
                                    maxWidth: "384px",
                                }}
                            >
                                {"Following"}
                            </Link>
                        </div>
                        <div className="col-lg-8">
                            <ul className="user-section">
                                <li className="user">
                                    <span className="name">Name:</span><em>{author?.name}</em>
                                </li>

                                <li>Email:<em>{author?.email}</em> </li>
                                <li className="social">
                                    Follow: <em>
                                        <Link to="#"><span aria-hidden="true" className="social_facebook"></span></Link>
                                        <Link to="#"><span aria-hidden="true" className="social_twitter"></span></Link>
                                        <Link to="#"><span aria-hidden="true" className="social_linkedin"></span></Link>
                                    </em>
                                </li>
                            </ul>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0 0 1rem',
                                }}
                            >
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Biography</h3>
                                <button
                                    onClick={handleEdit}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#007bff',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        padding: '0.25rem 0.5rem',
                                    }}
                                    onMouseOver={(e) => (e.target.style.textDecoration = 'underline')}
                                    onMouseOut={(e) => (e.target.style.textDecoration = 'none')}
                                >
                                    Edit
                                </button>
                            </div>
                            <p>{author?.bio}</p>

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
                            {/* <h2 className="teacher__course">Shared Skills</h2>
                            <div className="react-course-filter related__course">
                            <div className="react-course-filter related__course">
                            <div className="row react-grid">
                                {courses
                                .filter((data) => data.userId === author.id) // Filter courses where userId is 1
                                .map((data, index) => {
                                    return (
                                    <div key={index} className="single-studies col-lg-6">
                                        <SingleCourseFour
                                        skillID={data.id}
                                        skillUserId={data.userId}
                                        skillImg={`${data.image}`}
                                        skill={data.skill}
                                        skillTitle={data.title}
                                        courseAuthor={data.userName} // Assuming "userName" is the author's name
                                        courseAuthorImg={`${data.authorImg}`}
                                        skillSharingPostLikes={data.likes}
                                        courseDescription={data.description} // Pass the description
                                        courseComments={data.comments} // Pass the comments array
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
                                {milestones
                                .filter((data) => data.userId === author.id)
                                .map((data, index) => (
                                    <div key={index} className="col-lg-6">
                                    <SingleMilestoneThree
                                        postId={data.id}
                                        authorName={data.authorName}
                                        date={data.date}
                                        profileImg={`${data.profileImg}`}
                                        skill={data.skill}
                                        title={data.title}
                                        description={data.description}
                                        likes={data.likes}
                                        comments={data.comments}
                                    />
                                    </div>
                                ))}
                                </div>
                            </div>
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default ProfileMain;