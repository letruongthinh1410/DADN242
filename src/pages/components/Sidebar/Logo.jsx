import React from "react";
import "./Logo.css";
import BK from "../../../assets/BK.png";

const Logo = () => {
    return (
        <div className="logo d-flex align-items-center justify-content-center">
            <img src={BK} alt="BK" className="logo_img" />
            <div 
                className="d-flex flex-column align-items-center justify-content-center"
                
            >
                <p className="logo_title" style={{height: "1.5rem"}}>Giám sát</p> 
                <p className="logo_title">cây trồng</p>
            </div>
            
        </div>
    )
}

export default Logo;