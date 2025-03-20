import React from "react";
import { useState } from "react";
import { Grid2, Pagination } from "@mui/material";

import { Card, CardContent, Typography, Button, Alert, Box, Tooltip  } from "@mui/material";

import { TreeDeciduous, Thermometer, List, Info, Hammer, CirclePlus, Dot  } from 'lucide-react';

import { NavLink } from "react-router-dom";
const PlantCard = ({ plant }) => {
    return (
        <Card 
            sx={{ 
                width: 350, borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                    boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)"
                }
            }}  
            className="d-flex flex-column align-items-center"
        >
            <CardContent>
                {/* Tên cây */}
                <Typography variant="h6" fontWeight="bold" style={{fontSize: "1.1rem"}} className="d-flex align-items-center justify-content-center">
                    <Dot size={28} color= {plant.sign ? "#D90808" : "#0CD908"}/> {plant.id}
                </Typography>

                {/* Loại cây */}
                <Typography variant="body2" gutterBottom>
                    <TreeDeciduous size={20} color="#48752C" style = {{marginRight: "1rem",}}/> {plant.name}
                </Typography>

                {/* Thông tin môi trường */}
                <NavLink to="parameter" style={{textDecoration: "none", color: "black"}}>
                    <Typography variant="body2" fontWeight="bold" mt={1}>
                    <Thermometer size={20} style = {{marginRight: "1rem"}}/> Nhiệt độ - Độ ẩm - Ánh sáng
                    </Typography>
                    <Typography variant="body2">
                        {plant.temperature}°C - {plant.humidity}% - {plant.light}%
                    </Typography>
                </NavLink>
                

                <Typography variant="body2"  mt={1} >
                    <List size={20} style = {{marginRight: "1rem",}}/> Các thiết bị theo dõi
                    <Tooltip title={plant.devices.join("\n")} arrow>
                    <span> {/* Bọc lại để Tooltip hoạt động tốt hơn */}
                        <Info style={{ marginLeft: "1rem", cursor: "pointer" }} />
                    </span>
                    </Tooltip>
                </Typography>
                <Typography variant="body2" color={plant.sign ? "error" : "success"} mt={1}>
                    <Alert severity={plant.sign ? "error" : "success"} style = {{padding: "0 1rem", maxWidth: "15rem", maxHeight: "3rem"}}>{plant.status}</Alert>
                </Typography>

                {/* Nút sửa thông tin */}
                <NavLink to="update" style={{display: "flex", justifyContent: "end", textDecoration: "none"}}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ backgroundColor: "#26A69A", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem"}}
                    >
                        <Hammer style = {{marginRight: "0.6rem",}}/> Sửa thông tin
                    </Button>
                </NavLink>
            </CardContent>
        </Card>
    );
};

const PlantList = ({ plants }) => {
    const [page, setPage] = useState(1);
    const plantsPerPage = 6;

    // Tính toán số trang
    const totalPages = Math.ceil(plants.length / plantsPerPage);

    // Lọc danh sách cây cho trang hiện tại
    const currentPlants = plants.slice((page - 1) * plantsPerPage, page * plantsPerPage);

    return (
        <Box 
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "80vh", 
                marginBottom: "0.6rem"
            }}
        >
            {/* Grid hiển thị danh sách cây */}
            <Grid2 
                container 
                spacing={1} 
                justifyContent="start"
                sx={{ flexGrow: 1, padding: "0 5rem"}} // Để danh sách mở rộng khi cần
                
            >
                {currentPlants.map((plant, index) => (
                    <Grid2 item key={index}>
                        <PlantCard plant={plant} />
                    </Grid2>
                ))}
            </Grid2>

            {/* Pagination luôn ở dưới */}
            <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", mt: 1 }}>
                <NavLink to="add" style={{textDecoration: "none"}}>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ backgroundColor: "#0ba6ff", borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.2rem 0.8rem", fontWeight: 400, fontSize: "1rem"}}
                        >
                            <CirclePlus style = {{marginRight: "0.6rem"}}/> Thêm cây trồng
                        </Button>
                </NavLink>

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    variant="outlined" shape="rounded"
                    showFirstButton showLastButton
                />
                <p style={{margin: "0", fontWeight: 600, fontSize: "1.1rem"}}>Tổng số cây trồng: {plants.length}</p>
            </Box>
        </Box>
    );
};

const Home = () => {
    const plants = [
        { id: "TMT001", name: "Cà chua", type: "Hoa quả", temperature: 27, humidity: 50, light: 50, status: "Nhiệt độ cao", sign: true, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "RSF001", name: "Hoa hồng", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Độ ẩm đất thấp", sign: true, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "ORF001", name: "Hoa ly", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "CBF001", name: "Cây bắp cải", type: "Rau", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "HLT001", name: "Hoa lan", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "BMT001", name: "Bí ngô", type: "Hoa quả", temperature: 27, humidity: 50, light: 50, status: "Nhiệt độ cao", sign: true, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
        { id: "LMT001", name: "Lá lốt", type: "Lá", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false, devices: ["Cảm biến ánh sáng AS001", "Cảm biến nhiệt độ ND001", "Cảm biến độ ẩm đất DA001"] },
    ];
    return (
        <div className="home">
            <PlantList plants={plants} />
        </div>
    );
}

export default Home;