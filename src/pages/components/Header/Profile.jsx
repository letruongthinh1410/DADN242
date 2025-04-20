import React from "react";
import { useState } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import api from "../../../pages/api.jsx";
import { Spinner } from "react-bootstrap";
import { Avatar, Menu, MenuItem, Box } from '@mui/material';
import { NavLink } from "react-router-dom";
import Jack from "../../../assets/jack.jpg"; 

import { CircleUser, LogOut, ChevronDown } from "lucide-react";
const Profile = () => {
    const [anchorEl, setAnchorEl] = useState(null); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); 
    let token = localStorage.getItem("accessToken");
    const handleOpenList = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget); 
    }

    const handleLogOut = async () => {
        if (!token) 
        console.error("Token không hợp lệ hoặc chưa đăng nhập.");

    try {
        setLoading(true); 
        await handleUnSubscribe(); // Hủy đăng ký trước khi logout

        await api.post("/auth/logout", {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        console.log("Đã đăng xuất!");
        navigate("/"); // Quay về trang chủ
    } catch (error) {
        console.error("Lỗi khi logout:", error.response?.data || error.message);
    }finally {
        setLoading(false); 
    }
        
    }
    const handleUnSubscribe = async () => {
        if (!token) {
          console.error("Token không hợp lệ hoặc chưa đăng nhập.");
          return;
        }
        try {
            await api.post("/api/mqtt/unsubscribe", {}, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
            console.log("Đã hủy đăng ký nhận dữ liệu!");
        } catch (error) {
            console.error("Lỗi UnSubscribe:", error.response?.data || error.message);
        }
    };
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
                        {loading ? (
                                <>
                                    <Spinner 
                                        animation="border" 
                                        size="sm" 
                                        className="me-2" 
                                        style={{ width: "1rem", height: "1rem" }}
                                    />
                                    Đang đăng xuất...
                                </>
                            ) : (
                                <>
                                    <LogOut size={20} style={{ marginRight: "0.5rem" }} />
                                    Đăng xuất
                                </>
                            )}
                    </Box>
                </MenuItem>
            </Menu>
        </div>
    )
}

export default Profile;