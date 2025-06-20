import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { skillPostService } from "../../services/skillPostService";
import { userService } from "../../services/userService";
import dayjs from 'dayjs';

export default function Breadcrumb({
	skillID,
	skill,
	skillTitle,
	courseAuthor,
	courseAuthorImg,
	skillSharingPostLikes,
	courseComments,
	likedUserIds,
	createdAt,
}) {

	const [isLiked, setIsLiked] = useState(false);

	// Format date to relative time
	const formatDate = (dateString) => {
		return dayjs(dateString).fromNow();
	};

	useEffect(() => {
		async function fetchUserData() {
			try {
				const response = await userService.getMe();
				if (response) {
					const userId = response.id;
					const isUserLiked = likedUserIds?.includes(userId) || false;
					setIsLiked(isUserLiked);
				}
			} catch {
			}
		}
		fetchUserData();
	}, [likedUserIds]);

	const handleLike = async () => {
		try {
			if (isLiked) {
				await skillPostService.removeLike(skillID);
			}
			else {
				await skillPostService.addLike(skillID);
			}

			// Refresh the page
			window.location.reload();
		} catch {
		}
	};

	return (
		<div className="react-breadcrumbs single-page-breadcrumbs">
			<div className="breadcrumbs-wrap">
				<img className="desktop" src={require(`../../assets/images/blog/post-banner2.jpg`)} alt={skillTitle} />
				<img className="mobile" src={require(`../../assets/images/blog/post-banner2.jpg`)} alt={skillTitle} />
				<div className="breadcrumbs-inner">
					<div className="container">
						<div className="breadcrumbs-text">
							<Link to="#" className="cate">
								{skill}
							</Link>
							<h1 className="breadcrumbs-title">{skillTitle}</h1>
							<ul className="user-section">
								<li className="user">
									<span>
										<img src={courseAuthorImg} alt="user" />
									</span>
									<span>{courseAuthor}</span>
								</li>
								<li className="user">

									<span>{formatDate(createdAt)}</span>
								</li>
								<li>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-circle">
										<path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1 8.38 8.38 0 0 1-5.4-1.9L3 21l1.9-4.1A8.38 8.38 0 0 1 3.8 11.5a8.5 8.5 0 1 1 17 0z"></path>
									</svg>
									{courseComments?.length === 1 ? '1 Comment' : `${courseComments?.length || 0} Comments`}
								</li>
								<li>
									<button
										onClick={handleLike}
										className={`like-button ${isLiked ? 'liked' : 'not-liked'}`}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
										</svg>
										<span className="like-count">
											{skillSharingPostLikes === 0
												? 'Like'
												: skillSharingPostLikes === 1
													? '1 Like'
													: `${skillSharingPostLikes} Likes`
											}
										</span>
									</button>
								</li>

							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Breadcrumb.propTypes = {
	skillID: PropTypes.string,
	skill: PropTypes.string,
	skillTitle: PropTypes.string,
	courseAuthor: PropTypes.string,
	courseAuthorImg: PropTypes.string,
	skillSharingPostLikes: PropTypes.number,
	courseComments: PropTypes.array,
	likedUserIds: PropTypes.array,
	createdAt: PropTypes.string,
};