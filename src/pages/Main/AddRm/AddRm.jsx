import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Box, Pagination, TextField, MenuItem } from "@mui/material";
import { FaClock, FaStickyNote, FaRedo } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { NavLink } from "react-router-dom";

const ReminderForm = () => {
    const [plant, setPlant] = useState("");
    const [note, setNote] = useState("");
    const [frequency, setFrequency] = useState("");
    const [date, setDate] = useState({ year: "", month: "", day: "", hour: "", minute: "", second: "" });

    const handleChange = (field, value) => {
        setDate({ ...date, [field]: value });
    };
    const samplePlants = [
        { id: 1, name: "Cà chua" },
        { id: 2, name: "Hoa hồng" },
        { id: 3, name: "Hoa cúc" },
    ];
    

    
//     const [plantsData, setPlantsData] = useState([]);

// useEffect(() => {
//     fetch("https://api.example.com/plants")  // Thay URL API thật
//         .then(res => res.json())
//         .then(data => setPlantsData(data))
//         .catch(err => console.error(err));
// }, []);

    return (
        <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            p: 3, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
            "&:hover": { boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" },
            height: "100%",
            border: "1px solid #ccc", 
            borderRadius: "10px", 
            margin: "auto", 
            mx: "48px"
        }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}> 
                {/* Cột chứa dropdown chọn Cây trồng, Tần suất, Ngày giờ */}
                <Box class ="container-3" sx={{ display: "flex", flexDirection: "column", flex: 1}}>
                    <Box display="flex" justifyContent="space-between">
                        <TextField select label="Cây trồng" value={plant} onChange={(e) => setPlant(e.target.value)} sx={{ minWidth: 180, m: 1 }}>
                            {samplePlants.map((item) => (
                                <MenuItem key={item.id} value={item.name}>
                                    {item.name} ({item.id})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField select label="Tần suất" value={frequency} sx={{ minWidth: 180, m: 1 }} onChange={(e) => setFrequency(e.target.value)}>
                        <MenuItem value="Mỗi ngày">Mỗi ngày</MenuItem>
                        <MenuItem value="Mỗi tuần">Mỗi tuần</MenuItem>
                        <MenuItem value="Mỗi tháng">Mỗi tháng</MenuItem>
                    </TextField>
                     <Typography variant="h6" fontWeight="bold" textAlign="flex-start" marginLeft="1rem">
                        Thời gian
                     </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Box display="flex" justifyContent="space-between" mt={0}>
                            <TextField select label="Năm" value={date.year} onChange={(e) => handleChange("year", e.target.value)} sx={{ minWidth: 100, m: 1 }}>
                                {[2024, 2025, 2026].map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                            </TextField>
                            <TextField select label="Tháng" value={date.month} onChange={(e) => handleChange("month", e.target.value)} sx={{ minWidth: 100, m: 1 }}>
                                {[...Array(12)].map((_, i) => <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>)}
                            </TextField>
                            <TextField select label="Ngày" value={date.day} onChange={(e) => handleChange("day", e.target.value)} sx={{ minWidth: 100, m: 1 }}>
                                {[...Array(31)].map((_, i) => <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>)}
                            </TextField>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <TextField select label="Giờ" value={date.hour} onChange={(e) => handleChange("hour", e.target.value)} sx={{ minWidth: 100, m: 1 }}>
                                {[...Array(24)].map((_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                            </TextField>
                            <TextField select label="Phút" value={date.minute} onChange={(e) => handleChange("minute", e.target.value)} sx={{ minWidth: 100, m: 1 }}>
                                {[...Array(61)].map((_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                            </TextField>
                            <TextField select label="Giây" value={date.second} onChange={(e) => handleChange("second", e.target.value)} sx={{ minWidth: 100, m: 1 }}>
                                {[...Array(61)].map((_, i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                            </TextField>
                        </Box>
                    </Box>
                </Box>
        
                {/* Ô nhập Ghi chú bên cạnh */}
                <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                        Ghi chú
                     </Typography>
                    <TextField
                        label="Ghi chú"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        multiline
                        rows={11}  
                        fullWidth  
                        sx={{ maxWidth: "100%", m: 1 }}
                    />
                </Box>
            </Box>
        
            {/* Nút xác nhận và trở về */}
            <Box display="flex" sx={{ gap: 4 , maxWidth: "40%" , alignItems: "center" ,margin: "auto" , marginTop: "1rem"}}>
                <Button variant="contained" sx={{ backgroundColor: "#00c853", color: "white" }}>+ Xác Nhận</Button>
                 <NavLink to="/base/schedule" style={{ textDecoration: "none" }}>
                    <Button variant="contained" sx={{ backgroundColor: "gray", color: "white" }}>↩ Trở về</Button>
                 </NavLink>
                
            </Box>
        </Box>
    );
};

export default ReminderForm;