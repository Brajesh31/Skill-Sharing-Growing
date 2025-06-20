// import React from 'react';
// import { Link } from 'react-router-dom'


// const SingleCourseFour = (props) => {
//     const {
//         // itemClass,
//         // skillID,
//         // skillImg,
//         // skill,
//         // skillUserId,
//         // skillTitle,
//         // courseAuthor,
//         // courseAuthorImg,
//         // skillSharingPostLikes,
//         // courseDescription,
//         // courseComments
//         skillPostId,
//         authorId,
//         authorName,
//         authorProfileImageUrl,
//         skillPostImageUrls,
//         skillPostVideoUrl,
//         skillPostVideoThumbnailUrl,
//         videoDurationSeconds,
//         skillName,
//         title,
//         description,
//         noOfLikes,
//         likedUserIds,
//         comments,
//         createdAt
//     } = props;

//     return (
//         <div className='inner-course'>
//             <div className="case-img">
//                 <Link to="#" className="cate-w">{skillName}</Link>
//                 <img src={skillPostImageUrls ?? ""} alt={skillName} />
//             </div>
//             <div className="case-content">
//                 <ul className="meta-course">
//                     <li>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
//                             <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
//                         </svg>
//                         {noOfLikes} Likes </li>
//                     {/* <li><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> {courseEnrolled ? courseEnrolled : '44'} Students </li> */}
//                     <li>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
//                             <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3.8 11.5a8.5 8.5 0 1 1 17 0z"></path>
//                         </svg>
//                         {comments.length} Comments
//                     </li>

//                 </ul>
//                 <h4 className="case-title">
//                     <Link to={`/skillfeed/${skillPostId}`}>
//                         {title}
//                     </Link>
//                 </h4>
//                 <div className="react__user">
//                     <Link to={`/author/${authorId}`}>
//                         <img src={require(`../../assets/images/course/${authorProfileImageUrl}`)} alt="user" /> {authorName}
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SingleCourseFour;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { formatDate } from "../../util/formatDate";


// const SingleCourseFour = (props) => {
//     const {
//         skillPostId,
//         authorId,
//         authorName,
//         authorProfileImageUrl,
//         skillPostImageUrls = [],
//         skillPostVideoUrl,
//         skillPostVideoThumbnailUrl,
//         videoDurationSeconds,
//         skillName,
//         title,
//         description,
//         noOfLikes,
//         likedUserIds,
//         comments = [],
//         createdAt
//     } = props;

//     const [currentImageIndex, setCurrentImageIndex] = useState(0);

//     // Function to handle image navigation
//     const handleImageNav = (direction) => {
//         if (direction === 'next') {
//             setCurrentImageIndex((prev) =>
//                 prev === skillPostImageUrls.length - 1 ? 0 : prev + 1);
//         } else {
//             setCurrentImageIndex((prev) =>
//                 prev === 0 ? skillPostImageUrls.length - 1 : prev - 1);
//         }
//     };

//     // Format video duration
//     const formatDuration = (seconds) => {
//         if (!seconds) return '';
//         const minutes = Math.floor(seconds / 60);
//         const remainingSeconds = seconds % 60;
//         return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
//     };

//     return (
//         <div className='inner-course'>
//             <div className="case-img">
//                 <Link to="#" className="cate-w">{skillName}</Link>

//                 {/* Display video thumbnail or images */}
//                 {skillPostVideoUrl ? (
//                     <div className="video-container">
//                         <img
//                             src={skillPostVideoThumbnailUrl || ''}
//                             alt={`${title} video thumbnail`}
//                             className="video-thumbnail"
//                         />
//                         <div className="video-duration">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play-circle">
//                                 <circle cx="12" cy="12" r="10"></circle>
//                                 <polygon points="10 8 16 12 10 16 10 8"></polygon>
//                             </svg>
//                             <span>{formatDuration(videoDurationSeconds)}</span>
//                         </div>
//                     </div>
//                 ) : (
//                     skillPostImageUrls && skillPostImageUrls.length > 0 ? (
//                         <div className="image-gallery">
//                             <img
//                                 src={skillPostImageUrls[currentImageIndex]}
//                                 alt={`${title} - image ${currentImageIndex + 1}`}
//                                 className="post-image"
//                             />

//                             {skillPostImageUrls.length > 1 && (
//                                 <div className="image-navigation">
//                                     <button
//                                         onClick={() => handleImageNav('prev')}
//                                         className="nav-button prev"
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left">
//                                             <polyline points="15 18 9 12 15 6"></polyline>
//                                         </svg>
//                                     </button>
//                                     <div className="image-indicators">
//                                         {skillPostImageUrls.map((_, index) => (
//                                             <span
//                                                 key={index}
//                                                 className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
//                                                 onClick={() => setCurrentImageIndex(index)}
//                                             ></span>
//                                         ))}
//                                     </div>
//                                     <button
//                                         onClick={() => handleImageNav('next')}
//                                         className="nav-button next"
//                                     >
//                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right">
//                                             <polyline points="9 18 15 12 9 6"></polyline>
//                                         </svg>
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="no-media">
//                             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image">
//                                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
//                                 <circle cx="8.5" cy="8.5" r="1.5"></circle>
//                                 <polyline points="21 15 16 10 5 21"></polyline>
//                             </svg>
//                         </div>
//                     )
//                 )}
//             </div>

