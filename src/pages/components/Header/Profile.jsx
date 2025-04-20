import React from "react";
import { useState } from "react";
import "./Profile.css";

import { Avatar, Menu, MenuItem, Box } from '@mui/material';

import { NavLink } from "react-router-dom";

import Jack from "../../../assets/jack.jpg"; //xài tạm

import { CircleUser, LogOut, ChevronDown } from "lucide-react";
const Profile = () => {
    const [anchorEl, setAnchorEl] = useState(null); 

    const handleOpenList = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget); 
    }

    const handleLogOut = async () => {

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
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <NavLink to="infor-account" className="text-dark text-decoration-none">
                        <CircleUser size={20} style={{marginRight: "0.5rem"}}/> Thông tin tài khoản
                    </NavLink>
                </MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>
                    <Box className="text-danger text-decoration-none" onClick={handleLogOut}>
                        <LogOut size={20} style={{marginRight: "0.5rem"}}/> Đăng xuất
                    </Box>
                </MenuItem>
            </Menu>
        </div>
    )
}

export default Profile;