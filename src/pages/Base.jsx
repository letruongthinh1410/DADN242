import React from "react";
import {Outlet} from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Title from "./components/Title/Title.jsx";

import { Grid2 } from "@mui/material";

import { useMatches } from "react-router-dom";

const Base = () => {
    const matches = useMatches();
    
    // Lấy title của route hiện tại
    const currentTitle = matches.find(match => match.handle)?.handle.title || "Ứng dụng giám sát";
    
    return (
        <div className="base">
            <Grid2
                container 
                spacing={0} 
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" } // Nhỏ thì cột, lớn thì hàng
                }}
            >
                <Grid2
                    size={{ xs: 12, md: 2 }}    
                >
                    <Sidebar />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 10 }}>
                    <Header />
                    <Title title={currentTitle} />
                    <Outlet/>
                </Grid2>
            </Grid2>
        </div>
    );
}

export default Base;