import React from "react";
import { useState } from "react";
import { Grid, Pagination } from "@mui/material";

import { Card, CardContent, Typography, Button, Alert, Box, Tooltip  } from "@mui/material";

import { TreeDeciduous, Thermometer, List, Info, Hammer, CirclePlus, Dot, CircleX, Droplets, Sun} from 'lucide-react';

import { NavLink } from "react-router-dom";
import { takePlantsList } from "../../../api";

const PlantCard = ({ plant }) => {
    const handleDeletePlant = () => {
        //gọi API xoá cây trồng
        alert(`Xoá cây trồng ${plant.id} thành công!`);
    }
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
                <NavLink to={`/parameter`} state={{ plant }} style={{textDecoration: "none", color: "black"}}>
                    <Typography variant="body2" fontWeight="bold" mt={1}>
                        Thông số cây trồng:
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        <Thermometer size={20} style = {{marginRight: "1rem"}}/> 
                        <span style={{fontWeight: "bold", marginRight: "0.3rem"}}>Nhiệt độ:</span> {plant.temperature[0]}°C - {plant.temperature[1]}°C
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        <Droplets size={20} style = {{marginRight: "1rem"}}/> 
                        <span style={{fontWeight: "bold", marginRight: "0.3rem"}}>Độ ẩm đất:</span> {plant.humidity[0]}% - {plant.humidity[1]}%
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        <Sun size={20} style = {{marginRight: "1rem"}}/> 
                        <span style={{fontWeight: "bold", marginRight: "0.3rem"}}>Ánh sáng:</span> {plant.light[0]}% - {plant.light[1]}%
                    </Typography>
                </NavLink>
                
                <Typography variant="body2"  mt={1} >
                    <List size={20} style = {{marginRight: "1rem",}}/> Các thiết bị theo dõi
                    <Tooltip title={plant.devices.map((device) => `${device.name} (${device.id})`).join(", ")} arrow>
                    <span> {/* Bọc lại để Tooltip hoạt động tốt hơn */}
                        <Info style={{ marginLeft: "1rem", cursor: "pointer" }} />
                    </span>
                    </Tooltip>
                </Typography>
                <Typography variant="body2" color={plant.sign ? "error" : "success"} mt={1}>
                    <Alert severity={plant.sign ? "error" : "success"} style = {{padding: "0 1rem", maxWidth: "15rem", maxHeight: "3rem"}}>{plant.status}</Alert>
                </Typography>

                {/* Nút sửa thông tin */}
                <div className="d-flex justify-content-around align-items-center">
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleDeletePlant}
                        sx={{ backgroundColor: "#FF2400", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem", marginRight: "0.3rem"}}
                    >
                        <CircleX style = {{marginRight: "0.6rem",}}/> Xoá cây trồng
                    </Button>
                    {plant && (
                        <NavLink to={`update`} state={{ plant }} style={{display: "flex", justifyContent: "end", textDecoration: "none"}}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: "#26A69A", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem"}}
                            >
                                <Hammer style = {{marginRight: "0.6rem",}}/> Sửa thông tin
                            </Button>
                        </NavLink>
                    )}
                </div>
                
            </CardContent>
        </Card>
    ); 
};

const PlantList = ({ plants }) => {
    const [page, setPage] = useState(1);
    const plantsPerPage = 3;

    // Tính toán số trang
    const totalPages = Math.ceil(plants.length / plantsPerPage);

    // Lọc danh sách cây cho trang hiện tại
    const currentPlants = plants.slice((page - 1) * plantsPerPage, page * plantsPerPage);

    return (
        <Box >
            {/* Grid hiển thị danh sách cây */}
            <Grid 
                container 
                spacing={3} 
                justifyContent="center"
                alignItems="start"
                sx={{ flexGrow: 1, padding: "0 5rem", marginTop: "1rem"}} // Để danh sách mở rộng khi cần
                
            >
                {currentPlants.map((plant, index) => (
                    <Grid item key={index}>
                        <PlantCard plant={plant} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination luôn ở dưới */}
            <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", mt: 4 }}>
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
    const plants = takePlantsList();
    return (
        <div className="home d-flex flex-column justify-content-center" style={{height: "70vh"}}>
            <PlantList plants={plants}/>
        </div>
    );
}

export default Home;