import React from "react";

import "./Sidebar.css";

import Logo from "./Logo.jsx";

import { MdForest } from "react-icons/md";
import { FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
const Sidebar = () => {
    const menuItems = [
        {text: "Cây trồng", icon: <MdForest />, link: "plants", key: "plant",},
        {text: "Thống kê", icon: <FaChartLine />, link: "statistics", key: "statistic",},
        {text: "Lên lịch", icon: <FaCalendarAlt />, link: "schedule", key: "schedule",},
        {text: "Thông tin tài khoản", icon: <IoPersonCircleOutline />, link: "infor-account", key: "infor",},
    ]
    return (
        <div className="sidebar d-flex flex-column align-items-center justify-content-start" style={{boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",}}>
            <Logo /> 
            <List>
                {menuItems.map((item, index) => (
                    <ListItem key={index} disablePadding>
                        <NavLink 
                            to={item.link} 
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                width: "100%",
                            })}
                        >
                        {({ isActive }) => (
                            <ListItemButton
                                sx={{
                                    backgroundColor: isActive ? "#0F6918" : "white",
                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                    borderRadius: "8px",
                                    color: isActive ? "white" : "black",
                                    mb: 1,
                                    "&:hover": { backgroundColor: "#004d00", color: "white" },
                                    padding: "0.5rem 1rem",
                                    fontWeight: 700 
                                }}
                                >
                                {item.icon}
                                <ListItemText 
                                    primary={item.text} 
                                    sx={{ color: isActive ? "white" : "black", marginLeft: "0.6rem", }}
                                />
                            </ListItemButton>
                        )}
                        </NavLink>
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default Sidebar;