import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Box, TextField, MenuItem } from "@mui/material";
import { NavLink } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ReminderForm = () => {
    const [plant, setPlant] = useState("");
    const [note, setNote] = useState("");
    const [frequency, setFrequency] = useState("");
    const [dateTime, setDateTime] = useState(dayjs());

    const handleDateTimeChange = (newValue) => {
        setDateTime(newValue);
    };
    
    const samplePlants = [
        { id: 1, name: "Cà chua" },
        { id: 2, name: "Hoa hồng" },
        { id: 3, name: "Hoa cúc" },
    ];
    
    return (
        <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            p: 3, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
            "&:hover": { boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" },
            display: "flex", flexDirection: "column", height: "auto",
            border: "1px solid #ccc", 
            borderRadius: "10px", 
            margin: "auto", 
            mx: "48px"
        }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}> 
                {/* Cột chứa dropdown chọn Cây trồng, Tần suất, Ngày giờ */}
                <Box class ="container-3" sx={{ display: "flex", flexDirection: "column", flex: 1,}}>
                    <Box display="flex" justifyContent="space-between" sx={{ marginTop: "2rem" }}>
                        <TextField select label="Cây trồng" value={plant} onChange={(e) => setPlant(e.target.value)} sx={{ minWidth: 250, m: 1 }}>
                            {samplePlants.map((item) => (
                                <MenuItem key={item.id} value={item.name}>
                                    {item.name} ({item.id})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField select label="Tần suất" value={frequency} sx={{ minWidth: 250, m: 1 }} onChange={(e) => setFrequency(e.target.value)}>
                        <MenuItem value="Mỗi ngày">Mỗi ngày</MenuItem>
                        <MenuItem value="Mỗi tuần">Mỗi tuần</MenuItem>
                        <MenuItem value="Mỗi tháng">Mỗi tháng</MenuItem>
                    </TextField>
                    <Box  sx={{ maxWidth: 250, m: 1 }}>  
                    <Typography variant="subtitle1" fontWeight="bold">Ngày và giờ nhắc</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            value={dateTime}
                            onChange={handleDateTimeChange}
                            renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                        />
                    </LocalizationProvider>
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
                 <NavLink to="schedule" style={{ textDecoration: "none" }}>
                    <Button variant="contained" sx={{ backgroundColor: "gray", color: "white" }}>↩ Trở về</Button>
                 </NavLink>
                
            </Box>
        </Box>
    );
};

export default ReminderForm;