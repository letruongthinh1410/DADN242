import React, { useEffect } from "react";
import { useState } from "react";
import "./Profile.css";

import { Menu, MenuItem, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

import { NavLink, useNavigate } from "react-router-dom";

import { CircleUser, LogOut, ChevronDown, CircleUserRound } from "lucide-react";

import { Unsubcribe, Logout } from "../../../api";
import { useWebSocket } from "../../WebSocketProvider";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../../api";
const Profile = () => {
    const { closeAll } = useWebSocket()
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null); 
    const [openDialog, setOpenDialog] = useState(false);

    const [username, setUsername] = useState("")

    const handleOpenList = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget); 
    }

    const [loadingLogout, setLoadingLogout] = useState(false);

    const handleConfirmLogout = async () => {
        setLoadingLogout(true);
        try {
            closeAll();
            await Unsubcribe();
            await Logout();
            navigate("/");
        } catch (error) {
            console.error("Đăng xuất thất bại: ", error);
        } finally {
            setLoadingLogout(false);
            setOpenDialog(false);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
          try {
            const response = await api.get("/user/info");
            setUsername(response.data.data.username);
            console.log("Nhận username thành công")
          } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
          }
        };
        fetchUserInfo();
    }, []);
    return (
        <div className="profile_list ">
            <div className= "profile d-flex align-items-center justify-content-between" onClick={handleOpenList} >
                <div className="profile_avatar d-flex align-items-center justify-content-between">
                    <CircleUserRound />
                    <div className="profile_name">{username}</div>
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
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    setOpenDialog(true); // mở dialog
                }}>
                    <Box className="text-danger text-decoration-none">
                        <LogOut size={20} style={{ marginRight: "0.5rem" }} /> Đăng xuất
                    </Box>
                </MenuItem>

            </Menu>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Xác nhận đăng xuất</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn đăng xuất không?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Huỷ
                    </Button>
                    <Button
                        onClick={handleConfirmLogout}
                        color="error"
                        variant="contained"
                        disabled={loadingLogout}
                    >
                        {loadingLogout ? <CircularProgress size={20} color="inherit" /> : "Đăng xuất"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Profile;