//             <div className="case-content">
//                 {createdAt && (
//                     <div className="post-date">
//                         {formatDate(createdAt)}
//                     </div>
//                 )}
//                 <ul className="meta-course pt---10">
//                     <li>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
//                             <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
//                         </svg>
//                         {noOfLikes === 1 ? `${noOfLikes} Like` : `${noOfLikes} Likes`}
//                     </li>
//                     <li>
//                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
//                             <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3.8 11.5a8.5 8.5 0 1 1 17 0z"></path>
//                         </svg>
//                         {comments.length === 1 ? `${comments.length} Comment` : `${comments.length} Comments`}
//                     </li>
//                 </ul>

//                 <h4 className="case-title">
//                     <Link to={`/skill-feed/${skillPostId}`}>
//                         {title}
//                     </Link>
//                 </h4>

//                 {description && (
//                     <div className="post-description">
//                         {description.length > 100
//                             ? `${description.substring(0, 100)}...`
//                             : description
//                         }
//                     </div>
//                 )}

//                 <div className="react__user">
//                     <Link to={`/author/${authorId}`} className="author-link">
//                         <img
//                             src={authorProfileImageUrl}
//                             alt={authorName}
//                             className="author-image"
//                         />
//                         <span className="author-name">{authorName}</span>
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SingleCourseFour;

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from "../../util/formatDate";

const SingleCourseFour = (props) => {
    const {
        skillPostId,
        authorId,
        authorName,
        authorProfileImageUrl,
        skillPostImageUrls = [],
        skillPostVideoUrl,
        skillPostVideoThumbnailUrl,
        videoDurationSeconds,
        skillName,
        title,
        description,
        noOfLikes,
        likedUserIds,
        comments = [],
        createdAt
    } = props;

    // Use either original or new props based on what's provided
    const postId = skillPostId;
    const userId = authorId;
    const postSkill = skillName;
    const postTitle = title;
    const postAuthor = authorName;
    const postAuthorImg = authorProfileImageUrl;
    const postLikes = noOfLikes;
    const postComments = comments || [];
    const postDescription = description;

    // Format video duration
    const formatDuration = (seconds) => {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };


    return (
        <div className='inner-course'>
            <div className="case-img">
                <Link to="#" className="cate-w">{postSkill}</Link>

                {/* Display video thumbnail or first image */}
                {skillPostVideoUrl ? (
                    <div className="video-container">
                        <img
                            src={skillPostVideoThumbnailUrl || ''}
                            alt={`${postTitle} video thumbnail`}
                        />
                        {/* <div className="video-duration">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play-circle">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polygon points="10 8 16 12 10 16 10 8"></polygon>
                            </svg>
                            <span>{formatDuration(videoDurationSeconds)}</span>
                        </div> */}
                    </div>
                ) : (

                    <img src={skillPostImageUrls[0]} alt={postTitle} />
                )}
            </div>

            <div className="case-content" style={{ margingBottom: '20px' }}>
                {/* Show date if available, maintaining original style */}
                {/* {createdAt && (
                    <div className="post-date" style={{ fontSize: '14px', color: 'red', marginBottom:"20px" }}>
                        {formatDate(createdAt)}
                    </div>
                )} */}

                <ul className="meta-course">
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        {postLikes} Likes
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
                            <path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3.8 11.5a8.5 8.5 0 1 1 17 0z"></path>
                        </svg>
                        {postComments.length} Comments
                    </li>
                </ul>

                <h4 className="case-title">
                    {/* <Link to={`/skill-feed/${postId}`} style={{ fontWeight: 600, color:"black"}}>
                        {postTitle}
                    </Link> */}
                    <a href={`/skill-feed/${postId}`}>{postTitle}</a>
                </h4>

                {/* Show description excerpt if available */}
                {/* {postDescription && (
                    <div className="post-description">
                        {postDescription.length > 100
                            ? `${postDescription.substring(0, 100)}...`
                            : postDescription
                        }
                    </div>
                )} */}

<div className="react__user" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '40px' }}>
    <Link to={`/author/${userId}`} style={{ display: 'flex', alignItems: 'center' }}>
        {/* Handle image path like the original component */}
        {postAuthorImg && postAuthorImg.startsWith && postAuthorImg.startsWith('http') ? (
            <img src={postAuthorImg} alt="user" style={{ width: '30px', height: '30px', borderRadius: '50%' }}/>
        ) : (
            postAuthorImg && (
                <img
  src={
    postAuthorImg && postAuthorImg.startsWith?.('http')
      ? postAuthorImg
      : postAuthorImg || '../../assets/images/profile1.jpg'
  }
  alt="user"
  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
  onError={(e) => {
    // Prevent infinite loop
    if (e.target.src !== window.location.origin + '/default-user.png') {
      e.target.onerror = null;
      e.target.src = '../../assets/images/profile1.jpg';
    }
  }}
/>

            )
        )}
        <span style={{ marginLeft: '3px', color:"#5b5f64", fontSize:"16px"}}>{postAuthor}</span>
    </Link>
    {createdAt && (
        <div className="post-date" style={{ fontSize: '14px', color: 'red' }}>
            {formatDate(createdAt)}
        </div>
    )}
</div>
            </div>
        </div>
    );
};

SingleCourseFour.propTypes = {
    skillPostId: PropTypes.string,
    authorId: PropTypes.string,
    authorName: PropTypes.string,
    authorProfileImageUrl: PropTypes.string,
    skillPostImageUrls: PropTypes.arrayOf(PropTypes.string),
    skillPostVideoUrl: PropTypes.string,
    skillPostVideoThumbnailUrl: PropTypes.string,
    videoDurationSeconds: PropTypes.number,
    skillName: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    noOfLikes: PropTypes.number,
    likedUserIds: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.array,
    createdAt: PropTypes.string
};

export default SingleCourseFour;