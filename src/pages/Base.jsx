import React from "react";
import {Outlet} from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Title from "./components/Title/Title.jsx";
import api from "./api.jsx";
import { eventBus } from "./components/EventBus/eventBus.js";
import { Grid } from "@mui/material";
import { useEffect,useCallback } from "react";
import { useMatches } from "react-router-dom";

const Base = () => {
    const matches = useMatches();
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const handleSubscribe = useCallback(async () => {
        if (!token) {
          console.error("Token không hợp lệ hoặc chưa đăng nhập.");
          return;
        }
        try {
          await api.post("/api/mqtt/subscribe", {}, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          console.log("Đã đăng ký nhận dữ liệu!");
        } catch (error) {
          console.error("Lỗi Subscribe:", error.response?.data || error.message);
        }
      }, [token]);
    
        // Nghe event AccessToken được refresh
        useEffect(() => {
            const handleAccessTokenRefreshed = () => {
            console.log("Token đã refresh, tiến hành resubscribe MQTT...");
            handleSubscribe();
            };

            eventBus.on("accessTokenRefreshed", handleAccessTokenRefreshed);

            return () => {
            eventBus.off("accessTokenRefreshed", handleAccessTokenRefreshed);
            };
        }, [handleSubscribe]);

      // Subscribe MQTT ngay lần đầu vào app
        useEffect(() => {
            if (token) {
            handleSubscribe();
            }
        }, [handleSubscribe, token]);
    // Lấy title của route hiện tại
    const currentTitle = matches.find(match => match.handle)?.handle.title || "Ứng dụng giám sát";

    return (
        <div className="base">
            <Grid
                container 
                spacing={0} 
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" } // Nhỏ thì cột, lớn thì hàng
                }}
            >
                <Grid
                    size={{ xs: 12, md: 2 }}    
                >
                    <Sidebar />
                </Grid>
                <Grid size={{ xs: 12, md: 10 }}>
                    <Header />
                    <Title title={currentTitle} />
                    <Outlet/>
                </Grid>
            </Grid>
        </div>
    );
}

export default Base;