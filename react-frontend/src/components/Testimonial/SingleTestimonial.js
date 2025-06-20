
import testiImg from '../../assets/images/testimonial/testimonial.png';

const SingleTestimonial = (props) => {
	const { itemClass, itemImg, Title, Designation, Desc, ratingCount, likesCount, comaImg } = props;
    return (
        <div className={itemClass ? itemClass : 'single-client'}>
            <div className="client-bottom">   
                <span className="client-author">
                <img 
                    src= {itemImg ? itemImg : testiImg} 
                    alt="Image"
                />
                </span>
            </div>                                    
            <div className="client-content">
                <span className="client-title">{Title ? Title : 'Justin Case'} <em> {Designation ? Designation : 'Student'}</em></span>
                <p>{Desc ? Desc : 'Nulla porttitor accumsan tincidunt. vamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Quisque velit nisi, pretium ut lacinia in.'}</p>
                <div className="testimonial__ratings">
                    <em className="icon_star"></em>
                    <em className="icon_star"></em>
                    <em className="icon_star"></em>
                    <em className="icon_star"></em>
                    <em className="icon_star_alt"></em>
                    <span><em> {ratingCount ? ratingCount : '4.9'}</em> ({likesCount ? likesCount : '14'} Reviews)</span>
                </div>
                <img 
                    className="comma" 
                    src= {comaImg} 
                    alt="Coma"
                />
            </div>  
        </div>
    )
}

export default SingleTestimonial