import React from 'react';
import "../../css/ContactUs.css"
import email from "../../images/email.png"
import location from "../../images/location.png"

const Contact = () => {
    return (
        <div className="info pb-5">
        <div className="container">
            <div className="row">

                
                
                <div className="col-lg-6 col-md-12 mb-3">
                        <div className="right-box">
                        <h2>Contact Us For Any Informations</h2>
                        <p> <img style={{width:"30px"}} src={location} alt=''/>Location</p>
                        <span>Maadi as Sarayat Al Gharbeyah, Maadi, Cairo Governorate</span>
                        <p><img style={{width:"40px",padding:"5px"}} src={email} alt=''/>Email & Phone</p>
                        <div className="email-phone">
                             Med@gmail.com<br/>
                        </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>
    );
};

export default Contact;