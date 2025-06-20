import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const SignupMain = () => {

    const { login } = useContext(AuthContext);
    return (
        <>
            <div className="react-login-page react-signup-page pt---120 pb---120">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="login-right-form">
                                <form>
                                    <div className="login-top">
                                        <h3>Sign Up</h3>
                                        <p>Already have an account? <a href="/login">Log in</a></p>
                                    </div>
                                    <p>
                                        <label>Email</label>
                                        <input placeholder="Email" type="email" id="email" name="email" />
                                    </p>
                                    <p>
                                        <label>User Name</label>
                                        <input placeholder="User Name" type="email" id="email" name="email" />
                                    </p>
                                    <p>
                                        <label>Password</label>
                                        <input placeholder="Password" type="password" id="pass" name="pass" />
                                    </p>
                                    <p>
                                        <label>Confirm Password</label>
                                        <input placeholder="Confirm Password" type="password" id="pass" name="pass" />
                                    </p>
                                    <div className="back-check-box">
                                        <input type="checkbox" id="box-1" /> I agree to the <em>Terms & Conditions</em>
                                        <p></p>
                                    </div>
                                    <button type="submit" id="button" name="submit">Register <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>
                                    <span className="back-or"> ........ or Login with ........ </span>
                                    <button className="gsi-material-button" onClick={login}>
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        style={{ display: 'block' }}
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">Continue with Google</span>
                    <span style={{ display: 'none' }}>Continue with Google</span>
                  </div>
                </button>                                       
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </>

    );
}


export default SignupMain;