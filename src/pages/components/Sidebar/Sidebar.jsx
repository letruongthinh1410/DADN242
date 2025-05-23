import React from "react";

import "./Sidebar.css";

import Logo from "./Logo.jsx";

import { Trees, ChartSpline, CalendarCheck, CircleUserRound } from "lucide-react";
import { NavLink } from "react-router-dom";

import { List, ListItem, ListItemButton, ListItemText, Grid } from "@mui/material";
const Sidebar = () => {
    const menuItems = [
        {text: "Cây trồng", icon: <Trees />, link: "plants", key: "plant",},
        {text: "Thông số", icon: <ChartSpline />, link: "parameter", key: "statistic",},
        {text: "Lên lịch", icon: <CalendarCheck />, link: "schedule", key: "schedule",},
        {text: "Thông tin tài khoản", icon: <CircleUserRound />, link: "infor-account", key: "infor",},
    ]
    return (
        <div className="sidebar" style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)" }}>
            <Logo />
            <List style={{ marginTop: "2rem" }}>
                <Grid container spacing={2} className="d-flex flex-column align-items-center justify-content-center">
                    {menuItems.map((item, index) => (
                        <Grid item style={{xs:'12', sm:'6', md:'4'}} key={index}>
                            <ListItem disablePadding>
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
                                                backgroundColor: isActive ? "#4CAF50" : "white",
                                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                                borderRadius: "8px",
                                                color: isActive ? "white" : "black",
                                                "&:hover": { backgroundColor: "#9BCFB8", color: "white" },
                                                padding: "0.5rem 1rem",
                                                fontWeight: 700,
                                                minWidth: "13rem"
                                            }}
                                        >
                                            {item.icon}
                                            <ListItemText
                                                primary={item.text}
                                                sx={{
                                                    color: isActive ? "white" : "black",
                                                    marginLeft: "0.6rem",
                                                    "&:hover": { color: "white" },
                                                }}
                                            />
                                        </ListItemButton>
                                    )}
                                </NavLink>
                            </ListItem>
                        </Grid>
                    ))}
                </Grid>
            </List>
        </div>
    );
}

export default Sidebar;