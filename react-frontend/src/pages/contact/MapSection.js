import React from 'react';


import mapImg from '../../assets/images/contact/1.jpg'

const Map = (props) => {
    return (
        <div className="react-contacts pt-106"> 
            <div className="react-image-maping">
                <img src={mapImg} alt="Map" />
                <div className="react-ripple react-tooltip1"><div className="box"><span>New York</span></div></div>
            </div>
        </div> 
    );

}

export default Map;