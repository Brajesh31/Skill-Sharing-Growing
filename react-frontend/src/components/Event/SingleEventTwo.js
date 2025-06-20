import React from 'react';
import { Link } from 'react-router-dom'

const SingleEventTwo = (props) => {
	const { eventClass, eventID, eventImg, eventDayCount, eventDate, eventTitle, eventLocation } = props;
	return(
        <div className={eventClass ? eventClass : 'event__card'}>
            <div className="case-img">
                <img src={require(`../../assets/images/event/${eventImg}`)} alt={eventTitle} />
            </div>
            <div className="event__card--content">
                <div className="event__card--content-area">
                    <div className="event__card--date">{eventDayCount} {eventDate}</div>
                    <h3 className="event__card--title"><Link to={`/event/${eventID}`}>{eventTitle}</Link></h3>
                    <div className="event_location"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {eventLocation}</div>
                </div>
            </div>
        </div>
	)
}

export default SingleEventTwo