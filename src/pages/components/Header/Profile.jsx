import React from "react";
import { useState } from "react";
import "./Profile.css";

import { Avatar, Menu, MenuItem } from '@mui/material';

import { NavLink } from "react-router-dom";

import Jack from "../../../assets/jack.jpg"; //xài tạm

import { CircleUser, LogOut, ChevronDown } from "lucide-react";
const Profile = () => {
    const profiles = [
        {name: "Thông tin tài khoản", link: "", key: "info", style: "text-dark text-decoration-none", icon: <CircleUser size={20} style={{marginRight: "0.5rem"}}/>},
        {name: "Đăng xuất", link: "", key: "logout", style: "text-danger text-decoration-none", icon: <LogOut size={20} style={{marginRight: "0.5rem"}}/>},
    ]
    const [anchorEl, setAnchorEl] = useState(null); 

    const handleOpenList = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget); 
    }
    return (
        <div className="profile_list ">
            <div className= "profile d-flex align-items-center justify-content-between" onClick={handleOpenList} >
                <div className="profile_avatar d-flex align-items-center justify-content-between">
                    <Avatar 
                        alt="Tuan" 
                        src={Jack}
                        sx={{ width: 30, height: 30 }}
                    />
                    <div className="profile_name">Tuan</div>
                </div>
                <ChevronDown className="arrow_down"/>  
            </div>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl} 
                keepMounted
                open={Boolean(anchorEl)} 
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }} 
                transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
                {profiles.map((profile, index) => (
                <MenuItem key={index} onClick={() => setAnchorEl(null)}>
                    <NavLink to={profile.link} className={profile.style}>
                    {profile.icon} {profile.name}
                    </NavLink>
                </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default Profile;