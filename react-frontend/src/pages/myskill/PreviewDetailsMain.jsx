import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';
import Faq from '../../components/Faq';



const PreviewDetailsMain = ({
    skillPostId,
    authorId,
    authorName,
    authorProfileImageUrl,
    skillPostImageUrls,
    skillPostVideoUrl,
    skillPostVideoThumbnailUrl,
    videoDurationSeconds,
    skillName,
    title,
    description,
    noOfLikes,
    likedUserIds,
    comments: initialComments,
    createdAt
}) => {

    let tab1 = "Description",
        tab2 = "Comments",
        tab3 = "FAQ"
    const tabStyle = 'nav nav-tabs';

    return (
        <div className="back__course__page_grid react-courses__single-page pb---16 pt---110">
            <div className="container pb---70">
                <div className="row">
                    <div className="col-lg-12">
                        {skillPostVideoThumbnailUrl && (
                            <div className="course-details-video mb---30">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={skillPostVideoUrl || null}
                                    title="YouTube video player"
                                    allow="accelerometer"
                                ></iframe>
                            </div>
                        )}
                        <Tabs>
                            <div className="course-single-tab">
                                <TabList className={tabStyle}>
                                    <Tab><button>{tab1}</button></Tab>
                                    <Tab><button>{tab2}</button></Tab>
                                    <Tab><button>{tab3}</button></Tab>
                                </TabList>

                                <div className="tab-content" id="back-tab-content">

                                    {/* Description */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>About This Skill</h3>
                                            <p>{description}</p>
                                            <div className="image-banner">
                                                {skillPostImageUrls && skillPostImageUrls.length > 0 ? (
                                                    <div className="image-gallery">
                                                        {skillPostImageUrls.map((imageUrl, index) => (
                                                            <img
                                                                key={skillPostId + index}
                                                                src={
                                                                    imageUrl
                                                                        ? imageUrl
                                                                        : skillPostVideoThumbnailUrl
                                                                            ? skillPostVideoThumbnailUrl
                                                                            : require('../../assets/images/blog/post-banner2.jpg')
                                                                }
                                                                alt={`skill ${index + 1}`}
                                                                className="gallery-image"
                                                            />

                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    </TabPanel>

                                    {/* Comments */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>Comments</h3>
                                        </div>
                                    </TabPanel>

                                    {/* faq */}
                                    <TabPanel>
                                        <div className="tab-pane">
                                            <h3>FAQ</h3>
                                            <Faq />
                                        </div>
                                    </TabPanel>
                                </div>
                            </div>
                        </Tabs>

                    </div>

                </div>
            </div>
        </div>
    );
}
PreviewDetailsMain.propTypes = {
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

export default PreviewDetailsMain;