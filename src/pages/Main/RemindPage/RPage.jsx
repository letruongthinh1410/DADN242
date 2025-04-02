import React, { useState,useEffect,useRef } from "react";
import { Card, CardContent, Typography, Button, Box, Pagination, Modal, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { NavLink } from "react-router-dom";
import { TreeDeciduous, CalendarDays, NotebookPen, Clock, Hammer, Trash2, CirclePlus} from 'lucide-react';

const EditReminderModal = ({ open, onClose, reminder, onSave ,plants}) => {
    const [editedReminder, setEditedReminder] = useState(reminder);
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (name === "Name") {
            const selectedPlant = plants.find((plant) => plant.Id === value);
            setEditedReminder((prev) => ({
                ...prev,
                Name: `${selectedPlant.Name}(${selectedPlant.Id})`,
                Id: selectedPlant.Id
            }));
        } else {
            setEditedReminder((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleSave = () => {
        onSave(editedReminder);
        onClose();
    };
    console.log(editedReminder)
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ 
                position: "absolute", top: "50%", left: "50%", 
                transform: "translate(-50%, -50%)", width: 400, bgcolor: "white", 
                boxShadow: 24, p: 4, borderRadius: 2
            }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Sửa thông tin nhắc nhở
                </Typography>
                
                 {/* Dropdown chọn tên cây */}
                 <FormControl fullWidth margin="normal">
                        <InputLabel>Tên cây</InputLabel>
                        <Select
                            name="Name"
                            value={editedReminder.Id || ""}
                            onChange={handleChange}
                        >
                            {plants.map((plant) => (
                                <MenuItem key={plant.Id} value={plant.Id}>
                                    {plant.Name} ({plant.Id})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                <TextField
                    fullWidth margin="normal" label="Ghi chú" name="note"
                    value={editedReminder.note} onChange={handleChange}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Tần suất</InputLabel>
                    <Select
                        name="frequency" value={editedReminder.frequency} onChange={handleChange}
                    >
                        <MenuItem value="Mỗi ngày">Mỗi ngày</MenuItem>
                        <MenuItem value="Mỗi tuần">Mỗi tuần</MenuItem>
                        <MenuItem value="Mỗi tháng">Mỗi tháng</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth margin="normal" label="Thời gian" name="time"
                    value={editedReminder.time} onChange={handleChange}
                />

                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button onClick={onClose} variant="outlined">Hủy</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Lưu</Button>
                </Box>
            </Box>
        </Modal>
    );
};

const ReminderCard = ({ reminder ,plants}) => {
    const [expanded, setExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const maxLines = 3; // Số dòng tối đa hiển thị ban đầu
    const noteRef = useRef(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        if (noteRef.current) {
            // Kiểm tra nếu nội dung thực tế cao hơn maxLines thì hiển thị "Xem thêm"
            const lineHeight = parseFloat(window.getComputedStyle(noteRef.current).lineHeight);
            const maxHeight = lineHeight * maxLines;
            if (noteRef.current.scrollHeight > maxHeight) {
                setIsClamped(true);
            }
        }
    }, [reminder.note]); // Chạy khi ghi chú thay đổi
    return (

        <Card 
            sx={{ 
                width: 350, borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": { boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)" },
                 display: "flex", flexDirection: "column", height: "100%"
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                    {reminder.title} 
                </Typography>
                <Typography variant="body2" gutterBottom>
                    <TreeDeciduous color="#48752C" style = {{marginRight: "1rem",}}/> {reminder.Name} ({reminder.Id})
                 </Typography>
                 {/* ---------- */}
                 <Typography variant="body2" mt={1}>
                    <CalendarDays style={{ marginRight: "1rem", fontSize: "0.6rem", }} />
                    <span style={{ fontWeight: "bold" }}>Thời gian:</span> {reminder.time}
                </Typography>
              
                {/* Ghi chú với giới hạn số dòng */}
                <Typography variant="body2" mt={1} style={{ display: "flex", alignItems: "flex-start" }}>
                    <div style={{ marginRight: "1rem", display: "flex", alignItems: "center" }}>
                        <NotebookPen />
                    </div>
                    <span
                        ref={noteRef}
                        style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: expanded ? "unset" : maxLines,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        <span style={{ fontWeight: "bold" }}>Ghi chú:</span> {reminder.note}
                    </span>
                </Typography>

                {/* Chỉ hiển thị nút "Xem thêm" nếu có nhiều hơn 3 dòng */}
                {isClamped && (
                    <Button 
                        onClick={() => setExpanded(!expanded)} 
                        sx={{ textTransform: "none", color: "blue", padding: "0", minWidth: "auto", mt: 1 }}
                    >
                        {expanded ? "Thu gọn" : "Xem thêm"}
                    </Button>
                )}
                
                <Typography variant="body2" mt={1}>
                    <Clock style={{ marginRight: "1rem" }} />
                    <span style={{ fontWeight: "bold" }}>Tần suất:</span> {reminder.frequency}
                </Typography>
                <Box display="flex" justifyContent="space-between" sx={{ p: 2, mt: "auto" }}>
                    <Button
                          variant="contained"
                          fullWidth
                          sx={{ backgroundColor: "#FF0000", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem"}}
                      >
                          <Trash2 style = {{marginRight: "0.6rem",}}/> Xóa nhắc nhở
                    </Button>

                    <NavLink to="#" style={{display: "flex", justifyContent: "end", textDecoration: "none"}}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ backgroundColor: "#0CD908", mt: 1.3, borderRadius: "10px", textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem"}}
                        onClick={() => setEditModalOpen(true)}
                    >
                        <Hammer style = {{marginRight: "0.6rem",}}/> Sửa thông tin
                    </Button>
                    </NavLink>
                </Box>
            </CardContent >
            <EditReminderModal 
                open={isEditModalOpen} 
                onClose={() => setEditModalOpen(false)} 
                reminder={reminder} 
                onSave={(updatedReminder) => console.log(updatedReminder)} 
                plants={plants}
            />
        </Card>
        
    );
};

const ReminderList = ({ reminders }) => {
    const [page, setPage] = useState(1);
    const remindersPerPage = 6;
    const totalPages = Math.ceil(reminders.length / remindersPerPage);
    const currentReminders = reminders.slice((page - 1) * remindersPerPage, page * remindersPerPage);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "80vh" }}>
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
                {currentReminders.map((reminder, index) => (
                    <ReminderCard key={index} reminder={reminder} plants={reminders} />
                ))}
            </Box>
            <Box  sx={{display : "flex",justifyContent:"space-around", alignItems:"center", mt:"10px" , marginBottom:"10px"}}>    
               

                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    variant="outlined" shape="rounded"
                    showFirstButton showLastButton
                />
            </Box>
            <NavLink to="AddRm" style={{ textDecoration: "none" }}>
                <Button 
                    variant="contained" 
                    sx={{
                        background: "linear-gradient(to right, #00c853, #b2ff59)",
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: "25px",
                        padding: "10px 20px",
                        position: "fixed",
                        right: "20px",  // Căn sang góc phải
                        bottom: "20px", // Căn xuống đáy màn hình
                        zIndex: 1000, // Đảm bảo nằm trên các phần khác
                        "&:hover": {
                            background: "linear-gradient(to right, #00a152, #76ff03)"
                        }
                    }}
                >
                    <CirclePlus style={{ marginRight: "0.6rem" }} /> Thêm lịch nhắc nhở
                </Button>
            </NavLink>
        </Box>
    );
};

const ReminderSchedule = () => {
    const reminders = [ 
        { Id : 1,Name: "Cây cà chua",title: "Nhắc nhở cây cà chua",  time: "7:07 PM ,Sunday, February 23, 2025", note: "Tưới nước cho cây 1111111 11111111 11111111111 111111111 11111 11111 11111 111111 11 111111111 11111 11111 11111 111111 11", frequency: "Mỗi ngày" },
        { Id : 2,Name: "Hoa hồng",title: "Nhắc nhở hoa hồng", time: "7:07 PM ,Sunday, February 23, 2025", note: "Tưới nước cho cây", frequency: "Mỗi ngày" },
        { Id : 3,Name: "Hoa cúc",title: "Nhắc nhở hoa cúc", time: "7:07 PM ,Sunday, February 23, 2025", note: "Tưới nước cho cây", frequency: "Mỗi ngày" },
        { Id : 4,Name: "Cây cà chua",title: "Nhắc nhở cây cà chua", time: "7:07 PM ,Sunday, February 23, 2025", note: "Tưới nước cho cây", frequency: "Mỗi ngày" },
        { Id : 5,Name: "Hoa hồng",title: "Nhắc nhở hoa hồng", time: "7:07 PM ,Sunday, February 23, 2025", note: "Tưới nước cho cây", frequency: "Mỗi ngày" },
        { Id : 6,Name: "Hoa cúc",title: "Nhắc nhở hoa cúc", time: "7:07 PM ,Sunday, February 23, 2025", note: "Tưới nước cho cây", frequency: "Mỗi ngày" },
        { Id : 7,Name: "Hoa cúc",title: "Nhắc nhở hoa cúc", time: "7:07 PM ,Sunday, February 23, 2025", note: "Tưới nước cho cây", frequency: "Mỗi ngày" }
    ];

    return (
        <div className="reminder-schedule">
            <ReminderList reminders={reminders} />
        </div>
    );
};

export default ReminderSchedule;