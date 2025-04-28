import React from "react";
import "./Title.css";
const Title = ({title}) => {
    return (
        <div className="title d-flex align-items-center justify-content-center" style={{boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",}}>
            <h4 className="title-name">{title}</h4>
        </div>
    );
}

export default Title;