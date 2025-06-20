const ContactForm = (props) => {

    function sendEmail(e) {
        e.preventDefault();
    }

    return (
        <div className="react-blog-form">
            <h2 className="contact-title">Questions? <br /> Feel free to contact us.</h2>
            <div id="blog-form" className="blog-form">
                <div id="form-messages"></div>
                <form id="contact-form" onSubmit={sendEmail}>
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="back-input">
                                <input id="name" type="text" name="user_name" required placeholder="Name" />
                            </div>
                        </div>

                        <div className="col-lg-6 pdl-5">
                            <div className="back-input">
                                <input id="email" type="email" name="user_email" required placeholder="Email" />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="back-input">
                                <input id="subject" type="text" name="user_subject" required placeholder="Subject" />
                            </div>
                        </div>

                        <div className="col-lg-6 pdl-5">
                            <div className="back-input">
                                <input id="phone" type="text" name="user_phone" required placeholder="Phone" />
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="back-textarea">
                                <textarea id="message" name="user_message" required placeholder="Message"></textarea>
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <button type="submit" className="back-btn">Send Message <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

}

export default ContactForm;