import React, { useState } from "react";
import { Typography, Button, Box, TextField, MenuItem } from "@mui/material";
import { NavLink } from "react-router-dom";
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CirclePlus, CornerDownLeft } from "lucide-react";
const DayOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
const ReminderForm = () => {
    const [plant, setPlant] = useState("");
    const [note, setNote] = useState("");
    const [frequency, setFrequency] = useState("");
    const [time, setTime] = useState(dayjs().set('hour', dayjs().hour()).set('minute', dayjs().minute()).set('second', dayjs().second()));
    const [date, setDate] = useState(dayjs().set('date', dayjs().date()).set('month', dayjs().month()).set('year', dayjs().year()));
    
    const handleTimeChange = (newValue) => {
        setTime(newValue);
    };

    const handleDateChange = (newValue) => {
        setDate(newValue);
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
            height: "auto",
            border: "1px solid #ccc", 
            borderRadius: "10px", 
            margin: "auto", 
            mx: "48px"
        }}>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}> 
                <Box class="container-3" sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    <Box display="flex" justifyContent="space-between" sx={{ marginTop: "2rem" }}>
                        <TextField select label="Cây trồng" value={plant} onChange={(e) => setPlant(e.target.value)} sx={{ minWidth: 250, m: 1 }}>
                            <MenuItem value="">Tuỳ chọn</MenuItem>
                            {samplePlants.map((item) => (
                                <MenuItem key={item.id} value={item.name}>
                                    {item.name} ({item.id})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <TextField select label="Tần suất" value={frequency} sx={{ minWidth: 250, m: 1 }} onChange={(e) => setFrequency(e.target.value)}>
                        <MenuItem value="">Tuỳ chọn</MenuItem>
                        <MenuItem value="DAILY">Mỗi ngày</MenuItem>
                        <MenuItem value="WEEKLY">Mỗi tuần</MenuItem>
                        <MenuItem value="MONTHLY">Mỗi tháng</MenuItem>
                    </TextField>
                    <Box sx={{ maxWidth: 250, m: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Giờ:</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                value={time}
                                onChange={handleTimeChange}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                            />
                        </LocalizationProvider>
                    </Box>
                    {frequency === "WEEKLY" && (
                        <Box sx={{ maxWidth: 250, m: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Ngày trong tuần:</Typography>
                            <TextField select value={date.day()} onChange={(e) => setDate(date.set('day', e.target.value))} fullWidth>
                                <MenuItem value="">Tuỳ chọn</MenuItem>
                                {DayOfWeek.map((day, index) => (
                                    <MenuItem key={index} value={index}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    )}
                    {frequency === "MONTHLY" && (
                        <Box sx={{ maxWidth: 250, m: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Ngày trong tháng:</Typography>
                            <TextField
                                type="number"
                                value={date.date()}
                                onChange={(e) => setDate(date.set('date', e.target.value))}
                                fullWidth
                                inputProps={{ min: 1, max: 31 }}
                            />
                        </Box>
                    )}
                </Box>
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
            <Box className="d-flex align-items-center justify-content-end" sx={{ gap: 4 , margin: "auto" , marginTop: "1rem"}}>
                <Button variant="contained" sx={{ backgroundColor: "#00c853", color: "white", textTransform: "none" }}>
                    <CirclePlus style={{marginRight: "0.5rem"}} /> Xác nhận
                </Button>
                 <NavLink to="/schedule" style={{ textDecoration: "none" }}>
                    <Button variant="contained" sx={{ backgroundColor: "gray", color: "white", textTransform: "none" }}>
                        <CornerDownLeft style={{marginRight: "0.5rem"}}/> Trở về
                    </Button>
                 </NavLink>
                
            </Box>
        </Box>
    );
};

export default ReminderForm;