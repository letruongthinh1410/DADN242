import React, { useState, useEffect } from "react";
import {
    Box, TextField, MenuItem, Typography, Button
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import api from "../../../pages/api.jsx";

const ReminderForm = () => {
    const [plant, setPlant] = useState("");
    const [feed, setFeed] = useState("");
    const [note, setNote] = useState("");
    const [value, setValue] = useState("");
    const [type, setType] = useState("DAILY");
    const [dateTime, setDateTime] = useState(dayjs());
    const [plantGroups, setPlantGroups] = useState([]);
    const [dayOfWeek, setDayOfWeek] = useState(""); // 1 - 7
    const [dayOfMonth, setDayOfMonth] = useState("");

    const handleDateTimeChange = (newValue) => setDateTime(newValue);

    useEffect(() => {
        const fetchPlantGroups = async () => {
            try {
                const response = await api.get("/user/groups");
                if (response.status === 200) {
                    setPlantGroups(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách cây:", error);
            }
        };
        fetchPlantGroups();
    }, []);

    const handleSubmit = async () => {
        if (!plant || !feed || !value) {
            alert("Vui lòng chọn cây, feed và nhập giá trị!");
            return;
        }
        if (value <= 0) {
            alert("Giá trị phải lớn hơn 0!");
            return;
        }
        
        const time = dayjs(dateTime).format("HH:mm");
        const payload = {
            value: parseFloat(value),
            type,
            time,
            note
        };

        if (type === "WEEKLY") {
            payload.dayOfWeek = parseInt(dayOfWeek); // 1 - 7
        } else if (type === "MONTHLY" || type === "ONCE") {
            payload.day = parseInt(dayOfMonth);
        }

        try {
            const res = await api.post(`/user/groups/${plant}/feeds/${feed}/scheduler`, payload);
            alert("Tạo lịch nhắc thành công!");
            console.log("Gửi API thành công:", res.data);
        } catch (error) {
            console.error("Lỗi khi gửi API:", error);
            alert("Gửi thất bại");
        }
    };

    const selectedGroup = plantGroups.find(g => g.key === plant);
    const feeds = selectedGroup?.feeds || [];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", p: 3, mx: "48px", border: "1px solid #ccc", borderRadius: "10px" }}>
            <Box sx={{ display: "flex", gap: 3 }}>
                <Box sx={{ flex: 1, maxWidth: 300 }}>
                    <TextField
                        select
                        label="Cây trồng"
                        value={plant}
                        onChange={(e) => {
                            setPlant(e.target.value);
                            setFeed("");
                        }}
                        fullWidth sx={{ m: 1 }}
                    >
                           {plantGroups.filter(group => group.key !== "default" || group.name !== "Default").length > 0 ? (
                            plantGroups
                            .filter(group => group.key !== "default" || group.name !== "Default")
                            .map(group => (
                                <MenuItem key={group.key} value={group.key}>
                                {group.name} ({group.key})
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Không có cây</MenuItem>
                        )}    
                    </TextField>

                    {feeds.length > 0 && (
                        <TextField
                            select
                            label="Feed"
                            value={feed}
                            onChange={(e) => setFeed(e.target.value)}
                            fullWidth sx={{ m: 1 }}
                        >
                            {feeds.filter((f)=>f.name.toLowerCase().includes("pump")||f.name.toLowerCase().includes("fan")||f.key.toLowerCase().includes("pump")||f.key.toLowerCase().includes("fan"))
                            .map((f) => (
                                <MenuItem key={f.key} value={f.key}>
                                    {f.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                    {feed && (
                        <TextField
                            label="Giá trị"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            fullWidth sx={{ m: 1 }}
                        />
                    )}

                    <TextField
                        select
                        label="Tần suất"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        fullWidth sx={{ m: 1 }}
                    >
                        <MenuItem value="DAILY">Mỗi ngày</MenuItem>
                        <MenuItem value="WEEKLY">Mỗi tuần</MenuItem>
                        <MenuItem value="MONTHLY">Mỗi tháng</MenuItem>
                        <MenuItem value="ONCE">Một lần</MenuItem>
                    </TextField>

                    {type === "WEEKLY" && (
                        <TextField
                            select
                            label="Chọn thứ"// (1 = Chủ nhật) 
                            value={dayOfWeek}
                            onChange={(e) => setDayOfWeek(e.target.value)}
                            fullWidth sx={{ m: 1 }}
                        >
                            {["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"].map((label, idx) => (
                                <MenuItem key={idx + 1} value={idx + 1}>{label}</MenuItem>
                            ))}
                        </TextField>
                    )}

                    {(type === "MONTHLY" || type === "ONCE") && (
                        <TextField
                            select
                            label="Chọn ngày trong tháng"
                            value={dayOfMonth}
                            onChange={(e) => setDayOfMonth(e.target.value)}
                            fullWidth sx={{ m: 1 }}
                        >
                            {[...Array(31)].map((_, i) => (
                                <MenuItem key={i + 1} value={i + 1}>Ngày {i + 1}</MenuItem>
                            ))}
                        </TextField>
                    )}

                    <Box sx={{ m: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Chọn giờ nhắc"
                                value={dateTime}
                                onChange={handleDateTimeChange}
                                ampm={false}
                                minutesStep={1}
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold" textAlign="center">Ghi chú</Typography>
                    <TextField
                        label="Ghi chú"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        multiline
                        rows={11}
                        fullWidth
                        sx={{ m: 1 }}
                    />
                </Box>
            </Box>

            <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center" }}>
                <Button variant="contained" color="success" onClick={handleSubmit}>
                    + Xác nhận
                </Button>
                <NavLink to="/schedule">
                    <Button variant="contained" color="inherit">↩ Trở về</Button>
                </NavLink>
            </Box>
        </Box>
    );
};

export default ReminderForm;
