import React from "react";
import { useState } from "react";
import { Grid2, Pagination } from "@mui/material";

import { Card, CardContent, Typography, Button, Alert, Box  } from "@mui/material";
import { FaThermometerHalf, FaListAlt   } from "react-icons/fa";

import { RiTreeFill } from "react-icons/ri";
import { IoMdInformationCircle } from "react-icons/io";
import { FiTool } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { IoIosAddCircle } from "react-icons/io";

import "./Home.css";
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
                <Typography variant="h6" fontWeight="bold" sx={{textAlign: "center"}}>
                    <GoDotFill color= {plant.sign ? "#D90808" : "#0CD908"}/> {plant.id}
                </Typography>

                {/* Loại cây */}
                <Typography variant="body2" gutterBottom>
                    <RiTreeFill color="#48752C" style = {{marginRight: "1rem",}}/> {plant.name}
                </Typography>

                {/* Thông tin môi trường */}
                <Typography variant="body2" fontWeight="bold" mt={1}>
                    <FaThermometerHalf style = {{marginRight: "1rem",}}/> Nhiệt độ - Độ ẩm - Ánh sáng
                </Typography>
                <Typography variant="body2">
                    {plant.temperature}°C - {plant.humidity}% - {plant.light}%
                </Typography>

                <Typography variant="body2"  mt={1} >
                    <FaListAlt style = {{marginRight: "1rem",}}/> Các thiết bị theo dõi <IoMdInformationCircle style = {{marginLeft: "1rem",}}/>
                </Typography>
                <Typography variant="body2" color={plant.sign ? "error" : "success"} mt={1}>
                    <Alert severity={plant.sign ? "error" : "success"} style = {{padding: "0 1rem", maxWidth: "15rem", maxHeight: "3rem"}}>{plant.status}</Alert>
                </Typography>

                {/* Nút sửa thông tin */}
                <NavLink to="#" style={{display: "flex", justifyContent: "end", textDecoration: "none"}}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ backgroundColor: "#0CD908", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem"}}
                    >
                        <FiTool style = {{marginRight: "0.6rem",}}/> Sửa thông tin
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
                minHeight: "80vh", // Giữ chiều cao tối thiểu
                marginBottom: "0.6rem"
            }}
        >
            {/* Grid hiển thị danh sách cây */}
            <Grid2 
                container 
                spacing={3} 
                justifyContent="start"
                sx={{ flexGrow: 1, padding: "0 5rem", }} // Để danh sách mở rộng khi cần
                
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
                            sx={{ backgroundColor: "#0ba6ff", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.5rem 0.8rem", fontWeight: 400, fontSize: "1rem"}}
                        >
                            <IoIosAddCircle style = {{marginRight: "0.6rem",}}/> Thêm cây trồng
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
                <p style={{margin: "0", fontWeight: 600, fontSize: "1.2rem"}}>Tổng số cây trồng: {plants.length}</p>
            </Box>

        </Box>
    );
};

const Home = () => {
    const plants = [
        { id: "TMT001", name: "Cà chua", type: "Hoa quả", temperature: 27, humidity: 50, light: 50, status: "Nhiệt độ cao", sign: true },
        { id: "RSF001", name: "Hoa hồng", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Độ ẩm đất thấp", sign: true },
        { id: "ORF001", name: "Hoa ly", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false },
        { id: "CBF001", name: "Cây bắp cải", type: "Rau", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false },
        { id: "HLT001", name: "Hoa lan", type: "Hoa", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false },
        { id: "BMT001", name: "Bí ngô", type: "Hoa quả", temperature: 27, humidity: 50, light: 50, status: "Nhiệt độ cao", sign: true },
        { id: "LMT001", name: "Lá lốt", type: "Lá", temperature: 27, humidity: 50, light: 50, status: "Bình thường", sign: false },
    ];
    return (
        <div className="home">
            <PlantList plants={plants} />
        </div>
    );
}

export default Home;