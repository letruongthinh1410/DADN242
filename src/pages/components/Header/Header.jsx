import React from "react";
import Profile from "./Profile";
import "./Header.css";
const Header = () => {
    return (
        <div className="header d-flex justify-content-end align-items-center" style={{boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",}}>
            <Profile />
        </div>
    );
}

export default Header;