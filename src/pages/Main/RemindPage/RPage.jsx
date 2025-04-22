import React, { useState,useEffect,useRef } from "react";

import { NavLink } from "react-router-dom";
import { TreeDeciduous, CalendarDays, NotebookPen, Clock, Hammer, Trash2, CirclePlus,MonitorStop,Crosshair} from 'lucide-react';
import { Card, CardContent, Typography,Box, Pagination,Modal,Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import {Spinner,Container} from "react-bootstrap";
import { LocalizationProvider, TimePicker  } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import api from "../../../pages/api.jsx";


const EditReminderModal = ({ open, onClose, reminder, plants,onRefresh }) => {
    const [plantId, setPlantId] = useState("");
    const [feeds, setFeeds] = useState([]);
    const [feedKey, setFeedKey] = useState("");
    const [value, setValue] = useState("");
    const [note, setNote] = useState(reminder.note || "");
    const [type, setType] = useState("DAILY");
    const [dateTime, setDateTime] = useState(dayjs());
    const [dayOfWeek, setDayOfWeek] = useState("");
    const [day, setDay] = useState("");

    useEffect(() => {
        if (reminder) {
            setPlantId(reminder.Id);
            setNote(reminder.note || "");
            setType(reminder.type || "DAILY");
            setValue(reminder.value || "");
            setDayOfWeek(reminder.dayOfWeek || "");
            setDay(reminder.day || "");

            const time = dayjs()
                .hour(reminder.hour || 0)
                .minute(reminder.minute || 0)
                .second(reminder.second || 0);
            setDateTime(time);

            const plant = plants.find(p => p.Id === reminder.Id);
            if (plant) {
                setFeeds(plant.Feeds || []);
                setFeedKey(reminder.feedKey || "");
            }
        }
    }, [reminder, plants]);

    const handleSave = async () => {
        const time = dayjs(dateTime).format("HH:mm");
        if(value <= 0){
            alert("Giá trị phải lớn hơn 0!");
            return;
        }
        const payload = {
            value: parseFloat(value),
            type,
            time,
            note,
        };
    
        if (type === "WEEKLY") {
            payload.dayOfWeek = dayOfWeek;
        } else if (type === "MONTHLY" || type === "ONCE") {
            payload.day = day;
        }
    
        if (!plantId || !feedKey) {
            alert("Vui lòng chọn đầy đủ cây và feed.");
            return;
        }
    
        try {
            // Gọi API xóa reminder cũ
            await api.delete(
                `/user/groups/${reminder.Id}/feeds/${reminder.feedKey}/scheduler`,
                {
                    params: { id: reminder.id_reminder }
                }
            );

            // Gọi API tạo reminder mới
            const res = await api.post(
                `/user/groups/${plantId}/feeds/${feedKey}/scheduler`,
                payload
            );
            console.log("Cập nhật thành công:", res.data);
            alert("Cập nhật nhắc nhở thành công!");
            onClose();
            onRefresh();
        } catch (err) {
            console.error("Lỗi mạng:", err);
            alert("Không thể kết nối đến server.");
        }
    };
    
    const handlePlantChange = (e) => {
        const selectedId = e.target.value;
        setPlantId(selectedId);
        const selectedPlant = plants.find(p => p.Id === selectedId);
        if (selectedPlant) {
            setFeeds(selectedPlant.Feeds || []);
            setFeedKey(""); // reset feed selection
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", width: 800, bgcolor: "white",
                boxShadow: 24, p: 4, borderRadius: 2
            }}>
                <Typography variant="h6" textAlign="center" fontWeight="bold" sx={{ mb: 2 }}>
                    Sửa nhắc nhở
                </Typography>

                <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Typography fontWeight="bold">Chọn cây</Typography>
                            <Select value={plantId} onChange={handlePlantChange}>
                                {plants.length > 0 ? (plants.map((plant) => (  
                                    <MenuItem key={plant.Id} value={plant.Id}>
                                        {plant.Name} ({plant.Id})
                                    </MenuItem>
                                ))):
                                <MenuItem disabled>
                                    Không có cây  
                                </MenuItem>
                                }
                            </Select>
                        </FormControl>

                        {feeds.length > 0 && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Typography fontWeight="bold">Chọn feed</Typography>
                                <Select value={feedKey} onChange={(e) => setFeedKey(e.target.value)}>
                                    {feeds.filter((f)=>f.name.toLowerCase().includes("pump")||f.name.toLowerCase().includes("fan")||f.key.toLowerCase().includes("pump")||f.key.toLowerCase().includes("fan"))
                                    .map(feed => (
                                        <MenuItem key={feed.key} value={feed.key}>
                                            {feed.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            label="Giá trị (value)"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            type="number"
                            fullWidth sx={{ mb: 2 }}
                        />

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Typography fontWeight="bold">Tần suất</Typography>
                            <Select value={type} onChange={(e) => setType(e.target.value)}>
                                <MenuItem value="DAILY">Mỗi ngày</MenuItem>
                                <MenuItem value="WEEKLY">Mỗi tuần</MenuItem>
                                <MenuItem value="MONTHLY">Mỗi tháng</MenuItem>
                                <MenuItem value="ONCE">Một lần</MenuItem>
                            </Select>
                        </FormControl>

                        {type === "WEEKLY" && (
                            <TextField
                                select
                                label="Chọn thứ trong tuần"
                                value={dayOfWeek}
                                onChange={(e) => setDayOfWeek(e.target.value)}
                                fullWidth sx={{ mb: 2 }}
                            >
                                {["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
                                    .map((label, index) => (
                                        <MenuItem key={index + 1} value={index + 1}>
                                            {label}
                                        </MenuItem>
                                    ))}
                            </TextField>
                        )}

                        {(type === "MONTHLY" || type === "ONCE") && (
                            <TextField
                                select
                                label="Chọn ngày trong tháng"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                fullWidth sx={{ mb: 2 }}
                            >
                                {[...Array(31)].map((_, i) => (
                                    <MenuItem key={i + 1} value={i + 1}>
                                        Ngày {i + 1}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Chọn giờ"
                                value={dateTime}
                                onChange={setDateTime}
                                ampm={false}
                                minutesStep={1}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography fontWeight="bold" sx={{ mb: 1 }}>Ghi chú</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={10}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </Box>
                </Box>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button variant="outlined" onClick={onClose}>Hủy</Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>Lưu</Button>
                </Box>
            </Box>
        </Modal>
    );
};

const ReminderCard = ({ reminder, plants,onRefresh,onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const noteRef = useRef(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const maxLines = 3;
    useEffect(() => {
      if (noteRef.current) {
        const lineHeight = parseFloat(window.getComputedStyle(noteRef.current).lineHeight);
        const maxHeight = lineHeight * maxLines;
        if (noteRef.current.scrollHeight > maxHeight) {
          setIsClamped(true);
        }
      }
    }, [reminder.note]);
    const handleDeleteReminder = async () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn xoá nhắc nhở này?");
        if (!confirmed) return;
        try {
          await api.delete(
            `/user/groups/${reminder.Id}/feeds/${reminder.feedKey}/scheduler`,
            { params: { id: reminder.id_reminder } }
          );
        //   alert("Đã xoá nhắc nhở!");
          onDelete(reminder.id_reminder); // Gọi hàm xoá ở ngoài để update danh sách
        } catch (err) {
          console.error("Lỗi khi xoá nhắc nhở:", err);
          alert("Không thể xoá nhắc nhở.");
        }
      };

    const getFrequencyLabel = (type) => {
      switch (type) {
        case "DAILY": return "Hằng ngày";
        case "WEEKLY": return "Hằng tuần";
        case "MONTHLY": return "Hằng tháng";
        case "ONCE": return "Một lần";
        default: return type;
      }
    };
  
    const getFormattedTime = (reminder) => {
      const { type, time, dayOfWeek, day } = reminder;
      if (type === "DAILY") return time;
      if (type === "WEEKLY") {
        const weekdayMap = {
          1: "Chủ nhật",
          2: "Thứ 2",
          3: "Thứ 3",
          4: "Thứ 4",
          5: "Thứ 5",
          6: "Thứ 6",
          7: "Thứ 7",
        };
        return `${weekdayMap[dayOfWeek] || `Thứ ${dayOfWeek}`}, ${time}`;
      }
      if (type === "MONTHLY" || type === "ONCE") {
        return `Ngày ${day}, ${time}`;
      }
      return time;
    };
    // console.log("reminder", reminder);
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
            <TreeDeciduous color="#48752C" style={{ marginRight: "1rem" }} />
            <span style={{ fontWeight: "bold" }}>Cây trồng: </span>
            {reminder.Name ?? "Không có Name"} ({reminder.Id})
          </Typography>
            
          {/* Feed */}
          <Typography variant="body2" mt={1}>
            <MonitorStop style={{ marginRight: "1rem" }} />
            <span style={{ fontWeight: "bold" }}>Feed:</span> {reminder.feedName}
          </Typography>
            {/* value */}
          <Typography variant="body2" mt={1}>
            <Crosshair style={{ marginRight: "1rem" }} />
            <span style={{ fontWeight: "bold" }}>Value:</span>  {reminder.value}
          </Typography>

          
          {/* Time */}
          <Typography variant="body2" mt={1}>
            <CalendarDays style={{ marginRight: "1rem" }} />
            <span style={{ fontWeight: "bold" }}>Thời gian:</span> {getFormattedTime(reminder)}
          </Typography>
  
          {/* Ghi chú */}
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
  
          {isClamped && (
            <Button
              onClick={() => setExpanded(!expanded)}
              sx={{ textTransform: "none", color: "blue", padding: "0", minWidth: "auto", mt: 1 }}
            >
              {expanded ? "Thu gọn" : "Xem thêm"}
            </Button>
          )}
  
          {/* Tần suất */}
          <Typography variant="body2" mt={1}>
            <Clock style={{ marginRight: "1rem" }} />
            <span style={{ fontWeight: "bold" }}>Tần suất:</span> {getFrequencyLabel(reminder.type)}
          </Typography>
  
          {/* Nút Hành động */}
          <Box display="flex" justifyContent="space-between" sx={{ p: 2, mt: "auto" }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#FF0000", mt: 1.3, borderRadius: "10px",
                textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem"
              }}
              onClick={handleDeleteReminder}
            >
              <Trash2 style={{ marginRight: "0.6rem" }} /> Xóa nhắc nhở
            </Button>
  
            <NavLink to="#" style={{ display: "flex", justifyContent: "end", textDecoration: "none" }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#0CD908", mt: 1.3, borderRadius: "10px",
                  textTransform: "none", width: "fit-content", padding: "0.3rem 0.5rem"
                }}
                onClick={() => setEditModalOpen(true)}
              >
                <Hammer style={{ marginRight: "0.6rem" }} /> Sửa thông tin
              </Button>
            </NavLink>
          </Box>
        </CardContent>
  
        <EditReminderModal
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          reminder={reminder}
          plants={plants}
          onRefresh={onRefresh}
        />
      </Card>
    );
  };
  

const ReminderList = ({ reminders,plants,feeds,onRefresh}) => {
    const [page, setPage] = useState(1);
    const remindersPerPage = 6;
    const [remindersState, setRemindersState] = useState(reminders);
    const totalPages = Math.ceil(remindersState.length / remindersPerPage);
    const currentReminders = remindersState.slice(
        (page - 1) * remindersPerPage,
        page * remindersPerPage
    );
    useEffect(() => {
        setRemindersState(reminders);
        const newTotalPages = Math.ceil(reminders.length / remindersPerPage);
        if (page > newTotalPages) {
            setPage(newTotalPages || 1); // fallback về 1 nếu không có reminder nào
        }
    }, [reminders,page]);
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "80vh" }}>
            {/* Nếu không có reminders */}
            {reminders.length === 0 ? (
                <Typography
                    variant="h6"
                    align="center"
                    sx={{ mt: 4, color: "gray", fontStyle: "italic" }}
                >
                    Không có lịch nhắc nhở.
                </Typography>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 3,
                        flexGrow: 1,
                    }}
                >
                    {currentReminders.map((reminder, index) => (
                        <ReminderCard
                            key={index}
                            reminder={reminder}
                            plants={plants}
                            onRefresh={onRefresh}
                            onDelete={(id) =>
                                setRemindersState(prev => prev.filter(r => r.id_reminder !== id))}
                        />
                    ))}
                </Box>
            )}

            {/* Chỉ hiển thị pagination nếu có nhiều hơn 1 trang */}
            {totalPages > 1 && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: 2,
                        mb: 2,
                    }}
                >
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            {/* Nút thêm lịch nhắc nhở */}
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
                        right: "20px",
                        bottom: "20px",
                        zIndex: 1000,
                        "&:hover": {
                            background: "linear-gradient(to right, #00a152, #76ff03)",
                        },
                    }}
                >
                    <CirclePlus style={{ marginRight: "0.6rem" }} /> Thêm lịch nhắc nhở
                </Button>
            </NavLink>
        </Box>
    );
};



const ReminderSchedule = () => {
    const [plants, setPlants] = useState([]);
    const [selectedPlantId, setSelectedPlantId] = useState("all");
    const [feeds, setFeeds] = useState([]);
    const [selectedFeedKey, setSelectedFeedKey] = useState("all");
    const [selectedFrequency, setSelectedFrequency] = useState("all");
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        setLoading(true);
        try {
            const [groupRes, scheduleRes] = await Promise.all([
                api.get("/user/groups"),
                api.get("/user/schedules"),
            ]);

            const groupData = groupRes.data.data;
            const scheduleData = scheduleRes.data.data;

            const groupMap = {};
            const feedMap = {};

            // console.log("groupdata",groupData)
            const plantList = groupData.filter((group)=>!(group.key ==="default" && group.name === "Default")).map(group => {
                groupMap[group.key] = group.name;
                const filteredFeeds = group.feeds.filter(feed => feed.name.toLowerCase().includes("pump") || feed.name.toLowerCase().includes("fan")
                || feed.key.toLowerCase().includes("fan") || feed.key.toLowerCase().includes("pump"));

                filteredFeeds.forEach(feed => {
                    feedMap[`${feed.key}`] = {
                        feedName: feed.name,
                        groupKey: group.key,
                        groupName: group.name,
                    };
                });

                return {
                    Id: group.key,
                    Name: group.name,
                    Feeds: group.feeds,
                };
            });
            console.log("plantList",plantList)
            // console.log("feedMap", feedMap);
            // console.log("groupData", groupData);
            // console.log("scheduleData", scheduleData);
            
            const mappedReminders = scheduleData.map(item => {
                const { fullFeedKey } = item;
                const mapping = feedMap[fullFeedKey] || {};
                // console.log("mapping",mapping);
                const groupId = mapping.groupKey || fullFeedKey.split(".")[0];
                const feedKey = fullFeedKey;
                const feedName = mapping.feedName || fullFeedKey;
                return {
                    Id: groupId,
                    // Name: mapping.groupName || groupId,
                    Name: mapping.groupName,
                    feedKey,
                    feedName,
                    id_reminder: item.id,
                    value: item.value,
                    type: item.type,
                    time: item.time,
                    note: item.note,
                    dayOfWeek: item.dayOfWeek,
                    day: item.day,
                    hour: Number(item.time?.split(":")[0]) || 0,
                    minute: Number(item.time?.split(":")[1]) || 0,
                    second: 0,
                    frequency:
                        item.type === "DAILY" ? "Hằng ngày" :
                        item.type === "WEEKLY" ? `Thứ ${item.dayOfWeek}` :
                        item.type === "MONTHLY" ? `Ngày ${item.day}` :
                        item.type === "ONCE" ? `Một lần (${item.day})` : item.type,
                    title: `Nhắc nhở ${mapping.feedName || feedKey} của ${mapping.groupName || groupId}`
                };
            });

            setPlants(plantList);
            setReminders(mappedReminders);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);

    useEffect(() => {
        const selectedPlant = plants.find(p => p.Id === selectedPlantId);
        if (selectedPlant) {
            setFeeds(selectedPlant.Feeds || []);
        } else {
            setFeeds([]);
        }
        setSelectedFeedKey("all");
    }, [selectedPlantId, plants]);

    const filteredReminders = reminders.filter(reminder => {
        const matchPlant = selectedPlantId === "all" || reminder.Id === selectedPlantId;
        // console.log("selectedPlantId",selectedPlantId);
        // console.log("reminder.Id", reminder.Id);
        const matchFeed = selectedFeedKey === "all" || reminder.feedKey === selectedFeedKey;
        const matchFrequency = selectedFrequency === "all" || reminder.type === selectedFrequency;
        return matchPlant && matchFeed && matchFrequency;
    });
    // console.log("reminders", reminders);
    // console.log("Filtered reminders:", filteredReminders);
    // console.log("Selected frequency:", selectedFrequency);
    // console.log("Reminder types:", reminders.map(r => r.type));
    return (
        <Box sx={{ padding: 2 }}>
            <Box 
            sx={{  display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3, }}>
                <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel>Chọn cây</InputLabel>
                    <Select
                        value={selectedPlantId}
                        label="Chọn cây"
                        onChange={(e) => setSelectedPlantId(e.target.value)}
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        {plants.map(plant => (
                            <MenuItem key={plant.Id} value={plant.Id}>
                                {plant.Name} ({plant.Id})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {feeds.length > 0 && (
                    <FormControl fullWidth sx={{ maxWidth: 300 }}>
                        <InputLabel>Chọn feed</InputLabel>
                        <Select
                            value={selectedFeedKey}
                            label="Chọn feed"
                            onChange={(e) => setSelectedFeedKey(e.target.value)}
                        >
                            <MenuItem value="all">Tất cả feeds</MenuItem>
                            {feeds.map(feed => (
                                <MenuItem key={feed.key} value={`${feed.key}`}>
                                    {feed.name} ({feed.key})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel>Lọc theo tần suất</InputLabel>
                    <Select
                        value={selectedFrequency}
                        label="Lọc theo tần suất"
                        onChange={(e) => setSelectedFrequency(e.target.value)}
                    >
                        <MenuItem value="all">Tất cả</MenuItem>
                        <MenuItem value="DAILY">Hằng ngày</MenuItem>
                        <MenuItem value="WEEKLY">Hàng tuần</MenuItem>
                        <MenuItem value="MONTHLY">Hàng tháng</MenuItem>
                        <MenuItem value="ONCE">Một lần</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {loading ? (
                <Container className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <Spinner animation="border" variant="success" />
                </Container>
            ) : (
                <ReminderList reminders={filteredReminders} plants={plants} feeds={feeds}  onRefresh={fetchData}/>
            )}
        </Box>
    );
};





export default ReminderSchedule;